export module UsSubPres.Parser {
    export interface TravelHistory {
        trips: Trip[];
    }

    export interface Trip {
        enter: PortVisit;
        exit: PortVisit;
    }

    export interface PortVisit {
        port: Port;
        time: Date;
    }

    export type Port = string;

    export function parseTravelHistory(blah: string): TravelHistory {
        return {
            trips: []
        }
    }
}