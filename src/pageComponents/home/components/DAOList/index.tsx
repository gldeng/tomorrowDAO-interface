import DAOListItem from 'components/DAOListItem';
import Link from 'next/link';
import { useInfiniteScroll } from 'ahooks';
import DownIcon from 'assets/imgs/down.svg';
import Loading from 'components/Loading';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import TmrwDaoSpin from 'components/Spin';
import { store } from 'redux/store';
import './index.css';
import { useRef, useState } from 'react';
import { fetchDaoList } from 'api/request';

export default function DAOList() {
  const skipCount = useRef(0);
  const info = store.getState().elfInfo.elfInfo;
  const fetchDaoInner = async (data: { list: IDaoItem[] } | undefined) => {
    const res = await fetchDaoList({
      skipCount: data?.list?.length ?? 0,
      maxResultCount: 6,
      chainId: info.curChain,
    });
    skipCount.current += res.data.totalCount;
    console.log('res.data.items', res.data.items);
    return {
      list: res.data.items,
    };
  };
  const { data, loading, loadMore, loadingMore } = useInfiniteScroll(fetchDaoInner);

  // const [loading, setLoading] = useState<boolean>(false);
  // const [numbersArray, setNumbersArray] = useState(
  //   Array.from({ length: 6 }, (_, index) => index + 1),
  // );
  // const loadMore = () => {
  //   if (loading) return;
  //   setLoading(true);
  //   setTimeout(() => {
  //     const newNumbersArray = Array.from(
  //       { length: 6 },
  //       (_, index) => index + numbersArray[numbersArray.length - 1] + 1,
  //     );
  //     setNumbersArray((prev) => [...prev, ...newNumbersArray]);
  //     setLoading(false);
  //   }, 1000);
  // };
  return (
    <div className="dao-list">
      {loading && <TmrwDaoSpin />}
      <div className="dao-list-container">
        {data?.list.map((item, i) => {
          return (
            <Link key={item.daoId} href={`/dao/${item.daoId}`}>
              <DAOListItem item={item} />
            </Link>
          );
        })}
      </div>
      <div className="dao-more">
        <div className="more-button" onClick={loadMore}>
          {loadingMore ? (
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
