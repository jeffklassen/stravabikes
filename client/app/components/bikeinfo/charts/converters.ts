function convertDistance(prefersMetric: boolean, unconvertedValue: number): number {
  if (prefersMetric) {
    return unconvertedValue * 0.001; // meters to kilometers
  } else {
    return unconvertedValue * 0.000621371; // meters to miles
  }
}

function convertElevation(prefersMetric: boolean, unconvertedValue: number): number {
  if (prefersMetric) {
    return unconvertedValue; // already in meters
  } else {
    return unconvertedValue * 3.28084; // meters to feet
  }
}

function convertTime(prefersMetric: boolean, unconvertedValue: number): number {
  return unconvertedValue / 60 / 60; // seconds to hours
}

export {
  convertDistance,
  convertElevation,
  convertTime
};