import { getAthlete, rideAggregation, listAthleteRides, insertActivities } from '../clients/mongoclient';
import { fullStravaActivities } from '../clients/stravaclient';
import { StravaActivity, StravaAthlete } from '../../types/strava';
import { AthleteDocument, ActivityDocument } from '../../types/models';

interface FieldMapping {
  [key: string]: {
    display: string;
    fieldName: string;
  };
}

interface SummaryAggregation {
  total: number;
  field: string;
}

interface SummaryResponse {
  athlete: AthleteDocument | null;
  summary: SummaryAggregation[];
}

interface AthleteController {
  loadActivities: (authId: string) => Promise<StravaActivity[]>;
  getAthlete: (athleteId: number) => Promise<AthleteDocument | null>;
  getActivities: (athleteId: number) => Promise<ActivityDocument[]>;
  getSummary: (athleteId: number) => Promise<SummaryResponse>;
}

// mapping database fields to front-end names
const fieldMapping: FieldMapping = {
  distance: { display: 'Distance', fieldName: 'distance' },
  elevation: { display: 'Elevation', fieldName: 'total_elevation_gain' },
  time: { display: 'Time', fieldName: 'moving_time' }
};

const athleteController: AthleteController = {
  loadActivities: async (authId: string): Promise<StravaActivity[]> => {
    const activities = await fullStravaActivities(authId);
    return insertActivities(activities);
  },

  getAthlete: (athleteId: number): Promise<AthleteDocument | null> => {
    return getAthlete(athleteId);
  },

  getActivities: (athleteId: number): Promise<ActivityDocument[]> => {
    return listAthleteRides(athleteId);
  },

  // pull athlete profile, grab sum of relevant summary fields (time, elevation, distance) by bike from DB
  getSummary: async (athleteId: number): Promise<SummaryResponse> => {
    const data = await Promise.all([
      getAthlete(athleteId),
      rideAggregation(athleteId, fieldMapping.distance.fieldName),
      rideAggregation(athleteId, fieldMapping.elevation.fieldName),
      rideAggregation(athleteId, fieldMapping.time.fieldName)
    ]);

    const athlete = data[0];

    // drill down to each bike/metric object and add bikeName field
    const modifiedAggregations: SummaryAggregation[] = [data[1], data[2], data[3]]
      .map((aggregation: any[]) => {
        return aggregation
          // total up the metrics for all bikes
          .reduce((reducer: any, element: any) => {
            if (!reducer.total) {
              reducer.total = 0;
            }
            reducer.total += element.total;

            // map the metric field name to front-end name
            if (!reducer.field) {
              reducer.field = Object.keys(fieldMapping)
                .reduce((nestedReducer: string, key: string) => {
                  if (fieldMapping[key].fieldName === element.field) {
                    nestedReducer = fieldMapping[key].display;
                  }
                  return nestedReducer;
                }, '');
            }

            return reducer;
          }, {} as SummaryAggregation);
      });

    return { athlete, summary: modifiedAggregations };
  }
};

export default athleteController;