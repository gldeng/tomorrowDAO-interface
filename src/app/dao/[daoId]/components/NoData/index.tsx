import Image from 'next/image';
import { Typography } from 'aelf-design';
import NoDataIcon from 'assets/imgs/no-data.svg';
type TNoDataType = {
  imgW?: number;
  imgH?: number;
};
export default function NoData(props: TNoDataType) {
  const { imgW = 80, imgH = 80 } = props;
  return (
    <div className="flex justify-center flex-col items-center mb-[10px]">
      <Image className="mx-auto block" width={imgW} height={imgH} src={NoDataIcon} alt="" />
      <Typography.Text>No results found</Typography.Text>
    </div>
  );
}
