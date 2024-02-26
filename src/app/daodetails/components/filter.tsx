import React, { useState } from 'react';
import { Drawer, Form, Select, Row, Col, Tag, Space } from 'antd';
import Image from 'next/image';
import { Search, Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
import CommonDaoLogo from 'components/CommonDaoLogo';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import CommonDrawer from 'components/CommonDrawer';
import SwitchBtn from 'assets/imgs/switch-btn.svg';
import { proposalTypeList, governanceMechanismList, proposalStatusList } from '../constants';
import CloseTag from 'assets/imgs/close-tag.svg';
type PropsType = {
  form: any;
  onSearch: any;
};

export default function Filter(props: PropsType) {
  const { form, onSearch } = props;
  const { isSM } = useResponsive();
  const [isShowDrawer, setIsShowDrawer] = useState(false);

  const [drawerForm, setDrawForm] = useState({});

  const handleShowModal = () => {
    setIsShowDrawer(true);
  };

  const handleClose = () => {
    setIsShowDrawer(false);
  };

  const handleCloseTag = () => {};

  return (
    <Form layout="inline" form={form} name="control-hooks" className="w-full">
      <Row className="m-0 w-full" justify="space-between">
        {isSM ? (
          <Col span={4}>
            <Button
              className="w-[40px] h-[40px]"
              icon={<CommonDaoLogo src={SwitchBtn}></CommonDaoLogo>}
              onClick={handleShowModal}
            ></Button>
          </Col>
        ) : (
          <>
            <Col span={5}>
              <Form.Item name="proposalType" className="w-full">
                <Select
                  defaultValue="ALL"
                  className="tab-all-proposals-select"
                  options={proposalTypeList}
                  onChange={onSearch}
                  // size="small"
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="governanceMechanism" className="w-full">
                <Select
                  defaultValue="ALL"
                  // size="small"
                  className="tab-all-proposals-select"
                  options={governanceMechanismList}
                  onChange={onSearch}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="proposalStatus" className="w-full">
                <Select
                  defaultValue="ALL"
                  className="tab-all-proposals-select"
                  options={proposalStatusList}
                  onChange={onSearch}
                  // size="small"
                />
              </Form.Item>
            </Col>
          </>
        )}
        <Col span={isSM ? 20 : 8}>
          <Form.Item name="content" className="w-full">
            <Search
              size="small"
              className="w-full"
              placeholder="Proposals Title / Description / ID"
              onChange={onSearch}
            />
          </Form.Item>
        </Col>
      </Row>

      <CommonDrawer
        bodyStyle={{
          background: '#fafafa',
        }}
        title="Filters"
        height={'100%'}
        open={isShowDrawer}
        onClose={handleClose}
        className="custom-drawer"
      >
        <Form.Item name="governanceMechanism" label="Models" colon={false} labelCol={{ span: 24 }}>
          <ResponsiveSelect
            defaultValue="ALL"
            className="tab-all-proposals-select"
            options={proposalTypeList}
            onChange={onSearch}
          />
        </Form.Item>
        <Form.Item
          name="governanceMechanism"
          label="Organization Types"
          colon={false}
          labelCol={{ span: 24 }}
        >
          <ResponsiveSelect
            defaultValue="ALL"
            className="w-full"
            options={proposalTypeList}
            onChange={onSearch}
          />
        </Form.Item>
        <Form.Item name="proposalStatus" label="Status" colon={false} labelCol={{ span: 24 }}>
          <ResponsiveSelect
            defaultValue="ALL"
            className="tab-all-proposals-select"
            options={proposalStatusList}
            onChange={onSearch}
            // size="small"
          />
        </Form.Item>
        <div className="absolute bottom-0 left-0 right-0 bg-[#fff] flex justify-between p-4">
          <Button className="flex-1 mr-4">Reset All</Button>
          <Button className="flex-1" type="primary">
            Apply
          </Button>
        </div>
      </CommonDrawer>
      {isSM && (
        <Space size={[0, 'small']} wrap className="mt-4">
          <Tag
            bordered={false}
            // closeIcon={
            //   <div className="inline-block">
            //   </div>
            // }
            onClose={() => {
              handleCloseTag();
            }}
            className="bg-Brand-Brand-BG text-colorPrimary px-4 py-1 flex"
          >
            <span className="mr-1">Tag 2</span>
            <Image src={CloseTag} width={12} height={12} alt="" className="mt-1" />
          </Tag>
        </Space>
      )}
    </Form>
  );
}
