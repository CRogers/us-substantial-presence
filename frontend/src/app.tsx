import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Rx from 'rx'

module UsSubPres {

    let b = Rx.Observable.just(3);

    ReactDOM.render(
        <div>Hi</div>,
        document.getElementsByTagName('body')[0]
    );
}