import 'mocha'
import { expect } from 'chai'

import * as moment from 'moment'

import * as Parser from '../src/parser'
import * as Calculator from '../src/calculator'

describe('Calculator should', () => {
    let someDate = moment('2016-07-21');

    function travelHistoryWithAdjustedDays(total: number, inLastYear: number): Parser.TravelHistory {
        return {
            trips: [],
            adjustedDaysUpTo: (date) => {
                expect(date).to.deep.equal(someDate);
                return total;
            },
            adjustedDaysInTheLastYearUpTo: (date) => {
                expect(date).to.deep.equal(someDate);
                return inLastYear;
            }
        }
    }

    it('calculate you do not have substantial presence with 10 days in the last year and in total', () => {
        let hasPresence = Calculator.calculate(travelHistoryWithAdjustedDays(10, 10), someDate);
        expect(hasPresence).to.be.false;
    });
    it('calculate you have substantial presence with 183 days in the last year', () => {
        let hasPresence = Calculator.calculate(travelHistoryWithAdjustedDays(183, 183), someDate);
        expect(hasPresence).to.be.true;
    });
    it('calculate you do not have substantial presence with 200 days in total but only 30 in the last year', () => {
        let hasPresence = Calculator.calculate(travelHistoryWithAdjustedDays(183, 30), someDate);
        expect(hasPresence).to.be.false;
    })
});