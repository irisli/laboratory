import {combineReducers} from 'redux';
import endpointExplorer from './endpointExplorer';
import transactionBuilder from './transactionBuilder';
import transactionSigner from './transactionSigner';
import network from './network';
import {routeReducer} from 'redux-simple-router'

const rootReducer = combineReducers({
  endpointExplorer,
  transactionBuilder,
  transactionSigner,
  network,
  routing: routeReducer,
});

export default rootReducer;
