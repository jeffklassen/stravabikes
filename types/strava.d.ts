export interface StravaActivity {
  id: number;
  _id?: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  start_date_local: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  flagged: boolean;
  gear_id?: string;
  from_accepted_tag: boolean;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  workout_type?: number;
}

export interface StravaAthlete {
  id: number;
  _id?: number;
  username?: string;
  resource_state: number;
  firstname: string;
  lastname: string;
  city?: string;
  state?: string;
  country?: string;
  sex?: 'M' | 'F';
  premium: boolean;
  created_at: string;
  updated_at: string;
  badge_type_id: number;
  profile_medium?: string;
  profile?: string;
  friend?: 'pending' | 'accepted' | 'blocked';
  follower?: 'pending' | 'accepted' | 'blocked';
  follower_count?: number;
  friend_count?: number;
  mutual_friend_count?: number;
  athlete_type?: number;
  date_preference?: string;
  measurement_preference?: 'feet' | 'meters';
  clubs?: any[];
  ftp?: number;
  weight?: number;
  bikes?: StravaBike[];
  shoes?: any[];
}

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface StravaAuthProvider {
  authUrl: string;
  clientId: number;
  redirectUri: string;
  scope: string;
}

export interface StravaRequestParams {
  per_page?: number;
  page?: number;
  before?: number;
  after?: number;
}

export interface StravaBike {
  id: string;
  name: string;
  primary?: boolean;
  resource_state?: number;
  distance?: number;
}