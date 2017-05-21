require('es6-promise').polyfill();

import _ from 'lodash';
import fetch from 'isomorphic-fetch';


export const genRandomData = () => {
    return _.map(_.range(0,100), n => {
        const l = _.random(n, n + 5);
        const h = _.random(n, n + 25);
        return _.random(l, h);
    });
};

export const getRealData = (ticker) => {
    return fetch(`https://poloniex.com/public?command=returnChartData&currencyPair=${ticker}&start=1405699200&end=9999999999&period=86400`)
    .then(data => {
        return data.json();
    });
}

