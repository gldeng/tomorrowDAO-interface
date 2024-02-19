import './index.css';
import { FooterLogo } from 'components/Logo';
import { Divider } from 'antd';
import TwitterIcon from 'assets/imgs/twitter.svg';
import TGIcon from 'assets/imgs/telegram.svg';
import DiscordIcon from 'assets/imgs/icon_discord.svg';
import dayjs from 'dayjs';
const DocsItems = [
  {
    title: 'Docs',
    path: '/Docs',
  },
  {
    title: 'White Paper',
    path: '/White Paper',
  },
  {
    title: 'Send Feedback',
    path: '/Feedback',
  },
];
export default function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-main">
        <div className="footer-top">
          <div className="footer-logo">
            <FooterLogo />
          </div>
          <div className="footer-docs">
            {DocsItems.map((item) => {
              return (
                <div className="footer-docs-item" key={item.title}>
                  <a href={item.path}>{item.title}</a>
                </div>
              );
            })}
          </div>
        </div>
        <Divider />
        <div className="footer-media">
          <div className="footer-media-items">
            <div className="footer-media-item">
              <a href="https://twitter.com/TMRWDAO">
                <img src={DiscordIcon} alt="discord" />
              </a>
            </div>
            <div className="footer-media-item">
              <a href="https://twitter.com/TMRWDAO">
                <img src={TGIcon} alt="telegram" />
              </a>
            </div>
            <div className="footer-media-item">
              <a href="https://twitter.com/TMRWDAO">
                <img src={TwitterIcon} alt="twitter" />
              </a>
            </div>
          </div>
          <div className="footer-time">{`TMRW DAO@${dayjs().year()}`}</div>
        </div>
      </div>
    </div>
  );
}
