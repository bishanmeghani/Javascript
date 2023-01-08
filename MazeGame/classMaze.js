class Maze extends MazePath {
    #wallData;

    constructor(settings) {
        super(settings) ;
        this.#wallData = [];
        this.StoreCoordsForAllCells();
    }

    StoreCoordsForAllCells() {
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                this.cells[rowNum][colNum].StoreXYCoords(this.settings);
            }
        }
    }

    CellFromCoords(xCoord, yCoord) {
        let xMazePos = xCoord - this.settings.xBorderWidth;
        let yMazePos = yCoord - this.settings.yBorderWidth;
        return this.cells[Math.floor(yMazePos / this.settings.cellHeight)][Math.floor(xMazePos / this.settings.cellWidth)];
    }

    StoreWallData() {
        this.#wallData = [];
        let xHalfWallWidth = this.settings.xWallWidth / 2;
        let yHalfWallWidth = this.settings.yWallWidth / 2;
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                let cell = this.cells[rowNum][colNum];
                let xCellLeft = cell.xCoord - this.settings.cellWidth*0.5;
                let yCellTop = cell.yCoord - this.settings.cellHeight*0.5;
                if (!(cell.IsLinked(cell.north))) {
                    this.#wallData.push(new Wall(xCellLeft - xHalfWallWidth, yCellTop - yHalfWallWidth, this.settings.cellWidth + this.settings.xWallWidth, this.settings.yWallWidth, this.settings.yWallWidth*0.5));
                }
                if (!(cell.IsLinked(cell.west))) {
                    this.#wallData.push(new Wall(xCellLeft - xHalfWallWidth, yCellTop - yHalfWallWidth, this.settings.xWallWidth, this.settings.cellHeight + this.settings.yWallWidth, this.settings.xWallWidth*0.5));
                }
                if (rowNum === this.settings.rows - 1) {
                    this.#wallData.push(new Wall(xCellLeft - xHalfWallWidth, yCellTop + this.settings.cellHeight - yHalfWallWidth, this.settings.cellWidth + this.settings.xWallWidth, this.settings.yWallWidth, this.settings.yWallWidth*0.5));
                }
                if (colNum === this.settings.columns - 1) {
                    this.#wallData.push(new Wall(xCellLeft + this.settings.cellWidth - xHalfWallWidth, yCellTop - yHalfWallWidth, this.settings.xWallWidth, this.settings.cellHeight + this.settings.yWallWidth, this.settings.xWallWidth*0.5));
                }
            }
        }
    }

    DrawMaze(context, sumMaxOpponentDistances, currentOpponentCells) {
        context.save();
        context.fillStyle = this.settings.pathColour;
        context.strokeStyle = this.settings.pathColour;
        context.lineWidth = 2;
        context.fillRect(this.settings.xBorderWidth, this.settings.yBorderWidth, this.settings.mazeWidth, this.settings.mazeHeight);
        this.#DrawCells(context, sumMaxOpponentDistances, currentOpponentCells);
        context.fillStyle = this.settings.wallColour;
        context.strokeStyle = this.settings.wallColour;
        for (let wall of this.#wallData) {
            this.#DrawRoundedRectangle(context, wall);
        }
        context.restore();
    }

    #DrawRoundedRectangle(context, wall) {
        context.beginPath();
        if (wall.height <= wall.width) {
            context.moveTo(wall.xCoord + wall.radius, wall.yCoord);
            context.arcTo(wall.xCoord + wall.width, wall.yCoord, wall.xCoord + wall.width, wall.yCoord + wall.radius, wall.radius);
            context.arcTo(wall.xCoord + wall.width, wall.yCoord + wall.height, wall.xCoord + wall.width - wall.radius, wall.yCoord + wall.height, wall.radius);
            context.arcTo(wall.xCoord, wall.yCoord + wall.height, wall.xCoord, wall.yCoord + wall.radius, wall.radius);
            context.arcTo(wall.xCoord, wall.yCoord, wall.xCoord + wall.radius, wall.yCoord, wall.radius);
        }
        else {
            context.moveTo(wall.xCoord, wall.yCoord+wall.radius);
            context.arcTo(wall.xCoord, wall.yCoord, wall.xCoord + wall.radius, wall.yCoord, wall.radius);
            context.arcTo(wall.xCoord + wall.width, wall.yCoord, wall.xCoord + wall.width, wall.yCoord + wall.radius, wall.radius);
            context.arcTo(wall.xCoord + wall.width, wall.yCoord + wall.height, wall.xCoord + wall.radius, wall.yCoord + wall.height, wall.radius);
            context.arcTo(wall.xCoord, wall.yCoord + wall.height, wall.xCoord, wall.yCoord + wall.height - wall.radius, wall.radius);
        }
        context.closePath();
        context.stroke();
        context.fill();
        context.closePath();
    }

    #DrawCells(context, sumMaxOpponentDistances, currentOpponentCells) {
        context.save();
        let red = parseInt(this.settings.pathColour.slice(1,3), 16);
        let green = parseInt(this.settings.pathColour.slice(3,5), 16);
        let blue = parseInt(this.settings.pathColour.slice(5,7), 16);
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                let cell = this.cells[rowNum][colNum];
                let xCoord = cell.xCoord - (0.5 * this.settings.cellWidth);
                let yCoord = cell.yCoord - (0.5 * this.settings.cellHeight);
                let cellColour = this.#CalculateCellBackgroundFromDistances(cell, sumMaxOpponentDistances, currentOpponentCells, red, green, blue);
                context.fillStyle = cellColour;
                context.strokeStyle = cellColour;
                context.beginPath();
                context.fillRect(xCoord, yCoord, this.settings.cellWidth, this.settings.cellHeight);
                context.stroke();
                context.closePath();
            }
        }
        context.restore();
    }

    #GenerateCellBackgroundColour(cellDistance, maxDistance, red, green, blue) {
        red = red + Math.floor(((255-red)/maxDistance)*cellDistance);
        green = green + Math.floor(((255-green)/maxDistance)*cellDistance);
        blue = blue + Math.floor(((255-blue)/maxDistance)*cellDistance);
        return "rgb(" + red + "," + green + "," + blue + ")";
    }

    #CalculateCellBackgroundFromDistances(cell, sumMaxOpponentDistances,currentOpponentCells, red, green, blue){
        let cellDistance = 0;
        for (let opponentCell of currentOpponentCells) {
            cellDistance += this._FindDistanceBetweenTwoCells(cell, opponentCell);
        }
        return this.#GenerateCellBackgroundColour(cellDistance, sumMaxOpponentDistances, red, green, blue);
    }
}