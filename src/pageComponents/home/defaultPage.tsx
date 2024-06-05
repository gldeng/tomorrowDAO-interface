import { useEffect } from 'react';
import DAOHeader from './components/DAOHeader';
import DAOList from './components/DAOList';
import breadCrumb from 'utils/breadCrumb';
import './index.css';

export default function Home() {
  useEffect(() => {
    breadCrumb.clearBreadCrumb();
  }, []);
  return (
    <div className="home-container">
      <div className="home-header-container">
        <DAOHeader />
        <DAOList />
      </div>
    </div>
  );
}
