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
const GiftIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.2204 3.00586C8.47821 3.00586 7.06586 4.41821 7.06586 6.16044C7.06586 6.76722 7.23717 7.33398 7.53407 7.815H5.38074C4.41424 7.815 3.63074 8.59851 3.63074 9.565V11.7501C3.63074 12.3024 4.07845 12.7501 4.63074 12.7501H5.00476V19.2444C5.00476 20.2109 5.78826 20.9944 6.75476 20.9944H18.4952C19.4617 20.9944 20.2452 20.2109 20.2452 19.2444V12.7501H20.6193C21.1716 12.7501 21.6193 12.3024 21.6193 11.7501V9.565C21.6193 8.5985 20.8358 7.815 19.8693 7.815H17.7159C18.0128 7.33398 18.1842 6.76722 18.1842 6.16044C18.1842 4.41821 16.7718 3.00586 15.0296 3.00586C14.0662 3.00586 13.2036 3.43773 12.625 4.11843C12.0464 3.43773 11.1838 3.00586 10.2204 3.00586ZM10.2099 9.315C10.2134 9.31501 10.2169 9.31502 10.2204 9.31502H11.875H12.625H12.625H13.375H15.0296C15.0331 9.31502 15.0366 9.31501 15.0401 9.315H19.8693C20.0074 9.315 20.1193 9.42693 20.1193 9.565V11.2501H5.13074V9.565C5.13074 9.42693 5.24267 9.315 5.38074 9.315H10.2099ZM15.0372 7.815C15.9475 7.8109 16.6842 7.0717 16.6842 6.16044C16.6842 5.24664 15.9434 4.50586 15.0296 4.50586C14.1178 4.50586 13.3783 5.24331 13.375 6.15427L13.375 6.16044V7.815H15.0372ZM11.875 7.815V6.16044L11.875 6.15427C11.8717 5.24331 11.1322 4.50586 10.2204 4.50586C9.30664 4.50586 8.56586 5.24664 8.56586 6.16044C8.56586 7.0717 9.30252 7.8109 10.2128 7.815H11.875ZM6.50476 19.2444C6.50476 19.3825 6.61669 19.4944 6.75476 19.4944H18.4952C18.6333 19.4944 18.7452 19.3825 18.7452 19.2444V12.7501H6.50476V19.2444Z"
        fill="currentColor"
      />
    </svg>
  );
};
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
    icon: <GiftIcon />,
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
