let container = document.getElementById('grid');
var mousedown = false
let grid = [],
    gridWidth = 49,
    gridHeight = 25
let fsm = { // FINATE STATE MACHINE
    addWall: false,
    addPoints: false,
    dragEndpoint: false,
    animating: false,
    animSpeed: 2,

},
    drawType = {
        freeDraw: true,
        lineDraw: false,
        spiralDraw: false,
    };

let elementHold,
    prev,
    start,
    end;

let pathList = [],
    wallList = [];

let tools = document.getElementsByClassName('tools'),
    loader = document.getElementById('loader-container'),
    timer;
listeners()


// TODO CREATE ANIMATION STATE 
// CREATE HELPER THAT DISABLES ALL TOOLS WHILE ANIMATION STATE IS TRUE
// CREATE TOOL THAT CLEARS PATHS AND VISITED, AND TOOL THAT CLEARS THE BOARD OF WALLS

function initlize(height, width) {


    // container.addEventListener('mousedown', onMouseDown)
    // container.addEventListener('mousehover', onMouseOver)
    // container.addEventListener('mouseup', onMouseUp)

    container.addEventListener('mouseleave', containerLeave)
    for (var i = 0; i < height; i++) {

        var row = document.createElement('div');
        row.className = "row-container row";
        row.id = "row" + i;
        grid.push([])
        for (var j = 0; j < width; j++) {
            var box = document.createElement('div');
            box.className = 'box box-node-container';
            box.id = i + ',' + j;
            row.appendChild(box);

            var boxNode = document.createElement('div');
            boxNode.className = 'box box-node unvisited'
            //box.appendChild(boxNode)
            box.addEventListener('mousedown', onMouseDown)
            box.addEventListener('mouseover', onMouseOver)
            box.addEventListener('mouseup', onMouseUp)
            box.addEventListener('mouseleave', onMouseLeave)

            grid[i].push(box)


        }

        container.appendChild(row);
    }
    if (container) {

    }
    wallDrawState()
    return container;
}

// TOOLS 
// DROP DOWN
var mazeSelect = document.getElementById('maze')
var mazebtn = document.getElementById('mazebtn')

function generateMaze() {
    if (!fsm.animating) {

        const value = mazeSelect.options[mazeSelect.selectedIndex].value;
        if (value == 'recursiveDiv') {

            recursiveDivision()
        } else {
            mazebtn.innerText = 'SELECT MAZE!'
            mazebtn.classList.add('disabled')
            setTimeout(function () {
                mazebtn.innerText = 'Start'
                mazebtn.classList.remove('disabled')
            }, 1500)
        }


        endPointCheck(start)
    }
}

var algorithimSelect = document.getElementById('algorithims')
var pathfinderbtn = document.getElementById('pathfinderbtn')



function clearWalls() {
    if (!fsm.animating) {
        for (i = 0; i < wallList.length; i++) {
            box = document.getElementById(wallList[i])
            box.classList.remove('wall-node')


        }
        wallList = []
    }
}
function clearVisit() {
    if (!fsm.animating) {
        for (i = 0; i < grid.length; i++) {

            for (j = 0; j < grid[i].length; j++) {

                box = grid[i][j]
                if (box.classList.contains('visited-node') || box.classList.contains('path-node')) {
                    box.classList.remove('visited-node')
                    box.classList.remove('path-node')

                }
            }
        }
    }
}
function clearPaths() {
    if (!fsm.animating) {
        for (i = 0; i < pathList.length; i++) {

            box = document.getElementById(pathList[i])
            if (box.classList.contains('path-node')) {
                box.classList.remove('path-node')

            }
        }
    }
}
function clearBoard() {
    if (!fsm.animating) {
        for (i = 0; i < grid.length; i++) {

            for (j = 0; j < grid[i].length; j++) {

                box = grid[i][j]
                if (box.classList.contains('visited-node') || box.classList.contains('wall-node') || box.classList.contains('path-node')) {
                    box.classList.remove('visited-node')
                    box.classList.remove('wall-node')
                    box.classList.remove('path-node')


                }
            }
        }
        wallList = []
    }
}
function resetBoard() {
    if (!fsm.animating) {
        for (i = 0; i < grid.length; i++) {

            for (j = 0; j < grid[i].length; j++) {

                box = grid[i][j]

                box.classList.remove('visited-node')
                box.classList.remove('wall-node')
                box.classList.remove('path-node')
                box.classList.remove('start-node')
                box.classList.remove('end-node')


            }
        }
        wallList = []
        grid[11][12].classList.add('start-node');
        grid[11][37].classList.add('end-node');
        start = grid[11][12].id
        end = grid[11][37].id
    }
}

function disableFunctions() {
    for (i = 0; i < tools.length; i++) {
        tool = tools.item(i)
        if (!tool.classList.contains('disabled')) {
            tool.classList.add('disabled')
        } else {
            tool.classList.remove('disabled')
        }
    }
}

function endPointCheck(node) {
    // NOTE THIS CHECKS IF ENDPOINT IS BLOCKED ON ALL SIDES AND UNBLOCKS IT IN THE MAZE GENERATION
    //nodeId = node.id.split(',')
    //console.log(node)
    //up, down, left, right


}


function pathfinder() {
    const value = algorithimSelect.options[algorithimSelect.selectedIndex].value;
    if (value != "") {
        pathFinderRender(value)
    }
    else {
        pathfinderbtn.innerText = 'SELECT ALGORITHIM'
        pathfinderbtn.classList.add('disabled')
        setTimeout(function () {
            pathfinderbtn.innerText = 'Visualize'
            pathfinderbtn.classList.remove('disabled')
        }, 1500)
    }
}
function pathFinderRender(algoType) {
    gridData = []
    var dataFlags = {
        'unvisited': 0,
        'wall-node': 'W',
        'start-node': 'S',
        'end-node': 'F'
    }
    if (!fsm.animating) {
        for (i = 0; i < grid.length; i++) {
            gridData.push([])
            for (j = 0; j < grid[i].length; j++) {
                var node = 0

                box = grid[i][j]

                if (box.classList.contains('unvisited')) {
                    node = 0
                }
                if (box.classList.contains('wall-node')) {
                    node = 'W'
                }
                if (box.classList.contains('start-node')) {
                    node = 'S'
                    start = box.id

                }
                if (box.classList.contains('end-node')) {
                    node = 'F'
                    end = box.id
                }
                if (box.classList.contains('end-node') && box.classList.contains('start-node')) {
                    node = 'OV'
                }

                gridData[i].push(node)
            }
        }

        //console.log( 'DATA FROM CLIENT:', JSON.stringify(gridData))
        clearVisit()
        disableFunctions()
        ajaxHelper(JSON.stringify(gridData), start, end, algoType)
    }
}

// button functions
let addbtn = document.getElementById('add-wall')
let removebtn = document.getElementById('remove-wall')
addbtn.addEventListener('mousedown', onWallAdd)
removebtn.addEventListener('mousedown', onWallRemove)
function wallDrawState() {
    fsm.addWall = !fsm.addWall
    if (!fsm.addWall) {
        // remove
        addbtn.classList.remove('active-tool')
        removebtn.classList.add('active-tool')
        fsm.addWall = false
    } else {
        //add
        addbtn.classList.add('active-tool')
        removebtn.classList.remove('active-tool')
        fsm.addWall = true
    }

}

function onWallAdd(event) {
    if (!addbtn.classList.contains('active-tool')) {
        wallDrawState()
    }
}

function onWallRemove(event) {
    if (!removebtn.classList.contains('active-tool')) {
        wallDrawState()
    }
}


// from django documentation
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function ajaxHelper(gridData, start, end, algoType) {
    $.ajax({
        type: "POST",


        data: { 'result': gridData, 'start': start, 'end': end, 'algoType': algoType },
        dataType: "json",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken,
        },
        beforeSend: function () {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                loader.hidden = false
            },
                300);

        },

        success: (data) => {

            visualizePathfinder(data)

        },
        error: (error) => {
            console.log(error);
        },
        complete: function () {
            clearTimeout(timer);
            loader.hidden = true
        },
    });
}

function visualizePathfinder(data) {
    visited = data['visited']
    path = data['path'].reverse()
    pathList = path
    viz(visited, path, 'visited-node', false, 1)
}
function viz(array, array2, className, animEnd, animSpeedScaler) {
    fsm.animating = true
    for (let i = 0; i < array.length; i++) {
        setTimeout(function () {
            nodeId = array[i]
            var cell = document.getElementById(nodeId)
            cell.classList.add(className)

            if (i == array.length - 1) {
                if (animEnd) {
                    fsm.animating = false
                    disableFunctions()
                } else {
                    viz(array2, [], 'path-node', true, 5.1)
                }
            }
        }, i * fsm.animSpeed * animSpeedScaler);// unique scaler 5.1);
    }
}

// MAZE GENERATION

let wallAnimationStack = []
function recursiveDivision() {
    console.log('function call')
    clearBoard()
    wallAnimationStack = []
    width = grid[1].length
    height = grid.length
    //console.log(width,height)

    addOuterWalls(width, height);
    var ent = start
    //console.log(width,height)
    addInnerWalls(true, 1, width - 2, 1, height - 2, ent);
    fsm.animating = true
    for (let i = 0; i < wallAnimationStack.length; i++) {
        setTimeout(function () {
            const el = wallAnimationStack[i][0]
            const method = wallAnimationStack[i][1]
            if (method == 'add') {
                el.classList.add('wall-node')
            }
            else {
                //console.log('remove', el)
                el.classList.remove('wall-node')

            }
            if (i == wallAnimationStack.length - 1) {
                fsm.animating = false
            }
        }, i * 10)
    }

}

function addOuterWalls(width, height) {
    for (var i = 0; i < height; i++) {
        if (i == 0 || i == (height - 1)) {
            for (var j = 0; j < width; j++) {
                wallAnimationStack.push([grid[i][j], 'add'])
                //grid[i][j].classList.add('wall-node');
                wallList.push(grid[i][j].id)
            }
        } else {
            wallAnimationStack.push([grid[i][0], 'add'])
            wallAnimationStack.push([grid[i][width - 1], 'add'])
            //grid[i][0].classList.add('wall-node');
            //grid[i][width - 1].classList.add('wall-node');
            wallList.push(grid[i][0].id)
            wallList.push(grid[i][width - 1].id)
        }
    }
}

function addEntrance() {
    var x = randomNumber(1, grid.length - 1);
    grid[grid.length - 1][x].classList.add('start-node');
    return x;
}
let orientate = { 'HORIZONTAL': 0, 'VERTICAL': 1 }
function addInnerWalls(h, minX, maxX, minY, maxY, gate) {
    if (h) {
        if (maxX - minX < 2) {
            return;
        }

        var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
        addWall(minX, maxX, y, orientate['HORIZONTAL']);

        addInnerWalls(!h, minX, maxX, minY, y - 1, gate);
        addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
        addWall(minY, maxY, x, orientate['VERTICAL']);

        addInnerWalls(!h, minX, x - 1, minY, maxY, gate);
        addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
    }
}

function addWall(min, max, a, orientation) {
    var hole = Math.floor(randomNumber(min, max) / 2) * 2 + 1;
    fsm.animating = true
    //disableFunctions()
    for (var i = min; i <= max; i++) {
        if (orientation == 1) {
            node = grid[i][a]
        } else {
            node = grid[a][i]
        }
        var isEndPoint = node.classList.contains('start-node') || node.classList.contains('end-node')

        addWallAnimate(i, node, hole, isEndPoint)


    }

}

function addWallAnimate(i, node, hole, isEndPoint) {
    //setTimeout(function () {
    if (i == hole || isEndPoint) {
        //node.classList.remove('wall-node')
        wallAnimationStack.push([node, 'remove'])
    } else {
        wallAnimationStack.push([node, 'add'])//node.classList.add('wall-node')
        wallList.push(node.id)
    }
    if (i == grid.length || i == grid[1].length) {
        fsm.animating = false

    }
    //}, i * 200)
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}




//DRAW STATES
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function line(start, end) {
    var p0 = new Point(Number(start.split(',')[1]), Number(start.split(',')[0]))
    var p1 = new Point(Number(end.split(',')[1]), Number(end.split(',')[0]))
    line(p0, p1)
}

// from https://www.redblobgames.com/grids/line-drawing.html
function lineHelper(p0, p1) {
    let points = [];
    let N = diagonal_distance(p0, p1);
    for (let step = 0; step <= N; step++) {
        let t = N === 0 ? 0.0 : step / N;
        points.push(round_point(lerp_point(p0, p1, t)));
    }
    return points;
}

function diagonal_distance(p0, p1) {
    let dx = p1.x - p0.x, dy = p1.y - p0.y;
    return Math.max(Math.abs(dx), Math.abs(dy));
}

function round_point(p) {
    return new Point(Math.round(p.x), Math.round(p.y));
}

function lerp_point(p0, p1, t) {
    return new Point(lerp(p0.x, p1.x, t),
        lerp(p0.y, p1.y, t));
}

function lerp(start, end, t) {
    return start + t * (end - start);
}
// end of  https://www.redblobgames.com/grids/line-drawing.html

// EVENT LISTENERS
function listeners() {
    //EVENT LISTENERS
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('load', onLoad,);

};

function onLoad() {
    rows = gridHeight//Math.floor((container.offsetHeight-100)/20)
    cols = gridWidth //Math.floor((container.offsetWidth)/27)

    initlize(rows, cols);

    //console.log(grid)
    grid[11][12].classList.add('start-node');
    grid[11][37].classList.add('end-node');
    start = grid[11][12].id
    end = grid[11][37].id


};

function onWindowResize() {

    // rows =  Math.floor((container.offsetHeight-100)/20)
    // cols = Math.floor((container.offsetWidth)/27)

    // grid(rows,cols);


};
//// MOUSE EVENTS
function containerLeave(event) {
    mousedown = false
    if (fsm.dragEndpoint) {
        prev.classList.add(elementHold)
        fsm.dragEndpoint = false
    }

}

function mouseEventHelper(node) {
    if (!(node.classList.contains('start-node')) && !((node.classList.contains('end-node')))) {

        if (node.classList.contains('wall-node') && !fsm.addWall) {
            node.classList.remove('wall-node')
        }
        else if (fsm.addWall) {
            if (drawType.lineDraw) {

            }
            if (node.classList.contains('visited-node')) {
                node.classList.remove('visited-node')
                node.classList.add('wall-node')
                wallList.push(node.id)
            } else {
                node.classList.add('wall-node')
                wallList.push(node.id)
            }

        }
    }
    if (node.classList.contains('start-node') || (node.classList.contains('end-node'))) {
        fsm.dragEndpoint = true
        clearPaths()
        if (node.classList.contains('start-node')) {
            elementHold = 'start-node'
        }
        else {
            elementHold = 'end-node'
        }

        prev = node

    }

    if (node.classList.contains('path-node') && (node.classList.contains('wall-node'))) {
        //console.log('CLEAR PATHS')
        clearPaths()
    }
}

function mouseEvent(event) {
    if (!fsm.animating && mousedown && !fsm.dragEndpoint) {


        if (event.target.classList.contains('box')) {
            mouseEventHelper(event.target)
        }

    }
}

function onMouseDown(event) {

    mousedown = true
    mouseEvent(event)
}

function onMouseUp(event) {
    mousedown = false
    fsm.dragEndpoint = false
}

function nodeMoveHelper(node) {
    node.classList.add(elementHold)
    if (elementHold == 'start-node') {
        start = node.id
        //console.log(start)
    }
    else {
        end = node.id
    }
    //fsm.animSpeed = 0
    //gridConverter()
    //node.classList.remove('wall-node')


}

function onMouseOver(event) {
    mouseEvent(event)
    if (mousedown) {
        if (fsm.dragEndpoint && event.target.classList.contains('box')) {


            nodeMoveHelper(event.target)

        }
    }
}

function onMouseLeave(event) {
    if (fsm.dragEndpoint) {
        prev = event.target
        event.target.classList.remove(elementHold)
    }
    //console.log(prev)

}



