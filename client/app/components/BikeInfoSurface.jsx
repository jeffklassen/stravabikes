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
        request.get('/api/athleteSummary')
            .then(response => {
                let json = response.body;
                this.setState({ athlete: json.athlete, summaries: json.summary });

            });
    }

    render() {
        return (

            this.state.athlete ? (<div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            <hr />
                            <AthleteSummary athlete={this.state.athlete} summaries={this.state.summaries} />

                        </div>
                        <hr />
                    </div>
                    <span>Chart goes here </span>
                </div>
            </div>) : null

        );
    }
}

export default BikeInfoSurface;


