import React from 'react';
import * as request from 'superagent';


const AthleteSummary = ({athlete}) => {
    return (
        <div className="col-md-12">
            <hr />
            <div className="row" >
                <img src={athlete.profile} className="pull-left" style={{ float: 'left', marginRight: '15px', height: '100px', width: '100px', borderRadius: '50%' }} />
                <h2 className="col-md-3"> {`${athlete.firstname} ${athlete.lastname}`}</h2>
                <div className="pull-right" style={{ float: 'right', display: 'block' }}>
                    <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
                        <div style={{ display: 'block' }}>500</div>
                        <div style={{ display: 'block' }}>Total Distance</div>
                    </div>
                    <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
                        <div style={{ display: 'block', boxSizing: "border-box" }}>200</div>
                        <div style={{ display: 'block' }}>Total Elevation</div>
                    </div>
                    <div className="summaryComponent" style={{ display: 'inline-block', padding: '14px' }}>
                        <div style={{ display: 'block' }}>600</div>
                        <div style={{ display: 'block' }}>Total Hours</div>
                    </div>

                </div>
            </div>
            <hr />
        </div>

    );
};


class BikeInfoSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { numBikes: null, athlete: null };

        this.loadAthlete = this.loadAthlete.bind(this);
        this.loadAthlete();
    }
    loadAthlete() {
        request.get('/api/athlete')
            .then(response => {
                let json = response.body;
                console.log(json);
                this.setState({ athlete: json });

                // request.get('/api/metrics')
                //     .then(response => {
                //         let json = response.body;
                //         this.setState({
                //             summary: {
                //                 elevation: json.elevation,
                //                 distance: json.distance,
                //                 hours: json.hours
                //             }
                //         });
                //     });
            });

    }
    onButtonClick() {
        request.get('/api/bikecount')
            .then(response => {
                let json = response.body;
                this.setState({ numBikes: json.bikeCount });
            });
    }

    render() {
        return (

            this.state.athlete ? (<div>
                <div className="row">
                    <AthleteSummary athlete={this.state.athlete} />
                </div>
                <div className="row">
                    <span>number of bikes:{this.state.numBikes}</span>
                </div>
                <div className="row">
                    <button onClick={this.onButtonClick.bind(this)}> Get Count </button>
                </div>
            </div>) : null

        );
    }
}
export default BikeInfoSurface;


