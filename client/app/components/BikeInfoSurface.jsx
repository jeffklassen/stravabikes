import React from 'react';
import * as request from 'superagent';
import { Chart } from 'react-google-charts';
import AthleteSummary from './summary/AthleteSummary.jsx';

class BikeInfoSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { summary: {}, athlete: null };

        this.loadAthlete = this.loadAthlete.bind(this);
        this.loadAthlete();
    }
    loadAthlete() {
        Promise.all([request.get('/api/athleteSummary'), request.get('/api/activities')])
            .then(([summaryResponse, activityResponse]) => {
                let athleteSummary = summaryResponse.body;
                this.setState({ athlete: athleteSummary.athlete, summaries: athleteSummary.summary });

                let activities = activityResponse.body;

                let bikes = athleteSummary.athlete.bikes;

                //activities = activities.filter(activity => activity.gear_id === firstBikeId);

                console.log(activities.length);
                //create date column for chart
                let columns = [{
                    label: 'Date',
                    type: 'string'
                }];
                //create columns for each bike 
                columns = columns.concat(bikes.map(bike => {
                    return { type: 'number', label: bike.name };
                }));
                //iterate through ride activities, grab previous rows' data
                let allBikeData = activities.reduce((reducer, activity) => {
                    let previousRow;
                    if (reducer[reducer.length - 1]) {
                        previousRow = reducer[reducer.length - 1];
                    }

                    //put bikeId for all bikes in list, then get the bike id's index for the specific activity
                    let activityIndex = bikes.map(bike => bike.id).indexOf(activity.gear_id) ;


                    //for every bike, take the bike and its index in bikes
                    let data = bikes.map((bike, index) => {
                        //get previous value at bike index
                        let previousValue = 0;
                        if (previousRow && previousRow[index+1]) {
                            previousValue = previousRow[index+1];
                        }

                        //only update the correct bike sum if indexes match
                        if (index === activityIndex) {
                            return activity.distance + previousValue;
                        }
                        else {
                            return previousValue;
                        }
                    });
                    //add new row to reducer list
                    reducer.push([activity.start_date_local, ...data]);
                    return reducer;
                }, []);

                console.log(allBikeData);
                this.setState({ allBikeData, columns });

            });

    }

    render() {
        return (

            this.state.athlete ? (
                <div>
                    <div className="row">
                        <AthleteSummary athlete={this.state.athlete} summaries={this.state.summaries} />
                    </div>
                    <div className="row">
                        {this.state.allBikeData ? (
                            <Chart
                                chartType="LineChart"
                                columns={this.state.columns}
                                rows={this.state.allBikeData}
                                options={{}}
                                graph_id="ScatterChart"
                                width="100%"
                                height="400px"
                                legend_toggle
                            />
                        ) : null}
                    </div>

                </div>
            ) : null

        );
    }
}

export default BikeInfoSurface;


