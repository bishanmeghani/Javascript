class MazePath extends AbstractMaze {
    #allDistances;

    constructor(settings) {
        super(settings);
        this.#allDistances = {};
        this.maxDistances = {};
    }

    FindNextCellOnShortestPath(startCell, endCell) {
        if (startCell === endCell) {
            return endCell;
        }
        let path = new Stack();
        let queuedCells = new Queue();
        queuedCells.Enqueue(startCell);
        let processedCellData = {};
        processedCellData[startCell.row + "+" + startCell.column] = null;
        let currentCell = startCell;

        while (currentCell !== endCell) {
            currentCell = queuedCells.Dequeue();
            for (let linkedNeighbour of currentCell.links) {
                if (!((linkedNeighbour.row + "+" + linkedNeighbour.column) in processedCellData)) {
                    queuedCells.Enqueue(linkedNeighbour);
                    processedCellData[linkedNeighbour.row + "+" + linkedNeighbour.column] = currentCell;
                }
            }
        }

        path.Push(endCell);
        while (currentCell !== startCell) {
            currentCell = processedCellData[currentCell.row + "+" + currentCell.column];
            path.Push(currentCell);
        }
        path.Pop();
        return path.Pop();
    }

    FindDistancesToAllCellsFromAllCells() {
        for (let rowNum = 0; rowNum < this.settings.rows; rowNum++) {
            for (let colNum = 0; colNum < this.settings.columns; colNum++) {
                let cell = this.cells[rowNum][colNum];
                this.#allDistances[cell.row + "+" + cell.column] = this.#FindDistancesToAllCellsFromOneCell(cell);
            }
        }
    }

    #FindDistancesToAllCellsFromOneCell(startCell) {
        let queuedCells = new Queue();
        queuedCells.Enqueue(startCell);
        let cellDistances = {};
        cellDistances[startCell.row + "+" + startCell.column] = 0;
        let maxDistances = 0;

        while (!(queuedCells.IsEmpty())) {
            let currentCell = queuedCells.Dequeue();
            let currentDistance = cellDistances[currentCell.row + "+" + currentCell.column];
            for (let linkedNeighbour of currentCell.links) {
                if (!((linkedNeighbour.row + "+" + linkedNeighbour.column) in cellDistances)) {
                    queuedCells.Enqueue(linkedNeighbour);
                    cellDistances[linkedNeighbour.row + "+" + linkedNeighbour.column] = currentDistance + 1;
                    maxDistances = currentDistance + 1;
                }
            }
        }
        this.maxDistances[startCell.row + "+" + startCell.column] = maxDistances;
        return cellDistances;
    }

    _FindDistanceBetweenTwoCells(firstCell, secondCell) {
        return this.#allDistances[firstCell.row + "+" + firstCell.column][secondCell.row + "+" + secondCell.column];
    }
}