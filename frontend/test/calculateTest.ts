import 'mocha'
import { expect } from 'chai'

import * as moment from 'moment'

import * as ParserM from '../src/parser'
import * as CalculatorM from '../src/calculator'

module UsSubPres.Tests {
    import TravelHistory = ParserM.UsSubPres.Parser.TravelHistory;
    import Trip = ParserM.UsSubPres.Parser.Trip;
    import Calculator = CalculatorM.UsSubPres.Calculator;

    let JFK = 'JFK - JOHN F KENNEDY INTL';

    function singleTripFromTo(entryDate: string, exitDate: string) {
        return {
            trips: [
                new Trip(
                    {
                        port: JFK,
                        time: moment(entryDate)
                    },
                    {
                        port: JFK,
                        time: moment(exitDate)
                    }
                )

            ]
        };
    }

    describe('Calculator should', () => {
        it('calculate the travel history with no trips to no presence', () => {
            let travelHistory: TravelHistory = { trips: [] };
            expect(Calculator.calculate(travelHistory, moment('2016-09-16'))).to.equal(false)
        });

        it('calculate a single trip which stays for two years coming back the day after the end to have presence', () => {
            let travelHistory: TravelHistory = singleTripFromTo(
                '2014-09-16',
                '2016-09-16'
            );

            expect(Calculator.calculate(travelHistory, moment('2016-09-17'))).to.equal(true);
        });

        it('calculate a single trip which stays for two days measured the day after the end to not have presence', () => {
            let travelHistory: TravelHistory = singleTripFromTo(
                '2016-09-14',
                '2016-09-16'
            );

            expect(Calculator.calculate(travelHistory, moment('2016-09-17'))).to.equal(false);
        })
    });
}