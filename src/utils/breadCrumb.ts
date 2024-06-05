import { TBreadcrumbItems } from 'components/Breadcrumb';
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
// ------- href: /dao/:id
const daoDetailPage: (id: string) => TBreadcrumbItems = (id: string) => {
  return [
    ...explorePage,
    {
      title: 'DAO Information',
      href: `/dao/${id}`,
    },
  ];
};
const createProposalPage: (id: string) => TBreadcrumbItems = (id: string) => {
  return [
    ...(daoDetailPage(id) ?? []),
    {
      title: 'Create Proposal',
    },
  ];
};
const myVotesPage: (id: string) => TBreadcrumbItems = (id: string) => {
  return [
    ...(daoDetailPage(id) ?? []),
    {
      title: 'My Votes',
    },
  ];
};
const settingPage: (id: string) => TBreadcrumbItems = (id: string) => {
  return [
    ...(daoDetailPage(id) ?? []),
    {
      title: 'Settings',
    },
  ];
};
const proposalInformationPage: (id: string) => TBreadcrumbItems = (id: string) => {
  return [
    ...(daoDetailPage(id) ?? []),
    {
      title: 'Proposal',
    },
  ];
};
class BreadCrumb {
  updateBreadCrumb: TUpdateCallBack = () => {
    //
  };
  public setUpdateFunction(cb: TUpdateCallBack) {
    this.updateBreadCrumb = cb;
  }
  public updateDaoDetailPage(id: string) {
    this.updateBreadCrumb(daoDetailPage(id));
  }
  public updateCreateProposalPage(id: string) {
    this.updateBreadCrumb(createProposalPage(id));
  }
  public updateMyVotesPage(id: string) {
    this.updateBreadCrumb(myVotesPage(id));
  }
  public updateSettingPage(id: string) {
    this.updateBreadCrumb(settingPage(id));
  }
  public updateProposalInformationPage(id: string) {
    this.updateBreadCrumb(proposalInformationPage(id));
  }
  public clearBreadCrumb() {
    this.updateBreadCrumb([]);
  }
}
const breadCrumb = new BreadCrumb();
export default breadCrumb;
