// bygger html for labyrinten med vægge på alle side i alle celler (altså før labyrinten er skåret ud)
export function createVisualLabyrinth(model) {
    const labContainer = document.querySelector("#grid-container");
    labContainer.innerHTML = "";

    for (let row = 0; row < model.rows; row++) {
        for (let col = 0; col < model.cols; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add("grey");
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

// opdatere labyrintens vægge
export function updateVisualLabyrinth(model) {
    const visualCells = document.querySelectorAll("#grid-container .cell");
    
    for (let row = 0; row < model.rows; row++) {
        for (let col = 0; col < model.cols; col++) {

            const visualCellIndex = row * model.cols + col;
            const visualCell = visualCells[visualCellIndex];
            
            if (!model.maze[row][col].north) {
                visualCell.classList.remove("north");
            }
            if (!model.maze[row][col].east) {
                visualCell.classList.remove("east");
            }
            if (!model.maze[row][col].south) {
                visualCell.classList.remove("south");
            }
            if (!model.maze[row][col].west) {
                visualCell.classList.remove("west");
            }
        }
    }
}

// fjerner walked og grey således at cellen fremstår som besøgt
export function markCellVisited(cell, model) {
    const visualCells = document.querySelectorAll("#grid-container .cell");
    const cellIndex = cell.row * model.cols + cell.col;

    visualCells[cellIndex].classList.remove("grey");
    visualCells[cellIndex].classList.remove("walked");
}


// tilføjer markering af at en celle er blevet gået/trådt på
export function markCellWalked(cell, model) {
    const visualCells = document.querySelectorAll("#grid-container .cell");
    const cellIndex = cell.row * model.cols + cell.col;

    visualCells[cellIndex].classList.add("walked");
}

// fjerner markering af at der er blevet "trådt" på en celle
export function markCellUnWalked(cell, model) {
    const visualCells = document.querySelectorAll("#grid-container .cell");
    const cellIndex = cell.row * model.cols + cell.col;

    visualCells[cellIndex].classList.remove("walked");
}

export function printLabyrinthInJSON(model) {
    const labyrinthJsonText = JSON.stringify(model, null, 2) // null = replacer | 2 = space
    document.querySelector("#json-labyrinth").textContent = labyrinthJsonText

}