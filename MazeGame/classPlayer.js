class Player extends Character {

    #legs;
    #legAngles;
    #oldDirection;

    constructor (settings, maze, xCoord, yCoord, direction = 0) {
        super(settings, maze, xCoord, yCoord, settings.numPlayerSteps, direction);
        this.#legs = [];
        this.#legAngles = [];
        this.#oldDirection = -1;
        this.#RandomiseLegAngles();
    }

    #RandomiseLegAngles(paused) {
        let legNums = [-3, -2, -1, 1, 2, 3];
        if (this.#legAngles === [] || !(paused)) {
            this.#legAngles = [];
            for (let legNum of legNums) {
                let angle = this._direction + legNum * Math.PI / 4;
                let randomAngle = 0;
                if (legNum < 0) {
                    randomAngle = angle - (Math.random() * (7)) * Math.PI / 24;
                }
                else {
                    randomAngle = angle + (Math.random() * (7)) * Math.PI / 24;
                }
                this.#legAngles.push([angle, randomAngle]);
            }
        }
    }

    #DrawLegs(context, paused) {
        if (this.currentCell.xCoord !== this._xCoord || this.currentCell.yCoord !== this.yCoord || this._direction !== this.#oldDirection) {
            this.#RandomiseLegAngles(paused);
            this.#oldDirection = this._direction;
        }
        this.#legs = [];

        for (let leg of this.#legAngles) {
            let xTopLegCoord = this._xCoord + this.radius * Math.cos(leg[0]);
            let yTopLegCoord = this._yCoord + this.radius * Math.sin(leg[0]);
            let xEndLegCoord = xTopLegCoord + 0.25 *  this.radius * Math.cos(leg[1]);
            let yEndLegCoord = yTopLegCoord + 0.25 *  this.radius * Math.sin(leg[1]);
            let xTangent = xTopLegCoord + 0.1 * this.radius * Math.cos(2*leg[0]-leg[1]);
            let yTangent = yTopLegCoord + 0.1 * this.radius * Math.sin(2*leg[0]-leg[1]);
            let legData = [xTopLegCoord, yTopLegCoord, xEndLegCoord, yEndLegCoord, xTangent, yTangent];
            this.#legs.push(legData);
        }

        for (let leg of this.#legs) {
            context.save();
            context.strokeStyle = "black";
            context.lineWidth = 1.5;
            context.beginPath();
            context.moveTo(leg[0], leg[1]);
            context.arcTo(leg[4], leg[5], leg[2], leg[3], 1/8 * this.radius);
            context.closePath();
            context.stroke();
            context.restore();
        }
    }

    DrawPlayer(context, paused) {
        this.#DrawLegs(context, paused);
        context.save();
        context.strokeStyle = "black";
        context.fillStyle = this.settings.wallColour;
        context.beginPath();
        context.arc(this._xCoord, this._yCoord, this.radius, 0, 2*Math.PI);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
        this._DrawEyes(context);
    }

    MovePlayer(xShift, yShift) {
        if (xShift < 0) {
            this._direction = Math.PI;
            if (this.currentCell.IsLinked(this.currentCell.west)) {
                this.UpdateTargetCell(this.currentCell.west);
            }
        }
        else if (xShift > 0) {
            this._direction = 0;
            if (this.currentCell.IsLinked(this.currentCell.east)) {
                this.UpdateTargetCell(this.currentCell.east);
            }
        }
        else if (yShift < 0) {
            this._direction = 1.5 * Math.PI;
            if (this.currentCell.IsLinked(this.currentCell.north)) {
                this.UpdateTargetCell(this.currentCell.north);
            }
        }
        else if (yShift > 0) {
            this._direction = 0.5 * Math.PI;
            if (this.currentCell.IsLinked(this.currentCell.south)) {
                this.UpdateTargetCell(this.currentCell.south);
            }
        }
    }
}