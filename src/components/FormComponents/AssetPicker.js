import React from 'react';
import _ from 'lodash';
import RadioButtonPicker from './RadioButtonPicker';
import PubKeyPicker from './PubKeyPicker';
import PickerError from './PickerError';

// Value is a string containing the currently selected id (or undefined)
export default function AssetPicker(props) {
  let {value, onUpdate} = props;

  value = _.assign({
    type: '',
    code: '',
    issuer: '',
  }, value);

  let codePicker, codePickerError, inputPicker;
  if (value.type === 'alphanum4' || value.type === 'alphanum12') {
    codePicker = <input type="text"
      value={value.code}
      onChange={(event) => onUpdate(_.assign({}, props.value, {
        code: event.target.value,
      }))}
      placeholder="Asset Code"
      className="picker picker--textInput" />
    codePickerError = <PickerError message={codeValidator(value)} />
    inputPicker = <PubKeyPicker
      value={value.issuer}
      onUpdate={(issuer) => onUpdate(_.assign({}, props.value, {
        issuer: issuer,
      }))}
      placeholder="Issuer Account ID"
      />
  }

  let assetButtons = {
    'native': 'native',
    'alphanum4': 'Alphanumeric 4',
    'alphanum12': 'Alphanumeric 12',
  };

  if (props.disableNative) {
    delete assetButtons.native;
  }

  return <div>
    <RadioButtonPicker
      value={value.type}
      onUpdate={(typeValue) => onUpdate(_.assign({}, props.value, {
        type: typeValue,
      }))}
      items={assetButtons}
      />
    {codePicker}
    {codePickerError}
    {inputPicker}
  </div>
}

function codeValidator(value) {
  let minLength, maxLength;
  if (value.type === 'alphanum4') {
    minLength = 1;
    maxLength = 4;
  } else if (value.type === 'alphanum12') {
    minLength = 5;
    maxLength = 12;
  } else {
    return;
  }

  let code = value.code || '';

  if (code && !code.match(/^[a-zA-Z0-9]+$/g)) {
    return 'Asset code must consist of only letters and numbers.';
  } else if (code.length < minLength || code.length > maxLength) {
    return `Asset code must be between ${minLength} and ${maxLength} characters long.`;
  }
}
