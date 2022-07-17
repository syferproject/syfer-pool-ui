import { useReducer, useRef } from 'react';

import { constants as appSettings } from './constants';


const initialState = () => ({
  appSettings,
  intervals: [],

  poolConfig: {},
  networkStats: {},
  poolBlocks: [],
  poolMinersChart: [],
  poolStats: {},

  wallets: {},
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
    case 'SET_INTERVALS':
      const intervals = action.intervals.map(i => setInterval(i.fn, i.time * 1000));
      result = {
        ...state,
        intervals,
      };
      break;
    case 'CLEAR_APP':
      state.intervals.forEach(interval => clearInterval(interval));
      result = {
        ...state,
        wallets: {},
        intervals: [],
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
