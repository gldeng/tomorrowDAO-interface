import { Collapse, HashAddress, Typography } from 'aelf-design';
import Image from 'next/image';
import { Divider, Descriptions, DescriptionsProps, Button } from 'antd';
import useResponsive from 'hooks/useResponsive';
import PreviewFile from 'components/PreviewFile';
import { Skeleton } from 'components/Skeleton';
import { colorfulSocialMediaIconMap } from 'assets/imgs/socialMediaIcon';
import settingSrc from 'assets/imgs/setting-icon.svg';
import DaoLogo from 'assets/imgs/dao-logo.svg';
import ErrorResult from 'components/ErrorResult';
import Link from 'next/link';
import { getExploreLink } from 'utils/common';
import { useChainSelect } from 'hooks/useChainSelect';
import './index.css';
import { curChain, NetworkDaoHomePathName } from 'config';
import { useWebLogin } from 'aelf-web-login';

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
  daoId?: string;
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
    daoId,
  } = props;
  const { wallet } = useWebLogin();

  const { isLG, isSM } = useResponsive();
  const { isSideChain } = useChainSelect();
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
              chain={curChain}
            ></HashAddress>
          </Link>
        ),
      };
    })
    .filter(Boolean) as DescriptionsProps['items'];

  const items: DescriptionsProps['items'] | Array<null> = [
    !isNetworkDAO
      ? {
          key: '1',
          label: 'Creator',
          children: (
            <HashAddress
              className="address"
              preLen={8}
              endLen={11}
              chain={curChain}
              address={data?.creator ?? '-'}
            ></HashAddress>
          ),
        }
      : null,
    ...(isNetworkDAO ? [] : contractItems ?? []),
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
    isNetworkDAO && isSideChain
      ? null
      : {
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
  ].filter(Boolean) as DescriptionsProps['items'];

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
          <div className="dao-basic-info">
            <div className="dao-detail-logo px-4 lg:px-8">
              <Image
                width={80}
                height={80}
                src={metadata?.logoUrl ?? DaoLogo}
                alt=""
                className="mr-2 rounded-full logo-image"
              ></Image>
              <div className="flex">
                {wallet.address === data?.creator && (
                  <Link
                    href={
                      isNetworkDAO
                        ? `${NetworkDaoHomePathName}/${daoId}/edit`
                        : `/dao/${daoId}/edit`
                    }
                    className="mr-[10px]"
                  >
                    <div className="flex items-center justify-center h-8 bg-Neutral-Default-BG px-2 leading-8 rounded-md cursor-pointer">
                      <Image width={14} height={14} src={settingSrc} alt=""></Image>
                      {!isSM && <span className="ml-1 text-neutralPrimaryText">Settings</span>}
                    </div>
                  </Link>
                )}

                <PreviewFile list={fileInfoList} />
              </div>
            </div>
            <div className="dao-detail-desc px-4 lg:px-8">
              <div>
                <h2 className="title">{metadata?.name}</h2>
                <p className="description">{metadata?.description}</p>
              </div>
              <div className="flex gap-2">
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
          </div>
          <Divider className="mb-2 lg:mb-6" />
          <Collapse defaultActiveKey={isNetworkDAO ? [] : ['1']} ghost>
            <Collapse.Panel header={<Typography.Title>Dao Information</Typography.Title>} key="1">
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
