/**
 * 签到
 */

const signInContainer = () => import('@/pages/sign-in/container');
const signInToday = () => import("@/pages/sign-in/index")
const signInRule = () => import("@/pages/sign-in/sign-in-rule")
const signInRanking = () => import("@/pages/sign-in/sign-in-ranking")
const signInPointsDetails= () => import("@/pages/sign-in/points-details")
const signInRecord= () => import("@/pages/sign-in/sign-in-record")
export const signInRouter = {
  path: 'sign',
  component: signInContainer,
  children:[
    {
      meta:{title:"签到",
        needJsSdk:true},
      path: "/",
      name: "signInToday",
      component: signInToday,
    },{
      meta:{title:"签到规则",needJsSdk:true},
      path: "signInRule",
      name: "signInRule",
      component: signInRule,
    },{
      meta:{title:"签到排行",needJsSdk:true},
      path: "signInRanking",
      name: "signInRanking",
      component: signInRanking,
    },{
      meta:{title:"我的积分",tab:true,needJsSdk:true},
      path: "signInPointsDetails",
      name: "signInPointsDetails",
      component: signInPointsDetails,
    },{
      meta:{title:"签到记录",needJsSdk:true},
      path: "signInRecord",
      name: "signInRecord",
      component: signInRecord,
    }]
};
