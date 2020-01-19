/**
 * 商圈
 */
// yellowPage is start
const YellowPage = () => import('@/pages/yellow-page/container');
const YellowPageIndex = () => import('@/pages/yellow-page/index');
const YellowPageClassfy = () => import('@/pages/yellow-page/classfy');
const YellowPageInfo = () => import('@/pages/yellow-page/info');
const YellowPageMine = ()=> import('@/pages/yellow-page/mine');
const YellowPageSettled = ()=> import('@/pages/yellow-page/settled');
const ClassfyPage = ()=> import('@/pages/yellow-page/classPage');
const PageList = ()=> import('@/pages/yellow-page/pageList');
// yellowPage is end
export const yellowPageRouter = {
  path: 'yellowPage',
  component: YellowPage,
  children: [
    {
      meta: {tab: false, title: "黄页", notRequiredValid: true,needJsSdk: true,defaultTab:true},
      path: '/',
      name: 'YellowPageIndex',
      component: YellowPageIndex,
    }, {
      meta: {title: "分类",needJsSdk:true,defaultTab:true},
      path: 'classfy',
      name: 'YellowPageClassfy',
      component: YellowPageClassfy,
    }, {
      meta: {title: "详情页", notRequiredValid: true,tab:false,needJsSdk:true},
      path: 'yellowInfo',
      name: 'YellowPageInfo',
      component: YellowPageInfo,
    },{
      meta: {title: "我的记录", notRequiredValid: true,needJsSdk:true,defaultTab:true},
      path: 'yellowMine',
      name: 'YellowPageMine',
      component: YellowPageMine,
    },{
      meta: {title: "入驻", notRequiredValid: true,needJsSdk:true},
      path: 'yellowPageSettled',
      name: 'YellowPageSettled',
      component: YellowPageSettled,
    },{
      meta: {title: "分类", notRequiredValid: true,defaultTab:true,needJsSdk:true},
      path: 'classfyPage',
      name: 'ClassfyPage',
      component: ClassfyPage,
    },{
      meta: {title: "分类", notRequiredValid: true,defaultTab:true,needJsSdk:true},
      path: 'pageList',
      name: 'PageList',
      component: PageList,
    }
  ]
}
