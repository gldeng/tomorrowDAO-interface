import Image from 'next/image';
import { Button } from 'aelf-design';
import SuccessGreenIcon from 'assets/imgs/success-green.svg';

type PropsType = {
  onOk?: any;
};

export default function Info(props: PropsType) {
  const { onOk } = props;
  return (
    <div>
      <Image className="mx-auto block" width={56} height={56} src={SuccessGreenIcon} alt="" />
      <div className="text-center text-Primary-Text font-medium">Transaction Failed!</div>

      <p className="text-center text-Neutral-Secondary-Text font-medium">
        Insufficient transaction fee.
      </p>
      <p className="text-center text-Neutral-Secondary-Text font-medium">
        Please transfer some ELF to the account.
      </p>
      <Button
        className="mx-auto mt-6 w-[206px]"
        type="primary"
        onClick={() => {
          onOk(false);
        }}
      >
        Back
      </Button>
    </div>
  );
}
