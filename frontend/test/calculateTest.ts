import 'mocha'
import { expect } from 'chai'

import * as ParserM from '../src/parser'
import * as CalculatorM from '../src/calculator'

module UsSubPres.Tests {
    import TravelHistory = ParserM.UsSubPres.Parser.TravelHistory;
    import Calculator = CalculatorM.UsSubPres.Calculator;

    let JFK = 'JFK - JOHN F KENNEDY INTL';

    describe('Calculator should', () => {
        it('calculate the travel history with no trips to no presence', () => {
            let travelHistory: TravelHistory = { trips: [] }
            expect(Calculator.calculate(travelHistory)).to.equal(false)
        });

        it('calculate a single trip which stays for two years to have presence', () => {
            let travelHistory: TravelHistory = {
                trips: [
                    {
                        entry: {
                            port: JFK,
                            time: new Date('2014-09-16')
                        },
                        exit: {
                            port: JFK,
                            time: new Date('2016-09-16')
                        }
                    }

                ]
            };

            expect(Calculator.calculate(travelHistory)).to.equal(true);
        })
    });
}