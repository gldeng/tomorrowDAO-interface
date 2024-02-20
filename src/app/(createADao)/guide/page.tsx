'use client';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const linkArr = [
  { label: 'PTreasury Contract', path: '/' },
  { label: 'Voting Contract', path: '/' },
  { label: 'Election Contract', path: '/' },
];

const GuidePage = () => {
  const router = useRouter();
  const toCreateDaoPage = () => {
    router.push('/create');
  };

  return (
    <div>
      <div className="py-6 flex flex-col gap-3 border-0 border-b border-solid border-baseBorder">
        <Typography.Title level={5} fontWeight={FontWeightEnum.Medium}>
          Governance Framework on TMRW DAO
        </Typography.Title>
        <Typography.Text>
          The first secure and comprehensive platform for creating DAOs based on the aelf network.
        </Typography.Text>
      </div>

      <div className="py-6">
        <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
          It offers
        </Typography.Title>
        <div className="pt-4">
          <ul className="list-disc flex flex-col gap-4 pl-4">
            <li>
              <Typography.Text>
                Trusted by DAOs that play a central role in aelf network governance
              </Typography.Text>
            </li>
            <li>
              <Typography.Text>Protects about one billion of dollars in assets</Typography.Text>
            </li>
            <li>
              <Typography.Text>Enable flexible, trustless protocol upgrades</Typography.Text>
            </li>
            <li>
              <Typography.Text>
                Supports all kinds of governance tokens deployed on aelf chain
              </Typography.Text>
            </li>
            <li>
              <Typography.Text>
                Customizable number of participants, governance model,voting model, voting period
                and more
              </Typography.Text>
            </li>
            <li>
              <Typography.Text>Robust community of builders, users, and tools</Typography.Text>
            </li>
          </ul>
        </div>
      </div>

      <div className="py-6">
        <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
          It requires
        </Typography.Title>
        <div className="pt-4">
          <ul className="list-disc flex flex-col gap-4 pl-4">
            <li>
              <Typography.Text>Issue a governance token for voting if you need.</Typography.Text>
              <Link href="/" className="pl-2">
                <Typography.Text
                  fontWeight={FontWeightEnum.Medium}
                  className="text-colorPrimary hover:text-colorPrimaryHover active:text-colorPrimaryActive"
                >
                  Purchase a seed to issue a token.
                </Typography.Text>
              </Link>
            </li>
            <li>
              <Typography.Text>Know about the smart contracts and DYOR:</Typography.Text>
            </li>
          </ul>

          {linkArr.map((item, index) => (
            <div className='before:content-["·"] before:text-colorPrimary pt-4 pl-3' key={index}>
              <Link href={item.path} className="pl-2">
                <Typography.Text
                  fontWeight={FontWeightEnum.Medium}
                  className="text-colorPrimary hover:text-colorPrimaryHover active:text-colorPrimaryActive"
                >
                  {item.label}
                </Typography.Text>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex py-8 border-0 border-t border-solid border-baseBorder justify-end">
        <Button type="primary" className="w-40" onClick={toCreateDaoPage}>
          Get Start
        </Button>
      </div>
    </div>
  );
};

export default GuidePage;
