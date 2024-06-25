import { Button, Modal } from 'aelf-design';
import CommonModal from 'components/CommonModal';
import { useState } from 'react';
// import {} from 'antd';

function DeleteMultisigMembers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-[16px] items-center py-[64px]">
        <p className="">Choose a address to remove</p>
        <Button
          type="primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Select addresses
        </Button>
      </div>
      <CommonModal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        isShowHeader={false}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </CommonModal>
    </div>
  );
}

export default DeleteMultisigMembers;
