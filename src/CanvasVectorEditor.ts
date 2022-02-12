class CanvasVectorEditor {
    public canvas: any = document.getElementById('canvas');
    public ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    public colorPicker: any = document.getElementById('colors');
    public color: string = '#08D9D6';
    public coords: any = {
        x: 0, 
        y: 0, 
        vx: 0, 
        vy: 0,
    };
    public amountCoords: Array<number> = [];
    public arrayOfShapes: Array<any> =[];
    public movingShape: any;
    public move = this.mouseMove.bind(this);
    public remove:any = document.getElementById('remove');
    public savingPng: any = document.getElementById('savingAsPng');
    public savingSVG: any = document.getElementById('savingAsSvg');
    public impJson: any = document.getElementById('importJSON');
    public expJson: any = document.getElementById('exportJSON');

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
        const path: string[] = [];
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
        let file = localStorage.getItem('canvasPicture');
        if (!file) { return }
        
        let returnObj = JSON.parse(file);
        returnObj.forEach(function(item: any){
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
        let textarea: HTMLTextAreaElement | null = document.querySelector('.textarea-field');
        if (!textarea) { return } 
        textarea.value = savingFile;
    }

    importJson = () => {
        const ctx = this.ctx;
        let textarea: HTMLTextAreaElement | null= document.querySelector('.textarea-field');
        if (!textarea) { return } 
        let shape: any;
        let shapes = this.arrayOfShapes;
        let returnObj = JSON.parse(textarea.value);
        returnObj.forEach(function(item: any){
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

    setMovingShape(shape: any) { 
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

    newColor = (event: any) => {
        this.color = event.target.value;
        let pallete = event.target.closest('.label-colors');
        pallete.style.backgroundColor = `${this.color}`;
    }

    watchColorPicker = (event: any) => {
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

    getControlType(): string {
        let button: any = document.querySelectorAll('.canvas-checkbox');
        for (let elem of button) {
            if (elem.checked) {
                return `${elem.getAttribute('data-control')}`;
            };
        }
        return "new"
    }

    lineTo(coords: Array<number>, x: number, y: number) {
        coords.push(x, y);
    }

    mouseMove(event: any) {
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
