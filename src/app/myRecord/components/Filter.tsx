import React, { useState } from 'react';
import { Drawer, Form, Select, Row, Col, Tag, Space } from 'antd';
import { Search, Button } from 'aelf-design';
import useResponsive from 'hooks/useResponsive';
type PropsType = {
  form: any;
  onSearch: any;
  query?: Object;
};

export default function Filter(props: PropsType) {
  const { form, onSearch } = props;
  const { isSM } = useResponsive();

  return (
    <Form layout="inline" form={form} name="control-hooks">
      <Form.Item name="content">
        <Search size="small" placeholder="Proposals Name / ID" onChange={onSearch} />
      </Form.Item>
    </Form>
  );
}
