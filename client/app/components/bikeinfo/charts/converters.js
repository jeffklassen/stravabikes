function convertMetric(prefersMetric, unconvertedValue) {
   
    console.log(prefersMetric, unconvertedValue)
    if (prefersMetric) {
        return unconvertedValue * .001;
    } else {
        return unconvertedValue * .000621371;
    }
}

export {
    convertMetric
};


