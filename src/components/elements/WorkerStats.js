import { Fragment, useContext } from 'react';
import { AverageHashRate, HashRate, TimeAgo } from '../../helpers/Strings';
import { AppContext } from '../ContextProvider';
import MinerCharts from './MinerCharts';


const MinerStats = props => {
  const { state } = useContext(AppContext);
  const { miners } = state;
  const { address } = props;

  return (
    <div>
      <h4>Workers Stats</h4>
      {miners[address].identifiers?.sort((a, b) => a.localeCompare(b)).map(label => {
        const worker = miners[address].workers?.[label];
        const chartData = miners[address].chartData?.find(i => i.label === label)?.data;
        return (
          <Fragment key={label}>
            <div><strong>{label}</strong></div>
            <div>Last seen: <TimeAgo time={worker?.lts} /></div>
            <div>Hash rate: <HashRate hr={worker?.hash} /> [1h avg: <AverageHashRate data={chartData} timeWindow="hour" /> | 24h avg: <AverageHashRate data={chartData} />]</div>
            <div>Total hashes: {worker?.totalHash.toLocaleString()}</div>
          </Fragment>
        )
      })}

      {miners[address].chartData?.find(i => i.label === 'global')?.data.length > 0 &&
        <MinerCharts data={[miners[address].chartData.find(i => i.label === 'global')]} />
      }
    </div>
  );
}

export default MinerStats;
