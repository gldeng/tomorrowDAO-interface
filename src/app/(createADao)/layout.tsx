// import { Typography, FontWeightEnum } from 'aelf-design';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div>
        {/* <Typography.Title level={1} fontWeight={FontWeightEnum.Bold}> */}
        {/* <h1 className="py-6">Create your DAO to TMRW DAO</h1> */}
        {/* </Typography.Title> */}
      </div>
      {children}
    </section>
  );
}
