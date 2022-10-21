import { useContext } from 'react';
import { CCXExplorerLink, FormattedAmount, HashRate, TimeAgo } from '../../helpers/Strings';
import { AppContext } from '../ContextProvider';


const NetworkStats = () => {
  const { state } = useContext(AppContext);
  const { networkStats } = state;
  const { difficulty, hash, height, ts, value } = networkStats;

  return (
    <div>
      <h3>Network Stats</h3>
      <div>Network difficulty: {difficulty?.toLocaleString()}</div>
      <div>Network hash rate: <HashRate hr={difficulty / 120} /></div>
      <div>Current hash: <CCXExplorerLink hash={hash} shortHash type="block" /></div>
      <div>Current height: {height?.toLocaleString()}</div>
      <div>Time found: <TimeAgo time={ts} /></div>
      <div>Reward: {value && <FormattedAmount amount={value} minimumFractionDigits={0} divide />}</div>
    </div>
  );
}

export default NetworkStats;
