import 'mocha'
import { expect } from 'chai'

import * as _ from 'lodash'
import * as moment from 'moment';

import * as ParserM from '../src/parser'
let Parser = ParserM.UsSubPres.Parser;

module UsSubPres.Tests {
    describe('Parser should', () => {
        it('parse the empty string to no trips', () => {
            let travelHistory = Parser.parseTravelHistory('');
            expect(travelHistory).deep.equal({trips: []})
        });

        it('parse a single trip', () => {
            let rawText = stripIndent(`
                1\t
                2016-09-12T11:55:54.0-04:00
                JFK - JOHN F KENNEDY INTL\t
                2016-09-16T00:00:00.0-04:00
                NYC - NEW YORK CITY, NY
            `);

            expect(Parser.parseTravelHistory(rawText)).to.deep.equal({
                trips: [
                    new Parser.Trip(
                        {
                            port: 'JFK - JOHN F KENNEDY INTL',
                            time: moment('2016-09-12T11:55:54.0-04:00')
                        },
                        {
                            port: 'NYC - NEW YORK CITY, NY',
                            time: moment('2016-09-16T00:00:00.0-04:00')
                        }
                    )
                ]
            })
        })
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
}