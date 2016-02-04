import {connect} from 'react-redux';
import React from 'react';
import url from 'url';
import querystring from 'querystring';
import {updateLocation, loadState, LOAD_STATE} from '../actions/routing';
import {serializeStore, deserializeQueryObj} from './storeSerializer';

export const routerMiddleware = store => next => action => {
  let result = next(action);
  let state = store.getState();

  if (action.type === LOAD_STATE) {
    return result;
  }

  let newUrlObj = parseUrlHash(window.location.hash);
  newUrlObj.query = serializeStore(state.routing.location, state);
  delete newUrlObj.search;

  // NOTE: We only replace state here since these are only for general state
  // changes. By using history.replaceState, the routerListener won't pick up
  // on these changes.
  history.replaceState(null, null, '#' + url.format(newUrlObj));
  return result;
}

class RouterHashListener extends React.Component {
    componentWillMount() {
    window.addEventListener('hashchange', this.hashChangeHandler.bind(this), false);
  }
  componentWillUnmount() {
    // Just doing our duty of cleanup though it's really not necessary
    window.removeEventListener('hashchange', this.hashChangeHandler.bind(this), false);
  }
  hashChangeHandler(e) {
    let oldUrl = parseUrlHash(e.oldURL);
    let newUrl = parseUrlHash(e.newURL);

    if (oldUrl.pathname !== newUrl.pathname) {
      this.props.dispatch(updateLocation(newUrl.pathname));
    }

    if (newUrl.query === null) {
      // Don't disrupt/reset state if left out (e.g. when using top nav links)
      return;
    }

    let newQueryObj = querystring.parse(newUrl.query);
    let deserialized = deserializeQueryObj(newUrl.pathname, newQueryObj)
    this.props.dispatch(loadState(newUrl.pathname, deserialized));
  }
  render() {
    return null;
  }
}

function parseUrlHash(input) {
  let hash = url.parse(input).hash || '';
  return url.parse(hash.substr(1));
}

export let RouterListener = connect(chooseState, dispatch => ({ dispatch }))((RouterHashListener));
function chooseState(state) {
  return {
    routing: state.routing
  };
}