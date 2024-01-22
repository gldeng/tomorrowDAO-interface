import { selectData } from 'redux/reducer/data';
import { store } from 'redux/store';

export default function Home() {
  const data = selectData(store.getState());

  return (
    <div className="flex">
      <p>
        The live Ethereum price today is ${data?.ethusd || null} USD . We update our ETH to USD
        price in real-time.
      </p>
    </div>
  );
}
