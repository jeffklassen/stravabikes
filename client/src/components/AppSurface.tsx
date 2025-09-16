import React from 'react';
import BikeInfoSurface from './bikeinfo/BikeInfoSurface';
import LoginSurface from './login/LoginSurface';
import * as request from 'superagent';

interface AppSurfaceState {
    ready: boolean;
    isLoggedIn?: boolean;
}

const AppSurface = (): React.ReactElement => {
    const [state, setState] = React.useState<AppSurfaceState>({ ready: false });
    const isAuthenticated = React.useCallback(async () => {
        try {
            await request.get('/api/isAuthenticated');
            window.history.pushState('', '', '');
            setState({ ready: true, isLoggedIn: true });
        } catch (e) {
            console.log('isAuthenticated', e);
            setState({ ready: true, isLoggedIn: false });
        }
    }, []);

    React.useEffect(() => {
        isAuthenticated();
    }, [isAuthenticated]);
    return state.ready && state.isLoggedIn ?
        (<BikeInfoSurface />) :
        (<LoginSurface isAuthenticated={isAuthenticated} />);
};
export default AppSurface;