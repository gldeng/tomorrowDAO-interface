import {
  CheckCircleOutlined,
  StarOutlined,
  WalletOutlined,
  ShareExternalOutlined,
} from '@aelf-design/icons';
import './index.css';

export interface IFootTabBarProps {
  value: number;
  onChange: (value: number) => void;
}
const footTabBarList = [
  {
    icon: <CheckCircleOutlined />,
    text: 'Vote',
  },
  {
    icon: <StarOutlined />,
    text: 'My Points',
  },
  {
    icon: <ShareExternalOutlined />,
    text: 'Referral',
  },
  {
    icon: <WalletOutlined />,
    text: 'Wallet',
  },
];
export default function FootTabBar(props: IFootTabBarProps) {
  const { value, onChange } = props;
  return (
    <ul className="foot-tabbar">
      {footTabBarList.map((item, index) => (
        <li
          className={`foot-tabbar-item ${index === value ? 'active' : ''}`}
          key={index}
          onClick={() => {
            onChange(index);
          }}
        >
          {item.icon}
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
