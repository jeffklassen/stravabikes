function extractMetricPreference(athleteMetricPreference: string): boolean {
  if (athleteMetricPreference === 'meters') {
    return true;
  } else {
    return false;
  }
}

export {
  extractMetricPreference
};