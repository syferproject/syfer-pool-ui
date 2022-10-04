import { useContext } from 'react';
import { CCXExplorerLink, FormattedAmount, toHashRate } from '../../helpers/utils';

import { AppContext } from '../ContextProvider';


const NetworkStats = () => {
  const { state } = useContext(AppContext);
  const { poolConfig, networkStats } = state;

  return (
    <div>
      <h3>Network Stats</h3>
      <div>Network difficulty: {networkStats?.difficulty?.toLocaleString()}</div>
      <div>Network hash rate: {toHashRate((networkStats?.difficulty / 120))}</div>
      <div>Current hash: <CCXExplorerLink hash={networkStats?.hash} shortHash type="block" /></div>
      <div>Current height: {networkStats?.height?.toLocaleString()}</div>
      <div>Timestamp: {new Date(networkStats?.ts * 1000).toLocaleString()}</div>
      <div>Reward: <FormattedAmount amount={networkStats?.value / poolConfig?.sig_divisor} /></div>
    </div>
  );
}

export default NetworkStats;
