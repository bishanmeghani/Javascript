class Stack {
    #stack;

    constructor() {
        this.#stack = [];
    }

    Push(item) {
        this.#stack.push(item);
    }

    Pop() {
        return this.#stack.pop();
    }
}