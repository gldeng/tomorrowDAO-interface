import DAOListItem from 'components/DAOListItem';
import './index.css';
export default function DAOList() {
  const numbersArray = Array.from({ length: 6 }, (_, index) => index + 1);
  return (
    <div className="dao-list-container">
      {numbersArray.map((number) => {
        return <DAOListItem key={number} />;
      })}
    </div>
  );
}
