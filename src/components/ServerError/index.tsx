interface IServerErrorProps {
  error: string;
}
const ServerError: React.FC<IServerErrorProps> = (props: IServerErrorProps) => {
  const { error } = props;
  return (
    <p className="text-center normal-text text-error">
      {error.toString() ?? 'Error in obtaining initialization data, please refresh and retry.'}
    </p>
  );
};

export { ServerError };
