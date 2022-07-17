import React from 'react';

import useAppState from './useAppState';


export const AppContext = React.createContext();

const AppContextProvider = props => {
  const [state, dispatch, updatedState] = useAppState();

  const tmp = () => {

  };

  const actions = {
    tmp,
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default AppContextProvider;
