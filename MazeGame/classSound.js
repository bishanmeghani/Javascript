class Sound {
    #sound;

    constructor (fileName, volume = 1, loop = false) {
        this.#sound = document.createElement("audio");
        this.#sound.src = fileName;
        this.#sound.volume = volume;
        this.#sound.loop = loop;
        this.#sound.setAttribute("preload", "auto");
        this.#sound.setAttribute("controls", "none");
        this.#sound.style.display = "none";
        document.body.appendChild(this.#sound);
    }

    Play() {
        this.#sound.play();
    }

    Pause() {
        this.#sound.pause();
    }
}