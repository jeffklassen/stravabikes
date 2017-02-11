import { listAthleteActivities } from '../clients/mongoclient';

const bikeController = {
    getBikeCount: () => {
        return listAthleteActivities(3231940)
            .then(activities => {
                let ridesWithBikes = activities
                    .filter(activity => activity.type === 'Ride')
                    .filter(ride => typeof ride.gear_id === 'string');

                let bikeList = ridesWithBikes.reduce((bl, ride) => {
                    if (!bl.includes(ride.gear_id)) {
                        bl.push(ride.gear_id);
                    }
                    return bl;
                }, []);
                return bikeList.length;
            });
    }
};



export default bikeController;