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
            let coordsLine:Array<number>;
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

    toSvgFragment() {
        let path: Array<string>;
        path.push(`<path d="M ${this.coords[0]} ${this.coords[1]}`)
        for (let i = 2; i < (this.coords.length-1); i += 2) {
            path.push(`L ${this.coords[i]} ${this.coords[i+1]}`)
        }
        path.push(`" fill="transparent" stroke="${this.color}"/>`)
        return path.join(' ');
    }
}

class Rectangle extends Shape {
    figure = 'Rectangle';
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
        let width = x1 - x;
        let height = y1 - y;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = this.color;
        ctx.strokeRect(x, y, width, height);
        ctx.stroke();
    }

    isPointWithin(x: number, y: number): boolean {
        let perpen: number;
        for (let i = 0; i < (this.coords.length - 3); i += 2) {
            let coordsLine:Array<number>;
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

    toSvgFragment() {
        let path: Array<string>;
        path.push(`<path d="M ${this.coords[0]} ${this.coords[1]}`)
        for (let i = 0; i < (this.coords.length-1); i += 2) {
            path.push(`L ${this.coords[i]} ${this.coords[1]}`)
        }
        for (let i = 2; i >= 0; i -= 2) {
            path.push(`L ${this.coords[i]} ${this.coords[3]}`)
        }
        path.push(`z" fill="transparent" stroke="${this.color}"/>`)
        return path.join(' ');
    }
}

class Circle extends Shape {
    figure = 'Circle';
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
        let radius = Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2);
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.stroke();
    }

    isPointWithin(x: number, y: number): boolean {
        let t: number = 10;
        if (Math.abs(Math.sqrt((x - this.coords[0])**2 + (y - this.coords[1])**2) - Math.sqrt((this.coords[2] - this.coords[0]) ** 2 + (this.coords[3] - this.coords[1]) ** 2)) <= t) {
            return true;
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

    toSvgFragment() {
        let path: Array<string>;
        let radius = Math.sqrt((this.coords[2] - this.coords[0]) ** 2 + (this.coords[3] - this.coords[1]) ** 2);
        let x = this.coords[0];
        let y = this.coords[1];
        path.push(`<circle cx="${x}" cy="${y}" r="${radius}" fill="transparent" stroke="${this.color}"/>`);

        return path.join(' ');
    }
}

class CanvasVectorEditor {
    public canvas: any = document.getElementById('canvas');
    public ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    public colorPicker: HTMLElement = document.getElementById('colors');
    public color: string = '#08D9D6';
    public coords: any = {
        x: 0, 
        y: 0, 
        vx: 0, 
        vy: 0,
    };
    public amountCoords: Array<number>;
    public arrayOfShapes: Array<any>;
    public movingShape: any;
    public move = this.mouseMove.bind(this);
    public remove = document.getElementById('remove');
    public savingPng = document.getElementById('savingAsPng');
    public savingSVG = document.getElementById('savingAsSvg');
    public impJson = document.getElementById('importJSON');
    public expJson = document.getElementById('exportJSON');

    constructor() {
        this.initializeSubscriptions;
    }

    initializeSubscriptions() {
        this.canvas.addEventListener('mousedown', this.mouseDown);
        this.canvas.addEventListener('mouseup', this.finishShape);
        this.colorPicker.addEventListener("input", this.newColor);
        this.colorPicker.addEventListener("change", this.watchColorPicker);
        this.remove.addEventListener("click", this.removeAll);
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
        let canvasX = Math.round(event.clientX - positionBox.left);
        this.coords.x = canvasX;
        let canvasY = Math.round(event.clientY - positionBox.top);
        this.coords.y = canvasY;
        this.coords.vx = this.coords.x;
        this.coords.vy = this.coords.y;
        this.amountCoords.push(this.coords.x, this.coords.y);
        const shape = this.arrayOfShapes.find(item => item.isPointWithin(this.coords.x, this.coords.y) === true);
        this.setMovingShape(shape);
        this.canvas.addEventListener('mousemove', this.move);
    }

    saveImageSvg = () => {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const path = [];
        this.arrayOfShapes.forEach(item => path.push(item.toSvgFragment()));
        let svgData = `<svg width="${canvasWidth}" height="${canvasHeight}" xmlns="http://www.w3.org/2000/svg"> 
        ${path.join(' ')}
        </svg>`;

        let svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
        let svgUrl = URL.createObjectURL(svgBlob);
        let image = new Image();
        image.src = svgUrl;

        let link = document.createElement("a");

        link.setAttribute("href", image.src);
        link.setAttribute("download", "canvasSVG");
        link.click();
    }

    saveImagePng = () => {
        let imageData = this.canvas.toDataURL("image/svg");
        let image = new Image();
        image.src = imageData;
        let link = document.createElement("a");

        link.setAttribute("href", image.src);
        link.setAttribute("download", "canvasImage");
        link.click();
    }

    loadWindow = () => {
        const ctx = this.ctx;
        let shape;
        let shapes = this.arrayOfShapes;
        let returnObj = JSON.parse(localStorage.getItem('canvasPicture'));
        returnObj.forEach(function(item){
        switch (item.figure) {
            case "BrokenLine":
                shape = new BrokenLine(ctx, item.color, item.coords);
                shapes.push(shape);
                break;
            case "Rectangle":
                shape = new Rectangle(ctx, item.color, item.coords);
                shapes.push(shape);
                break;
            case "Circle":
                shape = new Circle(ctx, item.color, item.coords);
                shapes.push(shape);
                break;
            }
        })
        shapes.forEach(item => item.render(this.ctx));
    }

    closeWindowAndTab = () => {
        let file = this.arrayOfShapes;
        let savingFile = JSON.stringify(file);
        localStorage.setItem('canvasPicture', savingFile);
    }

    exportJson = () => {
        let file = this.arrayOfShapes;
        let savingFile = JSON.stringify(file);
        let textarea: HTMLTextAreaElement = document.querySelector('.textarea-field');
        textarea.value = savingFile;
    }

    importJson = () => {
        const ctx = this.ctx;
        let textarea: HTMLTextAreaElement = document.querySelector('.textarea-field');
        let shape: any;
        let shapes = this.arrayOfShapes;
        let returnObj = JSON.parse(textarea.value);
        returnObj.forEach(function(item){
        switch (item.figure) {
            case "BrokenLine":
                shape = new BrokenLine(ctx, item.color, item.coords);
                shapes.push(shape);
                break;
            case "Rectangle":
                shape = new Rectangle(ctx, item.color, item.coords);
                shapes.push(shape);
                break;
            case "Circle":
                shape = new Circle(ctx, item.color, item.coords);
                shapes.push(shape);
                break;
            }
        });
        shapes.forEach(item => item.render(ctx));
    }

    setMovingShape(shape) { 
        if (shape) {
            this.movingShape = shape;
        } else {
            this.movingShape = null;
        }
    }

    removeAll = () => {
        const answer = confirm("Your creating will be removed, are you sure?"); 
        if (answer) {
            this.arrayOfShapes.splice(0, this.arrayOfShapes.length);
            this.clear();
        }
    }

    newColor = (event) => {
        this.color = event.target.value;
        let pallete = event.target.closest('.label-colors');
        pallete.style.backgroundColor = `${this.color}`;
    }

    watchColorPicker = (event) => {
        this.color = event.target.value;
        if (this.getControlType() === "new"){
            this.movingShape.setColor(this.color);
        }
    }

    finishShape = () => {
        let shape: any;
        this.canvas.removeEventListener('mousemove', this.move);
        switch (this.getControlType()) {
            case "new":
                break;
            case "pencil":
                this.clear();
                shape = new BrokenLine(this.ctx, this.color, this.amountCoords);
                this.arrayOfShapes.push(shape);
                break;
            case "rectangle":
                this.clear();
                shape = new Rectangle(this.ctx, this.color, this.coords);
                this.arrayOfShapes.push(shape);
                break;
            case "circle":
                this.clear();
                shape = new Circle(this.ctx, this.color, this.coords);
                this.arrayOfShapes.push(shape);
                break;
        }
        this.arrayOfShapes.forEach(item => item.render(this.ctx));
    }

    drawShape(coords: Array<number>, controlType: string, color: string) {
        const ctx = this.ctx;
        let shape: any;
        switch (controlType) {
            case "new":
                let deltaX = this.coords.vx - this.coords.x;
                let deltaY = this.coords.vy - this.coords.y;
                shape = this.movingShape;

                if (shape) {
                    shape.moveShape(deltaX, deltaY);
                    this.coords.x = this.coords.vx;
                    this.coords.y = this.coords.vy;
                    this.clear();
                }
                break;
            case "pencil":
                new BrokenLine(ctx, color, coords);
                break;
            case "rectangle":
                this.clear();
                new Rectangle(ctx, color, coords);
                break;
            case "circle":
                this.clear();
                new Circle(ctx, color, coords);
                break;
        }
        this.arrayOfShapes.forEach(item => item.render(ctx));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getControlType() {
        let button: any = document.querySelectorAll('.canvas-checkbox');
        for (let elem of button) {
            if (elem.checked) {
                return `${elem.getAttribute('data-control')}`;
            };
        }
    }

    lineTo(coords: Array<number>, x: number, y: number) {
        coords.push(x, y);
    }

    mouseMove(event) {
        let type = this.getControlType;
        let color = this.color;
        const ctx = this.ctx;

        let positionBox = event.target.getBoundingClientRect();
        let canvasX = Math.round(event.clientX - positionBox.left);
        this.coords.vx = canvasX;
        let canvasY = Math.round(event.clientY - positionBox.top);
        this.coords.vy = canvasY;
            
        this.drawShape(this.coords, type(), color);
        if (type() === 'pencil') {
            this.lineTo(this.amountCoords, this.coords.vx, this.coords.vy);
            this.coords.x = this.coords.vx;
            this.coords.y = this.coords.vy;
        }
    }
}  