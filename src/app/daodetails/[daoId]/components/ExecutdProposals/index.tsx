import { Typography, FontWeightEnum, Button, HashAddress } from 'aelf-design';
import CommonModal from 'components/CommonModal';
import { useState } from 'react';
import Info from '../Info';

type TmodalInfoType = {
  title: string;
  type: 'success' | 'failed';
  btnText: string;
};

const successModalInfo: TmodalInfoType = {
  title: 'Proposal Executed Successfully',
  type: 'success',
  btnText: 'I Know',
};
const failedModalInfo: TmodalInfoType = {
  title: 'Proposal Executed Successfully',
  type: 'success',
  btnText: 'I Know',
};

export default function ExecutdProposals() {
  const data = Array.from({ length: 5 }, (index) => {
    return {
      title: 'sdfasdfasdfads',
      pid: 'ELF_2PedfasdfadsfasW28l_tDVW',
      id: index,
    };
  });

  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<TmodalInfoType>(successModalInfo);

  const handleExecute = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleMaskExecuted = () => {
    setShowInfoModal(true);
    const result = false;
    setModalInfo(result ? successModalInfo : failedModalInfo);
  };

  const handleCloseInfo = () => {
    setShowInfoModal(false);
  };

  return (
    <div className="border border-Neutral-Divider border-solid rounded-lg bg-white my-6">
      <Typography.Title
        className="px-4 lg:px-8 py-6 lg:py-4"
        fontWeight={FontWeightEnum.Medium}
        level={6}
      >
        To be executed proposals
      </Typography.Title>
      <div className="max-h-96 overflow-scroll">
        {data.map((item, index) => {
          return (
            <div className="flex justify-between items-center px-8 max-h-80 mb-8" key={index}>
              <div>
                <div className="block lg:flex items-center">
                  <Typography.Text fontWeight={FontWeightEnum.Medium}>Proposal ID:</Typography.Text>
                  <HashAddress
                    preLen={8}
                    endLen={11}
                    address={'ELF_2PedfasdfadsfasW28l_tDVW'}
                  ></HashAddress>
                </div>
                <Typography.Text className="text-Neutral-Secondary-Text">
                  Will expires on Nov 13, 2023
                </Typography.Text>
              </div>
              <Button type="primary" size="small" onClick={handleExecute}>
                Execute
              </Button>
            </div>
          );
        })}
      </div>
      <CommonModal
        open={showModal}
        onCancel={handleClose}
        title="This proposal needs to be executed"
      >
        <Typography.Text>
          As a member of this organization， you need to initiate a request to this organization to
          execute the proposal.
        </Typography.Text>
        <Button type="link" className="!px-0">
          Click here to view how to execute a proposal
        </Button>
        <Typography.Text>
          Once you mark this proposal as executed, it wil be tagged as executed status meaning that
          other addresses within your organization will no longer be able to execute this proposal.
          Please ensure that you have completed the execution of this proposal before marking its
          status.
        </Typography.Text>
        <div className="flex mt-6 flex-col lg:flex-row">
          <Button className="flex-1 mr-4 order-1 lg:order-2">Cancel</Button>
          <Button
            className="flex-1 order-2 lg:order-1"
            type="primary"
            danger
            onClick={handleMaskExecuted}
          >
            Mark as executed
          </Button>
        </div>
      </CommonModal>
      <CommonModal open={showInfoModal} onCancel={handleCloseInfo}>
        <Info
          title={modalInfo.title}
          type={modalInfo.type}
          btnText={modalInfo.btnText}
          onOk={handleCloseInfo}
        ></Info>
        <Button className="mx-auto" type="link">
          View Transaction Details
        </Button>
      </CommonModal>
    </div>
  );
}
