import { useContext } from 'react';
import { FormattedAmount } from '../../helpers/utils';

import { AppContext } from '../ContextProvider';


const Config = () => {
  const { state } = useContext(AppContext);
  const { poolConfig } = state;

  return (
    <div>
      <h3>Pool config</h3>
      <div>Min wallet payout: <FormattedAmount amount={poolConfig?.min_wallet_payout / poolConfig?.sig_divisor} useDecimals={false} /></div>
      <div>Min exchange payout: <FormattedAmount amount={poolConfig?.min_exchange_payout / poolConfig?.sig_divisor} useDecimals={false} /></div>
      <div>PPLNS fee: {poolConfig?.pplns_fee?.toLocaleString()}%</div>
      <div>Solo fee: {poolConfig?.solo_fee?.toLocaleString()}%</div>
      <div>Maturity depth: {poolConfig?.maturity_depth}</div>
    </div>
  );
}

export default Config;
