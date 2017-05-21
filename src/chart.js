import _ from 'lodash';
import moment from 'moment';
import { findHigh, findLow, convertDataToY, extractDate, groupDates } from './utils';
import config from './config';

import Line from './line';

const { defaultOptions, constants } = config;

class Chart {
    constructor(element, initialData, options = defaultOptions) {
        this.options = options;
        this.constants = constants;
        //Format data to conform with chart format.
        this.dataMin = Math.round(findLow(initialData) / 100) * 100;
        this.dataMax = Math.round(findHigh(initialData) / 100) * 100;
        this.allData = convertDataToY(initialData, this.dataMin, this.dataMax);
        this.data = this.allData.slice();
        
        this.allDates = extractDate(initialData);
        this.dates = this.allDates.slice();
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
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(event) {
        event.preventDefault();
    } 

    onMouseWheel(event) {
        event.preventDefault();

        if(event.deltaY < 0) {
            this.slicePoint += 15;
        } else if(this.slicePoint > 0) {
            this.slicePoint -= 15;
        }
        this.data = this.allData.slice(this.slicePoint);
        this.dates = this.allDates.slice(this.slicePoint);

        this.renderContainer();
    }

    renderPriceAxis() {
        const { width, height } = this.elementPosition;        
        const { PRICE_OFFSET, TIME_OFFSET, HORIZONTAL_GRID_SPACING } = this.constants;
        const { dataMax, dataMin } = this;

        //Draw the price container.
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(width-PRICE_OFFSET, 0, PRICE_OFFSET, height-TIME_OFFSET);

        const dataRange = dataMax - dataMin;
        
        //Value to decrement price by.
        const dataInterval = dataRange / HORIZONTAL_GRID_SPACING;
        const containerHeight = height - TIME_OFFSET;
        const horizontalLineGap = containerHeight / HORIZONTAL_GRID_SPACING;
        const x = width - 45;
        this.ctx.fillStyle = 'gray';
        this.ctx.font = '8px menlo';
        
        //Draw the price labels.
        //price - The starting price (max value)
        //y - Start drawing labels at y value 0
        for(let price = dataMax, y = 0; price > dataMin; price -= dataInterval, y += horizontalLineGap) {
            this.ctx.fillText(`$${price}`, x, y);
        }

    }

    renderTimeAxis() {
        const { width, height } = this.elementPosition;
        const {PRICE_OFFSET, TIME_OFFSET, VERTICAL_GRID_SPACING} = this.constants;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, height-TIME_OFFSET, width-PRICE_OFFSET, TIME_OFFSET);
        const length = this.dates.length;
        
        const y = height - 25;
        const containerWidth = width - PRICE_OFFSET;
        const arrayIndexGap = Math.round(length / VERTICAL_GRID_SPACING);
        const verticalLineGap = containerWidth / VERTICAL_GRID_SPACING; 

        this.ctx.fillStyle = 'gray';
        this.ctx.font = '8px menlo';

        for(let index = 0, x = 0; index < length; index += arrayIndexGap, x += verticalLineGap) {
            let date = moment.unix(this.dates[index]);
            this.ctx.fillText(date.format('M/D/YY') ,x, y);
        }

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

        if(this.options.chartType === this.constants.CANDLE) {
            this.candleChart = new Candle(this.ctx, this.data, this.options, this.elementPosition);
            this.candleChart.plotCandles();
        } else {
            this.lineChart = new Line(this.ctx, this.data, this.options, this.elementPosition);  
            this.lineChart.plotLines();
        }

    }

    onData(data) {
        if(data) {
            this.data = data;
            this.renderContainer();
        }
    }
}

export default Chart