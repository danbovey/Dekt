import moment from 'moment';

export const toHHMM = d => {
    const duration = moment(Math.floor(d), 'minutes');
    
    return duration.hours() + ':' + duration.minutes();
};
