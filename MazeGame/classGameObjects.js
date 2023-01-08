class GameObjects {
    #settings;
    #usedCells;
    #currentOpponentCells;
    #startCell;
    #sumMaxOpponentDistances;

    constructor(settings) {
        this.#settings = settings;
        this.#usedCells = [];
        this.#GenerateMaze();
        this.#SetStartAndFinishCells();
        this.opponents = [];
        this.#currentOpponentCells = [];
        this.player;
        this.maze;
        this.#startCell;
        this.finishCell;
        this.#sumMaxOpponentDistances;

        this.#CreatePlayer();
        this.#CreateOpponents();
    }

    #GenerateMaze() {
        this.maze = new Maze(this.#settings);
        this.maze.RemoveDeadEnds();
        this.maze.StoreWallData();
        this.maze.FindDistancesToAllCellsFromAllCells();
    }

    DrawMazeObjects(context) {
        context.fillStyle = "#000000";
        context.fillRect(0,0,this.#settings.canvas.width, this.#settings.canvas.height);
        this.maze.DrawMaze(context, this.#sumMaxOpponentDistances, this.#currentOpponentCells);
        this.#DrawFinishCell(context);
    }

    #CreatePlayer() {
        this.player = new Player(this.#settings, this.maze, this.#startCell.xCoord, this.#startCell.yCoord, 0);
    }

    #CreateOpponents() {
        for (let opponentNum = 1; opponentNum < this.#settings.level + 1; opponentNum++) {
            this.opponents.push(this.#CreateOpponent(opponentNum));
        }
    }

    #CreateOpponent(opponentNum) {
        let opponentStartCell = this.#SetOpponentStartCell();
        let opponent = new Opponent(this.#settings, this.maze, opponentStartCell.xCoord, opponentStartCell.yCoord, opponentNum, 0);
        opponent.UpdateTargetCell(this.maze.FindNextCellOnShortestPath(opponent.currentCell, this.player.currentCell));
        return opponent;
    }

    #SetStartAndFinishCells() {
        if (this.#settings.rows >= this.#settings.columns) {
            this.#startCell = this.maze.cells[0][Math.floor(Math.random()*(this.#settings.columns))];
            this.finishCell = this.maze.cells[this.#settings.rows - 1][Math.floor(Math.random()*(this.#settings.columns))];
        }
        else {
            this.#startCell = this.maze.cells[Math.floor(Math.random()*(this.#settings.rows))][0];
            this.finishCell = this.maze.cells[Math.floor(Math.random()*(this.#settings.rows))][this.#settings.columns - 1];
        }
        this.#usedCells.push(this.#startCell);
        this.#usedCells.push(this.finishCell);
    }

    #SetOpponentStartCell() {
        let opponentStartCell = this.#startCell;
        if (this.#settings.rows >= this.#settings.columns) {
            while (this.#usedCells.includes(opponentStartCell)) {
                opponentStartCell = this.maze.cells[this.#settings.rows - 1][Math.floor(Math.random()*(this.#settings.columns))];
            }
        }
        else {
            while (this.#usedCells.includes(opponentStartCell)) {
                opponentStartCell = this.maze.cells[Math.floor(Math.random()*(this.#settings.rows))][this.#settings.columns - 1];
            }
        }
        this.#usedCells.push(opponentStartCell);
        return opponentStartCell;
    }

    UpdateCharacterPositions() {
        this.player.UpdateCharacterPosition();
        this.#sumMaxOpponentDistances = 0;
        this.#currentOpponentCells = [];
        for (let opponentIndex in this.opponents) {
            let opponent = this.opponents[opponentIndex];
            opponent.UpdateCharacterPosition();
            this.#sumMaxOpponentDistances += this.maze.maxDistances[opponent.currentCell.row + "+" + opponent.currentCell.column];
            this.#currentOpponentCells.push(opponent.currentCell);
        }
    }

    #DrawFinishCell(context) {
        let innerRadius = Math.min(this.#settings.xCellSpace, this.#settings.yCellSpace) / 3.5;
        let outerRadius = 1.6 * innerRadius;
        let xCoord = this.finishCell.xCoord;
        let yCoord = this.finishCell.yCoord;
        let angleBetweenPoints = 2 * Math.PI / 5;
        context.save();
        context.strokeStyle = "black";
        context.fillStyle = this.#settings.wallColour;
        context.beginPath();
        context.moveTo(xCoord + outerRadius * Math.cos(1.5 * Math.PI), yCoord + outerRadius * Math.sin(1.5 * Math.PI));
        for (let pointNum = 1; pointNum < 6; pointNum++) {
            let firstAngle = 1.5 * Math.PI + (pointNum - 0.5) * angleBetweenPoints;
            let secondAngle = 1.5 * Math.PI + pointNum * angleBetweenPoints;
            context.lineTo(xCoord + innerRadius * Math.cos(firstAngle), yCoord + innerRadius * Math.sin(firstAngle));
            context.lineTo(xCoord + outerRadius * Math.cos(secondAngle), yCoord + outerRadius * Math.sin(secondAngle));
        }
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
    }
}