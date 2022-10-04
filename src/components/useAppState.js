import { useReducer, useRef } from 'react';

import { constants as appSettings } from './constants';


const initialState = () => ({
  appSettings,
  minersIntervals: [],
  poolIntervals: [],

  poolConfig: {},
  networkStats: {},
  poolBlocks: [],
  poolMinersChart: [],
  poolStats: {},

  miners: {},
});

let updatedState;

const reducer = (state, action) => {
  let result = {};
  switch (action.type) {
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
    case 'UPDATE_POOL_BLOCKS':
      result = {
        ...state,
        poolBlocks: action.poolBlocks,
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
        poolStats: action.poolStats,
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
