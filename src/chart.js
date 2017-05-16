import _ from 'lodash';

const getRatio = (min, max, point) => {
    return (point - min) / (max - min);
}

const prepareData = (data) => {
    const min = _.min(data);
    const max = _.max(data);
    return {
        min,
        max,
        data: _.map(data, d => getRatio(min, max, d))
    };
    
}

class Chart {
    constructor(element, initialData, options = {}) {
        this.constants = {
            PRICE_OFFSET: 50,
            TIME_OFFSET: 50,
            VERTICAL_GRID_SPACING: 10,
            HORIZONTAL_GRID_SPACING: 10
        };

        //Format data to conform with chart format.
        this.allData = prepareData(initialData);
        this.data = this.allData;
        this.slicePoint = 0;

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

        this.canvas.addEventListener('mousewheel', this.onMouseWheel.bind(this));
    }

    onMouseWheel(event) {
        if(event.deltaY < 0) {
            this.slicePoint += 5;
        } else {
            this.slicePoint -= 5;
        }
        this.data.data = this.allData.data.slice(this.slicePoint);
        console.log(this.slicePoint);
        this.renderContainer();
    }

    renderPriceAxis() {
        const { width, height } = this.elementPosition;        
        const { PRICE_OFFSET, TIME_OFFSET, HORIZONTAL_GRID_SPACING } = this.constants;
        const { max, min } = this.data;

        //Draw the price container.
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(width-PRICE_OFFSET, 0, PRICE_OFFSET, height-TIME_OFFSET);


        const dataRange = max - min;
        const dataInterval = dataRange / HORIZONTAL_GRID_SPACING;
        const containerHeight = height - TIME_OFFSET;
        const horizontalLineGap = containerHeight / HORIZONTAL_GRID_SPACING;
        const x = width - 45;
        this.ctx.fillStyle = 'gray';
        this.ctx.font = '8px menlo';
        //Draw the price labels.
        for(let price = max, y = horizontalLineGap; price > min; price -= dataInterval, y += horizontalLineGap) {
            this.ctx.fillText(`$${price}`, x, y);
        }

    }

    renderTimeAxis() {
        const { width, height } = this.elementPosition;
        const {PRICE_OFFSET, TIME_OFFSET} = this.constants;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, height-TIME_OFFSET, width, TIME_OFFSET);
    }

    renderGrid() {
        const { width, height } = this.elementPosition;
        const {
            PRICE_OFFSET, 
            TIME_OFFSET, 
            VERTICAL_GRID_SPACING, 
            HORIZONTAL_GRID_SPACING
        } = this.constants;

        const containerHeight = height - TIME_OFFSET;
        const containerWidth = width - PRICE_OFFSET;
        const horizontalLineGap = containerHeight / HORIZONTAL_GRID_SPACING;
        const verticalLineGap = containerWidth / VERTICAL_GRID_SPACING;

        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = 0.3;
        this.ctx.beginPath();

        //Render horizontal lines
        for(let y = horizontalLineGap; y < containerHeight; y += horizontalLineGap) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(containerWidth, y);
            this.ctx.stroke();
        }

        //Render vertical lines
        for(let x = verticalLineGap; x < containerWidth; x += verticalLineGap) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, containerHeight);
            this.ctx.stroke();
        }
    }

    renderChart() {
        const { width, height } = this.elementPosition;
        const { TIME_OFFSET, PRICE_OFFSET } = this.constants;
        const { data } = this.data;       
        const length = data.length;

        const containerHeight = height - TIME_OFFSET;
        const containerWidth = width - PRICE_OFFSET;
        const verticalGap = containerWidth / length;

        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 0.5;

        this.ctx.beginPath();
        for(let x = verticalGap, i = 0; i < length; x+=verticalGap, i++) {
            var y = containerHeight - (containerHeight * data[i])
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    renderContainer() {
        const { width, height } = this.elementPosition;
        const {PRICE_OFFSET, TIME_OFFSET} = this.constants;
        
        //Set the dimensions of the canvas according to the parent DOM element;
        this.canvas.width = width;
        this.canvas.height = height;

        //Draw the chart rectangle taking into account offsets for the price and time axis.
        this.ctx.fillRect(0,0,width-PRICE_OFFSET,height-TIME_OFFSET);

        //Render the price and time axis.
        this.renderPriceAxis();
        this.renderTimeAxis();
        this.renderGrid();
        this.renderChart();
    }
}

export default Chart