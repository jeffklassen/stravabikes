function convertKM(prefersMetric, unconvertedValue) {
    if (prefersMetric) {
        return unconvertedValue * .001;
    } else {
        return unconvertedValue * .000621371;
    }
}

function convertMeters(prefersMetric, unconvertedValue){


}

function convertTime(prefersMetric, unconvertedValue){

}

export {
    convertKM, 
    convertMeters,
    convertTime
};


