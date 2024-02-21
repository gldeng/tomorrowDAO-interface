'use client';

import { useMachine } from '@xstate/react';
import { formMachine } from './xstate';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import { memo } from 'react';
import { Steps } from 'antd';
import clsx from 'clsx';
import { ReactComponent as ArrowRight } from 'assets/imgs/arrow-right.svg';
import { ReactComponent as ArrowLeft } from 'assets/imgs/arrow-left.svg';

const items = [
  {
    title: 'Basic Details',
  },
  {
    title: 'Governance Model',
  },
  {
    title: 'Contracts And Files',
  },
];

const CreateDaoPage = () => {
  const [snapshot, send] = useMachine(formMachine);
  const currentStep = snapshot.context.currentView.step;
  const isNotFirstStep = currentStep > 0;

  return (
    <div>
      <Typography.Title className="py-6" level={5} fontWeight={FontWeightEnum.Medium}>
        Create your DAO to TMRW DAO
      </Typography.Title>
      <div className="font-medium pt-8 pb-12 border-0 border-t border-solid border-baseBorder px-[34px]">
        <Steps current={currentStep} items={items} />
      </div>
      <div>{snapshot.context.currentView.Component}</div>

      <div
        className={clsx(
          'flex py-8 border-0 border-t border-solid border-baseBorder',
          isNotFirstStep ? 'justify-between' : 'justify-end',
        )}
      >
        {isNotFirstStep && (
          <Button
            type="primary"
            ghost
            className="w-40 gap-2"
            onClick={() => send({ type: 'PREVIOUS' })}
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>
        )}
        {currentStep === 2 ? (
          <Button
            type="primary"
            className="w-40 gap-2"
            onClick={() => {
              alert('submit');
            }}
          >
            <span>Submit</span>
            <ArrowRight />
          </Button>
        ) : (
          <Button type="primary" className="w-40 gap-2" onClick={() => send({ type: 'NEXT' })}>
            <span>Next</span>
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(CreateDaoPage);
