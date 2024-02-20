import { HeaderLogo } from 'components/Logo';
import './index.css';
import Login from 'components/Login';
import { PCMenu } from 'components/Menu';
import Link from 'next/link';
import useResponsive from 'hooks/useResponsive';
import MenuButton from 'components/MenuButton';
export default function Header() {
  const { isLG } = useResponsive();
  return (
    <header className="header-container">
      <div className="header-banner">
        <div className="header-menu">
          <Link href="/">
            <HeaderLogo />
          </Link>
          {!isLG && <PCMenu />}
        </div>
        <Login />
        <div className="header-menu-icon ml-2">{isLG && <MenuButton />}</div>
      </div>
    </header>
  );
}
