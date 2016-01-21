import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import NetworkPicker from './NetworkPicker';
import {routeActions} from 'redux-simple-router';

let LaboratoryChrome = function(props) {
  let {routes, dispatch, children} = props;
  let tabItem = (name, key) => {
    let currentPage = (typeof routes[1] === 'undefined') ? '' : routes[1].path;
    return <a
      onClick={() => dispatch(routeActions.push('/' + key))}
      className={classNames(
        'buttonList__item s-button s-button__min',
        {'is-active': currentPage === key})}
      key={key}>
      {name}
    </a>
  }

  return <div>
    <div className="so-back">
      <div className="so-chunk">
        <div className="so-siteHeader LaboratoryChrome__header">
          <span className="so-logo">
            <a href="https://www.stellar.org/" className="so-logo__main">Stellar</a>
            <span className="so-logo__separator"> </span>
            <a href="https://www.stellar.org/laboratory/" className="so-logo__subSite">laboratory</a>
          </span>
          <NetworkPicker />
        </div>
      </div>
    </div>
    <div className="so-back LaboratoryChrome__siteNavBack">
      <div className="so-chunk">
        <nav className="s-buttonList">
          {tabItem('EndpointExplorer', 'endpoints')}
          {tabItem('TransactionBuilder', 'txbuilder')}
          {tabItem('TransactionSigner', 'txsigner')}
        </nav>
      </div>
    </div>
    {children}
  </div>;
};

export default connect(chooseState)(LaboratoryChrome);
function chooseState(state) {
  return {};
}
