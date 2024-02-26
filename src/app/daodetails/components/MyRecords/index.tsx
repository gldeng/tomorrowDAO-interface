import { Typography, FontWeightEnum, Button, HashAddress } from 'aelf-design';
import Image from 'next/image';
import arrowRightIcon from 'assets/imgs/arrow-right.svg';
interface IStatus {
  Approved: string;
  Rejected: string;
  Asbtained: string;
  Executed: string;
}

const colorMap: IStatus = {
  Approved: '#3888FF',
  Rejected: '#F55D6E',
  Asbtained: '#687083',
  Executed: '#05C4A2',
};

export default function MyRecords() {
  const data: any = Array.from({ length: 5 }, (index) => {
    return {
      title: 'sdfasdfasdfads',
      pid: 'ELF_2PedfasdfadsfasW28l_tDVW',
      time: 'Nov 13, 2023',
      vote: '18 votes',
      status: 'Approved',
      id: index,
    };
  });

  const statusCom = (text: keyof IStatus, size = 500) => {
    return (
      <span
        style={{
          color: colorMap[text],
          fontWeight: size,
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="border border-Neutral-Divider border-solid rounded-lg bg-white mb-4 lg:my-4">
      <div className="px-4 lg:px-8 py-6 lg:py-4 flex justify-between items-center">
        <Typography.Title fontWeight={FontWeightEnum.Medium} level={6}>
          My Records
        </Typography.Title>
        <div className="records-header-morebtn">
          <Button type="link" size="medium" className="!p-0 text-[#1A1A1A]">
            View More
            <Image width={12} height={12} src={arrowRightIcon} alt=""></Image>
          </Button>
        </div>
      </div>

      <div className="max-h-96 overflow-scroll">
        {data.map((item: any, index: number) => {
          return (
            <div
              className="flex justify-between items-center px-4 lg:px-8 max-h-80 mb-8"
              key={index}
            >
              <div>
                <div className="time">
                  <span className="text-Neutral-Secondary-Text mr-2">{item.time}</span>
                  <span className="time-r">{item.vote}</span>
                </div>
                <div className="block lg:flex items-center">
                  <Typography.Text fontWeight={FontWeightEnum.Medium}>Proposal ID:</Typography.Text>
                  <HashAddress
                    preLen={8}
                    endLen={11}
                    address={'ELF_2PedfasdfadsfasW28l_tDVW'}
                  ></HashAddress>
                </div>
              </div>
              {statusCom(item.status)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
