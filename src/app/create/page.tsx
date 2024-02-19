'use client';

import { useMachine } from '@xstate/react';
import { formMachine } from './xstate';
import { Button } from 'aelf-design';
import { memo } from 'react';

const CreateDaoPage = () => {
  const [snapshot, send] = useMachine(formMachine);

  return (
    <div>
      <div>{snapshot.context.currentView.Component}</div>
      <div className="flex justify-between">
        <Button type="primary" onClick={() => send({ type: 'PREVIOUS' })}>
          Back
        </Button>
        <Button type="primary" onClick={() => send({ type: 'NEXT' })}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default memo(CreateDaoPage);
