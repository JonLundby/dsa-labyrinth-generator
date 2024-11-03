import * as view from "./view.js";

const directions = [
    { name: "north", rowChange: -1, colChange: 0 },
    { name: "east", rowChange: 0, colChange: 1 },
    { name: "south", rowChange: 1, colChange: 0 },
    { name: "west", rowChange: 0, colChange: -1 },
];

export default class Labyrinth {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.start = { row: 0, col: 0 };
        this.goal = { row: this.rows - 1, col: this.cols - 1 };
        this.maze = [];
    }

    generateMaze() {
        for (let row = 0; row < this.rows; row++) {
            this.maze.push([]);
            for (let col = 0; col < this.cols; col++) {
                this.maze[row].push({
                    row: row,
                    col: col,
                    north: true,
                    east: true,
                    west: true,
                    south: true,
                    visited: false,
                });
            }
        }
        // this.randomWalk();
    }

    randomWalk() {
        // I starten vælges tilfældig celle som sættes som værende besøgt(visited) - det er denne celle som randomWalk skal "collide" med
        const rowCoordinate = Math.floor(Math.random() * this.rows);
        const colCoordinate = Math.floor(Math.random() * this.cols);
        const initialCellVisit = this.maze[rowCoordinate][colCoordinate];
        initialCellVisit.visited = true;
        view.markCellVisited(initialCellVisit, this);
        console.log(`Random cell set to visited at: row ${initialCellVisit.row}, col ${initialCellVisit.col}`);

        // random walk så længe der er en celle der ikke er besøgt i this.maze
        while (this.checkForUnvisitedCells()) {
            // finder en tilfældig celle at start randomWalk fra
            let currentCell = this.selectRandomUnvisitedCell();
            console.log(`Start randomWalk from: row ${currentCell.row}, col ${currentCell.col}`);
            // en "stack" til at holde styr på randomWalk's rute
            let route = [];

            // så længe den celle som randomWalk og routen starter fra endnu ikke er besøgt
            while (!currentCell.visited) {
                route.push(currentCell);
                console.log(`row ${currentCell.row}, col ${currentCell.col} pushed to route`);
                for (const element of route) {
                    console.log(element);
                }

                view.markCellWalked(currentCell, this);

                let nextCell = this.getRandomNeighbour(currentCell);

                // hvis ruten indeholder nextCell så har ruten ramt sig selv og skal trimmes tilbage til det element den ramte
                if (route.includes(nextCell)) {
                    console.log(`Route self collision, route will be trimmed`);
                    // route.pop()// popper den celle som allerede er i listen
                    // popper 1 fra ruten indtil den når den næste af de to ens celle i ruten
                    do {
                        currentCell = route.pop();
                        view.markCellUnWalked(currentCell, this);
                        if (currentCell === nextCell) {
                            route.push(nextCell)
                        }
                    } while (nextCell !== currentCell);

                    for (const e of route) {
                        console.log(e);
                    }
                } // else if (nextCell.visited) {
                // dette else if statement er overflødigt fordi at currentCell allerede er visited når den rammer den der er visited
                // currentCell.visited = true; // ???????den foregående celle behøves måske ikke sættes til visited????????
                // }

                currentCell = nextCell; // når current
            }

            // !!! IF ELSE BURDE VÆRE OVERFLØDIGT HER DA selectRandomUnvisitedCell ALLEREDE SØRGER FOR AT UDGANGSPUNKT IKKE ER VISITED !!!
            // hvis routen er 0 så må randomwalks udgangspunkt være visited
            // if (route.length === 0) {
            // this.randomWalk();
            // } else {
            this.setWalls(route);

            for (const cell of route) {
                view.markCellVisited(cell, this);
                this.maze[cell.row][cell.col].visited = true;
                // view.markCellUnWalked(cell, this);
            }
            route = [];
            console.log("Route should be empty: ", route);
            view.updateVisualLabyrinth(this);

            // console log det succesfulde randomWalk
            for (let row = 0; row < this.rows; row++) {
                for (let col = 0; col < this.cols; col++) {
                    const cell = this.maze[row][col];
                    if (this.maze[row][col].visited) {
                        console.log(`route cell: row ${cell.row}, col ${cell.col} - ${cell.visited}`);
                    }
                }
            }
            // }
        }
    }

    // en funktion returnere true hvis der er ubesøgte celler og false hvis alle celler er besøgt
    checkForUnvisitedCells() {
        return this.maze.some((row) => row.some((cell) => !cell.visited));
    }

    // en funktion der returner en tilfældig ubesøgt celle, det er her et nyt random walk starter fra
    selectRandomUnvisitedCell() {
        let unvisitedRowCoordinate;
        let unvisitedColCoordinate;
        let cell;

        // sæt nye koordinater så længe den rammer en celle der er visited
        do {
            unvisitedRowCoordinate = Math.floor(Math.random() * this.rows);
            unvisitedColCoordinate = Math.floor(Math.random() * this.cols);
            cell = this.maze[unvisitedRowCoordinate][unvisitedColCoordinate];
        } while (cell.visited);

        return cell;
    }

    getRandomNeighbour(cell) {
        let neighbourCells = [];

        for (const dir of directions) {
            const neighbourRow = cell.row + dir.rowChange;
            const neighbourCol = cell.col + dir.colChange;

            if (neighbourRow < this.rows && neighbourRow >= 0 && neighbourCol < this.cols && neighbourCol >= 0) {
                const neighbour = this.maze[neighbourRow][neighbourCol];
                neighbourCells.push(neighbour);
            }
        }

        const randomNeighbour = neighbourCells[Math.floor(Math.random() * neighbourCells.length)];

        // if statements mest bare til console logs
        if (cell.row > randomNeighbour.row) {
            console.log("neighbour is north??");
            // randomNeighbour.south = false;
        }
        if (cell.row < randomNeighbour.row) {
            console.log("neighbour is south??");
            // randomNeighbour.north = false;
        }
        if (cell.col > randomNeighbour.col) {
            console.log("neighbour is west??");
            // randomNeighbour.east = false;
        }
        if (cell.col < randomNeighbour.col) {
            console.log("neighbour is east??");
            // randomNeighbour.west = false;
        }

        console.log(`Going to ${randomNeighbour.row},${randomNeighbour.col}`);
        return randomNeighbour;
    }

    setWalls(route) {
        for (let i = 1; i < route.length; i++) {
            const currentRouteCell = route[i - 1];
            const nextRouteCell = route[i];

            if (currentRouteCell.row > nextRouteCell.row) {
                this.maze[currentRouteCell.row][currentRouteCell.col].north = false;
                this.maze[nextRouteCell.row][nextRouteCell.col].south = false;
            }
            if (currentRouteCell.row < nextRouteCell.row) {
                this.maze[currentRouteCell.row][currentRouteCell.col].south = false;
                this.maze[nextRouteCell.row][nextRouteCell.col].north = false;
            }
            if (currentRouteCell.col > nextRouteCell.col) {
                this.maze[currentRouteCell.row][currentRouteCell.col].west = false;
                this.maze[nextRouteCell.row][nextRouteCell.col].east = false;
            }
            if (currentRouteCell.col < nextRouteCell.col) {
                this.maze[currentRouteCell.row][currentRouteCell.col].east = false;
                this.maze[nextRouteCell.row][nextRouteCell.col].west = false;
            }
        }
    }
}
