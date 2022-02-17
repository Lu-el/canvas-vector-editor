import { BrokenLine } from './BrokenLine';
import { Circle } from './Circle';
import { Rectangle } from './Rectangle';
import { Shape } from './Shape';

type Coords = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    toArray(): Array<number>;
};

class CanvasVectorEditor {
    public canvas: HTMLCanvasElement = document.getElementById(
        'canvas'
    ) as HTMLCanvasElement;

    public ctx: CanvasRenderingContext2D = this.canvas.getContext(
        '2d'
    ) as CanvasRenderingContext2D;

    public colorPicker: HTMLInputElement = document.getElementById(
        'colors'
    ) as HTMLInputElement;

    public color: string = '#08D9D6';

    public coords: Coords = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        toArray() {
            return [this.x, this.y, this.vx, this.vy];
        }
    };

    public amountCoords: Array<number> = [];

    public arrayOfShapes: Array<Shape> = [];

    public movingShape: Shape | undefined;

    public move = this.mouseMove.bind(this);

    public remove: HTMLButtonElement = document.getElementById(
        'remove'
    ) as HTMLButtonElement;

    public savingPng: HTMLButtonElement = document.getElementById(
        'savingAsPng'
    ) as HTMLButtonElement;

    public savingSVG: HTMLButtonElement = document.getElementById(
        'savingAsSvg'
    ) as HTMLButtonElement;

    public impJson: HTMLButtonElement = document.getElementById(
        'importJSON'
    ) as HTMLButtonElement;

    public expJson: HTMLButtonElement = document.getElementById(
        'exportJSON'
    ) as HTMLButtonElement;

    public control =
        document.querySelectorAll<HTMLInputElement>('.canvas-checkbox');

    constructor() {
        this.initializeSubscriptions();
    }

    initializeSubscriptions() {
        this.canvas.addEventListener('mousedown', this.mouseDown);
        this.canvas.addEventListener('mouseup', this.finishShape);
        this.colorPicker.addEventListener('input', this.newColor);
        this.colorPicker.addEventListener('change', this.watchColorPicker);
        this.remove.addEventListener('click', this.removeAll);
        window.addEventListener('beforeunload', this.closeWindowAndTab);
        window.addEventListener('load', this.loadWindow);
        this.savingPng.addEventListener('click', this.saveImagePng);
        this.impJson.addEventListener('click', this.importJson);
        this.expJson.addEventListener('click', this.exportJson);
        this.savingSVG.addEventListener('click', this.saveImageSvg);
    }

    mouseDown = (event: MouseEvent) => {
        this.amountCoords = [];
        const positionBox = this.canvas.getBoundingClientRect();
        const canvasX = Math.round(event.clientX - positionBox.left);
        this.coords.x = canvasX;
        const canvasY = Math.round(event.clientY - positionBox.top);
        this.coords.y = canvasY;
        this.coords.vx = this.coords.x;
        this.coords.vy = this.coords.y;
        this.amountCoords.push(this.coords.x, this.coords.y);
        const shape = this.arrayOfShapes.find(
            (item) => item.isPointWithin(this.coords.x, this.coords.y) === true
        );
        this.setMovingShape(shape);
        this.canvas.addEventListener('mousemove', this.move);
    };

    saveImageSvg = () => {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const path: string[] = [];
        this.arrayOfShapes.forEach((item) => path.push(item.toSvgFragment()));
        const svgData = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg"> 
        ${path.join(' ')}
        </svg>`;

        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8'
        });
        const svgUrl = URL.createObjectURL(svgBlob);
        const image = new Image();
        image.src = svgUrl;

        const link = document.createElement('a');

        link.setAttribute('href', image.src);
        link.setAttribute('download', 'canvasSVG');
        link.click();
    };

    saveImagePng = () => {
        const imageData = this.canvas.toDataURL('image/svg');
        const image = new Image();
        image.src = imageData;
        const link = document.createElement('a');

        link.setAttribute('href', image.src);
        link.setAttribute('download', 'canvasImage');
        link.click();
    };

    loadWindow = () => {
        const { ctx } = this;
        let shape;
        const shapes = this.arrayOfShapes;
        const file = localStorage.getItem('canvasPicture');
        if (!file) {
            return;
        }

        const returnObj = JSON.parse(file);
        returnObj.forEach((item: Shape) => {
            switch (item.figure) {
                case 'BrokenLine':
                    shape = new BrokenLine(ctx, item.color, item.coords);
                    shapes.push(shape);
                    break;
                case 'Rectangle':
                    shape = new Rectangle(ctx, item.color, item.coords);
                    shapes.push(shape);
                    break;
                case 'Circle':
                    shape = new Circle(ctx, item.color, item.coords);
                    shapes.push(shape);
                    break;
                default:
            }
        });
        shapes.forEach((item) => item.render(this.ctx));
    };

    closeWindowAndTab = () => {
        const file = this.arrayOfShapes;
        const savingFile = JSON.stringify(file);
        localStorage.setItem('canvasPicture', savingFile);
    };

    exportJson = () => {
        const file = this.arrayOfShapes;
        const savingFile = JSON.stringify(file);
        const textarea: HTMLTextAreaElement | null =
            document.querySelector('.textarea-field');
        if (!textarea) {
            return;
        }
        textarea.value = savingFile;
    };

    importJson = () => {
        const { ctx } = this;
        const textarea: HTMLTextAreaElement | null =
            document.querySelector('.textarea-field');
        if (!textarea) {
            return;
        }
        let shape: Shape;
        const shapes = this.arrayOfShapes;
        const returnObj = JSON.parse(textarea.value);
        returnObj.forEach((item: Shape) => {
            switch (item.figure) {
                case 'BrokenLine':
                    shape = new BrokenLine(ctx, item.color, item.coords);
                    shapes.push(shape);
                    break;
                case 'Rectangle':
                    shape = new Rectangle(ctx, item.color, item.coords);
                    shapes.push(shape);
                    break;
                case 'Circle':
                    shape = new Circle(ctx, item.color, item.coords);
                    shapes.push(shape);
                    break;
                default:
            }
        });
        shapes.forEach((item) => item.render(ctx));
    };

    setMovingShape(shape: Shape | undefined) {
        if (shape) {
            this.movingShape = shape;
        } else {
            this.movingShape = undefined;
        }
    }

    removeAll = () => {
        this.arrayOfShapes.splice(0, this.arrayOfShapes.length);
        this.clear();
    };

    newColor = (event: Event) => {
        if (!event.target) return;
        const newColor = event.target as HTMLInputElement;
        this.color = newColor.value;
        const pallete = newColor.closest('.label-colors') as HTMLInputElement;
        if (!pallete) return;
        pallete.style.backgroundColor = `${this.color}`;
    };

    watchColorPicker = (event: Event) => {
        if (!event.target) return;
        const newColor = event.target as HTMLInputElement;
        this.color = newColor.value;
        if (this.getControlType() === 'new' && this.movingShape) {
            this.movingShape.setColor(this.color);
        }
    };

    finishShape = () => {
        let shape: Shape | undefined;
        this.canvas.removeEventListener('mousemove', this.move);
        switch (this.getControlType()) {
            case 'new':
                break;
            case 'pencil':
                this.clear();
                shape = new BrokenLine(this.ctx, this.color, this.amountCoords);
                this.arrayOfShapes.push(shape);
                break;
            case 'rectangle':
                this.clear();
                shape = new Rectangle(
                    this.ctx,
                    this.color,
                    this.coords.toArray()
                );
                this.arrayOfShapes.push(shape);
                break;
            case 'circle':
                this.clear();
                shape = new Circle(this.ctx, this.color, this.coords.toArray());
                this.arrayOfShapes.push(shape);
                break;
            default:
        }
        this.arrayOfShapes.forEach((item) => item.render(this.ctx));
    };

    drawShape(coords: Array<number>, controlType: string, color: string) {
        const { ctx } = this;
        let shape: Shape | undefined;
        let deltaX: number;
        let deltaY: number;
        switch (controlType) {
            case 'new':
                deltaX = this.coords.vx - this.coords.x;
                deltaY = this.coords.vy - this.coords.y;
                shape = this.movingShape;

                if (shape) {
                    shape.moveShape(deltaX, deltaY);
                    this.coords.x = this.coords.vx;
                    this.coords.y = this.coords.vy;
                    this.clear();
                }
                break;
            case 'pencil':
                shape = new BrokenLine(ctx, color, coords);
                break;
            case 'rectangle':
                this.clear();
                shape = new Rectangle(ctx, color, coords);
                break;
            case 'circle':
                this.clear();
                shape = new Circle(ctx, color, coords);
                break;
            default:
        }
        this.arrayOfShapes.forEach((item) => item.render(ctx));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getControlType(): string {
        const { control } = this;
        const controlType = Array.from(control).find(
            (elem) => elem.checked === true
        );
        if (controlType) {
            return `${controlType.getAttribute('data-control')}`;
        }
        return 'new';
    }

    lineTo(x: number, y: number) {
        this.amountCoords.push(x, y);
    }

    mouseMove(event: MouseEvent) {
        const type = this.getControlType();
        const { color } = this;
        const domElement = event.target as HTMLElement;
        const positionBox = domElement.getBoundingClientRect();
        const canvasX = Math.round(event.clientX - positionBox.left);
        this.coords.vx = canvasX;
        const canvasY = Math.round(event.clientY - positionBox.top);
        this.coords.vy = canvasY;

        this.drawShape(this.coords.toArray(), type, color);
        if (type === 'pencil') {
            this.lineTo(this.coords.vx, this.coords.vy);
            this.coords.x = this.coords.vx;
            this.coords.y = this.coords.vy;
        }
    }
}

export function createCanvasVectorEditor() {
    return new CanvasVectorEditor();
}
