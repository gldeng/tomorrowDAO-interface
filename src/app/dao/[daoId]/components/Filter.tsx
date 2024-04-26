import React, { useMemo, useState, useEffect } from 'react';
import { Form, Select, Row, Col, Tag, Space } from 'antd';
import Image from 'next/image';
import { Search, Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
import CommonDaoLogo from 'components/CommonDaoLogo';
import { ResponsiveSelect } from 'components/ResponsiveSelect';
import CommonDrawer from 'components/CommonDrawer';
import type { FormInstance } from 'antd';
import SwitchBtn from 'assets/imgs/switch-btn.svg';
import { proposalTypeList, proposalStatusList, tagMap, ALL } from '../constants';
import { IProposalTableParams, TTableParamsKey } from '../type';
import CloseTag from 'assets/imgs/close-tag.svg';
import { ProposalType } from 'types';
type PropsType = {
  form: FormInstance;
  // onFechData: (params: IProposalTableParams) => void;
  tableParams: IProposalTableParams;
  onChangeTableParams: any;
};

export default function Filter(props: PropsType) {
  const { form, tableParams, onChangeTableParams } = props;

  const [modalForm] = Form.useForm();

  const { isLG } = useResponsive();
  const [isShowDrawer, setIsShowDrawer] = useState(false);

  const tags = useMemo(() => {
    const keyArr = ['proposalType', 'proposalStatus'];
    const keyList = Object.keys(tableParams) as TTableParamsKey[];
    const list = keyList.filter((key) => tableParams[key] && keyArr.includes(key));

    return list.map((key) => {
      return {
        key: key,
        value: tableParams[key] === 'All' ? tagMap[key] : tableParams[key],
      };
    });
  }, [tableParams]);

  const handleShowModal = () => {
    setIsShowDrawer(true);
  };

  const handleClose = () => {
    modalForm.resetFields();
    setIsShowDrawer(false);
  };

  const handleApply = () => {
    const values = modalForm.getFieldsValue();
    onChangeTableParams((state: IProposalTableParams) => {
      return {
        ...state,
        ...values,
      };
    });
    setIsShowDrawer(false);
    form.setFieldsValue(tableParams);
  };

  const handleCloseTag = (key: TTableParamsKey) => {
    form.setFieldValue(key, '');
    onChangeTableParams((state: IProposalTableParams) => {
      return {
        ...state,
        [key]: '',
      };
    });
  };

  // form function
  const handleValuesChange = (changesValues: any, allValues: any) => {
    onChangeTableParams((state: IProposalTableParams) => {
      return {
        ...state,
        ...allValues,
      };
    });
  };

  const handleCloseAll = () => {
    const values = {
      proposalType: '',
      proposalStatus: '',
    };
    form.setFieldsValue(values);
    onChangeTableParams((state: IProposalTableParams) => {
      return {
        ...state,
        ...values,
      };
    });
  };

  useEffect(() => {
    form.setFieldsValue(tableParams);
    modalForm.setFieldsValue(tableParams);
  }, [form, isLG, modalForm, tableParams]);

  return (
    <div>
      <Form
        layout="inline"
        form={form}
        name="control-hooks"
        className="w-full"
        onValuesChange={handleValuesChange}
        initialValues={tableParams}
        size="small"
      >
        <Row className="m-0 w-full" justify="space-between">
          {isLG ? (
            <Col span={4}>
              <Button
                size="medium"
                icon={<CommonDaoLogo src={SwitchBtn}></CommonDaoLogo>}
                onClick={handleShowModal}
              ></Button>
            </Col>
          ) : (
            <>
              <Col span={5}>
                <Form.Item name="proposalType" className="w-full" initialValue={ProposalType.ALL}>
                  <Select
                    className="tab-all-proposals-select"
                    options={proposalTypeList}
                    // onChange={onFechData}
                    // size="small"
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="proposalStatus" className="w-full">
                  <Select
                    className="tab-all-proposals-select"
                    options={proposalStatusList}
                    // onChange={onFechData}
                    size="small"
                  />
                </Form.Item>
              </Col>
            </>
          )}
          <Col span={isLG ? 20 : 12}>
            <Form.Item name="content" className="w-full">
              <Search
                inputSize="small"
                className="w-full"
                placeholder="Proposals Title / Description / ID"
                maxLength={100}
              />
            </Form.Item>
          </Col>
        </Row>

        {isLG && (
          <Space size={[0, 'small']} wrap className="mt-4">
            {tags.map((item, index) => {
              return (
                <TagCom
                  key={index}
                  label={item.value as string}
                  onCloseTag={() => {
                    handleCloseTag(item.key);
                  }}
                />
              );
            })}
            {tags.length > 0 && <TagCom label="Clear ALL" onCloseTag={handleCloseAll} />}
          </Space>
        )}
      </Form>
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
        <Form form={modalForm} initialValues={tableParams}>
          <Form.Item name="proposalType" label="Models" colon={false} labelCol={{ span: 24 }}>
            <ResponsiveSelect className="tab-all-proposals-select" options={proposalTypeList} />
          </Form.Item>
          <Form.Item name="proposalStatus" label="Status" colon={false} labelCol={{ span: 24 }}>
            <ResponsiveSelect className="tab-all-proposals-select" options={proposalStatusList} />
          </Form.Item>
        </Form>

        <div className="absolute bottom-0 left-0 right-0 bg-[#fff] flex justify-between p-4">
          <Button className="flex-1 mr-4" onClick={handleCloseAll}>
            Reset All
          </Button>
          <Button className="flex-1" type="primary" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </CommonDrawer>
    </div>
  );
}

function TagCom(props: { label: string; onCloseTag: () => void }) {
  const { label, onCloseTag } = props;
  return (
    <Tag bordered={false} className="bg-Brand-Brand-BG text-colorPrimary px-4 py-1 flex">
      <span className="mr-1.5 font-medium">{label}</span>
      <Image
        src={CloseTag}
        width={12}
        height={12}
        alt=""
        className="mt-1 cursor-pointer"
        onClick={onCloseTag}
      />
    </Tag>
  );
}
