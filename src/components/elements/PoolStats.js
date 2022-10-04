import { useContext } from 'react';
import { CCXExplorerLink, toHashRate } from '../../helpers/utils';

import { AppContext } from '../ContextProvider';


const PoolStats = () => {
  const { state } = useContext(AppContext);
  const { poolBlocks, poolStats } = state;

  return (
    <div>
      <h3>Pool Stats</h3>
      <div>Last payment: {new Date(poolStats.last_payment * 1000).toLocaleString()}</div>
      <div>Current block: {poolStats.pool_statistics?.currentBlock.toLocaleString()}</div>
      <div>Hash rate: {toHashRate(poolStats.pool_statistics?.hashRate)}</div>
      <div>Last block: {poolStats.pool_statistics?.lastBlockFound.toLocaleString()} <CCXExplorerLink hash={poolBlocks[0]?.hash} shortHash type="block" /></div>
      <div>Last block found: {new Date(poolStats.pool_statistics?.lastBlockFoundTime * 1000).toLocaleString()}</div>
      <div>Miners: {poolStats.pool_statistics?.miners.toLocaleString()}</div>
      <div>Round hashes: {poolStats.pool_statistics?.roundHashes.toLocaleString()}</div>
      <div>Total blocks found: {poolStats.pool_statistics?.totalBlocksFound.toLocaleString()}</div>
      <div>Total hashes: {poolStats.pool_statistics?.totalHashes.toLocaleString()}</div>
      <div>Total miners paid: {poolStats.pool_statistics?.totalMinersPaid.toLocaleString()}</div>
      <div>Total payments: {poolStats.pool_statistics?.totalPayments.toLocaleString()}</div>
    </div>
  );
}

export default PoolStats;
