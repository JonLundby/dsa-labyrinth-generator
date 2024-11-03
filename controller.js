"use strict";

import Labyrinth from "./model.js";
import * as view from "./view.js";

window.addEventListener("load", init);

let model;

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
        // tilpasse css grid
        document.documentElement.style.setProperty("--grid-rows", ROW_SIZE);
        document.documentElement.style.setProperty("--grid-cols", COL_SIZE);

        // instantiere ny labyrint med grid størrelse svarende til inputs
        model = new Labyrinth(ROW_SIZE, COL_SIZE);

        // generere data til maze med x * x antal celler hvor hver celler har vægge mod nord, øst, syd og vest
        model.generateMaze();

        // generere den visuelle labyrint
        view.createVisualLabyrinth(model);

        model.randomWalk();
    });
}

async function getLabyrinthModel() {
    const response = await fetch(`./labyrinth.json`);

    const data = await response.json();
    return data;
}

