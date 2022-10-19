import { Fragment, useContext } from 'react';
import { useFormInput } from '../../helpers/hooks';
import { FormattedAmount, toHashRate } from '../../helpers/utils';
import { AppContext } from '../ContextProvider';

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
      {Object.keys(miners).map(address =>
        <Fragment key={address}>
          <div>{address} <button onClick={() => deleteMiner(address)}>Remove miner</button></div>
          <div>Hash rate: {toHashRate(miners[address].stats?.hash)}</div>
          <div>Last hash: {miners[address].stats?.lastHash ? new Date(miners[address].stats.lastHash * 1000).toLocaleString() : 'Never'}</div>
          <div>Total hashes: {miners[address].stats?.totalHashes?.toLocaleString() || 0}</div>
          <div>Valid shares: {miners[address].stats?.validShares?.toLocaleString() || 0}</div>
          <div>Invalid shares: {miners[address].stats?.invalidShares > 0 ?miners[address].stats?.invalidShares.toLocaleString() : 0}</div>
          <div>Amount paid: <FormattedAmount amount={miners[address].stats?.amtPaid} divide /></div>
          <div>Amount due: <FormattedAmount amount={miners[address].stats?.amtDue} divide /></div>
          <div>Total payments: {miners[address].stats?.txnCount?.toLocaleString()}</div>

          <WorkerStats address={address} miners={miners} />
          <MinerPayments address={address} miners={miners} />
        </Fragment>
      )}
    </div>
  );
}

export default MinerStats;
