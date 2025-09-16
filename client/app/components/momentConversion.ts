import moment from 'moment';

interface PreciseDiffResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  firstDateWasLater: boolean;
}

interface StringsConfig {
  nodiff: string;
  year: string;
  years: string;
  month: string;
  months: string;
  day: string;
  days: string;
  hour: string;
  hours: string;
  minute: string;
  minutes: string;
  second: string;
  seconds: string;
  delimiter: string;
}

type MomentInput = string | number | Date | moment.Moment;

// Create a simple extension interface that works with the existing moment types
interface MomentExtensions {
  preciseDiff(d1: MomentInput, d2: MomentInput, returnValueObject?: boolean): string | PreciseDiffResult;
  fn: {
    preciseDiff: (d2: MomentInput, returnValueObject?: boolean) => string | PreciseDiffResult;
  };
}

// Type assertion helper to extend moment safely
function extendMoment(momentInstance: typeof moment): typeof moment & MomentExtensions {
  return momentInstance as typeof moment & MomentExtensions;
}

const momentPlugin = (function(momentInstance: typeof moment) {
  const STRINGS: StringsConfig = {
    nodiff: '',
    year: 'year',
    years: 'years',
    month: 'month',
    months: 'months',
    day: 'day',
    days: 'days',
    hour: 'hour',
    hours: 'hours',
    minute: 'minute',
    minutes: 'minutes',
    second: 'second',
    seconds: 'seconds',
    delimiter: ' '
  };

  function pluralize(num: number, word: keyof Pick<StringsConfig, 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'>): string {
    const wordKey = (word + (num === 1 ? '' : 's')) as keyof StringsConfig;
    return num + ' ' + STRINGS[wordKey];
  }

  function buildStringFromValues(yDiff: number, mDiff: number, dDiff: number, hourDiff: number, minDiff: number, secDiff?: number): string {
    const result: string[] = [];

    if (yDiff) {
      result.push(pluralize(yDiff, 'year'));
    }
    if (mDiff) {
      result.push(pluralize(mDiff, 'month'));
    }
    if (dDiff) {
      result.push(pluralize(dDiff, 'day'));
    }
    if (hourDiff) {
      result.push(pluralize(hourDiff, 'hour'));
    }
    if (minDiff) {
      result.push(pluralize(minDiff, 'minute'));
    }
    if (secDiff) {
      result.push(pluralize(secDiff, 'second'));
    }

    return result.join(STRINGS.delimiter);
  }

  const extendedMoment = extendMoment(momentInstance);

  // Initialize fn if it doesn't exist
  if (!extendedMoment.fn) {
    extendedMoment.fn = {} as MomentExtensions['fn'];
  }

  extendedMoment.fn.preciseDiff = function(this: moment.Moment, d2: MomentInput, returnValueObject?: boolean): string | PreciseDiffResult {
    return extendedMoment.preciseDiff(this, d2, returnValueObject);
  };

  extendedMoment.preciseDiff = function(d1: MomentInput, d2: MomentInput, returnValueObject?: boolean): string | PreciseDiffResult {
    let m1 = moment(d1);
    let m2 = moment(d2);
    let firstDateWasLater: boolean;

    m1.add(m2.utcOffset() - m1.utcOffset(), 'minutes'); // shift timezone of m1 to m2

    if (m1.isSame(m2)) {
      return STRINGS.nodiff;
    }
    if (m1.isAfter(m2)) {
      const tmp = m1;
      m1 = m2;
      m2 = tmp;
      firstDateWasLater = true;
    } else {
      firstDateWasLater = false;
    }

    let yDiff = m2.year() - m1.year();
    let mDiff = m2.month() - m1.month();
    let dDiff = m2.date() - m1.date();
    let hourDiff = m2.hour() - m1.hour();
    let minDiff = m2.minute() - m1.minute();
    let secDiff = m2.second() - m1.second();

    if (secDiff < 0) {
      secDiff = 60 + secDiff;
      minDiff--;
    }
    if (minDiff < 0) {
      minDiff = 60 + minDiff;
      hourDiff--;
    }
    if (hourDiff < 0) {
      hourDiff = 24 + hourDiff;
      dDiff--;
    }
    if (dDiff < 0) {
      const daysInLastFullMonth = moment(m2.year() + '-' + (m2.month() + 1), "YYYY-MM").subtract(1, 'M').daysInMonth();
      if (daysInLastFullMonth < m1.date()) { // 31/01 -> 2/03
        dDiff = daysInLastFullMonth + dDiff + (m1.date() - daysInLastFullMonth);
      } else {
        dDiff = daysInLastFullMonth + dDiff;
      }
      mDiff--;
    }
    if (mDiff < 0) {
      mDiff = 12 + mDiff;
      yDiff--;
    }

    if (returnValueObject) {
      return {
        years: yDiff,
        months: mDiff,
        days: dDiff,
        hours: hourDiff,
        minutes: minDiff,
        seconds: secDiff,
        firstDateWasLater: firstDateWasLater
      };
    } else {
      return buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff);
    }
  };

  return extendedMoment;
}(moment));

export default momentPlugin;