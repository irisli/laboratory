import {connect} from 'react-redux';
import React from 'react';
import url from 'url';
import querystring from 'querystring';
import {updateLocation, loadState, LOAD_STATE, UPDATE_LOCATION} from '../actions/routing';
import {serializeStore, deserializeQueryObj} from './storeSerializer';

// One way data flow for routerMiddleware: redux -> url
export const routerMiddleware = store => next => action => {
  let result = next(action);
  let state = store.getState();

  // We will still process on UPDATE_LOCATION because it doesn't affect state
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

// One way data flow for RouterListener: url change -> redux
class RouterHashListener extends React.Component {
    componentWillMount() {
    window.addEventListener('hashchange', this.hashChangeHandler.bind(this), false);
  }
  componentWillUnmount() {
    // Just doing our duty of cleanup though it's really not necessary
    window.removeEventListener('hashchange', this.hashChangeHandler.bind(this), false);
  }
  componentDidMount() {
    this.changeProcessor(parseUrlHash(window.location.hash), {}, true)
  }
  hashChangeHandler(e) {
    this.changeProcessor(parseUrlHash(e.newURL), parseUrlHash(e.oldURL))
  }
  // @param {UrlObj|object} newUrl - URL object (of the hash) from node `url`
  // @param {UrlObj|object} oldUrl - URL object (of the hash) from node `url`. Can be empty object
  changeProcessor(newUrl, oldUrl, firstLoad) {
    let queryChanged = oldUrl.query !== newUrl.query;
    let shouldLoadState = firstLoad || (queryChanged && newUrl.query !== null);

    if (shouldLoadState) {
      let newQueryObj = querystring.parse(newUrl.query);
      let deserialized = deserializeQueryObj(newUrl.pathname, newQueryObj)
      this.props.dispatch(loadState(newUrl.pathname, deserialized));
      return;
    } else {
      this.props.dispatch(updateLocation(newUrl.pathname));
    }
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
