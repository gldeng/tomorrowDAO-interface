import React from 'react';
import { Button } from 'aelf-design';
import { ButtonCheckLogin } from 'components/ButtonCheckLogin';
import createDaoIconSrc1 from 'assets/imgs/create-dao-1.svg';
import createDaoIconSrc2 from 'assets/imgs/create-dao-2.svg';
import createDaoIconSrc3 from 'assets/imgs/create-dao-3.svg';
import createDaoIconSrc4 from 'assets/imgs/create-dao-4.svg';
import './index.css';

interface IFirstScreenProps {
  onClick: () => void;
}
export const FirstScreen = (props: IFirstScreenProps) => {
  const { onClick } = props;
  return (
    <>
      <div className="page-content-bg-border dao-create-first-screen mb-[24px] flex items-center justify-between">
        <h2 className="dao-create-first-screen-title">Create your DAO to TMRW DAO</h2>
        <ButtonCheckLogin onClick={onClick} type="primary">
          Build your DAO
        </ButtonCheckLogin>
      </div>
      <div className="page-content-bg-border dao-create-first-screen">
        <ul className="flex dao-create-preview">
          <li className="dao-create-preview-item">
            <div className="icon-wrap">
              <img className="icon" src={createDaoIconSrc1} alt="" />
            </div>
            <p>Step 1</p>
            <h3>Basic Information</h3>
          </li>
          <li className="dao-create-preview-item">
            <div className="icon-wrap">
              <img className="icon" src={createDaoIconSrc2} alt="" />
            </div>
            <p>Step 2</p>
            <h3>Referendum</h3>
          </li>
          <li className="dao-create-preview-item">
            <div className="icon-wrap">
              <img className="icon" src={createDaoIconSrc3} alt="" />
            </div>
            <p>Step 3</p>
            <h3>High Council</h3>
          </li>
          <li className="dao-create-preview-item">
            <div className="icon-wrap">
              <img className="icon" src={createDaoIconSrc4} alt="" />
            </div>
            <p>Step 4</p>
            <h3>Docs</h3>
          </li>
        </ul>
      </div>
    </>
  );
};
