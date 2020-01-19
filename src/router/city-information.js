/**
 * 资讯
 */

const CityInformation = () => import('@/pages/city-information/container');
const CityInformationIndex = () => import('@/pages/city-information/index');
const CityInformationDetail = () => import('@/pages/city-information/detail');
const CityInformationPostInformation = () => import( '@/pages/city-information/post-infomation');
const CityInformationRewardAuthor = () => import('@/pages/city-information/reward-author');
const cityInformationSearch = () => import("@/pages/city-information/city-search");
const CityInformationSearchList = () => import("@/pages/city-information/city-search-list");
const CityInformationCategoryList = ()=> import("@/pages/city-information/city-category-list")


export const cityInformationRouter = {
  meta: {title: '同城资讯',needJsSdk:true},
  path: 'cityInformation',
  component: CityInformation,
  children: [
    {
      meta: {title: '', notRequiredValid: true,tab:true,needJsSdk:true},
      path: '/',
      name: 'CityInformationIndex',
      component: CityInformationIndex
    },
    {
      meta: {title: '发布'},
      path: 'postInformation',
      name: 'CityInformationPostInformation',
      component: CityInformationPostInformation
    }, {
      meta: {title: '详情',notRequiredValid: true,tab:false,needJsSdk:true},
      path: 'detail',
      name: 'CityInformationDetail',
      component: CityInformationDetail
    },
    {
      meta: {title: '打赏楼主',needJsSdk: true},
      path: 'rewardAuthor',
      name: 'CityInformationRewardAuthor',
      component: CityInformationRewardAuthor,
    }, {
      meta: {title: '搜索', notRequiredValid: true,needJsSdk:true},
      path: 'cityInformationSearch',
      name: 'cityInformationSearch',
      component: cityInformationSearch,
    }, {
      meta: {title: ' 搜索结果 ', notRequiredValid: true,needJsSdk:true},
      path: 'cityInformationSearchList',
      name: "CityInformationSearchList",
      component: CityInformationSearchList,
    },{
      meta: {title: '列表',notRequiredValid: true,tab:true,needJsSdk:true},
      path: 'categoryList',
      name: 'CityInformationCategoryList',
      component: CityInformationCategoryList,
    }]
};
