import React from 'react';
import moment from 'moment';
import momentPlugin from '../../momentConversion';



const Metric = ({summary, metricPreference}) => {
    const metricStyle = { display: 'block', color: 'fc4c02' };
    const fieldStyle = { display: 'block' };
    const summaryStyle = { fontSize: 16, fontWeight: 700, marginLeft: '12px', display: 'inline-block', padding: '14px' };
    const convertedValue = conversionPasser(summary, metricPreference);
    return (
        <div className="summary" style={summaryStyle}>
            <div style={metricStyle}>{convertedValue.value}</div>
            <div style={fieldStyle}>{convertedValue.label}</div>
        </div>
    );
};

//determines the summary type for conversion, passes to appropriate conversion function
function conversionPasser(summary, metricPreference) {
    if (summary.field === 'Time') {
        return timeConverter(summary.total);
    } else if (summary.field === 'Elevation') {
        return elevationConverter(summary.total, metricPreference);
    } else if (summary.field === 'Distance') {
        return distanceConverter(summary.total, metricPreference);
    }
}

//convert time in seconds to human readable time
function timeConverter(timeInMilSeconds) {
    let timeInSeconds = timeInMilSeconds * 1000;
    let timeSec = moment.preciseDiff(0, timeInSeconds);
    return { 'label': 'time adventuring', 'value': timeSec };
}

//convert distance in meters to either miles/km based on user preference. then adds commas
function distanceConverter(distanceInMeters, metricPreference) {
    if (metricPreference == 'feet') {
        let distanceTotal = addCommas(Math.round(distanceInMeters * .000621371));
        return { 'label': 'miles pedaled', 'value': distanceTotal };
    } else {
        let distanceTotal = addCommas(Math.round(distanceInMeters * .001));
        return { 'label': 'kilometers pedaled', 'value': distanceTotal };
    }
}

//convert elevation gain to feet/meters based on user preference. then adds commas
function elevationConverter(elevationinMeters, metricPreference) {
    if (metricPreference === 'feet') {
        let totalClimbed = addCommas(Math.round(elevationinMeters * 3.28084));
        return { 'label': 'feet climbed', 'value': totalClimbed };
    } else {
        let totalClimbed = addCommas(Math.round(elevationinMeters));
        return { 'label': 'meters climbed', 'value': totalClimbed };
    }
}

//adds commas to numbers for readability
function addCommas(intNum) {
    return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export default Metric;

/*

 else if (summary.field === 'Distance') {
        return distanceConverter(summary.total);
    }

     else if (summary.field === 'Elevation') {
        return elevationConverter(summary.total);
    }
*/