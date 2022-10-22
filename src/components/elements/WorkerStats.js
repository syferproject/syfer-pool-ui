import { Fragment } from 'react';
import { AverageHashRate, HashRate, TimeAgo } from '../../helpers/Strings';


const MinerStats = props => {
  const { chartData, workers } = props;

  return (
    <div>
      <h4>Workers Stats</h4>
      {Object.keys(workers)
        .filter(i => i !== 'global')
        .sort((a, b) => a.localeCompare(b))
        .map(label => {
          const worker = workers[label];
          const workerChartData = chartData?.find(i => i.label === label)?.data;
          return (
            <Fragment key={label}>
              <div><strong>{label}</strong></div>
              <div>Last seen: <TimeAgo time={worker?.lts} /></div>
              <div>Hash rate: <HashRate hr={worker?.hash} /> [1h avg: <AverageHashRate data={workerChartData} timeWindow="hour" /> | 24h avg: <AverageHashRate data={workerChartData} />]</div>
              <div>Total hashes: {worker?.totalHash.toLocaleString()}</div>
            </Fragment>
          )})
      }
    </div>
  );
}

export default MinerStats;
