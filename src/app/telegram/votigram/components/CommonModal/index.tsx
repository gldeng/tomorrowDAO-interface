import { Button, Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import CloseIcon from '../CommonDrawer/CloseIcon';
import './index.css';

interface ICommonModalProps {
  content: React.ReactNode;
  title: string;
}
export interface ICommonModalRef {
  open: () => void;
  close: () => void;
}
const CommonModal = forwardRef((props: ICommonModalProps, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsModalOpen(true);
    },
    close: () => {
      setIsModalOpen(false);
    },
  }));
  return (
    <Modal
      title={null}
      open={isModalOpen}
      footer={null}
      closeIcon={null}
      centered
      wrapClassName="tg-common-modal"
    >
      <div className="tg-common-modal-header">
        <div className="title">{props.title}</div>
        <CloseIcon
          onClick={() => {
            setIsModalOpen(false);
          }}
        />
      </div>
      <div className="tg-common-modal-content">{props.content}</div>
    </Modal>
  );
});

export default CommonModal;
