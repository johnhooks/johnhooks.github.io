import type { Constructor, Observer } from "$lib/types/mod";

/**
 * A simple observable mixin.
 *
 * The mixin is intended for use in Svelte. Adding a `subscribe` method to the `Base` class,
 * implements the Svelte store contract and enables reactivity by prefixing the `$` character.
 *
 * @param Base - Class to mix in Observable methods.
 * @param initialValue - The initial value.
 */
export function observableMixin<TBase extends Constructor, TValue>(
  Base: TBase,
  initialValue: TValue
) {
  return class Observable extends Base {
    #listeners = new Map<symbol, Observer<TValue>>();
    #isClosed = false;
    /**
     * Svelte expects stores to maintain a current value. Subscription functions must be immediately
     * and synchronously called when registered through `subscribe`.
     */
    #value = initialValue;

    close(): void {
      if (this.#isClosed) return;
      for (const listener of this.#listeners.values()) {
        if (typeof listener !== "function" && listener.done) {
          listener.done();
        }
      }
      this.#isClosed = true;
      this.#listeners.clear();
    }

    error<TError extends Error>(error: TError) {
      if (this.#isClosed) throw new Error("Subscribable mixin method `error` called after `close`");
      for (const listener of this.#listeners.values()) {
        if (typeof listener !== "function" && listener?.error) {
          listener.error(error);
        }
      }
      this.#isClosed = true;
      this.#listeners.clear();
    }

    next(value: TValue) {
      if (this.#isClosed) return;
      for (const listener of this.#listeners.values()) {
        if (typeof listener === "function") {
          listener(value);
        } else {
          listener.next(value);
        }
      }
    }

    subscribe(listener: Observer<TValue>): () => void {
      const symbol = Symbol();
      this.#listeners.set(symbol, listener);

      // Immediately call the subscription function with the current value.
      if (typeof listener === "function") {
        listener(this.#value);
      } else {
        listener.next(this.#value);
      }

      return () => {
        this.#listeners.delete(symbol);
      };
    }
  };
}
