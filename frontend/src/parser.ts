import * as _ from 'lodash'
import * as moment from 'moment'
import 'moment-range'

export module UsSubPres.Parser {
    export interface TravelHistory {
        trips: Trip[];
    }

    export type AdjustedDays = number;

    export class Trip {
        constructor(public entry: PortVisit, public exit: PortVisit) {}

        public timeInUs(): moment.Range {
            return moment.range(this.entry.time, this.exit.time)
        }

        public adjustedDaysAt(time: moment.Moment): AdjustedDays {
            return rangeToDuration(this.timeInUs()).asDays()
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

    export function parseTravelHistory(str: string): TravelHistory {
        if (str.length == 0) {
            return { trips: [] }
        }

        let nonEmptyLine = (line: string) => !/^\s*$/.test(line);

        let trimmedLines = _(str)
            .split('\n')
            .filter(nonEmptyLine)
            .map(line => line.trim())
            .value();

        let trip = _.drop(trimmedLines, 1);

        return {
            trips: [parseTrip(trip)]
        }
    }

    function parseTrip(trip: string[]): Trip {
        let entry = _.take(trip, 2);
        let exit = _.drop(trip, 2);

        return new Trip(
            parsePortVisit(entry),
            parsePortVisit(exit)
        );
    }

    function parsePortVisit(portVisit: string[]): PortVisit {
        return {
            time: moment(portVisit[0]),
            port: portVisit[1]
        }
    }
}