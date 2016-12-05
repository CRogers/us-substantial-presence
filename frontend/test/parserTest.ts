import 'mocha'
import { expect } from 'chai'

import * as ParserM from '../src/parser'
let Parser = ParserM.UsSubPres.Parser;

module UsSubPres.Tests {
    describe('Parser should', () => {
        it('parse the empty string to no files', () => {
            let travelHistory = Parser.parseTravelHistory('');
            expect(travelHistory).deep.equal({trips: []})
        })
    });
}