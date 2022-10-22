import { Fragment, useContext } from 'react';
import { useFormInput } from '../../helpers/hooks';
import { FormattedAmount, HashRate, TimeAgo } from '../../helpers/Strings';
import { AppContext } from '../ContextProvider';
import MinerCharts from './MinerCharts';
import MinerPayments from './MinerPayments';
import WorkerStats from './WorkerStats';


const MinerStats = () => {
  const { actions, state } = useContext(AppContext);
  const { deleteMiner, setMiner } = actions;
  const { miners } = state;

  const { value: minerAddress, reset: resetMinerAddress, bind: bindMinerAddress } = useFormInput('');

  return (
    <div>
      <h3>Miner Stats</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          setMiner(minerAddress);
          resetMinerAddress();
        }}
      >
        <label>
          Miner address:
          <input
            {...bindMinerAddress}
            type="text"
            name="address"
            placeholder="Miner address"
            aria-label="miner-address"
          />
        </label>
        <input type="submit" value="Submit"></input>
      </form>
      {Object.keys(miners).map(address => {
        const { chartData, stats, workers } = miners[address];
        return (
          <Fragment key={address}>
            <div>{address} <button onClick={() => deleteMiner(address)}>Remove miner</button></div>
            <div>Hash rate: <HashRate hr={stats?.hash || 0} /></div>
            <div>Last hash: {stats?.lastHash ? <TimeAgo time={stats.lastHash} /> : 'Never'}</div>
            <div>Total hashes: {stats?.totalHashes?.toLocaleString() || 0}</div>
            <div>Valid shares: {stats?.validShares?.toLocaleString() || 0}</div>
            <div>Invalid shares: {stats?.invalidShares > 0 ? stats.invalidShares.toLocaleString() : 0}</div>
            <div>Amount paid: <FormattedAmount amount={stats?.amtPaid} divide minimumFractionDigits={0} /></div>
            <div>Amount due: <FormattedAmount amount={stats?.amtDue} divide /></div>
            <div>Total payments: {stats?.txnCount?.toLocaleString()}</div>

            {workers && <WorkerStats workers={workers} chartData={chartData} />}
            {chartData?.find(i => i.label === 'global')?.data.length > 0 &&
              <MinerCharts data={chartData} />
            }
            <MinerPayments address={address} />
          </Fragment>
        )
      })}
    </div>
  );
}

export default MinerStats;
