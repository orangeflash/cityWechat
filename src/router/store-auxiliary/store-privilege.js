/**
 * 求职招聘
 */
const StorePrivilegeContainer = () => import('@/pages/store-auxiliary/store-privilege/contatiner');
const StoreManagePrivilege = () => import('@/pages/store-auxiliary/store-privilege/manage-privilege');
const StoreReleasePrivilege = () => import('@/pages/store-auxiliary/store-privilege/release-privilege');
export const storePrivilegeRouter = {
  path: 'storePrivilege',
  component: StorePrivilegeContainer,
  children:[
    {
      meta: {title: "管理会员特权",defaultTab: true, },
      path: "/",
      name: "storeManagePrivilege",
      component: StoreManagePrivilege
    },
    {
      meta: {title: "发布特权",needJsSdk: true},
      path: "storeReleasePrivilege",
      name: "StoreReleasePrivilege",
      component: StoreReleasePrivilege
    },
    ]
};
