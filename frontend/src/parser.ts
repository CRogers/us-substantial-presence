import * as _ from 'lodash'
import * as moment from 'moment'
import 'moment-range'

import { Optional } from './optional'

export interface TravelHistory {
    trips: Trip[];
    adjustedDaysInTheLastYearUpTo(date: moment.Moment): AdjustedDays;
    adjustedDaysUpTo(date: moment.Moment): AdjustedDays;
}

export class DefaultTravelHistory implements TravelHistory {
    constructor(public trips: Trip[]) {}

    public adjustedDaysUpTo(someDate: moment.Moment): AdjustedDays {
        return _(this.trips)
            .map(trip => trip.adjustedDaysUpTo(someDate))
            .reduce((a, b) => a + b, 0);
    }

    public adjustedDaysInTheLastYearUpTo(someDate: moment.Moment): AdjustedDays {
        return _(this.trips)
            .map(trip => trip.adjustedDaysInTheLastYearUpTo(someDate))
            .reduce((a, b) => a + b, 0);
    }
}

export type AdjustedDays = number;

export interface Trip {
    entry: PortVisit;
    exit: PortVisit;
    adjustedDaysInTheLastYearUpTo(date: moment.Moment): AdjustedDays;
    adjustedDaysUpTo(date: moment.Moment): AdjustedDays;
}

function tapLog<T>(t: T): T {
    console.log(t);
    return t;
}

export class DefaultTrip implements Trip {
    constructor(public entry: PortVisit, public exit: PortVisit) {}

    public adjustedDaysInTheLastYearUpTo(date: moment.Moment): AdjustedDays {
        const startOfCurrentYear = moment(date.clone().year(), 'YYYY');
        const oneYearAgoUntilNow = moment.range(startOfCurrentYear, date);
        return this.daysInUsForRange(oneYearAgoUntilNow);
    }

    public adjustedDaysUpTo(date: moment.Moment): AdjustedDays {
        const startOfCurrentYear = moment(date.clone().year(), 'YYYY');
        const startOfLastYear = startOfCurrentYear.clone().subtract(1, 'year');
        const startOfTwoYearsAgo = startOfCurrentYear.clone().subtract(2, 'years');

        let oneToTwoYearsAgo = moment.range(startOfLastYear, startOfCurrentYear);
        let twoToThreeYearsAgo = moment.range(startOfTwoYearsAgo, startOfLastYear);

        return this.adjustedDaysInTheLastYearUpTo(date)
            +  this.daysInUsForRange(oneToTwoYearsAgo) / 3
            +  this.daysInUsForRange(twoToThreeYearsAgo) / 6;
    }

    private daysInUsForRange(range: moment.Range): AdjustedDays {
        let timeInUsInRange = range.intersect(this.timeInUs());
        if (timeInUsInRange === null) {
            return 0;
        }

        return rangeToDuration(timeInUsInRange).asDays();
    }

    private timeInUs(): moment.Range {
        return moment.range(this.entry.time, this.exit.time.clone().add(1, 'day'))
    }
}

function rangeToDuration(range: moment.Range): moment.Duration {
    return moment.duration(range.end.diff(range.start));
}

export interface PortVisit {
    port: Port,
    time: moment.Moment
}

export type Port = string;

export function parseTravelHistory(str: string): Optional<DefaultTravelHistory> {
    if (str.trim().length == 0) {
        return Optional.empty<DefaultTravelHistory>();
    }

    try {
        return Optional.of(parseTravelHistoryThrowingErrors(str));
    } catch (e) {
        return Optional.empty<DefaultTravelHistory>();
    }
}

export function parseTravelHistoryThrowingErrors(str: string): DefaultTravelHistory {
    const nonEmptyLine = (line: string) => !/^\s*$/.test(line);

    const trimmedLines = _(str)
        .split('\n')
        .filter(nonEmptyLine)
        .map(line => line.trim())
        .value();

    const chunks = _(trimmedLines)
        .chunk(5)
        .map(chunk => _.drop(chunk, 1))
        .value();

    const trips = _.map(chunks, parseTrip);

    return new DefaultTravelHistory(trips);
}

function parseTrip(trip: string[]): Trip {
    let entry = _.take(trip, 2);
    let exit = _.drop(trip, 2);

    return new DefaultTrip(
        parsePortVisit(entry),
        parsePortVisit(exit)
    );
}

function parsePortVisit(portVisit: string[]): PortVisit {
    return {
        time: onlyDate(portVisit[0]),
        port: portVisit[1]
    }
}

function onlyDate(dateAndTime: string): moment.Moment {
    let justDateStr = dateAndTime.split('T')[0];
    return moment(justDateStr);
}
