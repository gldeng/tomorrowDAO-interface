import { useEffect } from 'react';
import DAOHeader from './components/DAOHeader';
import DAOList from './components/DAOList';
import breadCrumb from 'utils/breadCrumb';
import './index.css';
import useResponsive from 'hooks/useResponsive';

export default function Home() {
  useEffect(() => {
    breadCrumb.clearBreadCrumb();
  }, []);
  const { isLG } = useResponsive();
  return (
    <div className="home-container">
      <div className="home-header-container">
        {!isLG && <DAOHeader />}
        {/* <DAOHeader /> */}
        <DAOList />
      </div>
    </div>
  );
}
