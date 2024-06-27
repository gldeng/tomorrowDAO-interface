import { fetchDaoInfo } from 'api/request';
import { TBreadcrumbItems } from 'components/Breadcrumb';
import { curChain } from 'config';
type TUpdateCallBack = (items: TBreadcrumbItems) => void;

const homePage: TBreadcrumbItems = [
  {
    title: 'Home',
    href: '/',
  },
];
const explorePage: TBreadcrumbItems = [
  ...homePage,
  {
    title: 'Explore',
    href: '/explore',
  },
];
const createDaoPage: TBreadcrumbItems = [
  ...homePage,
  {
    title: 'Create a DAO',
  },
];
export const defaultDaoName = 'DAO Information';
type TBreadcrumbFn = (id: string, daoName: string) => TBreadcrumbItems;
// ------- href: /dao/:id
const daoDetailPage: TBreadcrumbFn = (id, daoName) => {
  return [
    ...explorePage,
    {
      title: daoName,
      href: `/dao/${id}`,
    },
  ];
};
const createProposalPage: TBreadcrumbFn = (id, daoName) => {
  return [
    ...(daoDetailPage(id, daoName) ?? []),
    {
      title: 'Create Proposal',
    },
  ];
};
const treasuryPage: TBreadcrumbFn = (id, daoName) => {
  return [
    ...(daoDetailPage(id, daoName) ?? []),
    {
      title: 'Treasury',
    },
  ];
};
const membersPage: TBreadcrumbFn = (id, daoName) => {
  return [
    ...(daoDetailPage(id, daoName) ?? []),
    {
      title: 'Members',
    },
  ];
};
const myVotesPage: TBreadcrumbFn = (id, daoName) => {
  return [
    ...(daoDetailPage(id, daoName) ?? []),
    {
      title: 'My Votes',
    },
  ];
};
const settingPage: TBreadcrumbFn = (id, daoName) => {
  return [
    ...(daoDetailPage(id, daoName) ?? []),
    {
      title: 'Settings',
    },
  ];
};
const proposalInformationPage: TBreadcrumbFn = (id, daoName) => {
  return [
    ...(daoDetailPage(id, daoName) ?? []),
    {
      title: 'Proposal',
    },
  ];
};
interface IDaoMetaData {
  name: string;
}
class BreadCrumb {
  cacheDaoInfo: Record<string, IDaoMetaData> = {};

  getDaoName = async (id: string) => {
    if (this.cacheDaoInfo[id]) {
      return this.cacheDaoInfo[id].name;
    }
    const res = await fetchDaoInfo({
      daoId: id,
      chainId: curChain,
    });
    const name = res.data?.metadata?.name;
    this.cacheDaoInfo[id] = {
      name,
    };
    return name;
  };
  updateBreadCrumb: TUpdateCallBack = () => {
    //
  };
  public setUpdateFunction(cb: TUpdateCallBack) {
    this.updateBreadCrumb = cb;
  }
  public updateDaoDetailPage(id: string, daoName?: string) {
    if (daoName) {
      this.cacheDaoInfo[id] = {
        name: daoName,
      };
    } else {
      daoName = this.cacheDaoInfo[id]?.name ?? defaultDaoName;
    }
    this.updateBreadCrumb(daoDetailPage(id, daoName));
  }
  public async updateCreateDaoPage() {
    this.updateBreadCrumb(createDaoPage);
  }
  public async updateCreateProposalPage(id: string) {
    const daoName = await this.getDaoName(id);
    this.updateBreadCrumb(createProposalPage(id, daoName));
  }
  public async updateTreasuryPage(id: string) {
    const daoName = await this.getDaoName(id);
    this.updateBreadCrumb(treasuryPage(id, daoName));
  }
  public async updateMembersPage(id: string) {
    const daoName = await this.getDaoName(id);
    this.updateBreadCrumb(membersPage(id, daoName));
  }
  public async updateMyVotesPage(id: string) {
    const daoName = await this.getDaoName(id);
    this.updateBreadCrumb(myVotesPage(id, daoName));
  }
  public async updateSettingPage(id: string) {
    const daoName = await this.getDaoName(id);
    this.updateBreadCrumb(settingPage(id, daoName));
  }
  public async updateProposalInformationPage(id: string) {
    const daoName = await this.getDaoName(id);
    this.updateBreadCrumb(proposalInformationPage(id, daoName));
  }
  public async clearBreadCrumb() {
    this.updateBreadCrumb([]);
  }
}
const breadCrumb = new BreadCrumb();
export default breadCrumb;
