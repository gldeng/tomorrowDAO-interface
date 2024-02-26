import clsx from 'clsx';
import { Modal, IModalProps } from 'aelf-design';
import CommonHeader from 'components/CommonComponentsOfModalAndDrawer/CommonHeader';
import CommonFooter from 'components/CommonComponentsOfModalAndDrawer/CommonFooter';
import { ICommonExtensionProps } from 'types/modalAndDrawer';
import './index.css';

export type TCommonModalProps = ICommonExtensionProps &
  Omit<IModalProps, 'onCancel'> & {
    onCancel: Required<IModalProps>['onCancel'];
  };

export default function CommonModal({
  className,
  title,
  footerConfig,
  children,
  ...props
}: TCommonModalProps) {
  return (
    <Modal
      {...props}
      className={clsx('common-modal', className)}
      title={<CommonHeader title={title} onClose={props.onCancel} />}
      footer={null}
      centered
    >
      {children}
      {footerConfig && <CommonFooter {...footerConfig} />}
    </Modal>
  );
}
