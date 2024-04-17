import { Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import { IVotingResult } from './components/type';

const tabItems = [
  {
    key: '1',
    label: 'Description',
    children: (
      <div className="text-base	px-8 py-4">
        <span className="font-medium">Abstract</span>
        <span>
          - The ArbitrumDAO Procurement Committee (ADPC) is tasked with facilitating & administering
          various procurement frameworks within the Arbitrum Ecosystem, creating new procurement
          frameworks for DAO Ratification & creating a proposal for security-service subsidies.
        </span>

        <div>
          <span className="font-medium">Motivation</span>
          <span>
            - Implementing the ArbitrumDAO Procurement Committee (ADPC) and its associated
            frameworks is essential for the Arbitrum community as it ensures a transparent,
            efficient, and accountable approach to procurement, benefiting the ecosystem by securing
            high-quality service providers via a preemptive quality assurance mechanism which is the
            procurement framework.
          </span>
        </div>
        <div>
          <span className="font-medium">Rationale</span>
          <span>
            - the ADPC will play a pivotal role in achieving further organization within the
            ArbitrumDAO. The mandate of the ADPC aims to create an optimal organizational framework
            for service procurement while also creating a marketplace for service providers that
            would have gone through preemptive quality assurance.
          </span>
        </div>
        <div>
          <span className="font-medium">Steps to Implement</span>
          <span>
            - The AIP passed Snapshot on the 9th of January 2024. Following the conclusion of the
            Snapshot vote, the AIP is now proceeding to the on-chain voting stage so as to ratify
            the funding & process for the ADPC. Once the forecited steps are concluded the election
            process will commence. Specifications & Timeline - Specifications & timeline can be
            found in the following sections.
          </span>
        </div>
        <div>
          <span className="font-medium">Overall Cost</span>
          <span>
            - For a 6-month term, $8,000 per month, per member (payable in ARB at the applicable
            conversion rate at the end of the respective month) & 1,000ARB per Multi-sig member [per
            month]
          </span>
        </div>
        <div className="font-medium">
          The Funding Request from the on-chain vote will be 200,000ARB (a buffer has been added so
          that, in the case of ARB depreciation, the ADPC Multi-sig is still able to satisfy
          payments to procurement committee members. Unutilized ARB will be returned to the
          ArbitrumDAO Treasury)
        </div>
      </div>
    ),
  },
  {
    key: '2',
    label: 'Contract Information',
    children: (
      <div className="text-base	px-8 py-4">
        <div className="flex flex-col gap-2 pb-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium}>Contract Name</Typography.Text>
          </div>
          <div>
            <Typography.Text className="text-Neutral-Secondary-Text">
              AElf.ContractNames.Token
            </Typography.Text>
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium}>Contract Address</Typography.Text>
          </div>
          <div>
            <HashAddress address="JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZS" />
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium}>
              Contract Method Name
            </Typography.Text>
          </div>
          <div>
            <Typography.Text className="text-Neutral-Secondary-Text">
              AddAddressToCreateToken WhiteList
            </Typography.Text>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium}>Contract Params</Typography.Text>
          </div>
          <div className="p-4 rounded-md bg-[#F8F8F8]">
            <div>
              <Typography.Text className="text-Neutral-Secondary-Text">
                &quot;DHo2K7oUXXq3kJRs1JpuwqBJP56gqoaeSKFfuvr9x8svf3vEJ&quot;
              </Typography.Text>
            </div>
            <div>
              <Typography.Text className="text-Neutral-Secondary-Text">
                &quot;12345&quot;
              </Typography.Text>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: '3',
    label: 'Organization Information',
    children: (
      <div className="text-base	px-8 py-4">
        <div className="flex flex-col gap-2 pb-8">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium}>Organization Name</Typography.Text>
          </div>
          <div>
            <Typography.Text className="text-Neutral-Secondary-Text">
              Organization name 01
            </Typography.Text>
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-2">
          <div>
            <Typography.Text fontWeight={FontWeightEnum.Medium}>
              Organization Address
            </Typography.Text>
          </div>
          <div>
            <HashAddress address="JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZS" />
          </div>
        </div>
      </div>
    ),
  },
];

const stepItmes = [
  {
    title: (
      <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
        Proposal Posted
      </Typography.Title>
    ),
    description: (
      <div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Block
          </Typography.Text>
          ,
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            18756508
          </Typography.Text>
          ,
        </div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Nov 13, 2023
          </Typography.Text>
          ,
        </div>
      </div>
    ),
  },
  {
    title: (
      <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
        Voting Period Active
      </Typography.Title>
    ),
    description: (
      <div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Block
          </Typography.Text>
          ,
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            18756508
          </Typography.Text>
          ,
        </div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Nov 13, 2023
          </Typography.Text>
          ,
        </div>
      </div>
    ),
  },
  {
    title: (
      <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
        Voting Period Ends
      </Typography.Title>
    ),
    description: (
      <div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Block
          </Typography.Text>
          ,
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            18756508
          </Typography.Text>
          ,
        </div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Nov 13, 2023
          </Typography.Text>
          ,
        </div>
      </div>
    ),
  },
  {
    title: (
      <Typography.Title fontWeight={FontWeightEnum.Medium} level={7}>
        Proposal Expires
      </Typography.Title>
    ),
    description: (
      <div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Block
          </Typography.Text>
          ,
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            18756508
          </Typography.Text>
          ,
        </div>
        <div>
          <Typography.Text size="small" className="text-Neutral-Secondary-Text">
            Nov 13, 2023
          </Typography.Text>
          ,
        </div>
      </div>
    ),
  },
];

const tableData: IVotingResult[] = [];
for (let i = 0; i < 103; i++) {
  tableData.push({
    chainId: 'AELF',
    transactionId: 'c506dd8cfasf989fasdf167dd85bb',
    voter: 'c506dd8cfasf989fasdf167dd85bb',
    amount: 2232323232,
    voteOption: 'Rejected',
    voteTime: '2022/11/1610:32:11',
  });
}

export { tabItems, stepItmes, tableData };
