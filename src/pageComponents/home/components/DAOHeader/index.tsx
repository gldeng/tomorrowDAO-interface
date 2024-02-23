import { Typography, FontWeightEnum, Button } from 'aelf-design';
import './index.css';
import { useRouter } from 'next/navigation';
import useResponsive from 'hooks/useResponsive';

export default function DAOHeader() {
  const router = useRouter();

  const toGuidePage = () => {
    router.push('/guide');
  };

  const { isLG } = useResponsive();
  return (
    <div className="dao-header-container">
      <div className="dao-header">
        <div className="dao-detail">
          <Typography.Title
            level={isLG ? 5 : 4}
            fontWeight={FontWeightEnum.Medium}
            className="title"
          >
            Tomorrow DAO
          </Typography.Title>
          <div className="description">
            A broad-based DAO platform and governance model for aelfand the aelf ecosystem to
            achieve decentralized governance.
          </div>
        </div>
        <div>
          <div>
            <Button type="primary" onClick={toGuidePage}>
              Create a DAO
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
