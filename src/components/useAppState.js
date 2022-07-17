import { useReducer, useRef } from 'react';


const initialState = () => ({

});

let updatedState;

const reducer = (state, action) => {
  let result = {};
  switch (action.type) {
    case 'TMP':
      result = {
        ...state,
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
