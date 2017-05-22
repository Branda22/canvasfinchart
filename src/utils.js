import _ from 'lodash';
import moment from 'moment';

const priceKeyMap = ['open', 'high', 'low', 'close'];

export const findHigh = (data) => {
    var currentHigh = 0;

    for(let i = 0; i < data.length; i++) {
        if(data[i].high > currentHigh) {
            currentHigh = data[i].high;
        }
    }

    return currentHigh;
};

export const findLow = (data) => {
    //initial value
    var currentLow = data[0].low;

    for(let i = 0; i < data.length; i++) {
        if(data[i].low < currentLow) {
            currentLow = data[i].low;
        }
    }

    return currentLow;
};

export const getRatio = (min, max, point) => {
    return (point - min) / (max - min);
};

export const convertDataToY = (data, min, max) => {
    return _.map(data, d => {
        return _.map(priceKeyMap, key => getRatio(min, max, d[key]))
    });
};

export const extractDate = (data) => {
    return _.map(data, d => d.date)
};

export const groupDates = (dates) => {
    const dateGroup = {
        months: {}
    }

    _.each(dates, date => {
        let d = moment.unix(date);
        let month = d.month();
        if(dateGroup.months.hasOwnProperty(month)) {
            dateGroup.months[month].push(d)
        } 
        else {
            dateGroup.months[month] = [];
            dateGroup.months[month].push(d);
        }
    });

    return dateGroup;
}
