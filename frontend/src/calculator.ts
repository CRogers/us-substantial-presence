import * as ParserM from './parser'


export module UsSubPres.Calculator {
    import Parser = ParserM.UsSubPres.Parser;

    export function calculate(tripHistory: Parser.TravelHistory): boolean {
        return tripHistory.trips.length != 0;

    }
}