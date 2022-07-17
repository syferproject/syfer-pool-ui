import React, { useContext } from 'react';

import { AppContext } from '../components/ContextProvider';


export const formattedStringAmount = ({
  amount,
  currency = 'CCX',
  formatOptions = { minimumFractionDigits: 5, maximumFractionDigits: 5 },
  showCurrency,
  useSymbol,
}) => {
  let c = '';
  const symbols = { USD: '$', BTC: 'B' };
  if (showCurrency || useSymbol) {
    c = useSymbol
      ? symbols[currency]
      : currency;
  }
  return `${useSymbol ? c : ''} ${parseFloat(amount).toLocaleString(undefined, formatOptions)} ${!useSymbol ? c : ''}`;
};

export const FormattedAmount = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const { amount, currency = 'CCX', showCurrency = true, useSymbol = false, useDecimals = true } = props;

  let minimumFractionDigits = 0;
  let maximumFractionDigits = 0;

  if (useDecimals) {
    switch (currency) {
      case 'BTC':
        minimumFractionDigits = 8;
        maximumFractionDigits = 8;
        break;
      case 'USD':
        minimumFractionDigits = 2;
        maximumFractionDigits = 2;
        break;
      default:
        minimumFractionDigits = appSettings.coinDecimals;
        maximumFractionDigits = appSettings.coinDecimals;
        break;
    }
  }

  const formatOptions = { minimumFractionDigits, maximumFractionDigits };

  return (
    <>
      {formattedStringAmount({
        amount,
        currency,
        formatOptions,
        showCurrency,
        useSymbol,
      })}
    </>
  );
};
