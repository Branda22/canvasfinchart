import Chart from './chart';
import {getRealData} from '../test/fixtures';



var anchor = document.getElementById('container');
getRealData('USDT_BTC').then(data => {
    const chart = new Chart(anchor, data.slice(-150));
});