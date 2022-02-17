import { Shape } from './Shape';

export class Circle extends Shape {
    figure = 'Circle';

    constructor(
        public ctx: any,
        public color: string,
        public coords: Array<number>
    ) {
        super(ctx, color, coords);
        this.render(ctx);
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this.coords.length === 1) {
            this.coords = this.coords.flat();
        }
        for (let i: number = 0; i < this.coords.length - 3; i += 2) {
            this.drawShape(
                ctx,
                this.coords[i],
                this.coords[i + 1],
                this.coords[i + 2],
                this.coords[i + 3]
            );
        }
    }

    drawShape(ctx: any, x: number, y: number, x1: number, y1: number): void {
        const radius = Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2);
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.stroke();
    }

    isPointWithin(x: number, y: number): boolean {
        const t: number = 10;
        if (
            Math.abs(
                Math.sqrt(
                    (x - this.coords[0]) ** 2 + (y - this.coords[1]) ** 2
                ) -
                    Math.sqrt(
                        (this.coords[2] - this.coords[0]) ** 2 +
                            (this.coords[3] - this.coords[1]) ** 2
                    )
            ) <= t
        ) {
            return true;
        }
        return false;
    }

    moveShape(dx: number, dy: number): void {
        for (let i = 0; i < this.coords.length; i += 2) {
            this.coords[i] += dx;
        }
        for (let j = 1; j < this.coords.length; j += 2) {
            this.coords[j] += dy;
        }
    }

    setColor(color: string): void {
        this.color = color;
    }

    toSvgFragment() {
        const path: Array<string> = [];
        const radius = Math.sqrt(
            (this.coords[2] - this.coords[0]) ** 2 +
                (this.coords[3] - this.coords[1]) ** 2
        );
        const x = this.coords[0];
        const y = this.coords[1];
        path.push(
            `<circle cx="${x}" cy="${y}" r="${radius}" fill="transparent" stroke="${this.color}"/>`
        );

        return path.join(' ');
    }
}
