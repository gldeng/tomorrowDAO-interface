import Image from 'next/image';
import './index.css';

export default function Loading() {
  return (
    <div className="circular-progress">
      <Image src="/images/tg/circular-progress.png" alt="vote-confirm" width={56} height={56} />
    </div>
  );
}
