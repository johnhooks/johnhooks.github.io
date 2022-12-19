import { createMachine, assign, type DoneInvokeEvent } from "xstate";

type Connection<Port extends WebMidi.MIDIPort> = {
  using: boolean;
  port: Port;
};

type Context = {
  /**
   * Reference to MIDI access instance.
   */
  access: WebMidi.MIDIAccess;
  /**
   * Open input ports
   */
  inputs: Connection<WebMidi.MIDIInput>[];
  /**
   * Open output ports
   */
  outputs: Connection<WebMidi.MIDIOutput>[];
  /**
   * The failure reason message.
   */
  reason?: string;
  /**
   * The raised error of a failure.
   */
  error?: Error;
};

type RequestEvent = { type: "REQUEST" };
type GrantEvent = { type: "GRANT"; access: WebMidi.MIDIAccess };
type UseEvent = { type: "USE"; id: string };
type DropEvent = { type: "DROP"; id: string };
type ConnectionEvent = { type: "OPEN" | "CLOSE"; id: string };
type ErrorEvent = { type: "ERROR"; reason: "unsupported" | "denied" | "error" };

type MidiEvent = RequestEvent | GrantEvent | UseEvent | DropEvent | ConnectionEvent | ErrorEvent;

type InitialContext = {
  value: "initial" | "ungranted" | "requesting";
  context: Context & {
    access: undefined;
  };
};

type FailureContext = {
  value: "failure";
  context: Context & {
    reason: "unsupported" | "denied" | "error";
    error: Error;
  };
};

type SuccessContext = {
  value: "success";
  context: Context & {
    access: WebMidi.MIDIAccess;
  };
};

type MidiTypestate = InitialContext | FailureContext | SuccessContext;

/**
 * MIDI Access State Machine.
 *
 * @public
 */
export const midiMachine = createMachine<Context, MidiEvent, MidiTypestate>(
  {
    id: "midi",

    initial: "initial",

    predictableActionArguments: true,

    context: {
      // This is a hack. The success state is the only one using MIDIAccess, and its presence should
      // be implied in this state. Consider using an Actor for the success state and eliminate this.
      access: null as unknown as WebMidi.MIDIAccess,
      inputs: [],
      outputs: [],
    },

    states: {
      initial: {
        invoke: {
          id: "checkMidiPermission",
          src: () => {
            if (typeof document === "undefined") return Promise.reject(Error("Not in browser"));
            return navigator.permissions
              .query({ name: "midi" } as unknown as PermissionDescriptor)
              .then(() => {
                return navigator.requestMIDIAccess();
              })
              .catch((error) => {
                console.log(error);
              });
          },
          onDone: {
            target: "success",
            actions: [
              "logGranted",
              assign<Context, DoneInvokeEvent<WebMidi.MIDIAccess>>({
                access: (_context, { data: access }) => access,
                inputs: (_context, { data: access }) => {
                  return toInputs(access, (port) => ({ using: false, port }));
                },
                outputs: (_context, { data: access }) => {
                  return toOutputs(access, (port) => ({ using: false, port }));
                },
              }),
            ],
          },
          onError: {
            target: "ungranted",
          },
        },
        on: {
          REQUEST: { target: "requesting" },
        },
      },
      ungranted: {
        on: {
          REQUEST: { target: "requesting" },
        },
      },
      requesting: {
        invoke: {
          id: "midiRequestAccess",
          src: () => {
            if (typeof document === "undefined") return Promise.reject(Error("Not in browser"));
            return navigator.requestMIDIAccess();
          },
          onDone: {
            target: "success",
            actions: [
              "logGranted",
              assign<Context, DoneInvokeEvent<WebMidi.MIDIAccess>>({
                access: (_context, { data: access }) => access,
                inputs: (_context, { data: access }) => {
                  return toInputs(access, (port) => ({ using: false, port }));
                },
                outputs: (_context, { data: access }) => {
                  return toOutputs(access, (port) => ({ using: false, port }));
                },
              }),
            ],
          },
          onError: {
            target: "failure",
            actions: assign<Context, DoneInvokeEvent<Error>>({
              reason: (_context, event) => {
                const error = event.data;
                if (error instanceof DOMException) {
                  switch (error.name) {
                    case "NotSupportedError":
                      return "unsupported";
                    case "SecurityError":
                      return "denied";
                    default:
                      return "error";
                  }
                }
                throw event.data;
              },
              error: (_context, event) => {
                return event.data;
              },
            }),
          },
        },
      },
      success: {
        // example https://github.com/statelyai/xstate/discussions/2885#discussioncomment-1856173
        invoke: {
          id: "midiInitializeAccess",
          src: (context) => (send) => {
            // This should already be insured by the current state.
            function handleStateChange({ port }: WebMidi.MIDIConnectionEvent): void {
              switch (port.connection) {
                case "open":
                  send({ type: "OPEN", id: port.id });
                  break;
                case "closed":
                  send({ type: "CLOSE", id: port.id });
                  break;
                case "pending":
                  break;
              }
            }

            context.access.addEventListener("statechange", handleStateChange);

            return function () {
              context.access.removeEventListener("statechange", handleStateChange as EventListener);
            };
          },
        },
        on: {
          OPEN: {
            actions: [
              "logNewConnection",
              assign({
                inputs: ({ access, inputs }, { id }) => {
                  const [device, rest] = extract(inputs, id);
                  if (device) return [...rest, { ...device, using: true }];
                  const port = access.inputs.get(id);
                  if (!port) return inputs; // TODO fire a connection error?
                  return [...rest, { port, using: false } as Connection<WebMidi.MIDIInput>];
                },
              }),
            ],
          },

          CLOSE: {
            actions: [
              "logLostConnection",
              assign<Context, ConnectionEvent>({
                inputs: ({ inputs }, { id }) => {
                  const device = inputs.find(({ port }) => port.id === id);
                  if (device && device.port.connection === "closed") {
                    // TODO perhaps not remove but set a status property to `closed`.
                    return inputs.filter(({ port }) => port.id !== id);
                  }
                  return inputs;
                },
              }),
            ],
          },

          DROP: {
            actions: [
              "logDropDevice",
              assign<Context, DropEvent>({
                inputs: ({ inputs }, { id }) =>
                  update(inputs, id, (connection) => ({ ...connection, using: false })),
              }),
            ],
          },

          USE: {
            actions: [
              "logUseDevice",
              assign<Context, UseEvent>({
                inputs: ({ inputs }, { id }) => {
                  const [device, rest] = extract(inputs, id);
                  if (!device) return inputs;
                  if (device.port.state !== "connected") return inputs; // TODO should notify the user.
                  return [...rest, { ...device, using: true }];
                },
              }),
            ],
          },
        },
      },
      failure: {
        type: "final",
      },
    },
  },
  {
    actions: {
      // action implementations
      logGranted: (): void => {
        console.log("MIDI access granted");
      },
      logNewConnection: (context, event): void => {
        if (event.type === "OPEN") {
          const input = context.access.inputs.get(event.id);
          if (!input) return;
          console.log(`MIDI new device connection ${input.name || input.id}`);
        }
      },
      logLostConnection: (context, event): void => {
        if (event.type === "CLOSE") {
          const input = context.access.inputs.get(event.id);
          if (!input) return;
          console.log(`MIDI lost device connection ${input.name || input.id}`);
        }
      },
      logDropDevice: ({ inputs }, event): void => {
        if (event.type === "DROP") {
          const device = inputs.find(({ port }) => port.id === event.id);
          if (!device) return;
          console.log(`MIDI stop using device ${device.port.name || device.port.id}`);
        }
      },
      logUseDevice: ({ inputs }, event): void => {
        if (event.type === "USE") {
          const device = inputs.find(({ port }) => port.id === event.id);
          if (!device) return;
          console.log(`MIDI use device ${device.port.name || device.port.id}`);
        }
      },
    },
  }
);

type Transformer<Port extends WebMidi.MIDIPort> = (port: Port) => Connection<Port>;

function toInputs(
  access: WebMidi.MIDIAccess | undefined,
  transformer: Transformer<WebMidi.MIDIInput>
): Connection<WebMidi.MIDIInput>[] {
  if (!access) return [];
  const inputs = Array.from(access.inputs.values());
  return inputs.map(transformer);
}

function toOutputs(
  access: WebMidi.MIDIAccess | undefined,
  transformer: Transformer<WebMidi.MIDIOutput>
): Connection<WebMidi.MIDIOutput>[] {
  if (!access) return [];
  const inputs = Array.from(access.outputs.values());
  return inputs.map(transformer);
}

function update<TPort extends WebMidi.MIDIPort>(
  list: Connection<TPort>[],
  id: string,
  transformer: (connection: Connection<TPort>) => Connection<TPort>
): Connection<TPort>[] {
  const result: Connection<TPort>[] = [];
  for (const conn of list) {
    result.push(conn.port.id === id ? transformer(conn) : conn);
  }
  return result;
}

function extract<TPort extends WebMidi.MIDIPort>(
  list: Connection<TPort>[],
  id: string
): [Connection<TPort> | null, Connection<TPort>[]] {
  let item: Connection<TPort> | null = null;
  const rest: Connection<TPort>[] = [];
  for (const conn of list) {
    if (conn.port.id === id) {
      item = conn;
    } else {
      rest.push(conn);
    }
  }
  return [item, rest];
}
