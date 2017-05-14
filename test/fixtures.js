import _ from 'lodash';
import axios from 'axios';

const genRandomData = () => {
    return _.map(_.range(0,100), n => {
        const l = _.random(n, n + 5);
        const h = _.random(n, n + 25);
        return _.random(l, h);
    });
};

const getRealData = (ticker) => {
    return axios.get('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=1405699200&end=9999999999&period=14400')
    .then(data => {
        console.log('data:', data);
    });
}

export default genRandomData;