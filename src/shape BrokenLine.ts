abstract class Shape {
    abstract figure: string;
    constructor(public ctx: any, public color: string, public coords: Array<number>) {
        this.render;
    }

    abstract render(ctx: CanvasRenderingContext2D): void;

    abstract drawShape(ctx: any, x: number, y: number, x1: number, y1: number): void;

    abstract isPointWithin(x: number, y: number): boolean;

    abstract moveShape(dx: number, dy: number): void;

    abstract setColor(color: string): void;

    abstract toSvgFragment(): string; 
}

class BrokenLine extends Shape {
    figure = 'BrokenLine';
    constructor(public ctx: any, public color: string, public coords: Array<number>) {
        super(ctx, color, coords);
        this.render(ctx);
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this.coords.length == 1) {
            this.coords = this.coords.flat();
        }
        for(let i: number = 0; i < (this.coords.length - 3); i += 2) {
            this.drawShape(ctx, this.coords[i], this.coords[i + 1], this.coords[i + 2], this.coords[i + 3])
        }
    }

    drawShape(ctx: any, x: number, y: number, x1: number, y1: number): void {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    isPointWithin(x: number, y: number): boolean {
        let perpen: number;
        for (let i = 0; i < (this.coords.length - 3); i += 2) {
            let coordsLine:Array<number> = [];
            coordsLine.push(this.coords[i], this.coords[i+1], this.coords[i + 2], this.coords[i + 3]);
            let a = Math.sqrt((coordsLine[2] - coordsLine[0])**2 + (coordsLine[3] - coordsLine[1])**2);
            let b = Math.sqrt((coordsLine[2] - x)**2 + (coordsLine[3] - y)**2);
            let c = Math.sqrt((coordsLine[0] - x)**2 + (coordsLine[1] - y)**2);
            let p = (a + b + c)/2;
            let h = 2 *(Math.sqrt(p * (p - a) * (p - b) * (p - c)))/a;
            let maxSide = Math.max(c, b);
            let minSide = Math.min(c, b);
            if (maxSide**2 > minSide**2 + a**2) {
                perpen = minSide;
            } else {
                perpen = h;
            }
            if (perpen < 10) return true;
       }
       return false;
    }

    moveShape(dx: number, dy: number): void {
        for (let i = 0; i < (this.coords.length); i += 2) {
            this.coords[i] += dx;
        }
        for (let j = 1; j < (this.coords.length); j += 2) {
            this.coords[j] += dy;
        }
    }

    setColor(color: string): void {
        this.color = color;
    }

    toSvgFragment():string {
        let path: Array<string> = [];
        path.push(`<path d="M ${this.coords[0]} ${this.coords[1]}`)
        for (let i = 2; i < (this.coords.length-1); i += 2) {
            path.push(`L ${this.coords[i]} ${this.coords[i+1]}`)
        }
        path.push(`" fill="transparent" stroke="${this.color}"/>`)
        return path.join(' ');
    }
}