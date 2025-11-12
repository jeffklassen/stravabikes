import * as request from 'superagent';
import 'dotenv/config';

interface StravaActivity {
  id: number;
  name: string;
  start_date: string;
  start_date_local: string;
  device_name?: string;
  type: string;
}

async function fetchActivitiesFromDate(accessToken: string, afterDate: Date): Promise<StravaActivity[]> {
  const stravaActivityUrl = 'https://www.strava.com/api/v3/athlete/activities';
  const headers = { Authorization: `Bearer ${accessToken}` };

  const afterTimestamp = Math.floor(afterDate.getTime() / 1000);
  const params = { per_page: 200, after: afterTimestamp };

  let allActivities: StravaActivity[] = [];
  let page = 1;
  let hasMore = true;

  console.log(`Fetching activities after ${afterDate.toISOString()}...`);

  while (hasMore) {
    try {
      const response = await request
        .get(stravaActivityUrl)
        .query({ ...params, page })
        .set(headers);

      const activities: StravaActivity[] = response.body;

      if (activities.length === 0) {
        hasMore = false;
      } else {
        allActivities = allActivities.concat(activities);
        console.log(`Fetched page ${page}: ${activities.length} activities (total: ${allActivities.length})`);
        page++;
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      throw err;
    }
  }

  return allActivities;
}

async function findFirstCorosActivity() {
  try {
    const accessToken = process.env.STRAVA_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('STRAVA_ACCESS_TOKEN environment variable is required');
    }

    // Start from 2 years ago today
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const activities = await fetchActivitiesFromDate(accessToken, twoYearsAgo);

    // Sort by date (oldest first)
    activities.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    // Find all Coros activities
    const corosActivities = activities.filter(a =>
      a.device_name && a.device_name.toLowerCase().includes('coros')
    );

    console.log(`\n=== RESULTS ===`);
    console.log(`Total activities analyzed: ${activities.length}`);
    console.log(`Coros activities found: ${corosActivities.length}`);

    if (corosActivities.length > 0) {
      const firstCoros = corosActivities[0];
      console.log(`\nFirst Coros activity:`);
      console.log(`  Date: ${firstCoros.start_date_local}`);
      console.log(`  Name: ${firstCoros.name}`);
      console.log(`  Type: ${firstCoros.type}`);
      console.log(`  Device: ${firstCoros.device_name}`);
      console.log(`  Activity ID: ${firstCoros.id}`);

      // Show all unique device names to see the pattern
      const uniqueDevices = new Set(activities.map(a => a.device_name).filter(Boolean));
      console.log(`\nAll unique devices found:`);
      uniqueDevices.forEach(device => console.log(`  - ${device}`));
    } else {
      console.log('\nNo Coros activities found in this time range.');

      // Show sample of device names
      const devicesWithNames = activities.filter(a => a.device_name).slice(0, 20);
      if (devicesWithNames.length > 0) {
        console.log(`\nSample of device names found (first 20):`);
        devicesWithNames.forEach(a =>
          console.log(`  ${a.start_date_local}: ${a.device_name}`)
        );
      }
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

findFirstCorosActivity();
