// Search_Student.js 
// Computer Science 3200 - Assignment 2
// Author(s): David Churchill [replace with your name(s)]
//    Course: 3200 or 6980
//
// All of your Assignment code should be in this file, it is the only file submitted.
// You may create additional functions / member variables within this class, but do not
// rename any of the existing variables or function names, since they are used by the
// GUI to perform specific functions.
//
// Recommended order of completing the assignment:
// 1. Construct the function which computes whether a given size agent canFit in given x,y
//    This will be used by computeSectors / isLegalAction
// 2. Complete the computeSectors algorithm using 4D BFS as shown in class slides
// 3. Use results of step 2 to complete the isConnected function, test it with GUI
// 4. Complete the isLegalAction function, which will be used by searchIteration
// 5. Complete the startSearch function, which is called before searchIteration
// 6. Complete the getOpen and getClosed functions, which will help you visualize / debug
// 7. Complete searchIteration using A* with a heuristic of zero. It should behave like UCS.
// 8. Implement estimateCost heuristic functions, and use it with A*
// 9. (6980) Implement bidirectional search
//
// Please remove these comments before submitting. If you did not get any of the
// functionality of the assignment to work properly, please explain here in a comment.

class Search_Student {

    constructor(grid, config) {
        this.config = config;       // search configuration object
                                    //   config.actions = array of legal [x, y] actions
                                    //   config.actionCosts[i] = cost of config.actions[i]
                                    //   config.heuristic = 'diag', 'card', 'dist', or 'zero'
                                    //   config.bidirectional = true or false
        this.name = "Student";
        this.grid = grid;           // the grid we are using to search
        this.sx = -1;               // x location of the start state
        this.sy = -1;               // y location of the start state
        this.gx = -1;               // x location of the goal state
        this.gy = -1;               // y location of the goal state
        this.size = 1;              // the square side length (size) of the agent
        this.maxSize = 3;           // the maximum size of an agent

        this.inProgress = false;    // whether the search is in progress
        this.expanded = 0;          // number of nodes expanded (drawn in GUI)

        this.path = [];             // the path, if the search found one
        this.open = [];             // the current open list of the search (stores Nodes)
        this.closed = [];           // the current closed list of the search
        this.cost = 'Search Not Completed'; // the cost of the path found, -1 if no path

        this.computeSectors();
    }
    
    // Student TODO: Implement this function
    //
    // This function should set up all the necessary data structures to begin a new search
    // This includes, but is not limited to: setting the start and goal locations, resetting
    // the open and closed lists, and resetting the path. I have provided a starting point,
    // but it is not complete.
    //
    // Please note that this is NOT the place to do your connected sector computations. That
    // should be done ONCE upon object creation in the computeSectors function below.
    //
    // Args:
    //    sx, sy (int,int) : (x,y) position of the start state
    //    gx, gy (int,int) : (x,y) position of the goal state
    //    size   (int)     : the size of the agent for this search episode
    //
    // Returns:
    //    none             : this function does not return anything
    //
    startSearch(sx, sy, gx, gy, size) {
        // deals with an edge-case with the GUI, leave this line here
        if (sx == -1 || gx == -1) { return; }

        this.inProgress = true;     // the search is now considered started
        this.sx = sx;               // set the x,y location of the start state
        this.sy = sy;
        this.gx = gx;               // set the x,y location of the goal state
        this.gy = gy;
        this.size = size;           // the size of the agent
        this.path = [];             // set an empty path

        // TODO: everything else necessary to start a new search
    }

    // Student TODO: Implement this function
    //
    // This function should compute and return the heuristic function h(n) of a given
    // start location to a given goal location. This function should return one of
    // four different values, based on the this.config.heuristic option
    //
    // Args:
    //    x, y   (int,int) : (x,y) location of the given position
    //    gx, gy (int,int) : (x,y) location of the goal
    //    size             : the square side length size of the agent
    //
    // Returns:
    //    int              : the computed distance heuristic
    estimateCost(x, y, gx, gy) {
        // compute and return the diagonal manhattan distance heuristic
        if (this.config.heuristic == 'diag') {
            return 3;
        // compute and return the 4 directional (cardinal) manhattan distance
        } else if (this.config.heuristic == 'card') {
            return 2;
        // compute and return the 2D euclidian distance (Pythagorus)
        } else if (this.config.heuristic == 'dist') {
            return 1;
        // return zero heuristic
        } else if (this.config.heuristic == 'zero') {
            return 0;
        }
    }

    // Student TODO: Implement this function
    //
    // This function should return whether or not an object of a given size can 'fit' at
    // the given (x,y) location. An object can fit if the following are true:
    //    - the object lies entirely within the boundary of the map
    //    - all tiles occupied by the object have the same grid value
    //
    // Args:
    //    x, y (int,int) : (x,y) location of the object
    //    size           : the square side length size of the agent
    //
    // Returns:
    //    bool           : whether the object can fit
    canFit(x, y, size) {
        return true;
    }

    // Student TODO: Implement this function
    //
    // This function should return whether or not the two given locations are connected.
    // Two locations are connected if a path is possible between them. For this assignment,
    // keep in mine that 4D connectedness is equivalent to 8D connectedness because you
    // cannot use a diagonal move to jump over a tile.
    //
    // Args:
    //    x1, y1 (int,int) : (x,y) location 1
    //    x2, y2 (int,int) : (x,y) location 2
    //    size             : the square side length size of the agent
    //
    // Returns:
    //    bool              : whether the two locations are connected
    isConnected(x1, y1, x2, y2, size) {
        // incorrect example code: just return whether the colors match
        // this HAS TO BE CHANGED for the assignment, it is NOT CORRECT
        return this.grid.get(x1, y1) == this.grid.get(x2, y2);
    }

    // Student TODO: Implement this function
    //
    // This function should compute and return whether or not the given action is able
    // to be performed from the given (x,y) location.
    //
    // Diagonal moves are only legal if both 2-step cardinal moves are also legal.
    // For example: Moving diagonal up-right is only legal if you can move both up 
    //              then right, as well as right then up. 
    //
    // Args:
    //    x, y   (int,int) : (x,y) location of the given position
    //    size             : the square side length size of the agent
    //    action [int,int] : the action to be performed, representing the [x,y] movement
    //                       from this position. for example: [1,0] is move 1 in the x
    //                       direction and 0 in the y direction (move right). 
    //
    // Returns:
    //    bool : whether or not the given action is legal at the given location
    isLegalAction(x, y, size, action) {
        return true;
    }

    // Student TODO: Implement this function
    //
    // This function should compute and store the connected sectors discussed in class.
    // This function is called by the construct of this object before it is returned.
    //
    // Args:
    //    none
    //
    // Returns:
    //    none
    computeSectors() {

    }

    // Student TODO: Implement this function
    //
    // This function performs one iteration of search, which is equivalent to everything
    // inside the while (true) part of the algorithm pseudocode in the class nodes. The
    // only difference being that when a path is found, we set the internal path variable
    // rather than return it from the function. When expanding the current node, you must 
    // use the this.isLegalAction function above.
    //
    // If the search has been completed (path found, or open list empty) then this function
    // should do nothing until the startSearch function has been called again. This function
    // should correctly set the this.inProgress variable to false once the search has been
    // completed, which is required for the GUI to function correctly.
    //
    // This function should perform one the A* search algorithm using Graph-Search
    // The algorithm is located in the Lecture 6 Slides
    //
    // Tip: You can use the included BinaryHeap object as your open list data structure
    //      You may also use a simple array and search for it for the minimum f-value
    //
    // Args:
    //    none
    //
    // Returns:
    //    none
    //
    searchIteration() {
        
        // if we've already finished the search, do nothing
        if (!this.inProgress) { return; }

        // we can do a quick check to see if the start and end goals are connected
        // if they aren't, then we can end the search before it starts
        // don't bother searching if the start and end points don't have the same type
        // this code should remain for your assignment
        if (!this.isConnected(this.sx, this.sy, this.gx, this.gy, this.objectSize)) { 
            this.inProgress = false; // we don't need to search any more
            this.cost = -1; // no path was possible, so the cost is -1
            return; 
        }

        // Example: For simple demonstration, compute an L-shaped path to the goal
        // This is just so the GUI shows something when Student code is initially selected
        // Completely delete all of the following code in this function to write your solution
        var dx = (this.gx - this.sx) > 0 ? 1 : -1;
        var dy = (this.gy - this.sy) > 0 ? 1 : -1;
        for (var x=0; x < Math.abs(this.gx-this.sx); x++) { this.path.push([dx, 0]); }
        for (var y=0; y < Math.abs(this.gy-this.sy); y++) { this.path.push([0, dy]); }
        
        // 6980 only: bidirectional search
        if (this.config.bidirectional) {
            // do bidirectional search
        } else {
            // do normal start to goal search
        }

        // we found a path, so set inProgress to false
        this.inProgress = false;

        // set the cost of the path that we found
        // our sample L-shaped path cost is its length * 100
        // this will not be true for the correct solution!
        this.cost = this.path.length * 100;

        // if the search ended and no path was found, set this.cost = -1
    }

    // Student TODO: Implement this function
    //
    // This function returns the current open list states in a given format. This exists as
    // a separate function because your open list used in search will store nodes
    // instead of states, and may have a custom data structure that is not an array.
    //
    // Args:
    //    none
    //
    // Returns:
    //    openList : an array of unique [x, y] states that are currently on the open list
    //
    getOpen() {
        return [];
    }

    // Student TODO: Implement this function
    //
    // This function returns the current closed list in a given format. This exists as
    // a separate function, since your closed list used in search may have a custom 
    // data structure that is not an array.
    //
    // Args:
    //    none
    //
    // Returns:
    //    closedList : an array of unique [x, y] states that are currently on the closed list
    //
    getClosed() {
        return [];
    }
}

// The Node class to be used in your search algorithm.
// This should not need to be modified to complete the assignment
// Note: child.g = parent.g + cost(action)
class Node {
    constructor(x, y, parent, action, g, h) {
        this.x = x;
        this.y = y;
        this.action = action;
        this.parent = parent;
        this.g = g;
        this.h = h;
    }
}