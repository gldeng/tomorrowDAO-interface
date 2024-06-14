import React from 'react';
import { List, Skeleton as AntdSkeleton } from 'antd';
import './index.css';

const mockContent =
  'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.';
const listData = Array.from({ length: 4 }).map((_, i) => ({
  id: i,
  content: mockContent,
  title: mockContent,
}));

const SkeletonList: React.FC = () => {
  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <AntdSkeleton loading={true} active>
              <List.Item.Meta title={item.title} description={item.content} />
              {item.content}
            </AntdSkeleton>
          </List.Item>
        )}
      />
    </>
  );
};
const SkeletonDaoItemList: React.FC = () => {
  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <AntdSkeleton
              className="my-dao-item-skeleton"
              loading
              active
              avatar={{
                shape: 'circle',
                size: 'small',
              }}
              paragraph={false}
            ></AntdSkeleton>
          </List.Item>
        )}
      />
    </>
  );
};
const SkeletonLine: React.FC = () => {
  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={[...listData, ...listData]}
        renderItem={(item) => (
          <List.Item key={item.id} className="skeleton-line">
            <AntdSkeleton loading active avatar={false} paragraph={false}></AntdSkeleton>
          </List.Item>
        )}
      />
    </>
  );
};
const Skeleton: React.FC = () => {
  return <AntdSkeleton paragraph={{ rows: 4 }} className="skeleton-wrap" active />;
};
export { SkeletonList, Skeleton, SkeletonDaoItemList, SkeletonLine };
