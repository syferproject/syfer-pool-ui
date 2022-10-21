import { useReducer, useRef } from 'react';
import { constants as appSettings } from './constants';


const initialState = Auth => ({
  appSettings,
  minersIntervals: [],
  poolIntervals: [],

  networkStats: {},
  payments: [],
  poolBlocks: {},
  poolConfig: {},
  poolMinersChart: [],
  poolStats: {},

  miners: {},

  user: {
    emailEnabled: 0,
    loggedIn: () => Auth.loggedIn(),
    payoutThreshold: 0,
  },
});

let updatedState;

const reducer = (state, action) => {
  let result = {};
  switch (action.type) {
    case 'UPDATE_USER':
      result = {
        ...state,
        user: {
          ...state.user,
          emailEnabled: action?.emailEnabled,
          payoutThreshold: action?.payoutThreshold,
        }
      };
      break;
    case 'UPDATE_CONFIG':
      result = {
        ...state,
        poolConfig: action.poolConfig,
      };
      break;
    case 'UPDATE_NETWORK_STATS':
      result = {
        ...state,
        networkStats: action.networkStats,
      };
      break;
    case 'SET_MINERS':
      result = {
        ...state,
        miners: action.miners,
      };
      break;
    case 'UPDATE_MINER':
      result = {
        ...state,
        miners: {
          ...state.miners,
          [action.address]: {
            chartData: { ...state.miners[action.address]?.chartData, ...action?.chartData },
            identifiers: action?.identifiers || state.miners[action.address]?.identifiers,
            payments: action?.payments || state.miners[action.address]?.payments,
            stats: { ...state.miners[action.address]?.stats, ...action?.stats },
            workers: { ...state.miners[action.address]?.workers, ...action?.workers },
          },
        },
      };
      break;
    case 'UPDATE_PAYMENTS':
      result = {
        ...state,
        payments: action.payments,
      };
      break;
    case 'UPDATE_POOL_BLOCKS':
      result = {
        ...state,
        poolBlocks: {
          ...state.poolBlocks,
          [action.poolType]: action.poolBlocks,
        },
      };
      break;
    case 'UPDATE_POOL_MINERS_CHART':
      result = {
        ...state,
        poolMinersChart: action.poolMinersChart,
      };
      break;
    case 'UPDATE_POOL_STATS':
      result = {
        ...state,
        poolStats: {
          ...state.poolStats,
          [action.poolType]: action.poolStats,
        },
      };
      break;
    case 'CLEAR_MINERS_INTERVALS':
      state.minersIntervals.forEach(interval => clearInterval(interval));
      result = {
        ...state,
        minersIntervals: [],
      };
      break;
    case 'SET_MINERS_INTERVALS':
      const minersIntervals = action.intervals.map(i => setInterval(i.fn, i.time * 1000));
      result = {
        ...state,
        minersIntervals,
      };
      break;
    case 'SET_POOL_INTERVALS':
      const poolIntervals = action.intervals.map(i => setInterval(i.fn, i.time * 1000));
      result = {
        ...state,
        poolIntervals,
      };
      break;
    case 'CLEAR_APP':
      state.minersIntervals.forEach(interval => clearInterval(interval));
      state.poolIntervals.forEach(interval => clearInterval(interval));
      result = {
        ...state,
        wallets: {},
        minersIntervals: [],
        poolIntervals: [],
      };
      break;
    default:
      throw new Error();
  }

  updatedState.current = result;
  return result;
};

const useAppState = Auth => {
  const state = initialState(Auth);
  updatedState = useRef(state);
  return [...useReducer(reducer, state), updatedState];
};


export default useAppState;
