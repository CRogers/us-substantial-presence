import * as _ from 'lodash'

export module UsSubPres.Parser {
    export interface TravelHistory {
        trips: Trip[];
    }

    export interface Trip {
        entry: PortVisit;
        exit: PortVisit;
    }

    export interface PortVisit {
        port: Port;
        time: Date;
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

        return {
            entry: parsePortVisit(entry),
            exit: parsePortVisit(exit)
        }
    }

    function parsePortVisit(portVisit: string[]): PortVisit {
        return {
            time: new Date(portVisit[0]),
            port: portVisit[1]
        }
    }
}