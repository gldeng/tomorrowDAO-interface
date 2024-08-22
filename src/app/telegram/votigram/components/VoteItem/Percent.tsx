import { useEffect, useRef } from 'react';

interface IPercentProps {
  percent: number;
}
export default function Percent(props: IPercentProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.transitionDuration = `${props.percent * 0.6}s`;
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.width = `${props.percent * 100}%`;
        }
      }, 16);
    }
  }, []);
  return <div className="vote-item-percent" ref={ref}></div>;
}
