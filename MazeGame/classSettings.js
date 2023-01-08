class Settings {
    #startLevel;
    #maxLevel;
    #wallAsFractionOfCell;
    #numOpponents;

    constructor(canvas, startLevel, maxLevel) {
        this.rows = 10;
        this.columns = 10;
        this.canvas = canvas;
        this.#startLevel = startLevel;
        this.#maxLevel = maxLevel;
        this.#wallAsFractionOfCell = 0.3;
        this.basicSpeedUnit = 700;
        this.numPlayerSteps = 3;
        this.xBorderWidth;
        this.yBorderWidth;
        this.mazeWidth;
        this.mazeHeight;
        this.cellWidth;
        this.cellHeight;
        this.xWallWidth;
        this.yWallWidth;
        this.xCellSpace;
        this.yCellSpace;
        this.level;
        this.#numOpponents;
        this.removeDeadEnds;
        this.pathColour;
        this.wallColour;
        this.AdjustCanvasSize();
        this.#SetLevel(this.#startLevel);
    }

    AdjustCanvasSize() {
        this.canvas.height = Math.max((window.innerHeight * 0.85), 300);
        this.canvas.width = Math.max((window.innerWidth * 0.85), 300);
        if (this.canvas.height > (this.canvas.width*1.4)) {
            this.canvas.height = this.canvas.width * 1.4;
        }
        if (this.canvas.width > (this.canvas.height*1.4)) {
            this.canvas.width = this.canvas.height * 1.4;
        }
    }

    SetMazeDimensions() {
        this.xBorderWidth = this.canvas.width * 0.025;
        this.yBorderWidth = this.canvas.height * 0.025;
        this.mazeWidth = this.canvas.width - (this.xBorderWidth * 2);
        this.mazeHeight = this.canvas.height - (this.yBorderWidth * 2);
        this.cellWidth = this.mazeWidth / this.columns;
        this.cellHeight = this.mazeHeight / this.rows;
        this.xWallWidth = this.cellWidth * this.#wallAsFractionOfCell;
        this.yWallWidth = this.cellHeight * this.#wallAsFractionOfCell;
        this.xCellSpace = this.cellWidth - this.xWallWidth;
        this.yCellSpace = this.cellHeight - this.yWallWidth;
    }

    #SetLevel(newLevel) {
        this.level = Math.min(newLevel, maxLevel);
        this.#numOpponents = this.level;
        this.removeDeadEnds = 0;
        this.rows = 10 + this.level + parseInt(Math.random()*(3));
        this.columns = 10 + this.level + parseInt(Math.random()*(3));

        switch (this.level) {
            case 1:
                this.pathColour = "#8D00FF";
                this.wallColour = "#72FF00";
                break;
            case 2:
                this.pathColour = "#00FF47";
                this.wallColour = "#FF00B8";
                break;
            case 3:
                this.pathColour = "#FFFF00";
                this.wallColour = "#0000FF";
                break;
            case 4:
                this.pathColour = "#00FFFF";
                this.wallColour = "#FF00FF";
                break;
            case 5:
                this.pathColour = "#FF0000";
                this.wallColour = "#00FFFF";
                break;
            case 6:
                this.pathColour = "#72FF00";
                this.wallColour = "#8D00FF";
                break;
            case 7:
                this.pathColour = "#FF0088";
                this.wallColour = "#00FF47";
                break;
            case 8:
                this.pathColour = "#0000FF";
                this.wallColour = "#FFFF00";
                break;
            case 9:
                this.pathColour = "#FF00FF";
                this.wallColour = "#00FFFF";
                break;
            case 10:
                this.pathColour = "#00FFFF";
                this.wallColour = "#FF0000";
                break;
            default:
                this.pathColour = "#00FFFF";
                this.wallColour = "#FF0000";
                break;
        }
        this.SetMazeDimensions();
    }

    MaxLevelReached() {
        return (this.level === this.#maxLevel);
    }

    NextLevel() {
        this.#SetLevel(this.level + 1);
    }

    SetLevelToStartLevel() {
        this.#SetLevel(this.#startLevel);
    }

    SetOpponentColour(opponentNum) {
        switch (opponentNum) {
            case 1:
                return "#00F1FF";
            case 2:
                return "#0039FF";
            case 3:
                return "#FF0000";
            case 4:
                return "#8000FF";
            case 5:
                return "#80FF00";
            case 6:
                return "#72FF00";
            case 7:
                return "#FFC600";
            case 8:
                return "#00FF80";
            case 9:
                return "#80FF00";
            case 10:
                return "#8000FF";
            default:
                return "#8000FF";
        }
    }

    SetOpponentSpeed(opponentNum) {
        if (opponentNum === 1) {
            return 1;
        }
        else if (opponentNum === 2) {
            return 1.75;
        }
        else {
            return this.SetOpponentSpeed(opponentNum - 1) + (1/2) ** (opponentNum - 2);
        }
    }
}