import Chart from './chart';
import getRandomData from '../test/fixtures';

var anchor = document.getElementById('container');

const chart = new Chart(anchor, getRandomData());