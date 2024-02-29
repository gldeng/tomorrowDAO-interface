export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-[898px] w-[898px] my-0 mx-4 lg:mx-auto bg-white rounded-lg border border-solid border-Neutral-Divider px-4 lg:px-8 mb-16">
      <div>
        {/* <Typography.Title level={1} fontWeight={FontWeightEnum.Bold}> */}
        {/* <h1 className="py-6">Create your DAO to TMRW DAO</h1> */}
        {/* </Typography.Title> */}
      </div>
      {children}
    </section>
  );
}
