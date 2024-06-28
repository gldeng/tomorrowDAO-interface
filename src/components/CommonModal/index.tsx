import clsx from 'clsx';
import { Modal, IModalProps } from 'aelf-design';
import CommonHeader from 'components/CommonComponentsOfModalAndDrawer/CommonHeader';
import CommonFooter from 'components/CommonComponentsOfModalAndDrawer/CommonFooter';
import { ICommonExtensionProps } from 'types/modalAndDrawer';
import './index.css';

export type TCommonModalProps = ICommonExtensionProps &
  Omit<IModalProps, 'onCancel'> & {
    onCancel: Required<IModalProps>['onCancel'];
    isShowHeader?: boolean;
  };

export default function CommonModal({
  className,
  title,
  footerConfig,
  children,
  isShowHeader = true,
  ...props
}: TCommonModalProps) {
  return (
    <Modal
      {...props}
      className={clsx('common-modal', className)}
      title={isShowHeader ? <CommonHeader title={title} onClose={props.onCancel} /> : null}
      footer={null}
      maskClosable={false}
      centered
    >
      {children}
      {footerConfig && <CommonFooter {...footerConfig} />}
    </Modal>
  );
}
