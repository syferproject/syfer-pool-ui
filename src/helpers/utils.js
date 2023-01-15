export const localeDecimal =(maximumFractionDigits = 2, minimumFractionDigits = 2) =>
  new Intl.NumberFormat(
    undefined,
    {
      style: 'decimal',
      minimumFractionDigits: (maximumFractionDigits < minimumFractionDigits) ? maximumFractionDigits : minimumFractionDigits,
      maximumFractionDigits,
    });
export const localePercentage = (maximumFractionDigits = 2, minimumFractionDigits = 2) =>
  new Intl.NumberFormat(
    undefined,
    {
      style: 'percent',
      minimumFractionDigits: (maximumFractionDigits < minimumFractionDigits) ? maximumFractionDigits : minimumFractionDigits,
      maximumFractionDigits,
    });

export const formattedAmount = ({
  amount,
  currency = 'SYFR',
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
}

export const zeroPad = (num, length = 2, padString = '0') => String(num).padStart(length, padString);
