/**
 * 商圈
 */
const BusinessDistrict = () => import('@/pages/business-district/container');
const BusinessDistrictIndex = () => import('@/pages/business-district');
const BusinessDistrictComment = () => import('@/pages/business-district/comment');
const BusinessDistrictStoreList = () => import('@/pages/business-district/store-list');
const BusinessDistrictStoreManagement = ()=> import('@/pages/business-district/store-management');
const BusinessList = ()=> import('@/pages/business-district/business-list')
const StoreRankingList = ()=> import('@/pages/business-district/store-ranking-list')
export const businessDistrictRouter = {
  path: 'businessDistrict',
  component: BusinessDistrict,
  children: [
    {
      meta: {tab: true, title: "", notRequiredValid: true,needJsSdk: true},
      path: '/',
      name: 'BusinessDistrictIndex',
      component: BusinessDistrictIndex,
    }, {
      meta: {title: "评论",needJsSdk:true},
      path: 'comment',
      name: 'BusinessDistrictComment',
      component: BusinessDistrictComment,
    }, {
      meta: {title: "列表", notRequiredValid: true,tab:true,needJsSdk:true},
      path: 'storeList',
      name: 'BusinessDistrictStoreList',
      component: BusinessDistrictStoreList,
    },{
      meta: {title: "管理", notRequiredValid: true,tab:true,needJsSdk:true},
      path: 'storeManagement',
      name: 'BusinessDistrictStoreManagement',
      component: BusinessDistrictStoreManagement,
    },{
      meta: {title: "店铺排行榜", notRequiredValid: true,needJsSdk:true},
      path: 'storeRankingList',
      name: 'StoreRankingList',
      component: StoreRankingList,
    },{
      meta: {title: "店铺列表", notRequiredValid: true},
      path: 'businessList',
      name: 'BusinessList',
      component: BusinessList,
    }
  ]
}
