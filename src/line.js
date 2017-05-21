import config from './config';
const { constants } = config;

class Line {
    constructor(ctx, data, options, elementPosition) {
        this.ctx = ctx;
        this.data = data;
        this.options = options;
        this.constants = constants;
        this.elementPosition = elementPosition;
    }

    plotLines() {
        const { width, height } = this.elementPosition;
        const { TIME_OFFSET, PRICE_OFFSET } = this.constants;
        const { data } = this;

        const length = data.length;

        const containerHeight = height - TIME_OFFSET;
        const containerWidth = width - PRICE_OFFSET;
        const verticalGap = containerWidth / length;

        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 0.5;

        this.ctx.beginPath();
        for(let x = verticalGap, i = 0; i < length; x+=verticalGap, i++) {
            var y = containerHeight - (containerHeight * data[i][1])
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }
}

export default Line;