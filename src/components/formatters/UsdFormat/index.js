import React from 'react';
import { Text } from 'react-native';
import NumberFormat from 'react-number-format';

function UsdFormat({ value, style }) {
  return (
    <NumberFormat
      value={value}
      displayType="text"
      thousandSeparator=","
      fixedDecimalScale
      decimalScale={2}
      prefix="$"
      renderText={textValue => <Text style={style}>{textValue}</Text>}
    />
  );
}

export default UsdFormat;
