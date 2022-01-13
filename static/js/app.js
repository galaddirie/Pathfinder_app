let fsm = { // FINATE STATE MACHINE
    addWall: false,
    addPoints: false,
    dragEndpoint: false,
    animating: false,
    animSpeed: 2,

}
let drawType = {
    freeDraw: true,
    lineDraw: false,
    spiralDraw: false,
};

class BoardState {
    constructor() {
        this.cells
        this.drawEnabled
        this.inputEnabled
        this.animating
    }

    getCell() {

    }

}
class BoardMoveInput {
    constructor(board) {
        this.board = board
        this.state = board.state
        this.mousedown = false
        this.elementHold = null
    }

    nodeMoveHelper(node) {
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
    mouseEvent(event) {
        //todo change .dragpoint to just che
        if (!this.animating && this.mousedown && !this.drawEnabled) {
            if (event.target.classList.contains('box')) {
                mouseEventHelper(event.target)
            }

        }
    }

    mouseEventHelper(node) {
        if (!(node.classList.contains('start-node')) && !((node.classList.contains('end-node')))) {
            if (node.classList.contains('wall-node') && !fsm.addWall) {
                node.classList.remove('wall-node')
            }
            else if (this.drawEnabled) {
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
            this.drawEnabled = false
            clearPaths()
            if (node.classList.contains('start-node')) {
                this.elementHold = 'start-node'
            }
            else {
                this.elementHold = 'end-node'
            }

            prev = node

        }

        if (node.classList.contains('path-node') && (node.classList.contains('wall-node'))) {
            //console.log('CLEAR PATHS')
            clearPaths()
        }
    }

    onMouseDown(event) {
        this.mousedown = true
        this.mouseEvent(event)
    }

    onMouseUp(event) {
        this.mousedown = false
        this.state.dragEndpoint = false
    }

    onMouseOver(event) {
        mouseEvent(event)
        if (this.mousedown) {
            if (this.state.dragEndpoint && event.target.classList.contains('box')) {


                nodeMoveHelper(event.target)

            }
        }
    }

    onMouseLeave(event) {
        if (this.state.dragEndpoint) {
            prev = event.target
            event.target.classList.remove(elementHold)
        }
        //console.log(prev)

    }
}


class Board {
    constructor() {
    }

    draw() {
    }

    animate() {
    }
}

