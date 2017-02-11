import { getAthlete } from '../clients/mongoclient';

const athleteController = {
    getAthlete: () => {
        return getAthlete(3231940);
    }
};



export default athleteController;