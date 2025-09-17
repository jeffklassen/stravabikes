import React, { CSSProperties } from 'react';
import StatsCard from './StatsCard';
import { StravaAthlete } from '../../../../../types/strava';
import { ActivitySummary } from '../../../../../types/models';
import { useTheme } from '../../../context/ThemeContext';
import { getThemeColors } from '../../../styles/solarized';

interface AthleteSummaryProps {
    athlete: StravaAthlete;
    summaries?: ActivitySummary[];
}

const AthleteSummary = ({ athlete, summaries }: AthleteSummaryProps): React.ReactElement => {
    const { darkMode } = useTheme();
    const colors = getThemeColors(darkMode);

    const containerStyle: CSSProperties = {
        backgroundColor: colors.cardBackground,
        padding: '30px 0',
        borderBottom: `1px solid ${colors.border}`,
        marginBottom: '30px'
    };

    const profileSectionStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        gap: '20px'
    };

    const avatarStyle: CSSProperties = {
        height: '80px',
        width: '80px',
        borderRadius: '50%',
        border: `3px solid ${colors.border}`,
        objectFit: 'cover'
    };

    const profileInfoStyle: CSSProperties = {
        flex: 1
    };

    const nameStyle: CSSProperties = {
        fontSize: '24px',
        fontWeight: '600',
        color: colors.textPrimary,
        margin: '0 0 8px 0'
    };

    const bikeCountStyle: CSSProperties = {
        fontSize: '16px',
        fontWeight: '500',
        color: colors.accent,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const statsGridStyle: CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0',
        justifyContent: 'flex-start'
    };

    const activeBikes = athlete.bikes?.filter(bike => bike.distance && bike.distance > 0) || [];

    return (
        <div style={containerStyle}>
            <div style={profileSectionStyle}>
                <img src={athlete.profile} alt={`${athlete.firstname} ${athlete.lastname}`} style={avatarStyle} />
                <div style={profileInfoStyle}>
                    <h2 style={nameStyle}>{`${athlete.firstname} ${athlete.lastname}`}</h2>
                    <p style={bikeCountStyle}>
                        🚴 {activeBikes.length} {activeBikes.length === 1 ? 'bike' : 'bikes'}
                    </p>
                </div>
            </div>

            <div style={statsGridStyle}>
                {summaries &&
                    summaries.map((summary) => {
                        return (
                            <StatsCard
                                key={summary.field}
                                summary={summary}
                                metricPreference={athlete.measurement_preference || 'feet'}
                                darkMode={darkMode}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
};
export default AthleteSummary;