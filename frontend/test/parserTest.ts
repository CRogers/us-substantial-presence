import 'mocha'
import { expect } from 'chai'

import * as _ from 'lodash'
import * as moment from 'moment';

import * as Parser from '../src/parser'

import TravelHistory = Parser.DefaultTravelHistory;
import DefaultTrip = Parser.DefaultTrip;

let JFK = 'JFK - JOHN F KENNEDY INTL';
let NYC = 'NYC - NEW YORK CITY, NY';

describe('Parser should', () => {
    it('parse the empty string to optional empty', () => {
        let travelHistory = Parser.parseTravelHistory('');
        expect(travelHistory.isEmpty()).to.be.true
    });

    it('parse a single trip', () => {
        let rawText = stripIndent(`
            1\t
            2016-09-12T11:55:54.0-04:00
            JFK - JOHN F KENNEDY INTL\t
            2016-09-16T00:00:00.0-04:00
            NYC - NEW YORK CITY, NY
        `);

        expect(Parser.parseTravelHistory(rawText).get()).to.deep.equal(
            new TravelHistory([
                new DefaultTrip(
                    {
                        port: JFK,
                        time: moment('2016-09-12')
                    },
                    {
                        port: NYC,
                        time: moment('2016-09-16')
                    }
                )
            ])
        );
    });
    it('parse two trips', () => {
        let rawText = stripIndent(`
            1\t
            2016-09-12T11:55:54.0-04:00
            JFK - JOHN F KENNEDY INTL\t
            2016-09-16T00:00:00.0-04:00
            NYC - NEW YORK CITY, NY
            
            2\t
            2015-05-05T11:55:54.0-04:00
            JFK - JOHN F KENNEDY INTL\t
            2015-05-10T00:00:00.0-04:00
            NYC - NEW YORK CITY, NY
        `);

        expect(Parser.parseTravelHistory(rawText).get()).to.deep.equal(
            new TravelHistory([
                new DefaultTrip(
                    {
                        port: JFK,
                        time: moment('2016-09-12')
                    },
                    {
                        port: NYC,
                        time: moment('2016-09-16')
                    }
                ),
                new DefaultTrip(
                    {
                        port: JFK,
                        time: moment('2015-05-05')
                    },
                    {
                        port: NYC,
                        time: moment('2015-05-10')
                    }
                )
            ])
        );
    });
});

describe('DefaultTrip should', () => {
    it('gives days:adjustedDays 1:1 within the last year', () => {
        let trip = new Parser.DefaultTrip(
            {port: JFK, time: moment('2016-09-10')},
            {port: JFK, time: moment('2016-09-15')}
        );

        expect(trip.adjustedDaysUpTo(moment('2016-09-17'))).to.equal(6);
    });

    it('gives days:adjustedDays 3:1 if all in 1-2 years ago', () => {
        let trip = new Parser.DefaultTrip(
            {port: JFK, time: moment('2015-03-10')},
            {port: JFK, time: moment('2015-03-15')}
        );

        expect(trip.adjustedDaysUpTo(moment('2016-09-17'))).to.equal(2);
    });

    it('gives days:adjustedDays 6:1 if all in 2-3 years ago', () => {
        let trip = new Parser.DefaultTrip(
            {port: JFK, time: moment('2014-11-01')},
            {port: JFK, time: moment('2014-11-12')}
        );

        expect(trip.adjustedDaysUpTo(moment('2016-09-17'))).to.equal(2);
    });

    it('gives only counts days in the current year up to the given date', () => {
        let trip = new Parser.DefaultTrip(
            {port: JFK, time: moment('2016-11-10')},
            {port: JFK, time: moment('2016-11-15')}
        );

        expect(trip.adjustedDaysUpTo(moment('2016-11-12'))).to.equal(2);
    });
});

describe('DefaultTravelHistory should', () => {
    let someDate = moment('2016-11-11');

    function aTripWithAdjustedDays(total: number, inLastYear: number): Parser.Trip {
        return {
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

    it('with one trip with 56 adjusted days (44 in the last year) should show exactly that', () => {
        let travelHistory = new Parser.DefaultTravelHistory([
            aTripWithAdjustedDays(56, 44)
        ]);

        expect(travelHistory.adjustedDaysUpTo(someDate)).to.equal(56);
        expect(travelHistory.adjustedDaysInTheLastYearUpTo(someDate)).to.equal(44);
    });

    it('with two trips it should sum the total and last year adjusted days', () => {
        let travelHistory = new Parser.DefaultTravelHistory([
            aTripWithAdjustedDays(2, 3),
            aTripWithAdjustedDays(10, 20)
        ]);

        expect(travelHistory.adjustedDaysUpTo(someDate)).to.equal(12);
        expect(travelHistory.adjustedDaysInTheLastYearUpTo(someDate)).to.equal(23);
    });
});


function stripIndent(rawText: string) {
    let lines = rawText.split('\n');
    let minIndent: number = _(lines)
        .filter(line => line.length > 0 && !(/^\s+$/.test(line)))
        .map(line => line.length - line.replace(/^\s+/, '').length)
        .reduce((a, b) => Math.min(a, b), Number.MAX_VALUE);
    let trimmedLines = _(lines)
        .map(line => line.substring(minIndent))
        .value();
    return trimmedLines.join('\n');
}
