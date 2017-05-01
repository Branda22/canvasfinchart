import _ from 'lodash';

const genRandomData = () => {
    return _.map(_.range(0,500), n => _.random(45, 135));
};

export default genRandomData;