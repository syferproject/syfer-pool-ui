import React from 'react';
import ApiHelper from '../helpers/ApiHelper';
import { useMountEffect } from '../helpers/hooks';

import useAppState from './useAppState';


export const AppContext = React.createContext();

const AppContextProvider = props => {
  const [state, dispatch, updatedState] = useAppState();
  const Api = new ApiHelper({ state });

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

  };

  const initApp = () => {
    const { appSettings, userSettings } = state;

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

    dispatch({ type: 'SET_INTERVALS', intervals });
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
