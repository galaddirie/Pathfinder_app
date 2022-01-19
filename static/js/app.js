class Cell {
    constructor(x, y, element) {
        this.value
        this.x = x
        this.y = y
        this.element = element
        this.prev_value
    }
    update(value) {
        if (!(value == 'wall-node' && this.isEndPoint())) {
            this.prev_value = this.value
            this.value = value
            this.element.classList.add(value)
        }
    }
    remove(value) {
        if (value) {
            this.value = this.prev_value
            this.prev_value = null
            this.element.classList.remove(value)
        }
    }
    isEndPoint() {
        return this.value == 'start-node' || this.value == 'end-node'
    }
    isWall() {
        return this.value == 'wall-node'
    }

}


class BoardState {
    constructor() {
        this.moveEndPoint = false
        this.drawEnabled = true
        this.drawType = 'freeDraw'
        this.inputEnabled = true
        this.animating = false
        this.animSpeed = 2
    }
}


class BoardMoveInput {
    constructor(board) {
        this.board = board
        this.state = board.state
        this.drawHandle = board.drawHandle
        this.mousedown = false
        this.elementHold = { cell: null, prev: null }

        this.setMouseInput()
    }

    setMouseInput() {
        this.mouseOverListener = this.onMouseOver.bind(this)
        this.mouseDownListener = this.onMouseDown.bind(this)
        this.mouseUpListener = this.onMouseUp.bind(this)
        this.mouseLeaveListener = this.onMouseLeave.bind(this)
        this.leaveContainerListener = this.onContainerLeave.bind(this)
        console.log(this.board.cells)
        for (let i = 0; i < this.board.cells.length; i++) {
            for (let j = 0; j < this.board.cells[i].length; j++) {
                const el = this.board.cells[i][j].element;

                el.addEventListener('mouseover', this.mouseOverListener)
                el.addEventListener('mouseleave', this.mouseLeaveListener)
                el.addEventListener('mousedown', this.mouseDownListener)
                el.addEventListener('mouseup', this.mouseUpListener)

            }

        }
        this.board.element.addEventListener('mouseleave', this.leaveContainerListener)
    }

    mouseEvent(event) {
        let cell
        if (event.target.classList.contains('box')) {
            cell = this.board.getCell(event.target.id)
        }

        if (!this.state.animating && this.mousedown) {
            if (this.state.moveEndPoint) {
                //console.log(this.elementHold.cell)
                this.board.move(this.elementHold.cell, cell)
            }
            else if (cell.isEndPoint()) {
                this.elementHold.cell = cell
                this.elementHold.prev = cell.element
                this.state.moveEndPoint = true
            }

            else {

                if (this.state.drawEnabled && !cell.isEndPoint() && !this.state.moveEndPoint
                    && !cell.element.classList.contains('start-node')) {
                    switch (this.state.drawType) {
                        case 'freeDraw':
                            console.log('drawing wall')
                            this.drawHandle.freeDraw(event, cell)
                            break
                        case 'erase':
                            this.drawHandle.erase(event, cell)
                            break
                        default:
                            console.log('No Draw Mode')
                            break
                    }

                }
            }

        }
    }

    onMouseDown(event) {

        this.mousedown = true
        const x = this.board.getCell(event.target.id)
        console.log(x)
        this.mouseEvent(event)
    }

    onMouseUp(event) {
        this.mousedown = false
        this.state.moveEndPoint = false
    }

    onMouseOver(event) {
        if (this.mousedown) {
            this.mouseEvent(event)
        }
    }

    onMouseLeave(event) {
        if (this.state.moveEndPoint) {
            this.elementHold.cell = this.board.getCell(event.target.id)
            this.elementHold.prev = event.target
            //event.target.classList.remove(this.elementHold.cell.value)
        }

    }

    onContainerLeave(event) {
        this.mousedown = false
        this.state.moveEndPoint = false
        // if (this.elementHold.cell) {
        //     this.elementHold.prev.classList.add(this.elementHold.cell.value)
        // }
    }
}


class Board {
    constructor(height, width) {
        this.state = new BoardState()
        this.cells = []
        this.element = document.getElementById('grid');
        for (var i = 0; i < height; i++) {
            var row = document.createElement('div');
            row.className = "row-container row";
            row.id = "row" + i;
            this.cells.push([])
            for (var j = 0; j < width; j++) {
                var box = document.createElement('div');
                box.className = 'box box-node-container';
                box.id = i + ',' + j;
                row.appendChild(box);
                const cell = new Cell(i, j, box)
                this.cells[i].push(cell)
            }
            this.element.appendChild(row);
        }
        this.initializeBoard()
        this.initalizeTools()
        this.drawHandle = new DrawHandler(this)
        this.mouseInput = new BoardMoveInput(this)

    }

    initializeBoard() {
        // let walls = document.querySelector('.wall-node')
        // walls.walls.forEach(element => {
        //     element.classList.remove('wall-node')
        // });
        this.start = this.cells[11][12]
        this.start.update('start-node')

        this.end = this.cells[11][37]
        this.end.update('end-node')
    }

    initalizeTools() {
        this.addbtn = document.getElementById('add-wall')
        this.removebtn = document.getElementById('remove-wall')
        this.addWallListener = this.draw.bind(this)
        this.removeWallListener = this.erase.bind(this)
        this.addbtn.addEventListener('click', this.addWallListener)
        this.removebtn.addEventListener('click', this.removeWallListener)

        this.clearWallsbtn = document.getElementById('clearWalls')
        this.clearVisitbtn = document.getElementById('clearVisit')
        this.resetBoardBtn = document.getElementById('resetBoard')

        this.clearWallsListener = this.clearWalls.bind(this)
        this.clearVisitListener = this.clearVisited.bind(this)
        this.resetBoardListener = this.resetBoard.bind(this)

        this.clearWallsbtn = new Button('clearTool', this.clearWallsbtn, this.clearWallsListener)
        this.clearVisitbtn = new Button('clearTool', this.clearVisitbtn, this.clearVisitListener)
        this.resetBoardBtn = new Button('clearTool', this.resetBoardBtn, this.resetBoardListener)
    }

    getCell(id) {
        let loc = id.split(',')
        return this.cells[loc[0]][loc[1]]
    }

    move(fromNode, toNode) {
        if (toNode) {
            toNode.update(fromNode.value)
            fromNode.remove(toNode.value)
            switch (toNode.value) {
                case 'start-node':
                    this.start = toNode
                    break
                case 'end-node':
            }       this.end = toNode
        }


    }

    draw() {
        if (this.state.drawType != "freeDraw") {
            this.addbtn.classList.add('active-tool')
            this.removebtn.classList.remove('active-tool')
            this.state.drawType = "freeDraw"
        }
    }

    erase() {
        if (this.state.drawType != "erase") {
            this.addbtn.classList.remove('active-tool')
            this.removebtn.classList.add('active-tool')
            this.state.drawType = "erase"
        }
    }

    clearWalls() {
        const walls = this.element.querySelectorAll('.wall-node')
        walls.forEach(node => {
            node.classList.remove('wall-node')
        });
    }

    clearVisited() {
        const visited = this.element.querySelectorAll('.visited-node')
        //paths = this.element.querySelectorAll('.path-node')

        visited.forEach(node => {
            node.classList.remove('visited-node')
            node.classList.remove('path-node')
        });
        // paths.forEach(node => {

        // });


    }

    clearAll() {
        const all = this.element.querySelectorAll('.box')
        all.forEach(node => {
            node.classList.remove('path-node')
            node.classList.remove('visited-node')
            node.classList.remove('wall-node')
            node.classList.remove('start-node')
            node.classList.remove('end-node')
        });

    }

    resetBoard() {
        this.clearAll()
        this.initializeBoard()
    }

    animate() {
        const tools = document.querySelectorAll('.tools')
        console.log(tools)
        tools.forEach(tool => {
            tool.classList.add('disabled')
        });
    }

    animateStop() {
        const tools = document.querySelectorAll('.tools')
        tools.forEach(tool => {
            tool.classList.remove('disabled')
        });
    }
}


class DrawHandler {
    constructor(board) {
        this.board = board
        this.tempWallList = []
        this.initalPosition
    }

    freeDraw(event, cell) {
        event.target.classList.add('wall-node')
        cell.value = 'wall-node'
    }

    erase(event, cell) {
        event.target.classList.remove('wall-node')
    }

    Point(x, y) {
        this.x = x;
        this.y = y;
    }

    line(start, end) {
        var p0 = new this.Point(Number(start.split(',')[1]), Number(start.split(',')[0]))
        var p1 = new this.Point(Number(end.split(',')[1]), Number(end.split(',')[0]))
        this.line(p0, p1)
    }

    // from https://www.redblobgames.com/grids/line-drawing.html
    lineHelper(p0, p1) {
        let points = [];
        let N = this.diagonal_distance(p0, p1);
        for (let step = 0; step <= N; step++) {
            let t = N === 0 ? 0.0 : step / N;
            points.push(this.round_point(this.lerp_point(p0, p1, t)));
        }
        return points;
    }

    diagonal_distance(p0, p1) {
        let dx = p1.x - p0.x, dy = p1.y - p0.y;
        return Math.max(Math.abs(dx), Math.abs(dy));
    }

    round_point(p) {
        return new this.Point(Math.round(p.x), Math.round(p.y));
    }

    lerp_point(p0, p1, t) {
        return new this.Point(this.lerp(p0.x, p1.x, t),
            this.lerp(p0.y, p1.y, t));
    }

    lerp(start, end, t) {
        return start + t * (end - start);
    }
    render(event, mousedown) {
        // for (let i = 0; i < wallList.length; i++) {
        //     const wall = wallList[i];
        //     wall.classList.add('temp-wall-node')
        // }
    }
}


class Button {
    constructor(type, element, f) {
        this.type = type
        this.element = element
        this.element.addEventListener('click', f)
    }
    disable() {
        this.element.classList.add('disabled')
    }
    enable() {
        this.element.classList.remove('disabled')
    }
}


class PathfinderInterface {
    constructor(board) {
        const btn = document.getElementById('pathfinderbtn')
        this.btnListener = this.algorithimSelector.bind(this)
        this.pathfinderbtn = new Button('pathfinder', btn, this.btnListener)
        this.board = board
    }

    algorithimSelector() {
        let algorithimSelect = document.getElementById('algorithims')
        const algo = algorithimSelect.options[algorithimSelect.selectedIndex].value;
        if (algo != "") {
            const data = this.convertBoardData(algo)

            const gridData = data['gridData'],
                start = data['start'],
                end = data['end']
            this.getShortestPath(JSON.stringify(gridData), start, end, algo)
        }
        else {
            this.pathfinderbtn.element.innerText = 'SELECT ALGORITHIM'
            this.pathfinderbtn.disable()
            setTimeout(function (that) {
                that.pathfinderbtn.element.innerText = 'Visualize'
                that.pathfinderbtn.enable()
            }, 1500, this)
        }
    }
    convertBoardData() {
        let gridData = [], start, end
        var dataFlags = {
            'unvisited': 0,
            'wall-node': 'W',
            'start-node': 'S',
            'end-node': 'F'
        }
        this.board.clearVisited()
        if (!this.board.state.animating) {
            console.log('test')
            for (let i = 0; i < this.board.cells.length; i++) {
                gridData.push([])
                for (let j = 0; j < this.board.cells[i].length; j++) {
                    var node = 0

                    const box = this.board.cells[i][j].element

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

            this.board.animate()
            return { 'gridData': gridData, 'start': start, 'end': end } //
        }
    }
    // from django documentation
    getCookie(name) {
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

    getShortestPath(gridData, start, end, algoType) {
        let csrftoken = this.getCookie('csrftoken')
        let loader = document.getElementById('loader-container')
        let timer;
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
                console.log('sent data to server')
                // const visited = data['visited'],
                //     path = data['path'].reverse()
                //pathList = path

                this.visualizePathfinder(data)

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

    visualizePathfinder(data) {
        const visited = data['visited'],
            path = data['path'].reverse(),
            pathList = path
        this.vizHelper(visited, path, 'visited-node', false, 1)
    }

    vizHelper(array, array2, className, animEnd, animSpeedScaler) {
        this.board.state.animating = true

        for (let i = 0; i < array.length; i++) {
            setTimeout(function (that) {
                const nodeId = array[i]
                var cell = document.getElementById(nodeId)
                cell.classList.add(className)

                if (i == array.length - 1) {
                    if (animEnd) {
                        that.board.state.animating = false
                        that.board.animateStop()
                    } else {
                        that.vizHelper(array2, [], 'path-node', true, 5.1)
                    }
                }
            }, i * this.board.state.animSpeed * animSpeedScaler, this);// unique scaler 5.1);
        }
    }
}

class MazeInterface {
    constructor(board) {
        const btn = document.getElementById('mazebtn')
        this.btnListener = this.generateMaze.bind(this)
        this.mazebtn = new Button('mazeGen', btn, this.btnListener)
        this.wallAnimationStack = []

        this.board = board
    }
    generateMaze() {
        this.wallAnimationStack = []
        const mazeSelect = document.getElementById('maze')
        if (!this.board.state.animating) {

            const value = mazeSelect.options[mazeSelect.selectedIndex].value;
            if (value == 'recursiveDiv') {

                this.recursiveDivision()
            } else {
                this.mazebtn.disable()
                this.mazebtn.element.innerText = "Select Algorithim !"
                setTimeout(function (that) {
                    that.mazebtn.element.innerText = 'Start'
                    that.mazebtn.enable
                }, 1500)
            }
        }
    }

    recursiveDivision() {
        console.log('function call')
        this.board.clearWalls()
        this.board.clearVisited()
        this.wallAnimationStack = []
        const width = this.board.cells[1].length,
            height = this.board.cells.length
        //console.log(width,height)

        this.addOuterWalls(width, height);
        var ent = null
        //console.log(width,height)
        this.addInnerWalls(true, 1, width - 2, 1, height - 2, ent);
        this.board.state.animating = true
        this.board.animate()
        for (let i = 0; i < this.wallAnimationStack.length; i++) {
            setTimeout(function (that) {
                const el = that.wallAnimationStack[i][0].element
                const method = that.wallAnimationStack[i][1]
                if (method == 'add') {
                    el.classList.add('wall-node')
                }
                else {
                    //console.log('remove', el)
                    el.classList.remove('wall-node')

                }
                if (i == that.wallAnimationStack.length - 1) {
                    that.board.state.animating = false
                    that.board.animateStop()
                }
            }, i * 10, this)
        }

    }

    addOuterWalls(width, height) {
        for (var i = 0; i < height; i++) {
            if (i == 0 || i == (height - 1)) {
                for (var j = 0; j < width; j++) {
                    this.wallAnimationStack.push([this.board.cells[i][j], 'add'])
                    //grid[i][j].classList.add('wall-node');
                }
            } else {
                this.wallAnimationStack.push([this.board.cells[i][0], 'add'])
                this.wallAnimationStack.push([this.board.cells[i][width - 1], 'add'])

            }
        }
    }

    addEntrance() {
        var x = randomNumber(1, this.length - 1);
        this.board.cells[this.board.cells.length - 1][x].classList.add('start-node');
        return x;
    }

    addInnerWalls(h, minX, maxX, minY, maxY, gate) {
        let orientate = { 'HORIZONTAL': 0, 'VERTICAL': 1 }
        if (h) {
            if (maxX - minX < 2) {
                return;
            }

            var y = Math.floor(this.randomNumber(minY, maxY) / 2) * 2;
            this.addWall(minX, maxX, y, orientate['HORIZONTAL']);

            this.addInnerWalls(!h, minX, maxX, minY, y - 1, gate);
            this.addInnerWalls(!h, minX, maxX, y + 1, maxY, gate);
        } else {
            if (maxY - minY < 2) {
                return;
            }

            var x = Math.floor(this.randomNumber(minX, maxX) / 2) * 2;
            this.addWall(minY, maxY, x, orientate['VERTICAL']);

            this.addInnerWalls(!h, minX, x - 1, minY, maxY, gate);
            this.addInnerWalls(!h, x + 1, maxX, minY, maxY, gate);
        }
    }

    addWall(min, max, a, orientation) {
        let node
        var hole = Math.floor(this.randomNumber(min, max) / 2) * 2 + 1;
        this.board.state.animating = true
        this.board.animate()
        //disableFunctions()
        for (var i = min; i <= max; i++) {
            if (orientation == 1) {
                node = this.board.cells[i][a]
            } else {
                node = this.board.cells[a][i]
            }
            var isEndPoint = node.element.classList.contains('start-node') || node.element.classList.contains('end-node')

            this.addWallAnimate(i, node, hole, isEndPoint)


        }

    }

    addWallAnimate(i, node, hole, isEndPoint) {
        //setTimeout(function () {
        if (i == hole || isEndPoint) {
            //node.classList.remove('wall-node')
            this.wallAnimationStack.push([node, 'remove'])
        } else {
            this.wallAnimationStack.push([node, 'add'])//node.classList.add('wall-node')
        }
        if (i == this.board.cells.length || i == this.board.cells[1].length) {
            this.board.state.animating = false
            this.board.animateStop()

        }
        //}, i * 200)
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

function listeners() {
    //EVENT LISTENERS
    //window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('load', onLoad,);

};

function onLoad() {
    let board = new Board(25, 49),
        pathfinder = new PathfinderInterface(board),
        mazegen = new MazeInterface(board)
}


listeners()