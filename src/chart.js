const defaultOpts = {

}

class Chart {
    constructor(elem, data, opts = defaultOpts) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.data = data;

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

    plotData() {

    }

    _normalizeData(data) {
        return _.map(data, d => {

        });
    }
}

export default Chart;