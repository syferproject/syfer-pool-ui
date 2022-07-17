import React, { useContext } from 'react';
import { FormattedAmount } from '../helpers/utils';

import { AppContext } from './ContextProvider';


const Stats = () => {
  const { state } = useContext(AppContext);
  const { poolConfig, networkStats, poolStats } = state;

  return (
    <div>
      <h3>Pool Config</h3>
      <div>Min Wallet Payout: <FormattedAmount amount={poolConfig?.min_wallet_payout / poolConfig?.sig_divisor} useDecimals={false} /></div>
      <div>Min Exchange Payout: <FormattedAmount amount={poolConfig?.min_exchange_payout / poolConfig?.sig_divisor} useDecimals={false} /></div>
      <div>PPLNS Fee: {poolConfig?.pplns_fee?.toLocaleString()}%</div>
      <div>Solo Fee: {poolConfig?.solo_fee?.toLocaleString()}%</div>
      <div>Maturity Depth: {poolConfig?.maturity_depth}</div>

      <h3>Network Stats</h3>
      <div>Network Difficulty: {networkStats?.difficulty?.toLocaleString()}</div>
      <div>Current Hash: {networkStats?.hash}</div>
      <div>Current Height: {networkStats?.height?.toLocaleString()}</div>
      <div>Timestamp: {new Date(networkStats?.ts * 1000).toLocaleString()}</div>
      <div>Reward: <FormattedAmount amount={networkStats?.value / poolConfig?.sig_divisor} /></div>

      <h3>Pool Stats</h3>
      <div>Last Payment: {new Date(poolStats.last_payment * 1000).toLocaleString()}</div>
      <div>Current Block: {poolStats.pool_statistics?.currentBlock.toLocaleString()}</div>
      <div>Hash Rate: {poolStats.pool_statistics?.hashRate.toLocaleString()}</div>
      <div>Last Block Found: {poolStats.pool_statistics?.lastBlockFound.toLocaleString()}</div>
      <div>Last Block Found Time: {new Date(poolStats.pool_statistics?.lastBlockFoundTime * 1000).toLocaleString()}</div>
      <div>Miners: {poolStats.pool_statistics?.miners.toLocaleString()}</div>
      <div>Round Hashes: {poolStats.pool_statistics?.roundHashes.toLocaleString()}</div>
      <div>Total Blocks Found: {poolStats.pool_statistics?.totalBlocksFound.toLocaleString()}</div>
      <div>Total Hashes: {poolStats.pool_statistics?.totalHashes.toLocaleString()}</div>
      <div>Total Miners Paid: {poolStats.pool_statistics?.totalMinersPaid.toLocaleString()}</div>
      <div>Total Payments: {poolStats.pool_statistics?.totalPayments.toLocaleString()}</div>
    </div>
  );
}

export default Stats;
