import { listAthleteActivities } from '../clients/mongoclient';

const metricsController = {
    getMetrics: () => {
        return listAthleteActivities(3231940)
            .then(activities => {
                let totaElevation = 0;
                let rides = activities
                    .filter(activity => activity.type === 'Ride');

                let elevationGain = rides.forEach(activity => {
                     totalElevation += activity.total_elevation_gain;
                })
                    
console.log(totalElevation)
        return bikeList.length;
    });


export default bikeController;