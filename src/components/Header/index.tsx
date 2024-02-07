import LogoComponent from 'components/Logo';
import './index.css';
import Login from 'components/Login';
export default function Header() {
  return (
    <header className="header-container">
      <div className="header-banner">
        <div className="heder-menu">
          <LogoComponent />
        </div>
        <Login />
      </div>
    </header>
  );
}
