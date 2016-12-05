import 'mocha'
import { expect } from 'chai'

import * as moment from 'moment'

import * as ParserM from '../src/parser'
import * as CalculatorM from '../src/calculator'

module UsSubPres.Tests {
    import TravelHistory = ParserM.UsSubPres.Parser.TravelHistory;
    import Calculator = CalculatorM.UsSubPres.Calculator;

    let JFK = 'JFK - JOHN F KENNEDY INTL';

    function singleTripFromTo(entryDate: string, exitDate: string) {
        return {
            trips: [
                {
                    entry: {
                        port: JFK,
                        time: moment(entryDate)
                    },
                    exit: {
                        port: JFK,
                        time: moment(exitDate)
                    }
                }

            ]
        };
    }

    describe('Calculator should', () => {
        it('calculate the travel history with no trips to no presence', () => {
            let travelHistory: TravelHistory = { trips: [] };
            expect(Calculator.calculate(travelHistory)).to.equal(false)
        });

        it('calculate a single trip which stays for two years to have presence', () => {
            let travelHistory: TravelHistory = singleTripFromTo(
                '2014-09-16',
                '2016-09-16'
            );

            expect(Calculator.calculate(travelHistory)).to.equal(true);
        });

        it('calculate a single trip which stays for two days to not have presence', () => {
            let travelHistory: TravelHistory = singleTripFromTo(
                '2016-09-14',
                '2016-09-16'
            );

            expect(Calculator.calculate(travelHistory)).to.equal(false);
        })
    });
}