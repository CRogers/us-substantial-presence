import * as ParserM from './parser'
import moment = require("moment");


export module UsSubPres.Calculator {
    import Parser = ParserM.UsSubPres.Parser;

    let NUMBER_OF_DAYS_ALLOWED_IN_US = 183;

    export function calculate(tripHistory: Parser.TravelHistory, atDate: moment.Moment): boolean {
        if (tripHistory.trips.length == 0) {
            return false;
        }
        let firstTrip = tripHistory.trips[0];
        return firstTrip.adjustedDaysAt(atDate) >= NUMBER_OF_DAYS_ALLOWED_IN_US;
    }
}