import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Rx from 'rx'

module UsSubPres.UI {
    type JsxStream = Rx.Observable<JSX.Element>;

    let container = document.createElement('div');
    document.body.appendChild(container);

    let travelHistoryEvents: Rx.Subject<React.FormEvent<HTMLTextAreaElement>> = new Rx.Subject<React.FormEvent<HTMLTextAreaElement>>();
    let travelHistoryText: Rx.Observable<string> = travelHistoryEvents.map(ev => (ev.target as HTMLTextAreaElement).value).startWith('');

    let travelHistoryUI: JSX.Element = <textarea onChange={ev => travelHistoryEvents.onNext(ev)} className="travel-history"></textarea>;

    let testResult: Rx.Observable<boolean> = travelHistoryText.map(str => str.length > 0);
    let testResultUI: JsxStream = testResult.map(b => <div className="test-result">You do{b ? '' : ' not'} have Substantial Presence</div>)

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