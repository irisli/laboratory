import PickerGenerator from './PickerGenerator';

export default PickerGenerator({
  pickerName: 'TimeBounds',
  fields: [
    {
      type: 'text',
      name: 'min',
      placeholder: 'Minimum time. Example: 1452045889',
      validator: timestampValidator,
    },
    {
      type: 'text',
      name: 'max',
      placeholder: 'Maximum time. Example: 1452132289',
      validator: (value, fields) => {
        let maxValidation = timestampValidator(value);
        if (maxValidation !== null) {
          return maxValidation;
        }

        let min = Number(fields.min.value)
        let max = Number(value);
        let minValidation = timestampValidator(fields.min.value);
        if (minValidation === null && max < min) {
          return 'Maximum time bounds must be greater than the minimum time bounds';
        }

        return null;
      }
    },
  ],
});

function timestampValidator(value) {
  return (!value.match(/^[0-9]*$/g) || value < 0) ? 'Invalid UNIX timestamp. It must be a positive integer.' : null;
}
