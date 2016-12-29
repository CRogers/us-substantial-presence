import * as Parser from './parser'
import moment = require("moment");

let TOTAL_DAYS_TO_GET_PRESENCE = 183;
let CURRENT_YEAR_DAYS_TO_GET_PRESENCE = 31;

export function calculate(tripHistory: Parser.TravelHistory, atDate: moment.Moment): boolean {
    let enoughTotalAdjustedDays = tripHistory.adjustedDaysUpTo(atDate) >= TOTAL_DAYS_TO_GET_PRESENCE;
    let enoughDaysInTheLastYear = tripHistory.adjustedDaysInTheLastYearUpTo(atDate) >= CURRENT_YEAR_DAYS_TO_GET_PRESENCE;
    return enoughTotalAdjustedDays && enoughDaysInTheLastYear;
}