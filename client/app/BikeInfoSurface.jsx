import React from 'react';
import * as request from 'superagent';


class BikeInfoSurface extends React.Component {
    constructor(props) {
        super(props);
        this.state = { numBikes: null };
    }
    onButtonClick() {
        // reach out to API and print out the bike Count'

        request.get('/api/bikecount')
            .then(response => {
                let json = response.body;
                this.setState({ numBikes: json.bikeCount });
            });
    }
    render() {
        return (<div>
            <span>number of bikes:{this.state.numBikes}</span><br/>
            <button onClick={this.onButtonClick.bind(this)}> Get Count </button>
        </div>);
    }
}
export default BikeInfoSurface;


