// import { Typography, FontWeightEnum } from 'aelf-design';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-[898px] my-0 mx-auto">
      <div>
        {/* <Typography.Title level={1} fontWeight={FontWeightEnum.Bold}> */}
        Create your DAO to TMRW DAO
        {/* </Typography.Title> */}
      </div>
      {children}
    </section>
  );
}
