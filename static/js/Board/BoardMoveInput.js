export class BoardMoveInput {
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