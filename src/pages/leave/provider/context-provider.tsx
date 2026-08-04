import { Context } from "..";

const ContextProvider = () => {
  return (
    <Context.Provider
      value={{ showDialog, selected, handleDialog, handleSelected }}
    >
      <DataGridProvider></DataGridProvider>
    </Context.Provider>
  );
};

export { ContextProvider };
