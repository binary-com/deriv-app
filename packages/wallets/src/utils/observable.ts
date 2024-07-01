type Subscriber<T> = (value: T) => void;

class Observable<T> {
    private subscribers = new Set<Subscriber<T>>();

    constructor(private value: T) {
        this.value = value;
    }

    get(): T {
        return this.value;
    }

    set(newValue: T): void {
        if (JSON.stringify(this.value) === JSON.stringify(newValue)) return; // prevent unnecessary updates, causing infinite re-renders
        this.value = newValue;

        this.subscribers.forEach(listener => listener(this.value)); // notify all subscribers
    }

    /**
     * @description Subscribes to the observable
     * @param subscriber the observer function
     * @returns cleanup function to unsubscribe the subscriber when the component unmounts.
     */
    subscribe(subscriber: Subscriber<T>): () => void {
        this.subscribers.add(subscriber);

        return () => this.unsubscribe(subscriber); // cleanup function to unsubscribe the subscriber when the component unmounts
    }

    unsubscribe(subscriber: Subscriber<T>): void {
        this.subscribers.delete(subscriber);
    }
}

export { type Subscriber };

export default Observable;
