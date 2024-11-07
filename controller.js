"use strict";

import Labyrinth from "./model.js";
import * as view from "./view.js";

window.addEventListener("load", init);

let model;

const directions = [
    { name: "north", rowChange: -1, colChange: 0 },
    { name: "east", rowChange: 0, colChange: 1 },
    { name: "south", rowChange: 1, colChange: 0 },
    { name: "west", rowChange: 0, colChange: -1 },
];

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
        // tilpasser css grid
        document.documentElement.style.setProperty("--grid-rows", ROW_SIZE);
        document.documentElement.style.setProperty("--grid-cols", COL_SIZE);

        // instantiere ny labyrint med grid størrelse svarende til inputs
        model = new Labyrinth(ROW_SIZE, COL_SIZE);

        // generere data til maze med x * x antal celler hvor hver celler har vægge mod nord, øst, syd og vest
        model.generateMaze();
        // generateMaze();

        // generere den visuelle labyrint
        view.createVisualLabyrinth(model);

        // model.randomWalk();
        randomWalk();
        document.querySelector("#create-labyrinth-btn").disabled = true;
    });

    document.querySelector("#clear-labyrinth-btn").addEventListener("click", () => {
        document.querySelector("#grid-container").innerHTML = "";
        document.querySelector("#json-labyrinth").innerHTML = "";
        document.querySelector("#create-labyrinth-btn").disabled = false;
    });
}

async function getLabyrinthModel() {
    const response = await fetch(`./labyrinth.json`);

    const data = await response.json();
    return data;
}

async function randomWalk() {
    // I starten vælges tilfældig celle som sættes som værende besøgt(visited) - det er denne celle som randomWalk skal "collide" med
    const rowCoordinate = Math.floor(Math.random() * model.rows);
    const colCoordinate = Math.floor(Math.random() * model.cols);
    const initialCellVisit = model.maze[rowCoordinate][colCoordinate];
    initialCellVisit.visited = true;
    await view.markCellVisited(initialCellVisit, model);
    console.log(`Random cell set to visited at: row ${initialCellVisit.row}, col ${initialCellVisit.col}`);

    // random walk så længe der er en celle der ikke er besøgt i this.maze
    while (checkForUnvisitedCells(model)) {
        // finder en tilfældig celle at start randomWalk fra
        let currentCell = selectRandomUnvisitedCell();
        console.log(`Start randomWalk from: row ${currentCell.row}, col ${currentCell.col}`);
        // en "stack" til at holde styr på randomWalk's rute
        let route = [];

        // så længe den celle som randomWalk og routen starter fra endnu ikke er besøgt
        while (!currentCell.visited) {
            route.push(currentCell);

            await view.markCellWalked(currentCell, model);

            let nextCell = getRandomNeighbour(currentCell, model);

            // hvis ruten indeholder nextCell så har ruten ramt sig selv og skal trimmes tilbage til det element den ramte
            if (route.includes(nextCell)) {
                console.log(`Route self collision, route will be trimmed`);
                // route.pop()// popper den celle som allerede er i listen
                // popper 1 fra ruten indtil den når den næste af de to ens celle i ruten
                do {
                    currentCell = route.pop();
                    await view.markCellUnWalked(currentCell, model);
                } while (nextCell !== currentCell);
            }

            currentCell = nextCell; // når current
        }

        // husker at forbinde den sidste og allerede besøgte celle med ruten
        route.push(currentCell);

        // fjerner væggene mellem cellerne i ruten
        setWalls(route);

        // for hver celle i ruten opdateres visited i maze/model og view delen kaldes for at opdatere rutens celler visuelt
        for (const cell of route) {
            await view.markCellVisited(cell, model);
            model.maze[cell.row][cell.col].visited = true;
        }

        // ruten tømmes så en ny kan begyndes
        route = [];

        // hele modelen opdateres visuelt for at kunne se at vægge fra ruten er blevet fjernet
        await view.updateVisualLabyrinth(model);
    }

    setAllCellUnvisited(model);
    view.printLabyrinthInJSON(model);
}

// en funktion returnere true hvis der er ubesøgte celler og false hvis alle celler er besøgt
function checkForUnvisitedCells(model) {
    return model.maze.some((row) => row.some((cell) => !cell.visited));
}

// en funktion der returner en tilfældig ubesøgt celle, det er her et nyt random walk starter fra
function selectRandomUnvisitedCell() {
    let unvisitedRowCoordinate;
    let unvisitedColCoordinate;
    let cell;

    // sæt nye koordinater så længe den rammer en celle der er visited
    do {
        unvisitedRowCoordinate = Math.floor(Math.random() * model.rows);
        unvisitedColCoordinate = Math.floor(Math.random() * model.cols);
        cell = model.maze[unvisitedRowCoordinate][unvisitedColCoordinate];
    } while (cell.visited);

    return cell;
}

function getRandomNeighbour(cell, model) {
    let neighbourCells = [];

    for (const dir of directions) {
        const neighbourRow = cell.row + dir.rowChange;
        const neighbourCol = cell.col + dir.colChange;

        if (neighbourRow < model.rows && neighbourRow >= 0 && neighbourCol < model.cols && neighbourCol >= 0) {
            const neighbour = model.maze[neighbourRow][neighbourCol];
            neighbourCells.push(neighbour);
        }
    }

    const randomNeighbour = neighbourCells[Math.floor(Math.random() * neighbourCells.length)];

    // if statements mest bare til console logs
    if (cell.row > randomNeighbour.row) {
        console.log("neighbour is north??");
    }
    if (cell.row < randomNeighbour.row) {
        console.log("neighbour is south??");
    }
    if (cell.col > randomNeighbour.col) {
        console.log("neighbour is west??");
    }
    if (cell.col < randomNeighbour.col) {
        console.log("neighbour is east??");
    }

    console.log(`Going to ${randomNeighbour.row},${randomNeighbour.col}`);
    return randomNeighbour;
}

// funktion der sætter vægge udfra ruten
function setWalls(route) {
    for (let i = 1; i < route.length; i++) {
        const currentRouteCell = route[i - 1];
        const nextRouteCell = route[i];

        if (currentRouteCell.row > nextRouteCell.row) {
            model.maze[currentRouteCell.row][currentRouteCell.col].north = false;
            model.maze[nextRouteCell.row][nextRouteCell.col].south = false;
        }
        if (currentRouteCell.row < nextRouteCell.row) {
            model.maze[currentRouteCell.row][currentRouteCell.col].south = false;
            model.maze[nextRouteCell.row][nextRouteCell.col].north = false;
        }
        if (currentRouteCell.col > nextRouteCell.col) {
            model.maze[currentRouteCell.row][currentRouteCell.col].west = false;
            model.maze[nextRouteCell.row][nextRouteCell.col].east = false;
        }
        if (currentRouteCell.col < nextRouteCell.col) {
            model.maze[currentRouteCell.row][currentRouteCell.col].east = false;
            model.maze[nextRouteCell.row][nextRouteCell.col].west = false;
        }
    }
}

// funktion der resetter alle celler til visited = false (så solver appen kan besøge påny)
function setAllCellUnvisited(model) {
    for (let row = 0; row < model.rows; row++) {
        for (let col = 0; col < model.cols; col++) {
            model.maze[row][col].visited = false;
        }
    }
}
