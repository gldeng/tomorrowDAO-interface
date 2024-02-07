import { selectData } from 'redux/reducer/data';
import { store } from 'redux/store';
import Header from 'components/Header';

export default function Home() {
  const data = selectData(store.getState());

  return (
    <div className="flex">
      <Header />
    </div>
  );
}
