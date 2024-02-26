'use client';

import { useMachine } from '@xstate/react';
import { formMachine } from './xstate';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import { memo } from 'react';
import { Steps } from 'antd';
import clsx from 'clsx';
import SubmitButton from './component/SubmitButton';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as ArrowRight } from 'assets/imgs/arrow-right.svg';
import { ReactComponent as ArrowLeft } from 'assets/imgs/arrow-left.svg';
import './index.css';

const items = [
  {
    title: 'Basic Details',
  },
  {
    title: 'Referendum',
  },
  {
    title: 'High Council (optional)',
  },
  {
    title: 'Contracts And Files',
  },
];

const CreateDaoPage = () => {
  const [snapshot, send] = useMachine(formMachine);
  const currentStep = snapshot.context.currentView.step;
  const isNotFirstStep = currentStep > 0;
  const { isMD, isLG } = useResponsive();

  return (
    <div>
      <Typography.Title className="py-6" level={5} fontWeight={FontWeightEnum.Medium}>
        Create your DAO to TMRW DAO
      </Typography.Title>
      <div className="font-medium pt-6 lg:pt-8 pb-10 lg:pb-12 border-0 border-t border-solid border-Neutral-Divider px-0 lg:px-[34px]">
        <Steps
          responsive={false}
          className={clsx('dao-steps-wrap', isMD && 'dao-steps-wrap-mobile')}
          current={currentStep}
          items={items}
          labelPlacement={isMD ? 'vertical' : 'horizontal'}
        />
      </div>
      <div>{snapshot.context.currentView.Component}</div>

      <div
        className={clsx(
          'flex py-6 lg:py-8 border-0 border-t border-solid border-Neutral-Divider',
          isNotFirstStep ? 'gap-3 justify-between' : 'justify-end',
        )}
      >
        {isNotFirstStep && (
          <Button
            type="primary"
            ghost
            className="flex-1 lg:w-40 lg:flex-none gap-2"
            onClick={() => send({ type: 'PREVIOUS' })}
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>
        )}

        {currentStep === 3 ? (
          <SubmitButton
            buttonProps={{
              type: 'primary',
              className: 'flex-1 lg:w-40 lg:flex-none gap-2',
            }}
          >
            <span>Submit</span>
            <ArrowRight />
          </SubmitButton>
        ) : (
          <Button
            type="primary"
            className="flex-1 lg:w-40 lg:flex-none gap-2"
            onClick={() => send({ type: 'NEXT' })}
          >
            <span>Next</span>
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(CreateDaoPage);
