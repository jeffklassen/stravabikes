function convertDistance(prefersMetric, unconvertedValue) {
    if (prefersMetric) {
        return unconvertedValue * .001;
    } else {
        return unconvertedValue * .000621371;
    }
}

function convertElevation(prefersMetric, unconvertedValue) {
    if (prefersMetric) {
        return unconvertedValue;
    } else {
        return unconvertedValue * 3.28084;
    }
}

function convertTime(prefersMetric, unconvertedValue) {
    return unconvertedValue / 60 / 60;
}

export {
    convertDistance,
    convertElevation,
    convertTime
};


