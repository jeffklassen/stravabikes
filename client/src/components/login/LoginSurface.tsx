import React from 'react';
import queryString from 'query-string';
import LoginLink from './LoginLink';
import authService from '../../services/authService';
import activitiesService from '../../services/activitiesService';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginSurfaceState {
    authcode?: string;
    msg?: string;
}

interface LoginSurfaceProps {
    isAuthenticated: () => Promise<void>;
}

const LoginSurface = ({ isAuthenticated }: LoginSurfaceProps): JSX.Element => {
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = React.useState<LoginSurfaceState>({});
    const saveAuthCode = React.useCallback(async (authCode: string) => {
        await authService.completeLoginWithStrava(authCode);
        setState(prev => ({ ...prev, msg: 'updating your data' }));
        const resp = await activitiesService.loadActivities();
        setState(prev => ({ ...prev, msg: `loaded ${resp.body.activityCount} activities` }));
        navigate('/');
    }, [navigate]);

    React.useEffect(() => {
        const queryParams = queryString.parse(location.search);
        if (queryParams.code) {
            const authcode = queryParams.code as string;
            setState({ authcode });
            saveAuthCode(authcode);
        }
    }, [location.search, saveAuthCode]);



    return (
        <div>
            {state.authcode ? (
                <span>{state.msg || 'completing login with strava'}</span>
            ) : (
                <LoginLink />
            )}
        </div>
    );
};
export default LoginSurface;