import '@blueprintjs/core/dist/blueprint.css'
import '@blueprintjs/datetime/dist/blueprint-datetime.css'
import {DatePicker} from '@blueprintjs/datetime'
import './app.less'

import * as Plottable from 'plottable'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Rx from 'rx'
import * as moment from 'moment'
import * as _ from 'lodash'

import * as Parser from './parser'
import * as Calculator from './calculator'
import {Optional} from "./optional";

function renderTravelHistoryTable(travelHistory: Parser.TravelHistory, date: moment.Moment) {
    let rows = _.map(travelHistory.trips, trip =>
        <tr>
            <td>{trip.entry.port} ({trip.entry.time.toISOString()})</td>
            <td>{trip.exit.port} ({trip.exit.time.toISOString()})</td>
            <td>{trip.adjustedDaysUpTo(date)}</td>
            <td>{trip.adjustedDaysInTheLastYearUpTo(date)}</td>
        </tr>
    );
    return <div>
        <table className="pt-table pt-striped pt-bordered pt-interactive">
            <thead>
            <tr>
                <td>Entry</td>
                <td>Exit</td>
                <td>Adjusted Days</td>
                <td>Days this year</td>
            </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
        <div>
            Total adjusted days: {travelHistory.adjustedDaysUpTo(date)}
        </div>
        <div>
            Total days this year: {travelHistory.adjustedDaysInTheLastYearUpTo(date)}
        </div>
    </div>
}


module UsSubPres.UI {
    type JsxStream = Rx.Observable<JSX.Element>;

    let container = document.createElement('div');
    document.body.appendChild(container);

    let travelHistoryEvents: Rx.Subject<React.FormEvent<HTMLTextAreaElement>> = new Rx.Subject<React.FormEvent<HTMLTextAreaElement>>();
    travelHistoryEvents.subscribe(value => console.log(value));

    // let travelHistoryText: Rx.Observable<string> = Rx.Observable.of(defaultTravelHistory);
    let travelHistoryText: Rx.Observable<string> = travelHistoryEvents.map(ev => (ev.target as HTMLTextAreaElement).value).startWith('');

    let travelHistoryUI: JSX.Element = <textarea onChange={ev => travelHistoryEvents.onNext(ev)} className="travel-history"></textarea>;

    let parsedTravelHistory = travelHistoryText.map(Parser.parseTravelHistory);

    let testResult: Rx.Observable<Optional<boolean>> = parsedTravelHistory.map(travelHistoryOrError => {
        return travelHistoryOrError.map(travelHistory => Calculator.calculate(travelHistory, moment()));
    });

    let testResultText: Rx.Observable<string> = testResult.map(result => {
        return result
            .map(hasPresence => `You do${hasPresence ? '' : ' not'} have Substantial Presence`)
            .orElse("There was an error parsing your travel history");
    });

    let testResultUI: JsxStream = testResultText.map(text => <div className="test-result">{text}</div>);

    let selectedDateSubject: Rx.Subject<Date> = new Rx.Subject<Date>();

    let selectedDate = selectedDateSubject.startWith(new Date());

    let detailsTable: Rx.Observable<Optional<JSX.Element>> =
        Rx.Observable.combineLatest(parsedTravelHistory, selectedDate, (travelHistoryOrError, date) => {
            console.log(date);
            return travelHistoryOrError.map(travelHistory => renderTravelHistoryTable(travelHistory, moment(date)));
        });

    let detailsUI: JsxStream = detailsTable.map(detailsTableOrError => detailsTableOrError.orElse(<div>Cannot render table</div>));

    let wholeUI: JsxStream = Rx.Observable.combineLatest(testResultUI, detailsUI, (testResultElement, detailsElement) =>
        <div>
            {travelHistoryUI}
            {testResultElement}
            <h2>Details</h2>
            {detailsElement}
            <DatePicker defaultValue={new Date()} onChange={(date, blah) => selectedDateSubject.onNext(date)}></DatePicker>
        </div>
    );

    wholeUI.subscribeOnNext(element => {
        ReactDOM.render(element, container)
    });
}