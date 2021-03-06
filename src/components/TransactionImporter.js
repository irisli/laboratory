import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import validateTxXdr from '../utilities/validateTxXdr';

// TransactionImporter will call the onImport passed to it's props when the user
// presses the import button and the input is valid

export default class TransactionImporter extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
    };
  }
  updateTextarea(event) {
    this.setState({
      'input': event.target.value
    })
  }
  triggerImport() {
    if (validateTxXdr(this.state.input).result === 'success') {
      this.props.onImport(this.state.input);
    }
  }
  render() {
    let validation, message, submitEnabled;

    validation = validateTxXdr(this.state.input);
    if (validation.result === 'error') {
      message = <p className="TransactionImporter__message__alert">{validation.message}</p>
    } else if (validation.result === 'success') {
      message = <p className="TransactionImporter__message__success">{validation.message}</p>
    }

    submitEnabled = validation.result === 'success';

    return <div className="TransactionImporter">
      <div className="TransactionImporter__input">
        <textarea
          className="TransactionImporter__input__textarea"
          onChange={this.updateTextarea.bind(this)}
          placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
      </div>
      <div className="TransactionImporter__message">
        {message}
      </div>
      <div className="s-buttonList">
        <button className="s-button"
          disabled={!submitEnabled} onClick={this.triggerImport.bind(this)}>
          Import Transaction</button>
      </div>
    </div>
  }
}
TransactionImporter.propTypes = {
  'onImport': React.PropTypes.func.isRequired,
};
