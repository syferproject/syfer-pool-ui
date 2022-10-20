import { useContext } from 'react';

import { AppContext } from '../components/ContextProvider';


export const localeDecimal = new Intl.NumberFormat(undefined, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const localePercentage = new Intl.NumberFormat(undefined, { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const averageHashRate = (data, timeWindow = 'day') => {
  const filteredData = data?.filter(i => i.ts > Date.now() - (timeWindow === 'day' ? 86400000 : 3600000)).map(i => i.hs) || [];
  return toHashRate(filteredData.reduce((a, b) => a + b, 0) / filteredData.length || 0);
}

export const CCXExplorerLink = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const {
    hash,
    type = 'transaction',
    shortHash = false,
  } = props;

  return (
    <a
      href={`${appSettings.explorerURL}/index.html?hash=${hash}#blockchain_${type}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {shortHash ? `${hash?.slice(0, 8)}...` : hash}
    </a>
  );
};

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
  let {
    amount,
    currency = 'CCX',
    divide = false,
    showCurrency = true,
    useSymbol = false,
    useDecimals = true,
    maximumFractionDigits = appSettings.coinDecimals,
    minimumFractionDigits = appSettings.coinDecimals,
  } = props;

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
        break;
    }
  }

  const formatOptions = { minimumFractionDigits, maximumFractionDigits };

  return (
    <>
      {formattedStringAmount({
        amount: divide ? amount / Math.pow(10, appSettings.coinDecimals) : amount,
        currency,
        formatOptions,
        showCurrency,
        useSymbol,
      })}
    </>
  );
};

export const toHashRate = (nr, hr = 'H/s') => {
  if (nr > 1e9) return `${localeDecimal.format(nr / 1e9)} G${hr}`;
  if (nr > 1e6) return `${localeDecimal.format(nr / 1e6)} M${hr}`;
  if (nr > 1e3) return `${localeDecimal.format(nr / 1e3)} K${hr}`;
  return `${(localeDecimal.format(nr || 0))} ${hr}`;
};
