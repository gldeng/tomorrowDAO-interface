import { StateNode, assign, createMachine } from 'xstate';
import BasicDetails from './component/BasicDetails';
import GovernanceModel from './component/GovernanceModel';
import ContractsAndFiles from './component/ContractsAndFiles';

export type Event = { type: 'NEXT' } | { type: 'PREVIOUS' };

export type View = {
  Component: React.ReactNode;
  step: number;
};

export type Context = {
  currentView: View;
};

export type State = {
  states: {
    basicDetails: StateNode;
    governanceModel: StateNode;
    contractsAndFiles: StateNode;
  };
};

export const mapNameToView: Record<string, View> = {
  basicDetails: {
    Component: <GovernanceModel />,
    step: 0,
  },
  governanceModel: {
    Component: <GovernanceModel />,
    step: 1,
  },
  contractsAndFiles: {
    Component: <ContractsAndFiles />,
    step: 2,
  },
};

const initialStateName = 'basicDetails';

const formMachineConfig = {
  types: {} as {
    context: {
      currentView: View;
    };
  },
  id: 'createState',
  initial: initialStateName,
  context: {
    currentView: mapNameToView[initialStateName],
  },
  states: {
    basicDetails: {
      entry: assign({
        currentView: () => {
          return mapNameToView['basicDetails'];
        },
      }),
      on: {
        NEXT: {
          target: 'governanceModel',
          actions: assign({
            currentView: ({ context, event }, params) => {
              console.log(context, event, params);
              return mapNameToView['governanceModel'];
            },
          }),
        },
      },
    },
    governanceModel: {
      on: {
        PREVIOUS: {
          target: 'basicDetails',
          actions: assign({
            currentView: ({ context, event }, params) => {
              console.log(context, event, params);
              return mapNameToView['basicDetails'];
            },
          }),
        },
        NEXT: {
          target: 'contractsAndFiles',
          actions: assign({
            currentView: ({ context, event }, params) => {
              console.log(context, event, params);
              return mapNameToView['contractsAndFiles'];
            },
          }),
        },
      },
    },
    contractsAndFiles: {
      on: {
        PREVIOUS: {
          target: 'governanceModel',
          actions: assign({
            currentView: ({ context, event }, params) => {
              console.log(context, event, params);
              return mapNameToView['governanceModel'];
            },
          }),
        },
      },
    },
  },
};

export const formMachine = createMachine(formMachineConfig);
