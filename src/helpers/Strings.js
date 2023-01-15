import { formatDistanceToNowStrict, intervalToDuration } from 'date-fns';
import { memo, useContext } from 'react';
import { AppContext } from '../components/ContextProvider';
import { formattedAmount, localeDecimal, localePercentage, zeroPad } from './utils';


export const AverageHashRate = props => {
  const { data, timeWindow = 'day' } = props;
  const filteredData = data?.filter(i => i.ts > Date.now() - (timeWindow === 'day' ? 86400000 : 3600000)).map(i => i.hs) || [];
  return (
    <HashRate hr={filteredData.reduce((a, b) => a + b, 0) / filteredData.length || 0}/>
  )
}

export const BlockTime = props => {
  const { difficulty, hashRate } = props;
  const duration = (difficulty && hashRate) ? intervalToDuration({ start: 0, end: (difficulty / hashRate) * 1000 }) : undefined;
  return (
    <>
      {duration && (`${duration.days > 0 ? `${duration.days}:` : ''}${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`)}
    </>
  )
}

export const SYFRExplorerLink = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  const {
    hash,
    shortHash = false,
    type = 'transaction',
  } = props;

  const Link = props =>
    <a
      href={`${appSettings.explorerURL}/index.html?hash=${hash}#blockchain_${type}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>

  return (
    <>
      {hash
        ? shortHash
          ? <span className="truncate"><Link>{hash}</Link></span>
          : <Link>{hash}</Link>
        : ''
      }
    </>
  )
}

export const CurrentEffort = props => {
  const { difficulty, roundHashes } = props;
  return (
    <>
      {localePercentage(1).format(roundHashes / difficulty)}
    </>
  )
}

export const FormattedAmount = props => {
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  let {
    amount,
    currency = 'SYFR',
    divide = false,
    maximumFractionDigits = appSettings.coinDecimals,
    minimumFractionDigits = appSettings.coinDecimals,
    showCurrency = true,
    useSymbol = false,
    useDecimals = true,
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

  const formatOptions = {
    minimumFractionDigits: (maximumFractionDigits < minimumFractionDigits) ? maximumFractionDigits : minimumFractionDigits,
    maximumFractionDigits,
  };

  return (
    <>
      {amount
        ? formattedAmount({
            amount: divide ? amount / Math.pow(10, appSettings.coinDecimals) : amount,
            currency,
            formatOptions,
            showCurrency,
            useSymbol,
          })
        : ''
      }
    </>
  )
}

export const HashRate = props => {
  const { hr, unit = 'H/s' } = props;
  if (!hr && hr !== 0) return;
  if (hr > 1e9) return (<>{(localeDecimal().format(hr / 1e9))} G{unit}</>);
  if (hr > 1e6) return (<>{(localeDecimal().format(hr / 1e6))} M{unit}</>);
  if (hr > 1e3) return (<>{(localeDecimal().format(hr / 1e3))} K{unit}</>);
  return (<>{(localeDecimal().format(hr))} {unit}</>);
}

export const NetworkPercentage = props => {
  const { difficulty, hashRate } = props;
  const { state } = useContext(AppContext);
  const { appSettings } = state;
  return (
    <>
      {difficulty && hashRate
        ? localePercentage(1).format(hashRate / Math.floor(difficulty / appSettings.difficultyTarget))
        : ''
      }
    </>
  )
}

export const PPLNSWindow = props => {
  const { difficulty, hashRate } = props;
  const duration = (difficulty && hashRate) ? intervalToDuration({ start: 0, end: (difficulty * 2 / hashRate) * 1000 }) : undefined;
  return (
    <>
      {duration && `${duration.days > 0 ? `${duration.days}:` : ''}${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`}
    </>
  )
}

export const TimeAgo = memo(props => {
  const { time } = props;
  return (
    <>
      {time
        ? formatDistanceToNowStrict(new Date(time * 1000), { addSuffix: true })
        : ''
      }
    </>
  )
})
