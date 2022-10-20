import { Fragment } from 'react';
import { AverageHashRate, HashRate, TimeAgo } from '../../helpers/Strings';


const MinerStats = props => {
  const { address, miners } = props;

  return (
    <div>
      <h4>Workers Stats</h4>
      {miners[address].identifiers?.sort((a, b) => a.localeCompare(b)).map(w => {
        const worker = miners[address].workers[w];
        const chartData = miners[address].chartData[w];
        return (
          <Fragment key={w}>
            <div><strong>{w}</strong></div>
            <div>Last seen: <TimeAgo time={worker?.lts} /></div>
            <div>Hash rate: <HashRate hr={worker?.hash} /> [1h avg: <AverageHashRate data={chartData} timeWindow="hour" /> | 24h avg: <AverageHashRate data={chartData} />]</div>
            <div>Total hashes: {worker?.totalHash.toLocaleString()}</div>
          </Fragment>
        )
      })}
    </div>
  );
}

export default MinerStats;
