import React from 'react';
import _ from 'lodash';

// @param {object|array} props.items An object whose keys are the onUpdate values and
//   object values are labels the user will see.
// {
//   'valueToBeStored': 'Human Readable Label',
// }
//
// For array values, the UI label and onUpdate values are the same.
// The benefits array bring is that it can contain duplicate items.
export default function SelectPicker(props) {
  let {value, onUpdate, items} = props;

  let optionsList;
  if (_.isArray(items)) {
    optionsList = _.map(items, (value, index) => {
      return <option key={index} value={value}>{value}</option>
    })
  } else {
    optionsList = _.map(items, (value, index) => {
      return <option key={index} value={index}>{value}</option>
    })
  }
  return <select
    className="picker picker--select"
    value={value}
    onChange={(event) => onUpdate(event.target.value)}
    >
    <option value=""></option>
    {optionsList}
  </select>;
}
