class Cell {
    
    #nullCell;

    constructor(row, column) {
        this.#nullCell = [-1,-1];
        this.row = row;
        this.column = column;
        this.north = this.#nullCell;
        this.south = this.#nullCell;
        this.east = this.#nullCell;
        this.west = this.#nullCell;
        this.links = [];
        this.xCoord;
        this.yCoord;
    }

    SetNorth(otherCell) {
        this.north = otherCell;
    }

    SetSouth(otherCell) {
        this.south = otherCell;
    }

    SetEast(otherCell) {
        this.east = otherCell;
    }

    SetWest(otherCell) {
        this.west = otherCell;
    }

    AllNeighbours() {
        let neighbours = [];
        if (this.#ArrayEquals(this.north, this.#nullCell) === false) {
            neighbours.push(this.north);
        }
        if (this.#ArrayEquals(this.south, this.#nullCell) === false) {
            neighbours.push(this.south);
        }
        if (this.#ArrayEquals(this.east, this.#nullCell) === false) {
            neighbours.push(this.east);
        }
        if (this.#ArrayEquals(this.west, this.#nullCell) === false) {
            neighbours.push(this.west);
        }
        return neighbours;
    }

    #ArrayEquals(a,b) {
        return Array.isArray(a) && Array.isArray(b) && a.length == b.length;
    }

    Unlink(otherCell, bidi = true) {
        let otherCellNum = this.#CellLinkNumber(otherCell);
        if (otherCell !== -1) {
            this.links.splice(otherCellNum, 1);
            if (bidi === true) {
                otherCell.Unlink(this, false);
            }
        }
    }

    Link(otherCell, bidi = true) {
        if (this.IsLinked(otherCell) === false) {
            this.links.push(otherCell);
            if (bidi === true) {
                otherCell.Link(this,false);
            }
        }
    }

    #CellLinkNumber(otherCell) {
        for (let i = 0; i < this.links.length; i++) {
            if ((this.links[i].row === otherCell.row) && (this.links[i].column === otherCell.column)) {
                return i;
            }
        }
        return -1;
    }

    IsLinked(otherCell) {
        if (otherCell.row === -1) {
            return false;
        }
        for (let i = 0; i < this.links.length; i++) {
            if ((this.links[i].row === otherCell.row) && (this.links[i].column === otherCell.column)) {
                return true;
            }
        }
        return false;
    }

    IsDeadEnd() {
        return (this.links.length === 1);
    }

    AllDeadEndNeighbours() {
        let neighbours = this.AllNeighbours();
        let deadEndNeighbours = [];
        for (let neighbourIndex in neighbours) {
            if (neighbours[neighbourIndex].IsDeadEnd()) {
                deadEndNeighbours.push(neighbours[neighbourIndex]);
            }
        }
        return deadEndNeighbours;
    }

    AllUnlinkedNeighbours() {
        let neighbours = this.AllNeighbours();
        let unlinkedNeighbours = [];
        for (let neighbourIndex in neighbours) {
            if (neighbours[neighbourIndex].IsLinked(this) === false) {
                unlinkedNeighbours.push(neighbours[neighbourIndex]);
            }
        }
        return unlinkedNeighbours;
    }

    StoreXYCoords(settings) {
        this.xCoord = settings.cellWidth * (this.column + 0.5) + settings.xBorderWidth;
        this.yCoord = settings.cellHeight * (this.row + 0.5) + settings.yBorderWidth;
    }
}