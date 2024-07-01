import Image from 'next/image';
import { Button } from 'aelf-design';
import SuccessGreenIcon from 'assets/imgs/success-green.svg';
import WaringIcon from 'assets/imgs/waring.svg';

type TPropsType = {
  onOk: (p: boolean) => void;
  title: string;
  firstText?: string;
  secondText?: string;
  type?: 'failed' | 'success';
  btnText?: string;
};

const typeMap = {
  failed: WaringIcon,
  success: SuccessGreenIcon,
};

export default function Info(props: TPropsType) {
  const { onOk, title, firstText, secondText, type, btnText } = props;
  return (
    <div>
      {type && (
        <Image className="mx-auto block" width={56} height={56} src={typeMap[type]} alt="" />
      )}
      <div className="text-center text-Primary-Text font-medium mt-2">{title}</div>

      <p className="text-center text-Neutral-Secondary-Text font-medium">{firstText}</p>
      <p className="text-center text-Neutral-Secondary-Text font-medium">{secondText}</p>
      {btnText && (
        <Button
          className="mx-auto mt-6 w-[206px]"
          type="primary"
          onClick={() => {
            onOk(false);
          }}
        >
          {btnText}
        </Button>
      )}
    </div>
  );
}
