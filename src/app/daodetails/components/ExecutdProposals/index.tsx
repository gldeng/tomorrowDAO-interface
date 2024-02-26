import { Typography, FontWeightEnum, Button, HashAddress } from 'aelf-design';
import CommonModal from 'components/CommonModal';
import { useState } from 'react';

export default function ExecutdProposals() {
  const data = Array.from({ length: 5 }, (index) => {
    return {
      title: 'sdfasdfasdfads',
      pid: 'ELF_2PedfasdfadsfasW28l_tDVW',
      id: index,
    };
  });

  const [showModal, setShowModal] = useState(false);

  const handleExecute = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
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
              <CommonModal
                open={showModal}
                onCancel={handleClose}
                title="This proposal needs to be executed"
              >
                <Typography.Text>
                  As a member of this organization， you need to initiate a request to this
                  organization to execute the proposal.
                </Typography.Text>
                <Button type="link" className="px-0">
                  Click here to view how to execute a proposal
                </Button>
                <Typography.Text>
                  Once you mark this proposal as executed, it wil be tagged as executed status
                  meaning that other addresses within your organization will no longer be able to
                  execute this proposal. Please ensure that you have completed the execution of this
                  proposal before marking its status.
                </Typography.Text>
                <div className="flex mt-6">
                  <Button className="flex-1 mr-4">Cancel</Button>
                  <Button className="flex-1" type="primary">
                    Mark as executed
                  </Button>
                </div>
              </CommonModal>
            </div>
          );
        })}
      </div>
    </div>
  );
}
