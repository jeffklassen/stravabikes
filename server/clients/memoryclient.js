const store = {};

function insertActivities(activities, athleteId) {
  // convert activies to map _id -> activity
  const activityMap = activities.reduce((map, activity) => {
    map[activity._id] = activity;
    return map;
  }, {});
  store.athletes.find((ath) => ath.id === athleteId).activities = {
    ...store.activities,
    ...activityMap,
  };

  return store.activities;
}
