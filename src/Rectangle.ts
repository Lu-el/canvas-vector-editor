import { Shape } from './Shape';

export class Rectangle extends Shape {
    figure = 'Rectangle';

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
        const width = x1 - x;
        const height = y1 - y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = this.color;
        ctx.strokeRect(x, y, width, height);
        ctx.stroke();
    }

    isPointWithin(x: number, y: number): boolean {
        let perpen: number;
        for (let i = 0; i < this.coords.length - 3; i += 2) {
            const coordsLine: Array<number> = [];
            coordsLine.push(
                this.coords[i],
                this.coords[i + 1],
                this.coords[i + 2],
                this.coords[i + 3]
            );
            const a = Math.sqrt(
                (coordsLine[2] - coordsLine[0]) ** 2 +
                    (coordsLine[3] - coordsLine[1]) ** 2
            );
            const b = Math.sqrt(
                (coordsLine[2] - x) ** 2 + (coordsLine[3] - y) ** 2
            );
            const c = Math.sqrt(
                (coordsLine[0] - x) ** 2 + (coordsLine[1] - y) ** 2
            );
            const p = (a + b + c) / 2;
            const h = (2 * Math.sqrt(p * (p - a) * (p - b) * (p - c))) / a;
            const maxSide = Math.max(c, b);
            const minSide = Math.min(c, b);
            if (maxSide ** 2 > minSide ** 2 + a ** 2) {
                perpen = minSide;
            } else {
                perpen = h;
            }
            if (perpen < 10) return true;
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
        path.push(`<path d="M ${this.coords[0]} ${this.coords[1]}`);
        for (let i = 0; i < this.coords.length - 1; i += 2) {
            path.push(`L ${this.coords[i]} ${this.coords[1]}`);
        }
        for (let i = 2; i >= 0; i -= 2) {
            path.push(`L ${this.coords[i]} ${this.coords[3]}`);
        }
        path.push(`z" fill="transparent" stroke="${this.color}"/>`);
        return path.join(' ');
    }
}
