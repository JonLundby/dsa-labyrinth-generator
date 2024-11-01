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
                this.maze[row].push({ row: 0, col: 0, north: true, east: true, west: true, south: true, visited: false });
            }
        }
        this.randomWalk();
    }

    randomWalk() {
        const rowCoordinate = Math.floor(Math.random() * this.rows);
        const colCoordinate = Math.floor(Math.random() * this.cols);
        const randomCoordinate = { row: rowCoordinate, col: colCoordinate }
        
        console.log(randomCoordinate)

        while (condition) {
            
        }
    }
}
