import { Typography, FontWeightEnum, Button } from 'aelf-design';
import './index.css';
import { useRouter } from 'next/navigation';
import useResponsive from 'hooks/useResponsive';

export default function DAOHeader() {
  const router = useRouter();

  const toGuidePage = () => {
    router.push('/create');
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
            A DAO platform that empowers decentralised governance in the aelf network and ecosystem.
            Creating, managing, and engaging with DAOs is as simple as a few clicks.
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
