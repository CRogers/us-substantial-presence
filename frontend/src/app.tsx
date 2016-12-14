import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Rx from 'rx'
import * as moment from 'moment'

import * as ParserM from './parser'
import * as CalculatorM from './calculator'
import {Optional} from "./optional";

module UsSubPres.UI {
    import Parser = ParserM.UsSubPres.Parser;
    import Calculator = CalculatorM.UsSubPres.Calculator;

    type JsxStream = Rx.Observable<JSX.Element>;

    let container = document.createElement('div');
    document.body.appendChild(container);

    let travelHistoryEvents: Rx.Subject<React.FormEvent<HTMLTextAreaElement>> = new Rx.Subject<React.FormEvent<HTMLTextAreaElement>>();
    travelHistoryEvents.subscribe(value => console.log(value));

    let travelHistoryText: Rx.Observable<string> = travelHistoryEvents.map(ev => (ev.target as HTMLTextAreaElement).value).startWith('');

    let travelHistoryUI: JSX.Element = <textarea onChange={ev => travelHistoryEvents.onNext(ev)} className="travel-history"></textarea>;

    let testResult: Rx.Observable<Optional<boolean>> = travelHistoryText.map(str => {
        let travelHistoryOrError = Parser.parseTravelHistory(str);
        return travelHistoryOrError.map(travelHistory => Calculator.calculate(travelHistory, moment()));
    });

    let testResultText: Rx.Observable<string> = testResult.map(result => {
        return result
            .map(hasPresence => `You do${hasPresence ? '' : ' not'} have Substantial Presence`)
            .orElse("There was an error parsing your travel history");
    });

    let testResultUI: JsxStream = testResultText.map(text => <div className="test-result">{text}</div>);

    let wholeUI: JsxStream = testResultUI.map((testResultElement) =>
        <div>
            {travelHistoryUI}
            {testResultElement}
        </div>
    );

    wholeUI.subscribeOnNext(element => {
        ReactDOM.render(element, container)
    });
}