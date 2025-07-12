export class vector2D {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static add(a: vector2D, b: vector2D): vector2D {
        return new vector2D(a.x + b.x, a.y + b.y);
    }

    static subtract(a: vector2D, b: vector2D): vector2D {
        return new vector2D(a.x - b.x, a.y - b.y);
    }

    static multiply(a: vector2D, scalar: number): vector2D {
        return new vector2D(a.x * scalar, a.y * scalar);
    }

    static divide(a: vector2D, scalar: number): vector2D {
        if (scalar === 0) throw new Error("Cannot divide by zero");
        return new vector2D(a.x / scalar, a.y / scalar);
    }

    static normalize(v: vector2D): vector2D {
        const mag = v.magnitude;
        if (mag === 0) return new vector2D(0, 0);
        return new vector2D(v.x / mag, v.y / mag);
    }

    static distance(a: vector2D, b: vector2D): number {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }
}

export class Segment {
    public start: vector2D;
    public end: vector2D;

    constructor(start: vector2D, end: vector2D) {
        this.start = start;
        this.end = end;
    }

    public length(): number {
        return vector2D.subtract(this.end, this.start).magnitude;
    }

    public isPointOnSegment(point: vector2D): boolean {
        const crossProduct =
            (point.y - this.start.y) * (this.end.x - this.start.x) -
            (point.x - this.start.x) * (this.end.y - this.start.y);
        if (Math.abs(crossProduct) > Number.EPSILON) return false;

        const dotProduct =
            (point.x - this.start.x) * (this.end.x - this.start.x) +
            (point.y - this.start.y) * (this.end.y - this.start.y);
        if (dotProduct < 0) return false;

        const squaredLength = this.length() ** 2;
        if (dotProduct > squaredLength) return false;

        return true;
    }

    public getIntersectionsWithSegment(other: Segment): vector2D | null {
        const dx1 = this.end.x - this.start.x;
        const dy1 = this.end.y - this.start.y;
        const dx2 = other.end.x - other.start.x;
        const dy2 = other.end.y - other.start.y;

        const denominator = dx1 * dy2 - dy1 * dx2;
        if (denominator === 0) return null;

        const dxStart = this.start.x - other.start.x;
        const dyStart = this.start.y - other.start.y;

        const ua = (dx2 * dyStart - dy2 * dxStart) / denominator;
        const ub = (dx1 * dyStart - dy1 * dxStart) / denominator;

        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) return null;

        const intersectionX = this.start.x + ua * dx1;
        const intersectionY = this.start.y + ua * dy1;
        return new vector2D(intersectionX, intersectionY);
    }

    public getIntersectionsWithBody(body: Body): vector2D[] | null {
        const intersections: vector2D[] = [];

        for (const segment of Object.values(body.segments)) {
            const intersection = this.getIntersectionsWithSegment(segment);
            if (intersection) {
                intersections.push(intersection);
            }
        }

        return intersections.length > 0 ? intersections : null;
    }
}

export class Body {
    public position: vector2D;
    public size: vector2D;

    constructor(position: vector2D, size: vector2D) {
        this.position = position;
        this.size = size;
    }

    get segments(): Object {
        const A = this.position;
        const B = new vector2D(this.position.x + this.size.x, this.position.y);
        const C = new vector2D(this.position.x + this.size.x, this.position.y + this.size.y);
        const D = new vector2D(this.position.x, this.position.y + this.size.y);

        return {
            top: new Segment(A, B),
            right: new Segment(B, C),
            bottom: new Segment(C, D),
            left: new Segment(D, A),
        };
    }

    static isCollidingWith(body1: Body, body2: Body): boolean {
        const bounds1: any = {};
        bounds1.left = body1.position.x;
        bounds1.right = body1.position.x + body1.size.x;
        bounds1.top = body1.position.y;
        bounds1.bottom = body1.position.y + body1.size.y;

        const bounds2: any = {};
        bounds2.left = body2.position.x;
        bounds2.right = body2.position.x + body2.size.x;
        bounds2.top = body2.position.y;
        bounds2.bottom = body2.position.y + body2.size.y;

        return (
            bounds1.left < bounds2.right &&
            bounds1.right > bounds2.left &&
            bounds1.top < bounds2.bottom &&
            bounds1.bottom > bounds2.top
        );
    }
}
