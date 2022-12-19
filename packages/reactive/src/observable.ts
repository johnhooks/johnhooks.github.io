import type { Observer } from "./types/index.js";

/**
 * A simple observable class.
 *
 * Intended for use in Svelte. Adding a `subscribe` method to the `Base` class implements the Svelte
 * store contract and enables reactivity by prefixing the `$` character.
 * @public
 */
export class Observable<TValue> {
  #listeners = new Map<symbol, Observer<TValue>>();
  #isClosed = false;
  /**
   * Svelte expects stores to maintain a current value. Subscription functions must be immediately
   * and synchronously called when registered through `subscribe`.
   */
  #value: TValue;

  /**
   * @param initialValue - The initial value, immediately passed to observers on initializing a subscription.
   */
  constructor(initialValue: TValue) {
    this.#value = initialValue;
  }

  /**
   * Get current value.
   *
   * @public
   */
  public get value(): TValue {
    return this.#value;
  }

  /**
   * Close subscriptions.
   *
   * @public
   */
  public close(): void {
    if (this.#isClosed) return;
    for (const listener of this.#listeners.values()) {
      if (typeof listener !== "function" && listener.done) {
        listener.done();
      }
    }
    this.#isClosed = true;
    this.#listeners.clear();
  }

  /**
   * Close subscriptions with an error.
   *
   * @public
   */
  public error<TError extends Error>(error: TError) {
    if (this.#isClosed) throw new Error("Subscribable mixin method `error` called after `close`");
    for (const listener of this.#listeners.values()) {
      if (typeof listener !== "function" && listener?.error) {
        listener.error(error);
      }
    }
    this.#isClosed = true;
    this.#listeners.clear();
  }

  /**
   * Push next `value` to subscribers.
   *
   * @public
   */
  public next(value: TValue) {
    if (this.#isClosed) return;
    for (const listener of this.#listeners.values()) {
      if (typeof listener === "function") {
        listener(value);
      } else {
        listener.next(value);
      }
    }
  }

  /**
   * Add subscription.
   *
   * @public
   */
  public subscribe(listener: Observer<TValue>): () => void {
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
}
