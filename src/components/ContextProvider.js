import { createContext } from 'react';
import ApiHelper from '../helpers/ApiHelper';
import { useLocalStorage, useMountEffect } from '../helpers/hooks';

import useAppState from './useAppState';


export const AppContext = createContext();

const AppContextProvider = props => {
  const [state, dispatch, updatedState] = useAppState();
  const [storedMiners, setStoredMiners] = useLocalStorage('ccx_pool');
  const Api = new ApiHelper({ state });

  const deleteMiner = address => {
    const miners = {...storedMiners};
    delete miners[address];
    setStoredMiners(miners);
    dispatch({ type: 'SET_MINERS', miners });
    if (Object.keys(miners).length === 0) dispatch({ type: 'CLEAR_MINERS_INTERVALS' });
  }

  const getMinerData = address => {
    Api.getMinerStats(address)
      .then(stats => {
        dispatch({ type: 'UPDATE_MINER', address, stats });
      });
    Api.getMinerIdentifiers(address)
      .then(identifiers => {
        dispatch({ type: 'UPDATE_MINER', address, identifiers });
      });
    Api.getMinerWorkers(address)
      .then(workers => {
        dispatch({ type: 'UPDATE_MINER', address, workers });
      });
    Api.getMinerChart(address)
      .then(chartData => {
        dispatch({ type: 'UPDATE_MINER', address, chartData });
      })
    Api.getMinerPayments(address)
      .then(payments => {
        dispatch({ type: 'UPDATE_MINER', address, payments });
      })
  }

  const getMiners = () => {
    Object.keys(storedMiners).map(address => getMinerData(address));
  }

  const setMiner = address => {
    const miners = {
      ...storedMiners,
      [address]: {
        chartData: {},
        identifiers: [],
        payments: [],
        stats: {},
        workers: {},
      }
    };
    setStoredMiners(miners);
    dispatch({ type: 'SET_MINERS', miners });
    getMinerData(address);
  }

  const getConfig = () => {
    Api.getConfig()
      .then(poolConfig => {
        dispatch({ type: 'UPDATE_CONFIG', poolConfig });
      })
      .catch(() => {
        console.error('Error getting pool config.')
      });
  };

  const getNetworkStats = () => {
    Api.getNetworkStats()
      .then(networkStats => {
        dispatch({ type: 'UPDATE_NETWORK_STATS', networkStats });
      })
      .catch(() => {
        console.error('Error getting network stats.')
      });
  };

  const getPoolBlocks = () => {
    Api.getPoolBlocks()
      .then(poolBlocks => {
        dispatch({ type: 'UPDATE_POOL_BLOCKS', poolBlocks });
      })
      .catch(() => {
        console.error('Error getting pool blocks.')
      });
  };

  const getPoolMinersChart = () => {
    Api.getPoolMinersChart()
      .then(poolMinersChart => {
        dispatch({ type: 'UPDATE_POOL_MINERS_CHART', poolMinersChart });
      })
      .catch(() => {
        console.error('Error getting pool miners chart.')
      });
  };

  const getPoolStats = () => {
    Api.getPoolStats()
      .then(poolStats => {
        dispatch({ type: 'UPDATE_POOL_STATS', poolStats });
      })
      .catch(() => {
        console.error('Error getting pool stats.')
      });
  };

  const actions = {
    deleteMiner,
    setMiner,
  };

  const initApp = () => {
    const { appSettings } = state;

    getConfig();
    getNetworkStats();
    getPoolStats();
    getPoolBlocks();
    getPoolMinersChart();

    const intervals = [];
    intervals.push(
      { fn: getNetworkStats, time: appSettings.updateStatsInterval },
      { fn: getPoolBlocks, time: appSettings.updateStatsInterval },
      { fn: getPoolMinersChart, time: appSettings.updateStatsInterval },
      { fn: getPoolStats, time: appSettings.updateStatsInterval },
    );

    dispatch({ type: 'SET_POOL_INTERVALS', intervals });

    if (Object.keys(storedMiners).length > 0) {
      getMiners();
      dispatch({ type: 'SET_MINERS_INTERVALS', intervals: [{ fn: getMiners, time: appSettings.updateMinersInterval }] });
    }
  };

  const clearApp = () => {
    dispatch({ type: 'CLEAR_APP' });
  };

  useMountEffect(() => {
    initApp();
    return () => clearApp();
  });

  return (
    <AppContext.Provider value={{ state, actions }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;
