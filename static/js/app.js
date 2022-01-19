
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
        this.value = this.prev_value
        this.prev_value = null
        this.element.classList.remove(value)
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

    render(event, mousedown) {
        // for (let i = 0; i < wallList.length; i++) {
        //     const wall = wallList[i];
        //     wall.classList.add('temp-wall-node')
        // }
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

    getCell(id) {
        let loc = id.split(',')
        return this.board.cells[loc[0]][loc[1]]
    }

    mouseEvent(event) {
        //todo change .dragpoint to just che
        switch (event.type) {
            case 'mousedown':
                ''
            case 'mouseup':
                ''
            case 'mouseover':
                ''
        }
        let cell
        if (event.target.classList.contains('box')) {
            cell = this.getCell(event.target.id)
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
        const x = this.getCell(event.target.id)
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
            this.elementHold.cell = this.getCell(event.target.id)
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
    }

    animate() {
    }
}




function listeners() {
    //EVENT LISTENERS
    //window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('load', onLoad,);

};

function onLoad() {
    let board = new Board(25, 49),
        pathfinder = new Pathfinder(board)
}


listeners()