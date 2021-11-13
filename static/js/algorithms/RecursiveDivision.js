// // TODO CHECK IF RUNNING graph.shortest() will  generate any path quickly (teh dragging endpoints and updating the shoteest path thing)
// let horizontal = 0
// let vertical = 1
// function orientation(width, height){
//     if (width < height){
//         return horizontal
//     } else if(height < width){
//         return vertical
        
//     } else{
//          var i =Math.floor(Math.random()*2)
//         return [horizontal,vertical][i]
//     }
// }

// function divide(grid, x,y,width,height, orientate){
//     if (width < 2 || height < 2){
//         return true
//     }
     
// }

// function recursiveDivision(grid){
//     ///
// }

var grid;

function generate(dimensions, numDoors) {
    grid = [];
    for (var i = 0; i < dimensions; i++) {
        grid[i] = new Array();

        for (var j = 0; j < dimensions; j++) {
            grid[i][j] = "";
        }
    }

    addOuterWalls();
    var ent = addEntrance();
    console.log(ent)
    addInnerWalls(true, 1, grid.length - 2, 1, grid.length - 2, ent);
}

function addOuterWalls() {
    for (var i = 0; i < grid.length; i++) {
        if (i == 0 || i == (grid.length - 1)) {
            for (var j = 0; j < grid.length; j++) {
                grid[i][j] = "w";
            }
        } else {
            grid[i][0] = "w";
            grid[i][grid.length - 1] = "w";
        }
    }
}

function addEntrance() {
    var x = randomNumber(1, grid.length - 1);
    grid[grid.length - 1][x] = "g";
    return x;
}

function addInnerWalls(h, minX, maxX, minY, maxY, gate) {
    if (h) {

        if (maxX - minX < 2) {
            return;
        }

        var y = Math.floor(randomNumber(minY, maxY)/2)*2;
        addHWall(minX, maxX, y);

        addInnerWalls(!h, minX, maxX, minY, y-1, gate);
        addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(randomNumber(minX, maxX)/2)*2;
        addVWall(minY, maxY, x);

        addInnerWalls(!h, minX, x-1, minY, maxY, gate);
        addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
    }
}

function addHWall(minX, maxX, y) {
    var hole = Math.floor(randomNumber(minX, maxX)/2)*2+1;

    for (var i = minX; i <= maxX; i++) {
        if (i == hole) grid[y][i] = "";
        else grid[y][i] = "w";
    }
}

function addVWall(minY, maxY, x) {
    var hole = Math.floor(randomNumber(minY, maxY)/2)*2+1;

    for (var i = minY; i <= maxY; i++) {
        if (i == hole) grid[i][x] = "";
        else grid[i][x] = "w";
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function display() {
    document.getElementById("cnt").innerHTML = "";

    for (var i = 0; i < grid.length; i++) {
        var output = "<div>";
        for (var j = 0; j < grid.length; j++) {
            output += "<b " + grid[i][j] + "></b>";
        }
        output += "</div>";
        document.getElementById("cnt").innerHTML += output;
    }
}
// generate(31, 1, 1);
// display();
export {generate,display}