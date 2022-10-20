import { useContext } from 'react';
import { FormattedAmount } from '../../helpers/Strings';
import { localePercentage } from '../../helpers/utils';

import { AppContext } from '../ContextProvider';


const Config = () => {
  const { state } = useContext(AppContext);
  const { poolConfig } = state;
  const { maturity_depth, min_exchange_payout, min_wallet_payout, pplns_fee, solo_fee } = poolConfig;

  return (
    <div>
      <h3>Pool config</h3>
      <div>Min wallet payout: <FormattedAmount amount={min_wallet_payout} divide minimumFractionDigits={0} /></div>
      <div>Min exchange payout: <FormattedAmount amount={min_exchange_payout} divide minimumFractionDigits={0} /></div>
      <div>PPLNS fee: {pplns_fee && localePercentage(1).format(pplns_fee / 100)}</div>
      <div>Solo fee: {solo_fee && localePercentage(1).format(solo_fee / 100)}</div>
      <div>Maturity depth: {maturity_depth}</div>
    </div>
  );
}

export default Config;
