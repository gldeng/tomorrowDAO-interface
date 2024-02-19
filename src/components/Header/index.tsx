import { HeaderLogo } from 'components/Logo';
import './index.css';
import Login from 'components/Login';
import { PCMenu } from 'components/Menu';
import Link from 'next/link';
export default function Header() {
  return (
    <header className="header-container">
      <div className="header-banner">
        <div className="header-menu">
          <Link href="/">
            <HeaderLogo />
          </Link>
          <PCMenu />
        </div>
        <Login />
      </div>
    </header>
  );
}
