class Key {
    #UP;
    #DOWN;
    #LEFT;
    #RIGHT;
    #UP2;
    #DOWN2;
    #LEFT2;
    #RIGHT2;
    #SPACE;
    #pressedKeys;

    constructor() {
        this.#UP = 38;
        this.#DOWN = 40;
        this.#LEFT = 37;
        this.#RIGHT = 39;
        this.#UP2 = 87;
        this.#DOWN2 = 83;
        this.#LEFT2 = 65;
        this.#SPACE = 32;
        this.#pressedKeys = {};
    }

    #KeyIsDown(keyCode) {
        return this.#pressedKeys[keyCode];
    }

    OnKeyDown(event) {
        this.#pressedKeys[event.keyCode] = true;
        event.preventDefault();
    }

    OnKeyUp(event) {
        delete this.#pressedKeys[event.keyCode];
    }

    ClearKeyBuffer() {
        delete this.#pressedKeys[this.#UP];
        delete this.#pressedKeys[this.#DOWN];
        delete this.#pressedKeys[this.#LEFT];
        delete this.#pressedKeys[this.#RIGHT];
        delete this.#pressedKeys[this.#UP2];
        delete this.#pressedKeys[this.#DOWN2];
        delete this.#pressedKeys[this.#LEFT2];
        delete this.#pressedKeys[this.#RIGHT2];     
    }

    MoveUp() {
        return (this.#KeyIsDown(this.#UP) || this.#KeyIsDown(this.#UP2));
    }

    MoveDown() {
        return (this.#KeyIsDown(this.#DOWN) || this.#KeyIsDown(this.#DOWN2));
    }

    MoveLeft() {
        return (this.#KeyIsDown(this.#LEFT) || this.#KeyIsDown(this.#LEFT2));
    }

    MoveRight() {
        return (this.#KeyIsDown(this.#RIGHT) || this.#KeyIsDown(this.#RIGHT2));
    }

    SpacePressed() {
        return this.#KeyIsDown(this.#SPACE);
    }
}