import _ from 'lodash';

const defaultOpts = {

}

class Chart {
    constructor(elem, data, opts = defaultOpts) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.data = data;
        this.min = _.min(data);
        this.max = _.max(data);

        var parentDimensions = elem.getBoundingClientRect();
        elem.appendChild(this.canvas);
        
        this.canvas.height = parentDimensions.height || 1000;
        this.canvas.width = parentDimensions.width;
        this._renderContainer(this.canvas.width, this.canvas.height);
        window.onresize = (evt) => {
            var parentDimensions = elem.getBoundingClientRect();
            this.canvas.height = parentDimensions.height || 1000;
            this.canvas.width = parentDimensions.width;
            this._renderContainer(this.canvas.width, this.canvas.height);
        }
    }

    _renderContainer(width, height) {
        var priceOffset = 50;
        var timeOffset = 25;

        var width = width - priceOffset;
        var height = height - timeOffset;

        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0,0, width, height);
        this._renderGrid(width, height);
        this.plotData(width, height);
        this._renderTape(width, height);
    }

    _renderGrid(width, height) {
        const { ctx } = this;
        const verticalSpacing = width / 5;
        const lateralSpacing = height / 10; 

        for(let i = 0; i <= width; i+=verticalSpacing) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.closePath();
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        for(let i = 0; i <= height; i+=lateralSpacing) {
            ctx.beginPath();
            ctx.moveTo(0,i);
            ctx.lineTo(width, i);
            ctx.closePath();
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    }

    plotData(width, height) {
        const { ctx } = this;
        var data = this._normalizeData(this.data);
        const length = data.length;
        const dataGap = width / length;
        let j = 0;
        ctx.beginPath();
        ctx.moveTo(0,0);
        for(let i = 0; i < length; i++) {
            let xCoordinate = height * data[i].percentage;
            ctx.lineTo(j, xCoordinate);
            j+=dataGap;
        }
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    _normalizeData(data) {
        const { min, max } = this;
        const range = max - min;
        
        return _.map(data, d => {
            return {
                price: d,
                percentage: 1 - ((d - min) / range)
            }
        });
    }

    _renderGutter() {

    }

    _renderTape(width, height) {
        const { ctx, min, max } = this;
        const lateralSpacing = height / 10;
        ctx.fillStyle = 'black';
        ctx.fillRect(width, 0, 50, height);
        ctx.font = '13px menlo';
        ctx.fillStyle = 'gray';
        var n = max
        for(let i = 0; i <= height; i+=lateralSpacing) {
            n -= 10;
            ctx.fillText(n, width+10, i);
        }
    }
}

export default Chart;