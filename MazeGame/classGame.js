class Game {
    #settings;
    #context;
    #soundElement;
    #gameMessageElement;
    #pauseTime;
    #paused;
    #levelStatus;
    #playerMovementSound;
    #ambientSound;
    #caughtSound;
    #levelCompleteSound;
    #caughtSoundPlayed;

    constructor(canvas, startLevel, soundElement, gameMessageElement, maxLevel = 10) {
        this.#settings = new Settings(canvas, startLevel, maxLevel);
        this.#context = this.#settings.canvas.getContext("2d");
        this.#soundElement = soundElement;
        this.#gameMessageElement = gameMessageElement;
        this.#pauseTime = Date.now();
        this.#paused = true;
        this.#levelStatus = "waitingtostart";
        this.gameObjects;
        this.#playerMovementSound;
        this.#ambientSound;
        this.#caughtSound;
        this.#levelCompleteSound;
        this.#caughtSoundPlayed;
    }

    #InitialiseGame() {
        this.#caughtSoundPlayed = false;
        this.#paused = true;
        return new GameObjects(this.#settings);
    }

    _ProcessKeyPresses(key) {
        if ((key.SpacePressed()) && (Date.now() - this.#pauseTime > 300)) {
            this.#paused = !(this.#paused);
            this.#pauseTime = Date.now();
            if (this.#levelStatus === "caught") {
                this.#ReturnToStartLevel();
            }
        }
        if (!(this.#paused)) {
            this.#levelStatus = "midgame";
            if (key.MoveUp()) {
                this.gameObjects.player.MovePlayer(0,-1);
            }
            if (key.MoveDown()) {
                this.gameObjects.player.MovePlayer(0,1);
            }
            if (key.MoveLeft()) {
                this.gameObjects.player.MovePlayer(-1,0);
            }
            if (key.MoveRight()) {
                this.gameObjects.player.MovePlayer(1,0);
            }
        }
    }

    _ProcessNextCellForOpponents() {
        for (let opponentIndex in this.gameObjects.opponents) {
            this.gameObjects.opponents[opponentIndex].MoveOpponent(this.gameObjects.player.currentCell);
       }
    }

    #ResizeWindow() {
        this.#paused = true;
        this.gameObjects.player.StoreRelativeLocation();
        for (let opponentIndex in this.gameObjects.opponents) {
            this.gameObjects.opponents[opponentIndex].StoreRelativeLocation();
        }
        this.#settings.AdjustCanvasSize();
        this.#settings.SetMazeDimensions();
        this.gameObjects.maze.StoreCoordsForAllCells();
        this.gameObjects.maze.StoreWallData();
        this.gameObjects.player.UpdateRelativeLocation();
        this.gameObjects.player.SetRadiusOfCharacter();
        this.gameObjects.player.AdjustStepSizeAccordingToCanvasSize();
        this.gameObjects.player.UpdateTargetCell();
        for (let opponentIndex in this.gameObjects.opponents) {
            this.gameObjects.opponents[opponentIndex].UpdateRelativeLocation();
            this.gameObjects.opponents[opponentIndex].SetRadiusOfCharacter();
            this.gameObjects.opponents[opponentIndex].AdjustStepSizeAccordingToCanvasSize();
            this.gameObjects.opponents[opponentIndex].UpdateTargetCell();
        }
        this.gameObjects.DrawMazeObjects(this.#context);
    }

    _FinishLevel() {
        this.#paused = true;
        if (this.#soundElement.checked) {
            this.#levelCompleteSound.Play();
        }
        if (this.#settings.MaxLevelReached()) {
            this.#levelStatus = "won";
        }
        else {
            this.#levelStatus = "waitingtostart";
            this.#settings.NextLevel();
            this.gameObjects = this.#InitialiseGame();
            this.gameObjects.UpdateCharacterPositions();
        }
    }

    #ReturnToStartLevel() {
        this.#paused = true;
        this.#levelStatus = "waitingtostart";
        this.#settings.SetLevelToStartLevel();
        this.gameObjects = this.#InitialiseGame();
        this.gameObjects.UpdateCharacterPositions();
    }

    _IsPlayerCaught(opponent) {
        let player = this.gameObjects.player;
        let separation = ((player.GetXCoord() - opponent.GetXCoord()) ** 2 + (player.GetYCoord() - opponent.GetYCoord()) ** 2) ** (1/2);
        if (separation < player.radius + opponent.radius) {
            if (player.currentCell === opponent.currentCell || player.currentCell.IsLinked(opponent.currentCell)) {
                return true;
            }
        }
        return false;
    }

    #LoadSounds() {
        let path = document.location.pathname;
        let soundLoop = true;
        let directory = path.substring(path.indexOf('/'), path.lastIndexOf('/'));
        this.#playerMovementSound = new Sound(directory + "/InsectWalking.mp3", 1, soundLoop);
        this.#ambientSound = new Sound(directory + "/ForestAmbient.mp3", 0.4, soundLoop);
        this.#caughtSound = new Sound(directory + "/InsectCaught.mp3", 1, !(soundLoop));
        this.#levelCompleteSound = new Sound(directory + "/birdChick.mp3", 1, !(soundLoop));
        this.#caughtSoundPlayed = false;
    }

    _PlaySounds() {
        if (this.#soundElement.checked && !(this.#paused)) {
            this.#ambientSound.Play();
        }
        else {
            this.#ambientSound.Pause();
        }
        if (this.#soundElement.checked && !(this.#paused) && !(this.gameObjects.player.IsTargetReached())) {
            this.#playerMovementSound.Play();
        }
        else {
            this.#playerMovementSound.Pause();
        }
    }

    _DisplayMessages() {
        let messageDetail = "";
        switch (this.#levelStatus) {
            case "waitingtostart":
                messageDetail = " - press space to play";
                break;
            case "won":
                messageDetail = " - you have won!";
                break;
            case "caught":
                messageDetail = " - Caught! * Press space to restart *";
                break;
            default:
                messageDetail = "";
                break;
        }
        this.#gameMessageElement.innerHTML = "Level " + this.#settings.level + messageDetail;
    }

    StartGame() {
        this.#LoadSounds();
        this.gameObjects = this.#InitialiseGame();
        let key = new Key;
        this.#context.canvas.addEventListener("keyup",function(event) {key.OnKeyUp(event); },false);
        this.#context.canvas.addEventListener("keydown",function(event) {key.OnKeyDown(event); },false);
        window.addEventListener("resize", this.#ResizeWindow.bind(this));
        this.#context.canvas.focus();
        function updateGame() {
            this._DisplayMessages();
            this._PlaySounds();
            this._ProcessKeyPresses(key);
            if (!(this.#paused)) {
                this._ProcessNextCellForOpponents();
                this.gameObjects.UpdateCharacterPositions();
            }
            if (this.gameObjects.player.currentCell === this.gameObjects.finishCell) {
                this._FinishLevel();
            }
            this.gameObjects.DrawMazeObjects(this.#context);
            this.gameObjects.player.DrawPlayer(this.#context, this.#paused);
            for (let opponentIndex in this.gameObjects.opponents) {
                let opponent = this.gameObjects.opponents[opponentIndex];
                opponent.DrawOpponent(this.#context);
                if (this._IsPlayerCaught(opponent)) {
                    this.#paused = true;
                    this.#levelStatus = "caught";
                    if (!(this.#caughtSoundPlayed) && this.#soundElement.checked) {
                        this.#caughtSound.Play();
                    }
                    this.#caughtSoundPlayed = true;
                }
            }
            window.requestAnimationFrame(updateGame.bind(this));
        }
        this.gameObjects.UpdateCharacterPositions();
        this.gameObjects.DrawMazeObjects(this.#context);
        window.requestAnimationFrame(updateGame.bind(this));
    }
}