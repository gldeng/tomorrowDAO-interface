import { Collapse, HashAddress, Typography } from 'aelf-design';
import Image from 'next/image';
import { Divider, Descriptions, DescriptionsProps } from 'antd';
import useResponsive from 'hooks/useResponsive';
import PreviewFile from 'components/PreviewFile';
import { Skeleton } from 'components/Skeleton';
import { colorfulSocialMediaIconMap } from 'assets/imgs/socialMediaIcon';
import DaoLogo from 'assets/imgs/dao-logo.svg';
import ErrorResult from 'components/ErrorResult';
import Link from 'next/link';
import { getExploreLink } from 'utils/common';
import './index.css';
import { sideChainSuffix } from 'config';

const firstLetterToLowerCase = (str: string) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};
const colorfulSocialMediaIconMapKeys = Object.keys(colorfulSocialMediaIconMap).reduce(
  (acc, key) => ({
    ...acc,
    [firstLetterToLowerCase(key)]: (colorfulSocialMediaIconMap as Record<string, string>)[key],
  }),
  {},
);

const getSocialUrl = (key: string, val: string) => {
  if (key === 'twitter') {
    return `https://twitter.com/${val.includes('@') ? val.split('@')[1] : val}`;
  }
  return val;
};
interface IParams {
  data?: IDaoInfoData;
  onChangeHCParams: any;
  isLoading: boolean;
  isError?: Error;
}
const contractMapList = [
  {
    label: 'Treasury contract',
    key: 'treasuryContractAddress',
  },
  {
    label: 'Vote Contract',
    key: 'voteContractAddress',
  },
];
export default function DaoInfo(props: IParams) {
  const {
    data,
    data: { metadata, fileInfoList = [], isNetworkDAO } = {},
    isLoading,
    isError,
    onChangeHCParams,
  } = props;

  const { isLG } = useResponsive();
  const socialMedia = metadata?.socialMedia ?? {};

  const socialMediaList = Object.keys(socialMedia).map((key) => {
    return {
      name: firstLetterToLowerCase(key),
      url: socialMedia[key as keyof typeof socialMedia],
    };
  });

  const contractItems = contractMapList
    .map((obj) => {
      const dataKey = obj.key;
      const address = data?.[dataKey as keyof IDaoInfoData];
      if (!address) return null;
      return {
        key: dataKey,
        label: obj.label,
        children: (
          <Link href={getExploreLink(address as string, 'address')} target="_blank">
            <HashAddress
              preLen={8}
              endLen={11}
              className="address"
              address={address as string}
            ></HashAddress>
          </Link>
        ),
      };
    })
    .filter(Boolean) as DescriptionsProps['items'];

  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Creator',
      children: (
        <HashAddress
          className="address"
          preLen={8}
          endLen={11}
          chain={sideChainSuffix}
          address={data?.creator ?? '-'}
        ></HashAddress>
      ),
    },
    ...(contractItems ?? []),
    {
      key: '3',
      label: 'Governance Token',
      children: data?.governanceToken ?? '-',
    },
    {
      key: '4',
      label: 'Governance Mechanism',
      children: `Referendum ${data?.isHighCouncilEnabled ? ' + High Council' : ''}`,
    },
    {
      key: '5',
      label: 'High Council',
      children: (
        <div className="dis-item">
          <span
            className="dis-common-span"
            onClick={() => {
              if (isNetworkDAO) {
                onChangeHCParams();
              }
            }}
          >
            {data?.highCouncilMemberCount ?? '-'} Members,
          </span>
          <span>Rotates Every {data?.highCouncilConfig?.electionPeriod} Days.</span>
        </div>
      ),
    },
    // {
    //   key: '6',
    //   label: 'High Council Candidates',
    //   children: (
    //     <div className="dis-item">
    //       <span
    //         className="dis-common-span"
    //         onClick={() => {
    //           onChangeHCParams(HC_CANDIDATE);
    //         }}
    //       >
    //         {data?.candidateCount ?? '-'} Candidates
    //       </span>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="dao-detail-dis">
      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <div>
          <ErrorResult />
        </div>
      ) : (
        <>
          <div className="dao-detail-dis-title px-4 lg:px-8">
            <div className="md:flex md:items-center">
              <Image
                width={32}
                height={32}
                src={metadata?.logoUrl ?? DaoLogo}
                alt=""
                className="mr-2"
              ></Image>
              <Typography.Title level={5}>{metadata?.name}</Typography.Title>
            </div>
            <PreviewFile list={fileInfoList} />
          </div>
          <div className="dao-detail-dis-dis px-4 lg:px-8">
            {metadata?.description}
            <div className="flex gap-2 mt-[16px]">
              {socialMediaList.map(
                ({ name, url }, index) =>
                  url && (
                    <Link href={getSocialUrl(name, url)} target="_blank" key={index}>
                      <Image
                        src={(colorfulSocialMediaIconMapKeys as any)[name]}
                        alt="media"
                        width={16}
                        height={16}
                      />
                    </Link>
                  ),
              )}
            </div>
          </div>
          <Divider className="mb-2 lg:mb-6" />
          <Collapse defaultActiveKey={['1']} ghost>
            <Collapse.Panel header={<Typography.Title>Creator</Typography.Title>} key="1">
              <Descriptions
                layout={isLG ? 'vertical' : 'horizontal'}
                items={items}
                column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
              />
            </Collapse.Panel>
          </Collapse>
        </>
      )}
    </div>
  );
}
