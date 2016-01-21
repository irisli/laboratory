require("./styles/main.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';

import {syncHistory} from 'redux-simple-router';
import {Router, Route, useRouterHistory} from 'react-router';
import {createHashHistory} from 'history'

import rootReducer from './reducers/root';
import logging from "./middleware/logging";

import LaboratoryChrome from './components/LaboratoryChrome';
import EndpointExplorer from './components/EndpointExplorer';
import TransactionBuilder from './components/TransactionBuilder';
import TransactionSigner from './components/TransactionSigner';

document.write('<div id="app"></div>');

const history = useRouterHistory(createHashHistory)({
  queryKey: false,
})

let createStoreWithMiddleware = applyMiddleware(
  thunk,
  syncHistory(history),
  logging,
)(createStore);

let store = createStoreWithMiddleware(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={LaboratoryChrome}>
        <Route path="endpoints" component={EndpointExplorer} />
        <Route path="txbuilder" component={TransactionBuilder} />
        <Route path="txsigner" component={TransactionSigner} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
