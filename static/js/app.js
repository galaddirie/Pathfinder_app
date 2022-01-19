import { Board } from "./Board/Board.js"
import { Button } from './Tools/Button.js'



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