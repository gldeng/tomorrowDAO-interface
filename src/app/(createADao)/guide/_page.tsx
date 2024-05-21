'use client';
import { Button, Typography, FontWeightEnum } from 'aelf-design';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useJumpByPath from 'hooks/useJumpByPath';
import { ReactComponent as CircleDot } from 'assets/imgs/circle-dot.svg';
import { symbolmarketUrl } from 'config';

const linkArr = [
  { label: 'DAO Governance Contract', path: '/' },
  { label: 'Treasury Contract', path: '/' },
  { label: 'Voting Contract', path: '/' },
  { label: 'Election Contract', path: '/' },
];

const offers = [
  {
    label: 'Trustworthy',
    text: ' Trusted by the aelf network for creating its DAO, guaranteeing reliability and integrity.',
  },
  {
    label: 'Secure',
    text: 'Provides robust security measures to protect user assets and DAO treasuries.',
  },
  {
    label: 'Trustless',
    text: 'Operates entirely through collective decision-making using smart contracts, eliminating the need for intermediaries.',
  },
  {
    label: 'Customisable',
    text: 'Enables the customisation of governance mechanisms, voting rules, and other parameters to suit specific needs.',
  },
  {
    label: 'Boundless',
    text: 'Accomodates a wide range of scenarios and offers a low entry barrier for creating and participating in DAOs.',
  },
];

const GuidePage = () => {
  const router = useRouter();
  const jump = useJumpByPath();

  const toCreateDaoPage = () => {
    router.push('/create');
  };
  const onJumpHandler = () => {
    jump(symbolmarketUrl);
  };

  return (
    <div className="px-4 lg:px-8">
      <div className="py-6 flex flex-col gap-3 border-0 border-b border-solid border-Neutral-Divider">
        <Typography.Title level={5} fontWeight={FontWeightEnum.Medium}>
          Governance Framework on TMRWDAO
        </Typography.Title>
        <Typography.Text>
          Launch your own DAO with a customisable governance framework tailored to your
          organisation&lsquo;s needs.
        </Typography.Text>
      </div>
      <div>
        <p className="pt-[38px] pb-[20px]">
          <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
            TMRWDAO supports the creation of Decentralised Autonomous Organisations (DAOs) where
            creators can customise the governance mechanisms to ensure efficient and fair
            operations. The two mechanisms supported are &quot;Referendum&quot; and &quot;High
            Council&quot;.
          </Typography.Title>
        </p>
        <p>
          <Typography.Text>
            -&gt; Referendum: This is the primary governance mechanism that all DAOs need to
            establish. By enabling all members to vote on and execute proposals, referendum ensure
            inclusiveness and fairness in the decision-making process. It allows everyone to
            directly express their opinions on important matters and influence the future direction
            of the DAO through voting on proposals.
          </Typography.Text>
        </p>
        <p className="py-[20px]">
          <Typography.Text>
            -&gt; High Council: This is a supplementary governance mechanism that is optional for
            DAOs to enable. The High Council comprises a small group of users selected based on
            predefined rules, and its members are granted the authority to review, vote on, and
            execute proposals. The High Council aims to expedite the decision-making process,
            ensuring that the DAO can promptly respond to changes and challenges.
          </Typography.Text>
        </p>
      </div>

      <div className="py-6">
        <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
          Features
        </Typography.Title>
        <div className="pt-4">
          <ul className="flex flex-col gap-4">
            {offers.map((ele, idx) => (
              <li className="flex gap-2" key={idx}>
                <div className="flex items-center h-[22px]">
                  <CircleDot />
                </div>
                <Typography.Text className="flex-1">
                  <strong>{ele.label}</strong>: {ele.text}
                </Typography.Text>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="py-6">
        <Typography.Title level={6} fontWeight={FontWeightEnum.Medium}>
          All You Need to Do
        </Typography.Title>
        <div className="pt-4">
          <ul className="flex flex-col gap-4">
            <li className="flex gap-2">
              <div className="flex items-center h-[22px]">
                <CircleDot />
              </div>
              <div className="flex-1">
                <Typography.Text>
                  If needed, you can issue a governance token. You can create and issue your token
                  via{' '}
                  <Typography.Text
                    onClick={onJumpHandler}
                    fontWeight={FontWeightEnum.Medium}
                    className="pl-0 sm:pl-2 cursor-pointer !text-Brand-Brand hover:text-Brand-hover active:text-Brand-click"
                  >
                    Symbol Market
                  </Typography.Text>
                  . The platform allows you to acquire SEEDs, which enable you to create tokens with
                  symbol of your preference.
                </Typography.Text>
              </div>
            </li>
            <li className="flex gap-2">
              <div className="flex items-center h-[22px]">
                <CircleDot />
              </div>
              <Typography.Text className="flex-1">
                Learn about the smart contracts that could be used for creating your DAO. These
                contracts are deployed by TMRWDAO and can empower you to activate specific
                functionalities in your own DAO.
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
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default GuidePage;
