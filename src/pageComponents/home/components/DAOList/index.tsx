import DAOListItem from 'components/DAOListItem';
import DownIcon from 'assets/imgs/down.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './index.css';
import { useState } from 'react';
export default function DAOList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [numbersArray, setNumbersArray] = useState(
    Array.from({ length: 6 }, (_, index) => index + 1),
  );
  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newNumbersArray = Array.from(
        { length: 6 },
        (_, index) => index + numbersArray[numbersArray.length - 1] + 1,
      );
      setNumbersArray((prev) => [...prev, ...newNumbersArray]);
      setLoading(false);
    }, 1000);
  };
  return (
    <div className="dao-list">
      <div className="dao-list-container">
        {numbersArray.map((number) => {
          return <DAOListItem key={number} />;
        })}
      </div>
      <div className="dao-more">
        <div className="more-button" onClick={loadMore}>
          {loading ? (
            <Spin indicator={<LoadingOutlined spin rev={undefined} />} />
          ) : (
            <>
              <span className="more-text">View More</span>
              <img className="down-icon" src={DownIcon} alt="down" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
