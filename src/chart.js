class Chart {
    constructor(element, initialData, options = {}) {
        //Create canvas element
        this.canvas = document.createElement('canvas'); 

        //Set Context
        this.ctx = this.canvas.getContext('2d');

        //Get parent element dimensions and position
        this.elementPosition = element.getBoundingClientRect();

        //Append canvas to parent element.
        element.appendChild(this.canvas);

        //Initial render
        this.renderContainer();

        //on window size change we need to redraw the whole canvas!
        window.onresize = (e) => {
            this.elementPosition = element.getBoundingClientRect();
            this.renderContainer();
        }
    }

    renderContainer() {
        const { width, height } = this.elementPosition;
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.fillRect(0,0,width,height);
    }
}

export default Chart