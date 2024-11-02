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
        this.randomWalk();
    }

    randomWalk() {
        // I starten vælges tilfældig celle som sættes som værende besøgt(visited) - det er denne celle som randomWalk skal "collide" med
        const rowCoordinate = Math.floor(Math.random() * this.rows);
        const colCoordinate = Math.floor(Math.random() * this.cols);
        this.maze[rowCoordinate][colCoordinate].visited = true;
        console.log("1st random cell is visited at: ", rowCoordinate, ",", colCoordinate);

        // random walk så længe der er en celle der ikke er besøgt i this.maze
        while (this.checkForUnvisitedCells) {
            const currentCell = this.selectRandomUnvisitedCell(); // den celle som randomWalk er nået til - initieres som tilfældig ubesøgt celle
            const route = []; // en stack til at holde styr på randomWalk's rute

            while (!currentCell.visited) {
                route.push(currentCell);

                currentCell = getRandomNeighbour(currentCell)

                if (route.includes(currentCell)) {
                    // pop alt fra listen efter
                }
            }
        }
    }

    // en funktion returnere true hvis der er ubesøgte celler og false hvis alle celler er besøgt
    checkForUnvisitedCells() {
        return this.maze.some((row) => row.some((cell) => !cell.visited));
    }

    // en funktion der returner en tilfældig ubesøgt celle, det er her et nyt random walk starter fra
    selectRandomUnvisitedCell() {
        const unvisitedRowCoordinate = Math.floor(Math.random() * this.rows);
        const unvisitedColCoordinate = Math.floor(Math.random() * this.cols);
        const cell = this.maze[unvisitedRowCoordinate][unvisitedColCoordinate];
        console.log("unvisited cell to start walking from: ", cell);

        if (this.checkForUnvisitedCells) {
            return cell;
        }
    }

    getRandomNeighbour(cell) {
        let neighbourCells = [];

        for (const dir of directions) {
            const neighbourRow = cell.row + dir.rowChange;
            const neighbourCol = cell.col + dir.colChange;
            
            if (neighbourRow < this.rows && neighbourRow >= 0 && neighbourCol < this.cols && neighbourCol >= 0) {
                const neighbour = this.maze[neighbourRow][neighbourCol]
                neighbourCells.push(neighbour);
                // console.log("current cell: ", cell)
                // console.log("neighbour cell pushed: ", neighbour)
            }
        }
        // console.log(Math.floor(Math.random() * neighbourCells.length));
        const randomNeighbour = neighbourCells[Math.floor(Math.random() * neighbourCells.length)]

        return randomNeighbour;
    }
}
