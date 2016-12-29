import * as _ from 'lodash'

import * as Parser from './parser'
import moment = require("moment");
import {AdjustedDays} from "./parser";
import {Trip} from "./parser";
import {TravelHistory} from "./parser";
import {Days} from "./parser";

let TOTAL_DAYS_TO_GET_PRESENCE = 183;
let CURRENT_YEAR_DAYS_TO_GET_PRESENCE = 31;

export function calculate(tripHistory: Parser.TravelHistory, atDate: moment.Moment): boolean {
    let enoughTotalAdjustedDays = tripHistory.adjustedDaysAt(atDate) >= TOTAL_DAYS_TO_GET_PRESENCE;
    let enoughDaysInTheLastYear = tripHistory.adjustedDaysInTheLastYearAt(atDate) >= CURRENT_YEAR_DAYS_TO_GET_PRESENCE;
    return enoughTotalAdjustedDays && enoughDaysInTheLastYear;
}

export interface Calculator<T> {
    totalDaysInUs(t: T): Days;
    adjustedDaysInTheLastYearAt(t: T, date: moment.Moment): AdjustedDays;
    adjustedDaysAt(t: T, date: moment.Moment): AdjustedDays;
}

export class TripCalculator implements Calculator<Trip> {
    public totalDaysInUs(trip: Trip): Days {
        return rangeToDuration(timeInUs(trip)).asDays();
    }
    public adjustedDaysInTheLastYearAt(trip: Trip, date: moment.Moment): AdjustedDays {
        let oneYearAgo = date.clone().subtract(1, 'year');
        let oneYearAgoUntilNow = moment.range(oneYearAgo, date);
        return daysInUsForRange(trip, oneYearAgoUntilNow);
    }

    public adjustedDaysAt(trip: Trip, date: moment.Moment): AdjustedDays {
        let oneYearAgo = date.clone().subtract(1, 'year');
        let twoYearsAgo = date.clone().subtract(2, 'years');
        let threeYearsAgo = date.clone().subtract(3, 'years');

        let oneToTwoYearsAgo = moment.range(twoYearsAgo, oneYearAgo);
        let twoToThreeYearsAgo = moment.range(threeYearsAgo, twoYearsAgo);

        return this.adjustedDaysInTheLastYearAt(trip, date)
            +  daysInUsForRange(trip, oneToTwoYearsAgo) / 3
            +  daysInUsForRange(trip, twoToThreeYearsAgo) / 6;
    }
}

export class TravelHistoryCalculator implements Calculator<TravelHistory> {
    constructor(private readonly tripCalculator: Calculator<Trip> = new TripCalculator()) {}

    public adjustedDaysAt(travelHistory: TravelHistory, someDate: moment.Moment): AdjustedDays {
        return _(travelHistory.trips)
            .map(trip => this.tripCalculator.adjustedDaysAt(trip, someDate))
            .reduce((a, b) => a + b, 0);
    }

    public adjustedDaysInTheLastYearAt(travelHistory: TravelHistory, someDate: moment.Moment): AdjustedDays {
        return _(travelHistory.trips)
            .map(trip => this.tripCalculator.adjustedDaysInTheLastYearAt(trip, someDate))
            .reduce((a, b) => a + b, 0);
    }

}

export function adjustedDaysInTheLastYearForTrip(trip: Trip, date: moment.Moment): AdjustedDays {
    let oneYearAgo = date.clone().subtract(1, 'year');
    let oneYearAgoUntilNow = moment.range(oneYearAgo, date);
    return daysInUsForRange(trip, oneYearAgoUntilNow);
}

export function adjustedDaysAt(trip: Trip, date: moment.Moment): AdjustedDays {
    let oneYearAgo = date.clone().subtract(1, 'year');
    let twoYearsAgo = date.clone().subtract(2, 'years');
    let threeYearsAgo = date.clone().subtract(3, 'years');

    let oneToTwoYearsAgo = moment.range(twoYearsAgo, oneYearAgo);
    let twoToThreeYearsAgo = moment.range(threeYearsAgo, twoYearsAgo);

    return adjustedDaysInTheLastYearAt(trip, date)
        +  daysInUsForRange(trip, oneToTwoYearsAgo) / 3
        +  daysInUsForRange(trip, twoToThreeYearsAgo) / 6;
}

function daysInUsForRange(trip: Trip, range: moment.Range): AdjustedDays {
    let timeInUsInRange = range.intersect(timeInUs(trip));
    if (timeInUsInRange === null) {
        return 0;
    }

    return rangeToDuration(timeInUsInRange).asDays();
}

function timeInUs(trip: Trip): moment.Range {
    return moment.range(trip.entry.time, trip.exit.time.clone().add(1, 'day'))
}

function rangeToDuration(range: moment.Range): moment.Duration {
    return moment.duration(range.end.diff(range.start));
}