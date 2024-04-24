import { useCallback, useContext, useState } from 'react';
import { Button, IButtonProps } from 'aelf-design';
import CreatePreviewModal, { ICreatePreviewModalProps } from '../CreatePreviewModal';
import CommonOperationResultModal, {
  CommonOperationResultModalType,
  TCommonOperationResultModalProps,
} from 'components/CommonOperationResultModal';
import { StepEnum, StepsContext } from '../../type';

interface ISubmitButtonProps {
  buttonProps?: Omit<IButtonProps, 'onClick'>;
  children?: React.ReactNode;
  onConfirm?: () => void;
}

type TPreviewModalConfig = Pick<ICreatePreviewModalProps, 'open'>;

type TResultModalConfig = Pick<
  TCommonOperationResultModalProps,
  'open' | 'type' | 'primaryContent' | 'secondaryContent' | 'footerConfig'
>;

const INIT_PREVIEW_MODAL_CONFIG: TPreviewModalConfig = {
  open: false,
};

const INIT_RESULT_MODAL_CONFIG: TResultModalConfig = {
  open: false,
  type: CommonOperationResultModalType.Success,
  primaryContent: '',
  secondaryContent: '',
};

export default function SubmitButton({ buttonProps, children, onConfirm }: ISubmitButtonProps) {
  const [previewModalConfig, setPreviewModalConfig] = useState(INIT_PREVIEW_MODAL_CONFIG);
  const [resultModalConfig, setResultModalConfig] = useState(INIT_RESULT_MODAL_CONFIG);

  const { stepForm } = useContext(StepsContext);

  const getResultModalConfig = useCallback(
    ({ type, failReason }: { type: CommonOperationResultModalType; failReason?: string }) => {
      switch (type) {
        case CommonOperationResultModalType.Success:
          return {
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
                  children: 'View My DAO',
                  onClick: () => {
                    setResultModalConfig(INIT_RESULT_MODAL_CONFIG);
                  },
                },
              ],
            },
          };
        case CommonOperationResultModalType.Error:
        default:
          return {
            type: CommonOperationResultModalType.Error,
            primaryContent: 'Failed to Create the DAO',
            secondaryContent: failReason || 'Failed to Create the DAO',
            footerConfig: {
              buttonList: [
                {
                  children: 'Back',
                  onClick: () => {
                    setResultModalConfig(INIT_RESULT_MODAL_CONFIG);
                    setPreviewModalConfig({ open: true });
                  },
                },
              ],
            },
          };
      }
    },
    [],
  );

  const handleCreate = useCallback(() => {
    setPreviewModalConfig({
      open: false,
    });
    setResultModalConfig({
      open: true,
      ...getResultModalConfig({ type: CommonOperationResultModalType.Error }),
    });
    onConfirm?.();
  }, [getResultModalConfig]);

  return (
    <>
      <Button
        {...buttonProps}
        onClick={() => {
          stepForm[StepEnum.step3].formInstance?.validateFields().then(() => {
            setPreviewModalConfig({
              open: true,
            });
          });
        }}
      >
        {children || 'Submit'}
      </Button>
      <CreatePreviewModal
        {...previewModalConfig}
        onClose={() =>
          setPreviewModalConfig({
            open: false,
          })
        }
        onConfirm={handleCreate}
      />
      <CommonOperationResultModal
        {...resultModalConfig}
        onCancel={() => {
          setResultModalConfig(INIT_RESULT_MODAL_CONFIG);
        }}
      />
    </>
  );
}
