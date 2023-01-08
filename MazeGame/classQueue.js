class Queue {
    #queue;

    constructor() {
        this.#queue = [];
    }

    Enqueue(item) {
        this.#queue.push(item);
    }

    Dequeue() {
        if (!(this.IsEmpty())) {
            return this.#queue.shift();
        }
    }

    IsInQueue(item) {
        return this.#queue.includes(item);
    }

    IsEmpty() {
        return this.#queue.length === 0;
    }

    Peek() {
        return this.#queue[0];
    }
}