import { createContext } from 'react';
import ApiHelper from '../helpers/ApiHelper';
import AuthHelper from '../helpers/AuthHelper';
import { useLocalStorage, useMountEffect } from '../helpers/hooks';
import useAppState from './useAppState';


export const AppContext = createContext();
const Auth = new AuthHelper();

const AppContextProvider = props => {
  const [state, dispatch, updatedState] = useAppState(Auth);
  const [storedMiners, setStoredMiners] = useLocalStorage('syfr_pool');
  const Api = new ApiHelper(Auth);

  const deleteMiner = address => {
    const updatedMiners = { ...storedMiners };
    delete updatedMiners[address];
    setStoredMiners(updatedMiners);
    const miners = updatedState.current.miners;
    delete miners[address];
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
      .then(res => {
        const chartData = Object.keys(res)
          .map(label => ({ label, data: res[label] }));
        dispatch({ type: 'UPDATE_MINER', address, chartData });
      })
  }

  const getMinerPayments = async (address, page = 0, limit = 10) => {
    const rows = await Api.getMinerPayments(address, page, limit);
    dispatch({ type: 'UPDATE_MINER', address, payments: rows });
    return {
      rows,
      pageCount: Math.ceil(updatedState.current.miners[address].stats.txnCount / limit),
    }
  }

  const getMiners = () => {
    Object.keys(JSON.parse(localStorage.getItem('syfr_pool')))
      .forEach(address => {
        getMinerData(address);
      });
  }

  const setMiner = address => {
    setStoredMiners({
      ...storedMiners,
      [address]: {}
    });
    const miners = {
      ...updatedState.current.miners,
      [address]: {}
    };
    dispatch({ type: 'SET_MINERS', miners });
    getMinerData(address);

    if (Object.keys(updatedState.current.miners).length === 0) {
      dispatch({ type: 'SET_MINERS_INTERVALS', intervals: [{ fn: getMiners, time: state.appSettings.updateMinersInterval }] });
    }
  }

  const getConfig = () => {
    Api.getConfig()
      .then(poolConfig => {
        dispatch({ type: 'UPDATE_CONFIG', poolConfig });
      })
      .catch(() => {
        console.error('Error getting pool config.')
      });
  }

  const getNetworkStats = () => {
    Api.getNetworkStats()
      .then(networkStats => {
        dispatch({ type: 'UPDATE_NETWORK_STATS', networkStats });
      })
      .catch(() => {
        console.error('Error getting network stats.')
      });
  }

  const getPoolBlocks = async (page = 0, limit = 10) => {
    const rows = await Api.getPoolBlocks(page, limit);
    dispatch({ type: 'UPDATE_POOL_BLOCKS', poolBlocks: rows, poolType: 'global' });
    return {
      rows,
      pageCount: Math.ceil(updatedState.current.poolStats.global.pool_statistics.totalBlocksFound / limit),
    }
  }

  const getPayments = async (page = 0, limit = 10) => {
    const rows = await Api.getPayments(page, limit);
    dispatch({ type: 'UPDATE_PAYMENTS', payments: rows });
    return {
      rows,
      pageCount: Math.ceil(updatedState.current.poolStats.global.pool_statistics.totalPayments / limit),
    }
  }

  const getPoolMinersChart = () => {
    Api.getPoolMinersChart()
      .then(poolMinersChart => {
        dispatch({ type: 'UPDATE_POOL_MINERS_CHART', poolMinersChart });
      })
      .catch(() => {
        console.error('Error getting pool miners chart.')
      });
  }

  const getPoolStats = () => {
    Api.getPoolStats()
      .then(poolStats => {
        dispatch({ type: 'UPDATE_POOL_STATS', poolStats, poolType: 'global' });
        poolStats.pool_list.forEach(poolType => {
          Api.getPoolStats(poolType)
            .then(poolStats => {
              dispatch({ type: 'UPDATE_POOL_STATS', poolStats, poolType });
            });
          Api.getPoolBlocks(0, 1, poolType)
            .then(poolBlocks => {
              dispatch({ type: 'UPDATE_POOL_BLOCKS', poolBlocks, poolType });
            });
          Api.getPoolHashRateChart(poolType)
            .then(poolHashRate => {
              dispatch({ type: 'UPDATE_POOL_HASHRATE', poolHashRate, poolType });
            });
        })
      })
      .catch(() => {
        console.error('Error getting pool stats.')
      });
  }

  // Authed

  const login = (username, password, cb) => {
    Auth.login(username, password)
      .then(res => {
        if (res.success) {
          getUserSettings();
        } else {
          cb(res.msg);
        }
      })
  }

  const logout = () => {
    Auth.logout();
    dispatch({ type: 'UPDATE_USER' });
  }

  const getUserSettings = () => {
    Api.getUserSettings()
      .then(res => {
        dispatch({
          type: 'UPDATE_USER',
          emailEnabled: res.msg.email_enabled,
          payoutThreshold: res.msg.payout_threshold,
        });
      })
  }

  const changePassword = (password, cb) => {
    Api.changePassword(password)
      .then(res => {
        cb(res.msg);
      });
  }

  const changePayoutThreshold = (payoutThreshold, cb) => {
    Api.changePayoutThreshold(payoutThreshold)
      .then(res => {
        dispatch({
          type: 'UPDATE_USER',
          emailEnabled: updatedState.current.user.emailEnabled,
          payoutThreshold: Number(payoutThreshold * Math.pow(10, updatedState.current.appSettings.coinDecimals)),
        });
        cb(res.msg);
      });
  }

  const toggleEmail = cb => {
    Api.toggleEmail()
      .then(res => {
        dispatch({
          type: 'UPDATE_USER',
          emailEnabled: Number(!updatedState.current.user.emailEnabled),
          payoutThreshold: updatedState.current.user.payoutThreshold,
        });
        cb(res.msg);
      })
  }

  const actions = {
    changePassword,
    changePayoutThreshold,
    deleteMiner,
    getMinerPayments,
    getPayments,
    getPoolBlocks,
    login,
    logout,
    setMiner,
    toggleEmail,
  }

  const initApp = () => {
    const { appSettings } = state;

    if (updatedState.current.user.loggedIn()) getUserSettings();

    getConfig();
    getNetworkStats();
    getPoolStats();
    getPoolMinersChart();

    const intervals = [];
    intervals.push(
      { fn: getNetworkStats, time: appSettings.updateStatsInterval },
      { fn: getPoolMinersChart, time: appSettings.updateStatsInterval },
      { fn: getPoolStats, time: appSettings.updateStatsInterval },
    );

    dispatch({ type: 'SET_POOL_INTERVALS', intervals });

    if (Object.keys(storedMiners).length > 0) {
      getMiners();
      dispatch({ type: 'SET_MINERS_INTERVALS', intervals: [{ fn: getMiners, time: appSettings.updateMinersInterval }] });
    }
  }

  const clearApp = () => {
    dispatch({ type: 'CLEAR_APP' });
  }

  useMountEffect(() => {
    initApp();
    return () => clearApp();
  })

  return (
    <AppContext.Provider value={{ state, actions }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;
