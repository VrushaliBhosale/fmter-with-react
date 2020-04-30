
import React, { createContext, useReducer } from 'react';


export const ReportContext = createContext();

const { Provider } = ReportContext;

const initialState = {
  data:["hello"]
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "addRuns": console.log("add runs reducers");
    default:
      return state;
  }
};

const ReportProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <Provider value={{
      state, dispatch,
    }}
    >
      {children}
    </Provider>
  );
};
export default ReportProvider;
