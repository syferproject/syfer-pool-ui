import { Fragment, useContext } from 'react';
import {
  BlockTime,
  SYFRExplorerLink,
  CurrentEffort,
  FormattedAmount,
  HashRate,
  NetworkPercentage,
  PPLNSWindow,
  TimeAgo,
} from '../../helpers/Strings';
import { AppContext } from '../ContextProvider';
import PoolCharts from './PoolCharts';


const PoolStats = () => {
  const { state } = useContext(AppContext);
  const { networkStats, poolBlocks, poolHashRate, poolStats } = state;
  const { difficulty } = networkStats;
  const { global } = poolStats;
  const { pool_statistics: stats } = global || {};

  return (
    <div>
      <h3>Pool Stats</h3>
      <div>Last payment: <TimeAgo time={global?.last_payment} /></div>
      <div>Current block: {stats?.currentBlock.toLocaleString()}</div>
      <div>Hash rate: <HashRate hr={stats?.hashRate} /></div>
      <div>Network percentage: <NetworkPercentage hashRate={stats?.hashRate} difficulty={difficulty} /></div>
      <div>Last block: {stats?.lastBlockFound.toLocaleString()} <SYFRExplorerLink hash={poolBlocks.global?.[0].hash} shortHash type="block" /></div>
      <div>Last block found: <TimeAgo time={stats?.lastBlockFoundTime} /></div>
      <div>Miners: {stats?.miners.toLocaleString()}</div>
      <div>Round hashes: {stats?.roundHashes.toLocaleString()}</div>
      <div>Total blocks found: {stats?.totalBlocksFound.toLocaleString()}</div>
      <div>Total hashes: {stats?.totalHashes.toLocaleString()}</div>
      <div>Total miners paid: {stats?.totalMinersPaid.toLocaleString()}</div>
      <div>Total payments: {stats?.totalPayments.toLocaleString()}</div>

      {Object.keys(poolStats).filter(poolType => poolType !== 'global').sort((a, b) => a.localeCompare(b)).map(poolType => {
        const { pool_statistics: stats } = poolStats[poolType];
        return (
          <Fragment key={poolType}>
            <h4>{poolType}</h4>
            <div>Hash rate: <HashRate hr={stats.hashRate} /></div>
            <div>Network percentage: {stats.hashRate ? <NetworkPercentage hashRate={stats.hashRate} difficulty={difficulty} /> : '-'}</div>
            <div>Current effort: <CurrentEffort roundHashes={stats.roundHashes} difficulty={difficulty} /></div>
            <div>Last block: {stats.lastBlockFound.toLocaleString()} <SYFRExplorerLink hash={poolBlocks[poolType]?.[0].hash} shortHash type="block" /></div>
            <div>Last block found: <TimeAgo time={stats.lastBlockFoundTime} /></div>
            <div>Block reward: <FormattedAmount amount={poolBlocks[poolType]?.[0].value} divide minimumFractionDigits={0} /></div>
            <div>Miners: {stats.miners.toLocaleString()}</div>
            <div>Round hashes: {stats.roundHashes.toLocaleString()}</div>
            <div>Block every (est.): {stats.hashRate > 0 ? <BlockTime difficulty={difficulty} hashRate={stats.hashRate} /> : '-'}</div>
            <div>Total blocks found: {stats.totalBlocksFound.toLocaleString()}</div>
            <div>Total hashes: {stats.totalHashes.toLocaleString()}</div>
            <div>PPLNS window: {stats.hashRate > 0 ? <PPLNSWindow difficulty={difficulty} hashRate={stats.hashRate} /> : '-'}</div>
          </Fragment>
        )
      })}

      {poolHashRate.find(i => i.label === 'pplns')?.data.length > 0 && <PoolCharts />}
    </div>
  );
}

export default PoolStats;
