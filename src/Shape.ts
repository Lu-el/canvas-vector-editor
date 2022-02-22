export abstract class Shape {
    abstract figure: string;

    constructor(
        public ctx: CanvasRenderingContext2D,
        public color: string,
        public coords: Array<number>
    ) {}

    abstract render(ctx: CanvasRenderingContext2D): void;

    abstract drawShape(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        x1: number,
        y1: number
    ): void;

    abstract isPointWithin(x: number, y: number): boolean;

    abstract moveShape(dx: number, dy: number): void;

    abstract setColor(color: string): void;

    abstract toSvgFragment(): string;
}
