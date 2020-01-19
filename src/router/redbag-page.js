/**
 * 红包集合页
 */
const Redbag = () => import('@/pages/redbag-page/container');
const RedbagIndex = () => import('@/pages/redbag-page/index');
const RedbagRank = () => import('@/pages/redbag-page/red-rank');
export const redbagRouter = {
  path: 'redbag',
  component: Redbag,
  children:[
    {
      meta: {tab: true, title: "抢福利",needJsSdk:true, notRequiredValid: true},
      path: "/",
      name: "RedbagIndex",
      component: RedbagIndex
    },
    {
      meta:{title:"福利排行榜",needJsSdk: true},
      path: "redbagRank",
      name: "RedbagRank",
      component: RedbagRank,
    }
    ]
};
