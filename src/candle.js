import _ from 'lodash';
import config from './config';

const { constants } = config;

class Candles {
    constructor(ctx, data, options, elementPosition) {
      const { TIME_OFFSET, PRICE_OFFSET } = constants;

      this.ctx = ctx;
      this.data = data;
      this.length = data.length;
      this.options = options;

      this.elementPosition = elementPosition;
      const {width, height} = this.elementPosition;

      this.containerHeight = height - TIME_OFFSET;
      this.containerWidth = width - PRICE_OFFSET;
    }



    renderCandle(ohlc, x, index) {

      //converting ohlc percentage values to pixel values
      //Subtracts by containerHeight to invert value since height is from top down.
      ohlc = _.map(ohlc, p => this.containerHeight - (this.containerHeight * p));

      var previousCandle;

      if(index - 1 >= 0) {
        previousCandle = this.data[index - 1];
      }

      const open = ohlc[0];
      const high = ohlc[1];
      const low = ohlc[2];
      const close = ohlc[3];

      this.ctx.strokeStyle = 'green';

      //render wick
      this.ctx.moveTo(x, high);
      this.ctx.lineTo(x, low);
      this.ctx.stroke();

      this.ctx.fillStyle = 'red';
      //render body
      let height;
      let start;
      if(close > open) {
        height = close - open;
        start = close;
      } else {
        height = open - close;
        start = open;
      }
      this.ctx.fillRect(x-5, start, 10, height);
    }

    plotCandles() {
      const verticalGap = this.containerWidth / this.length;
      let x = 0;
      this.ctx.beginPath()
      _.each(this.data, (ohlc, index) => {
        x += verticalGap;
        this.renderCandle(ohlc, x, index)
      });
    }
}

export default Candles;