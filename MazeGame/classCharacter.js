class Character {
    _xCoord;
    _yCoord;
    #numSteps;
    _direction;
    #targetCell;
    #horizontalStepSize;
    #verticalStepSize;
    _xTarget;
    _yTarget;
    #relativeXCoord;
    #relativeYCoord;

    constructor(settings, maze, xCoord, yCoord, numSteps = 2, direction = 0) {
        this.settings = settings;
        this.maze = maze;
        this._xCoord = xCoord;
        this._yCoord = yCoord;
        this.#numSteps = numSteps;
        this._direction = direction;
        this.currentCell = this.maze.CellFromCoords(this._xCoord, this._yCoord);
        this.#targetCell = this.currentCell;
        this.#horizontalStepSize;
        this.#verticalStepSize;
        this._xTarget;
        this._yTarget;
        this.#relativeXCoord;
        this.#relativeYCoord;
        this.radius;
        this.AdjustStepSizeAccordingToCanvasSize();
        this.UpdateTargetCell();
        this.SetRadiusOfCharacter();
    }

    SetRadiusOfCharacter() {
        this.radius = Math.min(this.settings.xCellSpace, this.settings.yCellSpace) / 3;
    }

    GetXCoord() {
        return this._xCoord;
    }

    GetYCoord() {
        return this._yCoord;
    }

    AdjustStepSizeAccordingToCanvasSize() {
        this.#horizontalStepSize = (this.settings.canvas.width / this.settings.basicSpeedUnit) * this.#numSteps;
        this.#verticalStepSize = (this.settings.canvas.height / this.settings.basicSpeedUnit) * this.#numSteps;
    }

    UpdateTargetCell(cell = this.#targetCell) {
        this.#targetCell = cell;
        this._xTarget = this.#targetCell.xCoord;
        this._yTarget = this.#targetCell.yCoord;
    }

    IsTargetReached() {
        return (this._xCoord === this._xTarget && this._yCoord === this._yTarget);
    }

    _DrawEyes(context) {
        context.save();
        context.lineWidth = this.radius / 7;
        context.strokeStyle = "black";
        context.fillStyle = "white";
        let xEyeCoord = this._xCoord + 0.5 * this.radius * Math.cos(this._direction + Math.PI / 4);
        let yEyeCoord = this._yCoord + 0.5 * this.radius * Math.sin(this._direction + Math.PI / 4);
        context.beginPath();
        context.arc(xEyeCoord, yEyeCoord, this.radius / 3, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        context.fill();
        xEyeCoord = this._xCoord + 0.5 * this.radius * Math.cos(this._direction - Math.PI / 4);
        yEyeCoord = this._yCoord + 0.5 * this.radius * Math.sin(this._direction - Math.PI / 4);
        context.beginPath();
        context.arc(xEyeCoord, yEyeCoord, this.radius / 3, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        context.fill();

        context.fillStyle = "black";
        xEyeCoord = this._xCoord + 0.55 * this.radius * Math.cos(this._direction + Math.PI / 5);
        yEyeCoord = this._yCoord + 0.55 * this.radius * Math.sin(this._direction + Math.PI / 5);
        context.beginPath();
        context.arc(xEyeCoord, yEyeCoord, this.radius / 10, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        context.fill();
        xEyeCoord = this._xCoord + 0.55 * this.radius * Math.cos(this._direction - Math.PI / 5);
        yEyeCoord = this._yCoord + 0.55 * this.radius * Math.sin(this._direction - Math.PI / 5);
        context.beginPath();
        context.arc(xEyeCoord, yEyeCoord, this.radius / 10, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
    }

    UpdateCharacterPosition() {
        if (this._xCoord < this._xTarget) {
            this._xCoord += this.#horizontalStepSize;
            this._direction = 0;
            if (this._xCoord > this._xTarget) {
                this._xCoord = this._xTarget;
            }
        }
        else if (this._xCoord > this._xTarget) {
            this._xCoord -= this.#horizontalStepSize;
            this._direction = Math.PI;
            if (this._xCoord > this._xTarget) {
                this._xCoord = this._xTarget;
            }
        }
        if (this._yCoord < this._yTarget) {
            this._yCoord += this.#verticalStepSize;
            this._direction = 0.5 * Math.PI;
            if (this._yCoord > this._yTarget) {
                this._yCoord = this._yTarget;
            }
        }
        else if (this._yCoord > this._yTarget) {
            this._yCoord -= this.#verticalStepSize;
            this._direction = 1.5 * Math.PI;
            if (this._yCoord < this._yTarget) {
                this._yCoord = this._yTarget;
            }
        }
        this.currentCell = this.maze.CellFromCoords(this._xCoord, this._yCoord);
    }

    StoreRelativeLocation() {
        this.#relativeXCoord = this._xCoord / this.settings.canvas.width;
        this.#relativeYCoord = this._yCoord / this.settings.canvas.height;
    }

    UpdateRelativeLocation() {
        this._xCoord = this.#relativeXCoord * this.settings.canvas.width;
        this._yCoord = this.#relativeYCoord * this.settings.canvas.height;
        this.UpdateTargetCell();
    }
}