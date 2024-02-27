import { HashAddress, IHashAddressProps } from 'aelf-design';
import './index.css';
export interface IAddress extends IHashAddressProps {
  address: string;
  info?: string;
}

export default function Address(props: IAddress) {
  return (
    <div className="address-container">
      <div className="address">
        <HashAddress {...props} />
      </div>
      {props.info && <div className="address-info">{props.info}</div>}
    </div>
  );
}
