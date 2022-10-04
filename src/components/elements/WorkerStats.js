import { Fragment } from 'react';
import { averageHashRate, toHashRate } from '../../helpers/utils';


const MinerStats = props => {
  const { address, miners } = props;

  return (
    <div>
      <h4>Workers Stats</h4>
      {miners[address].identifiers?.sort((a, b) => a.localeCompare(b)).map(worker =>
        <Fragment key={worker}>
          <div><strong>{worker}</strong></div>
          <div>Last seen: {new Date(miners[address].workers[worker]?.lts * 1000).toLocaleString()}</div>
          <div>Hash rate: {toHashRate(miners[address].workers[worker]?.hash)} [1h avg: {averageHashRate(miners[address].chartData[worker], 'hour')} | 24h avg: {averageHashRate(miners[address].chartData[worker])}]</div>
          <div>Total hashes: {miners[address].workers[worker]?.totalHash.toLocaleString()}</div>
        </Fragment>
      )}
    </div>
  );
}

export default MinerStats;
