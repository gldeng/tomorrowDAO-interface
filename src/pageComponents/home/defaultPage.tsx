import { selectData } from 'redux/reducer/data';
import { store } from 'redux/store';
import DAOHeader from './components/DAOHeader';
import DAOList from './components/DAOList';
import './index.css';

export default function Home() {
  const data = selectData(store.getState());

  return (
    <div className="home-container">
      <div className="home-header-container">
        <DAOHeader />
        <DAOList />
      </div>
    </div>
  );
}
