# Labyrinth generator

[Try the labyrinth generator](https://jonlundby.github.io/dsa-labyrinth-generator/)

For this labyrinth generator i have used Wilson's algorithm

links used for research:

https://en.wikipedia.org/wiki/Maze_generation_algorithm#Wilson's_algorithm
https://weblog.jamisbuck.org/2011/1/20/maze-generation-wilson-s-algorithm

I also made chat-gpt generate some pseudocode to get started on:

chatgpt pseudo-code:

-   Initialize grid with each cell surrounded by walls
-   Mark all cells as unvisited

-   Choose a random cell and mark it as visited

-   While there are unvisited cells:
    Choose a random unvisited cell as the start of a random walk
    Initialize an empty path list

    -   While the current cell is unvisited:
        Add the current cell to the path list
        Choose a random neighboring cell and move to it

        -   If the new cell is already in the path list:
            Remove all cells in the path after the first occurrence of this cell
            (This prevents loops in the walk)

    -   For each cell in the path:
        Mark the cell as visited
        Break the wall between consecutive cells in the path
