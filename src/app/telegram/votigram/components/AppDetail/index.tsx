import { Button } from 'aelf-design';
import './index.css';
interface IAppDetailProps {
  item: IRankingListResItem | null;
  style?: React.CSSProperties;
  className?: string;
}
export default function AppDetail(props: IAppDetailProps) {
  const { style, className, item } = props;
  return (
    <div className={`${className} votigram-app-detail-wrap`} style={style}>
      <div className="summary">
        <img className="summary-logo" src={item?.icon} alt="" />
        <div className="summary-desc">
          <h3 className="font-20-25-weight text-white">{item?.title}</h3>
          <p
            className="font-14-18 text-[#B1B3BC] mt-[6px] summary-desc-text"
            dangerouslySetInnerHTML={{
              __html: item?.description ?? '',
            }}
          ></p>
        </div>
      </div>
      <div>
        {(item?.screenshots?.length ?? 0) > 0 && (
          <ul className="app-screenshots mt-[24px]">
            {item?.screenshots?.map((screenshot, index) => (
              <li key={index}>
                <img src={screenshot} alt="" />
              </li>
            ))}
          </ul>
        )}
      </div>
      {item?.longDescription && (
        <div className="mt-[24px] px-[28px]">
          <h3 className="font-20-25-weight text-white">Description</h3>
          <p className="font-14-18 mt-[8px] text-[#B1B3BC]">{item?.longDescription}</p>
        </div>
      )}
      <div className="app-link">
        <a href={item?.url}>
          <Button type="primary">
            <span className="font-17-22 app-link-text">Open</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
