class Opponent extends Character {
    constructor (settings, maze, xCoord, yCoord, opponentNum, direction = 0) {
        super(settings, maze, xCoord, yCoord, settings.SetOpponentSpeed(opponentNum), direction);
        this.opponentNum = opponentNum;
    }

    DrawOpponent(context) {
        let outerRadius = 1.2 * this.radius;
        let numSpikes = 13;
        let angleBetweenSpikes = 2 * Math.PI / numSpikes;
        context.save();
        context.strokeStyle = "black";
        context.fillStyle = this.settings.SetOpponentColour(this.opponentNum);
        context.beginPath();
        context.moveTo(this._xCoord + outerRadius * Math.cos(this._direction), this._yCoord + outerRadius * Math.sin(this._direction));
        for (let spikeNum = 1; spikeNum < numSpikes + 1; spikeNum++) {
            let firstAngle = this._direction + (spikeNum - 0.5) * angleBetweenSpikes;
            let secondAngle = this._direction + spikeNum * angleBetweenSpikes;
            context.lineTo(this._xCoord + this.radius * Math.cos(firstAngle), this._yCoord + this.radius * Math.sin(firstAngle));
            context.lineTo(this._xCoord + outerRadius * Math.cos(secondAngle), this._yCoord + outerRadius * Math.sin(secondAngle));
        }
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
        this._DrawEyes(context);
    }

    MoveOpponent(currentPlayerCell) {
        if (!(this._xCoord === this._xTarget && this._yCoord === this._yTarget)) {
            return;
        }
        let nextCell = this.maze.FindNextCellOnShortestPath(this.currentCell, currentPlayerCell);
        if (this.currentCell.north === nextCell) {
            this._direction = 1.5 * Math.PI;
            if (this.currentCell.IsLinked(nextCell)) {
                this.UpdateTargetCell(nextCell);
            }
        }
        else if (this.currentCell.south === nextCell) {
            this._direction = 0.5 * Math.PI;
            if (this.currentCell.IsLinked(nextCell)) {
                this.UpdateTargetCell(nextCell);
            }
        }
        else if (this.currentCell.east === nextCell) {
            this._direction = 0;
            if (this.currentCell.IsLinked(nextCell)) {
                this.UpdateTargetCell(nextCell);
            }
        }
        else if (this.currentCell.west === nextCell) {
            this._direction = Math.PI;
            if (this.currentCell.IsLinked(nextCell)) {
                this.UpdateTargetCell(nextCell);
            }
        }
    }
}