import { useCallback, useMemo, useState } from 'react';
import useJumpByPath from 'hooks/useJumpByPath';
import useResponsive from 'hooks/useResponsive';
import { Dropdown } from 'aelf-design';
import { List, type MenuProps } from 'antd';
import Image from 'next/image';
import ProposalDetailFile from 'assets/imgs/proposal-detail-file.svg';
import CommonDrawer from 'components/CommonDrawer';

type itemType = {
  name: string;
  url: string;
};

type PropsType = {
  list: itemType[];
};
export default function PreviewFile(props: PropsType) {
  const { list = [] } = props;
  const { isSM } = useResponsive();
  const jump = useJumpByPath();

  const [showDrawerModal, setShowDrawerModal] = useState(false);

  const handleViewPdf = (url: string) => {
    jump(url);
  };

  const fileItems: MenuProps['items'] = list.map((item, index) => {
    return {
      ...item,
      key: `${index}`,
      label: (
        <div
          className="min-w-36"
          onClick={() => {
            handleViewPdf(item.url);
          }}
        >
          {item.name}
        </div>
      ),
    };
  });

  const handleClick = useCallback(() => {
    if (isSM) {
      setShowDrawerModal(true);
    }
  }, [isSM]);

  const btnCom = useMemo(() => {
    return (
      <div className="flex items-center justify-center h-8 bg-Neutral-Default-BG px-2 leading-8 rounded-md">
        <Image width={14} height={14} src={ProposalDetailFile} alt="" onClick={handleClick}></Image>
        {!isSM && <span className="ml-1">Preview File</span>}
      </div>
    );
  }, [handleClick, isSM]);

  const handleClose = () => {
    setShowDrawerModal(false);
  };

  return (
    <div>
      {isSM ? (
        btnCom
      ) : (
        <Dropdown menu={{ items: fileItems }} placement="bottomRight">
          {btnCom}
        </Dropdown>
      )}
      <CommonDrawer title="Preview File" open={showDrawerModal} onClose={handleClose}>
        <List
          size="small"
          dataSource={list}
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                handleViewPdf(item.url);
              }}
            >
              {item.name}
            </List.Item>
          )}
        />
      </CommonDrawer>
    </div>
  );
}
