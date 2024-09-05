import './index.css';

interface IFooterProps {
  classname?: string;
}
export default function Footer(props: IFooterProps) {
  const { classname } = props;
  return (
    <p className={`${classname} telegram-votigram-footer font-14-18`}>A Product of TMRW DAO</p>
  );
}
