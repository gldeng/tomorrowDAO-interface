'use client';

import { useMachine } from '@xstate/react';
import { formMachine } from './xstate';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import React, { memo, useCallback, useRef, useState } from 'react';
import { Steps, message, FormInstance, Result, StepsProps } from 'antd';
import Image from 'next/image';
import { useWebLoginEvent, WebLoginEvents, useWebLogin, WebLoginState } from 'aelf-web-login';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import SubmitButton, { ISubmitRef } from './component/SubmitButton';
import { daoCreateContractRequest } from 'contract/daoCreateContract';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as ArrowRight } from 'assets/imgs/arrow-right.svg';
import { ReactComponent as ArrowLeft } from 'assets/imgs/arrow-left.svg';
import { ReactComponent as Skip } from 'assets/imgs/skip.svg';
import CommonOperationResultModal, {
  CommonOperationResultModalType,
  TCommonOperationResultModalProps,
} from 'components/CommonOperationResultModal';
import './index.css';
import {
  ICreateDAOInput,
  IFile,
  IGovernanceSchemeThreshold,
  IHighCouncilInput,
  IMetadata,
  IStepsContext,
  StepEnum,
  StepsContext,
  defaultStepsFormMap,
} from './type';
import { emitLoading } from 'utils/myEvent';
import Link from 'next/link';
import { current } from '@reduxjs/toolkit';

const initItems: StepsProps['items'] = [
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
  const currentStepString = currentStep.toString() as StepEnum;

  const isHighCouncilStep = currentStepString === StepEnum.step2;
  const [messageApi, contextHolder] = message.useMessage();
  const isSkipHighCouncil = useRef<boolean>(false);
  const submitButtonRef = useRef<ISubmitRef>(null);
  const router = useRouter();
  const { loginState } = useWebLogin();
  const isNotFirstStep = currentStep > 0;
  const { isMD } = useResponsive();
  const [items, setItems] = useState(initItems);

  const stepsFormMapRef = useRef<IStepsContext>(defaultStepsFormMap);

  const handleNextStep = () => {
    const form = stepsFormMapRef.current.stepForm[currentStepString].formInstance;
    if (form) {
      form?.validateFields().then((res) => {
        stepsFormMapRef.current.stepForm[currentStepString].submitedRes = res;
        if (isHighCouncilStep) {
          isSkipHighCouncil.current = false;
          setItems(initItems);
        }
        send({ type: 'NEXT' });
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'No registration form',
      });
      // send({ type: 'NEXT' });
    }
  };
  const handleSkip = () => {
    isSkipHighCouncil.current = true;
    const itemsCopy = [...items];
    itemsCopy[2] = {
      icon: <Skip />,
      title: 'High Council (Skipped)',
    };
    setItems(itemsCopy);
    stepsFormMapRef.current.stepForm[StepEnum.step2].submitedRes = undefined;
    send({ type: 'NEXT' });
  };

  const onRegisterHandler = useCallback(
    (ins: FormInstance) => {
      stepsFormMapRef.current.stepForm[currentStepString].formInstance = ins;
    },
    [currentStepString],
  );
  emitLoading(false);
  const handleCreateDao = async () => {
    const stepForm = stepsFormMapRef.current.stepForm;
    const form = stepForm[StepEnum.step3].formInstance;
    if (form) {
      form?.validateFields().then(async (res) => {
        stepForm[StepEnum.step3].submitedRes = res;
        const originMetadata = stepForm[StepEnum.step0].submitedRes;
        const metadata = {
          metadata: {
            ...originMetadata?.metadata,
            logoUrl: originMetadata?.metadata?.logoUrl?.[0]?.response?.url,
          },
          governanceToken: originMetadata?.governanceToken,
        };
        try {
          const files: IFile[] =
            stepForm[StepEnum.step3].submitedRes?.files?.map((file) => {
              const url = new URL(file.response.url);
              // const url = file.response.url;
              const id = url.pathname.split('/').pop() ?? '';
              return {
                cid: id,
                name: file.name,
                url: file.response.url,
              };
            }) ?? [];
          const params: any = {
            ...metadata,
            governanceSchemeThreshold: {
              ...(stepForm[StepEnum.step1].submitedRes ?? {}),
            },
            files,
          };
          if (!isSkipHighCouncil.current) {
            params.highCouncilInput = {
              ...(stepForm[StepEnum.step2].submitedRes ?? {}),
            };
          }
          console.log('params', params);
          emitLoading(true, 'Uploading...');
          const createRes = await daoCreateContractRequest('CreateDAO', params);
          // todo loading
          emitLoading(false);
          submitButtonRef.current?.setResultModalConfig({
            open: true,
            type: CommonOperationResultModalType.Success,
            primaryContent: 'Network DAO is created successfully',
            secondaryContent: (
              <>
                If you wish to modify the DAO&apos;s display information, you can join the{' '}
                <Link className="text-colorPrimary cursor-pointer" href={'https://t.me/tmrwdao'}>
                  Telegram group
                </Link>
                .
              </>
            ),
            footerConfig: {
              buttonList: [
                {
                  children: <Link href={`/`}>View My DAO</Link>,
                },
              ],
            },
          });
        } catch (error) {
          emitLoading(false);
          submitButtonRef.current?.setResultModalConfig({
            open: true,
            type: CommonOperationResultModalType.Error,
            primaryContent: 'Failed to Create the DAO',
            secondaryContent: 'Failed to Create the DAO',
            footerConfig: {
              buttonList: [
                {
                  children: 'Back',
                  onClick: () => {
                    submitButtonRef.current?.initResultModalConfig();
                  },
                },
              ],
            },
          });
        }
      });
    }
  };

  useWebLoginEvent(WebLoginEvents.LOGOUT, () => {
    router.push('/guide');
  });

  const isLogin = loginState === WebLoginState.logined;
  const isFillGovernanceToken =
    stepsFormMapRef.current?.stepForm[StepEnum.step0]?.submitedRes?.governanceToken;

  console.log('currentStepString', currentStepString);

  return isLogin ? (
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
          onChange={(current) => {
            console.log('current', current);
            // setCurrentStep(current);
          }}
          labelPlacement={'vertical'}
        />
      </div>
      {contextHolder}
      <StepsContext.Provider
        value={{
          ...stepsFormMapRef.current,
          onRegister: onRegisterHandler,
        }}
      >
        <div className="dao-steps-content-wrap">{snapshot.context.currentView.Component}</div>

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
              className="flex-quarter lg:w-40 lg:flex-none gap-2"
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
              onConfirm={handleCreateDao}
              ref={submitButtonRef}
            >
              <span>Submit</span>
              <ArrowRight />
            </SubmitButton>
          ) : (
            <div className="flex justify-end flex-half">
              {isHighCouncilStep && (
                <Button
                  type="primary"
                  className="flex-1 lg:w-40 lg:flex-none gap-2 create-dao-rigth-btn"
                  onClick={handleSkip}
                >
                  <span>Skip</span>
                  <ArrowRight />
                </Button>
              )}
              {!(isHighCouncilStep && !isFillGovernanceToken) && (
                <Button
                  type="primary"
                  className="flex-1 lg:w-40 lg:flex-none gap-2 create-dao-rigth-btn"
                  onClick={handleNextStep}
                >
                  <span>Next</span>
                  <ArrowRight />
                </Button>
              )}
            </div>
          )}
        </div>
      </StepsContext.Provider>
    </div>
  ) : (
    <Result status="warning" title="Please log in first before creating a DAO" />
  );
};

export default memo(CreateDaoPage);
