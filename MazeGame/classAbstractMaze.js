class AbstractMaze {
    constructor(settings) {
        this.settings = settings;
        this.cells = [];
        this.#PrepareMazeCells();
        this.#ConfigureCells();
        this.#CreateMaze();
        this.RemoveDeadEnds();
    }

    #PrepareMazeCells() {
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            let row = [];
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                row.push(new Cell(rowNum, colNum));
            }
            this.cells.push(row.slice());
        }
    }

    #ConfigureCells() {
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                if (rowNum > 0) {
                    this.cells[rowNum][colNum].SetNorth(this.cells[rowNum-1][colNum]);
                }
                if (rowNum < this.settings.rows-1) {
                    this.cells[rowNum][colNum].SetSouth(this.cells[rowNum+1][colNum]);
                }
                if (colNum < this.settings.columns-1) {
                    this.cells[rowNum][colNum].SetEast(this.cells[rowNum][colNum+1]);
                }
                if (colNum > 0) {
                    this.cells[rowNum][colNum].SetWest(this.cells[rowNum][colNum-1]);
                }
            }
        }
    }

    #LinkCellsToAllNeighbours() {
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                let neighbours = this.cells[rowNum][colNum].AllNeighbours();
                for (let i = 0; i <neighbours.length; i++) {
                    this.cells[rowNum][colNum].Link(neighbours[i]);
                }
            }
        }
    }

    #CreateMaze() {
        this.#LinkCellsToAllNeighbours();
        let maxPathWidth = 2;
        this.#CreateMazeHidden(this.cells[0][0], this.cells[this.settings.rows-1][this.settings.columns-1], maxPathWidth);
    }

    #CreateMazeHidden(topLeft, bottomRight, maxPathWidth) {
        let height = bottomRight.row - topLeft.row + 1;
        let width = bottomRight.column - topLeft.column + 1;

        if (height === 1 && width ===1) {
            return;
        }
        if (height <= maxPathWidth && width <= maxPathWidth) {
            if (Math.random() < 0.25) {
                return;
            }
        }
        if (height >= width) {
            let splitHeight = Math.min(Math.floor(Math.random()*(height-1)+1), height-1);
            let gap1 = Math.min(Math.floor(Math.random()*(width)), width-1);
            let gap2 = gap1;
            if (width > 5) {
                while (Math.abs(gap2-gap1) < 2) {
                    gap2 = Math.min(Math.floor(Math.random()*(width)),width-1);
                }
            }
            for (let column = topLeft.column; column <= bottomRight.column; column++) {
                if ((column != topLeft.column + gap1) && (column != topLeft.column + gap2)) {
                    this.cells[topLeft.row + splitHeight-1][column].Unlink(this.cells[topLeft.row+splitHeight][column]);
                }
            }
            this.#CreateMazeHidden(topLeft,this.cells[topLeft.row+splitHeight-1][bottomRight.column], maxPathWidth);
            this.#CreateMazeHidden(this.cells[topLeft.row+splitHeight][topLeft.column], bottomRight, maxPathWidth);
        }
        else {
            let splitWidth = Math.min(Math.floor(Math.random()*(width-1)+1), width-1);
            let gap1 = Math.min(Math.floor(Math.random()*(height)), height-1);
            let gap2 = gap1;
            if (height > 5) {
                while (Math.abs(gap2 - gap1) < 2) {
                    gap2 = Math.min(Math.floor(Math.random()*(height)),height-1);
                }
            }
            for (let row = topLeft.row; row <= bottomRight.row; row++) {
                if ((row != topLeft.row + gap1) && (row != topLeft.row + gap2)) {
                    this.cells[row][topLeft.column + splitWidth-1].Unlink(this.cells[row][topLeft.column+splitWidth]);
                }
            }
            this.#CreateMazeHidden(topLeft,this.cells[bottomRight.row][topLeft.column+splitWidth-1], maxPathWidth);
            this.#CreateMazeHidden(this.cells[topLeft.row][topLeft.column+splitWidth], bottomRight, maxPathWidth);
        }
    }

    RemoveDeadEnds() {
        let deadEnds = this.#FindDeadEnds();
        let target = Math.floor(this.settings.removeDeadEnds * deadEnds.length);
        while (deadEnds.length > target) {
            let cell = deadEnds[Math.min(Math.floor(Math.random()*(deadEnds.length)), deadEnds.length -1)];
            while (cell.IsDeadEnd() === false) {
                cell = deadEnds[Math.min(Math.floor(Math.random()*(deadEnds.length)), deadEnds.length -1)];
            }
            let deadEndNeighbours = cell.AllDeadEndNeighbours();
            if (deadEndNeighbours.length > 0) {
                let connect = deadEndNeighbours[Math.min(Math.floor(Math.random()*(deadEndNeighbours.length)), deadEndNeighbours.length - 1)];
                cell.Link(connect);
            }
            else {
                let unlinkedNeighbours = cell.AllUnlinkedNeighbours();
                let connect = unlinkedNeighbours[Math.min(Math.floor(Math.random()*(unlinkedNeighbours.length)), unlinkedNeighbours.length - 1)];
                cell.Link(connect);
            }
            deadEnds = this.#FindDeadEnds();
        }
    }

    #FindDeadEnds() {
        let deadEnds = [];
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                if (this.cells[rowNum][colNum].IsDeadEnd()) {
                    deadEnds.push(this.cells[rowNum][colNum]);
                }
            }
        }
        return deadEnds;
    }
}