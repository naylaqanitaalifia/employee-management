import { createContext, useContext as useReactContext } from "react";

type ContextProps = {
  showDialog: {
    add: boolean;
    edit: boolean;
    delete: boolean;
  };
  selected: {
    id: string;
  };
  handleDialog: (dialog: string, open: boolean) => void;
  handleSelected: (key: string, value: string) => void;
};

const initialProps: ContextProps = {
  showDialog: {
    add: false,
    edit: false,
    delete: false,
  },
  selected: {
    id: "",
  },
  handleDialog: () => {},
  handleSelected: () => {},
};

const Context = createContext<ContextProps>(initialProps);

function useContext() {
  return useReactContext(Context);
}

export { Context, useContext };
