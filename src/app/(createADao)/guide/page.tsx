'use client';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useJumpByPath from 'hooks/useJumpByPath';
import { ReactComponent as CircleDot } from 'assets/imgs/circle-dot.svg';

const linkArr = [
  { label: 'PTreasury Contract', path: '/' },
  { label: 'Voting Contract', path: '/' },
  { label: 'Election Contract', path: '/' },
];

const offers = [
  { label: 'Trusted by DAOs that play a central role in aelf network governance' },
  { label: 'Protects about one billion of dollars in assets' },
  { label: 'Enable flexible, trustless protocol upgrades' },
  { label: 'Supports all kinds of governance tokens deployed on aelf chain' },
  {
    label:
      'Customizable number of participants, governance model,voting model, voting period and more',
  },
  { label: 'Robust community of builders, users, and tools' },
];
const URL_FOR_TSM = 'https://eforest.finance/symbolmarket';

const GuidePage = () => {
  const router = useRouter();
  const jump = useJumpByPath();

  const toCreateDaoPage = () => {
    router.push('/create');
  };
  const onJumpHandler = () => {
    jump(URL_FOR_TSM);
  };

  return (
    <div>
      <div className="py-6 flex flex-col gap-3 border-0 border-b border-solid border-Neutral-Divider">
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
          <ul className="flex flex-col gap-4">
            {offers.map((ele, idx) => (
              <li className="flex items-baseline gap-2" key={idx}>
                <CircleDot />
                <Typography.Text className="flex-1">{ele.label}</Typography.Text>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="py-6">
        <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
          It requires
        </Typography.Title>
        <div className="pt-4">
          <ul className="flex flex-col gap-4">
            <li className="flex items-baseline gap-2">
              <CircleDot />
              <div className="flex-1">
                <Typography.Text>Issue a governance token for voting if you need.</Typography.Text>
                <Typography.Text
                  onClick={onJumpHandler}
                  fontWeight={FontWeightEnum.Medium}
                  className="pl-0 sm:pl-2 cursor-pointer !text-Brand-Brand hover:text-Brand-hover active:text-Brand-click"
                >
                  Purchase a seed to issue a token.
                </Typography.Text>
              </div>
            </li>
            <li className="flex items-baseline gap-2">
              <CircleDot />
              <Typography.Text className="flex-1">
                Know about the smart contracts and DYOR:
              </Typography.Text>
            </li>
          </ul>

          {linkArr.map((item, index) => (
            <div className='before:content-["·"] before:text-Brand-Brand pt-4 pl-3' key={index}>
              <Link href={item.path} className="pl-2">
                <Typography.Text
                  fontWeight={FontWeightEnum.Medium}
                  className="!text-Brand-Brand hover:text-Brand-hover active:text-Brand-click"
                >
                  {item.label}
                </Typography.Text>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex py-6 lg:py-8 border-0 border-t border-solid border-Neutral-Divider justify-end">
        <Button type="primary" className="w-full lg:w-40" onClick={toCreateDaoPage}>
          Get Start
        </Button>
      </div>
    </div>
  );
};

export default GuidePage;
