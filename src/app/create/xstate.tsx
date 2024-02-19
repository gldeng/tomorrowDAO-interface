import { StateNode, assign } from 'xstate';
import { createMachine } from 'xstate';

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
    Component: <div>basicDetails</div>,
    step: 0,
  },
  governanceModel: {
    Component: <div>governanceModel</div>,
    step: 1,
  },
  contractsAndFiles: {
    Component: <div>contractsAndFiles</div>,
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
