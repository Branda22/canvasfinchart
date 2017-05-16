import Chart from './chart';
import {getRealData} from '../test/fixtures';



var anchor = document.getElementById('container');
getRealData('BTC_ETH').then(data => {
    const chart = new Chart(anchor, data);
});