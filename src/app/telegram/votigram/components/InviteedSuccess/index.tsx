interface IInvitedSuccessProps {
  onFinish: () => void;
}
export default function InvitedSuccess(props: IInvitedSuccessProps) {
  const { onFinish } = props;
  return (
    <div>
      InvitedSuccess
      <button onClick={onFinish}>ok</button>
    </div>
  );
}
