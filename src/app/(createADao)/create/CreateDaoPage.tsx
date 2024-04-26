'use client';

import { useMachine } from '@xstate/react';
import { formMachine } from './xstate';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import React, { memo, useCallback, useRef } from 'react';
import { Steps, message, FormInstance } from 'antd';
import clsx from 'clsx';
import SubmitButton, { ISubmitRef } from './component/SubmitButton';
import { daoCreateContractRequest } from 'contract/daoCreateContract';
import useResponsive from 'hooks/useResponsive';
import { ReactComponent as ArrowRight } from 'assets/imgs/arrow-right.svg';
import { ReactComponent as ArrowLeft } from 'assets/imgs/arrow-left.svg';
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
  const currentStepString = currentStep.toString() as StepEnum;
  const isHighCouncilStep = currentStepString === StepEnum.step2;
  const [messageApi, contextHolder] = message.useMessage();
  const isSkipHighCouncil = useRef<boolean>(false);
  const submitRef = useRef<ISubmitRef>(null);
  const isNotFirstStep = currentStep > 0;
  const { isMD } = useResponsive();

  const stepsFormMapRef = useRef<IStepsContext>(defaultStepsFormMap);

  const handleNextStep = () => {
    const form = stepsFormMapRef.current.stepForm[currentStepString].formInstance;
    console.log(form, currentStepString);
    if (form) {
      form?.validateFields().then((res) => {
        console.log(form, currentStepString, res);
        stepsFormMapRef.current.stepForm[currentStepString].submitedRes = res;
        if (isHighCouncilStep) {
          isSkipHighCouncil.current = false;
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
    send({ type: 'NEXT' });
  };

  const onRegisterHandler = useCallback(
    (ins: FormInstance) => {
      stepsFormMapRef.current.stepForm[currentStepString].formInstance = ins;
    },
    [currentStepString],
  );
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
          console.log('res', createRes);
          emitLoading(false);
          submitRef.current?.setResultModalConfig({
            open: true,
            type: CommonOperationResultModalType.Success,
            primaryContent: 'Network DAO is created successfully',
            secondaryContent: (
              <>
                If you wish to modify the DAO&apos;s display information, you can join the{' '}
                <span className="text-colorPrimary cursor-pointer">Telegram group</span>.
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
          submitRef.current?.setResultModalConfig({
            open: true,
            type: CommonOperationResultModalType.Error,
            primaryContent: 'Failed to Create the DAO',
            secondaryContent: 'Failed to Create the DAO',
            footerConfig: {
              buttonList: [
                {
                  children: 'Back',
                  onClick: () => {
                    submitRef.current?.initResultModalConfig();
                  },
                },
              ],
            },
          });
        }
      });
    }
  };

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
              onConfirm={handleCreateDao}
              ref={submitRef}
            >
              <span>Submit</span>
              <ArrowRight />
            </SubmitButton>
          ) : (
            <>
              {isHighCouncilStep && (
                <Button
                  type="primary"
                  className="flex-1 lg:w-40 lg:flex-none gap-2"
                  onClick={handleSkip}
                >
                  <span>Skip</span>
                  <ArrowRight />
                </Button>
              )}
              <Button
                type="primary"
                className="flex-1 lg:w-40 lg:flex-none gap-2"
                onClick={handleNextStep}
              >
                <span>Next</span>
                <ArrowRight />
              </Button>
            </>
          )}
        </div>
      </StepsContext.Provider>
    </div>
  );
};

export default memo(CreateDaoPage);
