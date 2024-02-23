import { Typography, FontWeightEnum, Button, HashAddress } from 'aelf-design';

export default function ExecutdProposals() {
  const data = Array.from({ length: 5 }, (index) => {
    return {
      title: 'sdfasdfasdfads',
      pid: 'ELF_2PedfasdfadsfasW28l_tDVW',
      id: index,
    };
  });

  return (
    <div className="border border-Neutral-Divider border-solid rounded-lg bg-white my-6">
      <Typography.Title className="px-8 py-6" fontWeight={FontWeightEnum.Medium} level={6}>
        To be executed proposals
      </Typography.Title>
      <div className="max-h-96 overflow-scroll">
        {data.map((item, index) => {
          return (
            <div className="flex justify-between items-center px-8 max-h-80 mb-8" key={index}>
              <div className="flex items-center">
                <Typography.Text fontWeight={FontWeightEnum.Medium}>Proposal ID:</Typography.Text>
                <HashAddress
                  preLen={8}
                  endLen={11}
                  address={'ELF_2PedfasdfadsfasW28l_tDVW'}
                ></HashAddress>
              </div>
              <Button type="primary" size="small">
                Execute
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
