import * as view from "./view.js";

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
    }
}
