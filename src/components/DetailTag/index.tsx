export default function DetailTag(props: {
  customStyle: {
    width?: number;
    text: string;
    height: number;
    color: string;
    bgColor: string;
  };
  className?: string;
}) {
  const customStyle = props.customStyle;
  const style = {
    fontSize: '12px',
    width: customStyle.width,
    height: customStyle.height,
    color: customStyle.color,
    backgroundColor: customStyle.bgColor,
  };
  return (
    <div
      className={`inline-block px-2 rounded leading-5 font-medium ${props.className}`}
      style={{ ...style }}
    >
      {customStyle.text}
    </div>
  );
}
