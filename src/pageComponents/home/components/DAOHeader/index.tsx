import { Typography, FontWeightEnum, Button } from 'aelf-design';
import './index.css';
import { useRouter } from 'next/navigation';

export default function DAOHeader() {
  const router = useRouter();

  const toGuidePage = () => {
    router.push('/guide');
  };
  return (
    <div className="dao-header">
      <div className="dao-detail">
        <Typography.Title level={4} fontWeight={FontWeightEnum.Medium} className="title">
          Tomorrow DAO
        </Typography.Title>
        <div className="description">
          A broad-based DAO platform and governance model for aelfand the aelf ecosystem to achieve
          decentralized governance.
        </div>
      </div>
      <div>
        <Button type="primary" ghost onClick={toGuidePage}>
          Create a DAO
        </Button>
      </div>
    </div>
  );
}
