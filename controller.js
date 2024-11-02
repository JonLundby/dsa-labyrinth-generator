"use strict";

import Labyrinth from "./model.js";

window.addEventListener("load", init);

// let ROW_SIZE;
// let COL_SIZE;

async function init() {
    let ROW_SIZE = document.querySelector("#row-size-input").value;
    let COL_SIZE = document.querySelector("#col-size-input").value;

    document.querySelector("#row-size-input").addEventListener("change", (e) => {
        ROW_SIZE = parseInt(e.target.value);
    });
    document.querySelector("#col-size-input").addEventListener("change", (e) => {
        COL_SIZE = parseInt(e.target.value);
    });

    document.querySelector("#create-labyrinth-btn").addEventListener("click", async () => {
        document.documentElement.style.setProperty("--grid-rows", ROW_SIZE);
        document.documentElement.style.setProperty("--grid-cols", COL_SIZE);

        const model = new Labyrinth(ROW_SIZE, COL_SIZE);
        model.generateMaze();

        createLabyrinth(model);
    });
}

async function getLabyrinthModel() {
    const response = await fetch(`./labyrinth.json`);

    const data = await response.json();
    return data;
}

// det her er måske mere view del...
function createLabyrinth(model) {
    // console.log(model);
    const labContainer = document.querySelector("#grid-container");
    labContainer.innerHTML = "";

    for (let row = 0; row < model.rows; row++) {
        for (let col = 0; col < model.cols; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (model.maze[row][col].north) {
                cell.classList.add("north");
            }
            if (model.maze[row][col].east) {
                cell.classList.add("east");
            }
            if (model.maze[row][col].south) {
                cell.classList.add("south");
            }
            if (model.maze[row][col].west) {
                cell.classList.add("west");
            }
            labContainer.insertAdjacentElement("beforeend", cell);
        }
    }
}
