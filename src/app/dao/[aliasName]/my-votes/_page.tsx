'use client';

import { Card } from 'antd';
// import Filter from './components/Filter';
import RecordTable from './components/Table';
import './page.css';

export default function MyRecord() {
  // const [form] = Form.useForm();

  // const handleSearch = () => {
  //   console.log(form.getFieldsValue());
  // };
  return (
    <div className="myRecord w-full">
      <Card
        className="w-full m"
        title={
          <div className="py-6 block lg:flex justify-between items-center">
            <div className="card-title py-[10px]">My Votes</div>
          </div>
        }
        styles={{
          body: {
            padding: 0,
            marginTop: 1,
          },
        }}
      >
        <RecordTable />
      </Card>
    </div>
  );
}
