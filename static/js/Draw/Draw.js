export class DrawHandler {
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