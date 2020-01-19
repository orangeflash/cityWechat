/**
 * 红包集合页
 */
const Partner = () => import('@/pages/partner-page/container');
const PartnerIndex = () => import('@/pages/partner-page/index');
const PartnerEnterForm = () => import('@/pages/partner-page/partner-enter-form');
const PartnerHome= () => import('@/pages/partner-page/partner-home');
const PartnerWdsr= () => import('@/pages/partner-page/partner-wdsr');
const PartnerSrdl= () => import('@/pages/partner-page/partner-srdl');
const PartnerWdfs= () => import('@/pages/partner-page/partner-wdfs');
const PartnerInvite= () => import('@/pages/partner-page/partner-invite');
const PartnerCash= () => import('@/pages/partner-page/partner-cash');
const PartnerCashlist= () => import('@/pages/partner-page/partner-cashlist');
const PartnerCashdetail= () => import('@/pages/partner-page/partner-cashdetail');
const PartnerWdqy= () => import('@/pages/partner-page/partner-wdqy');
export const partnerRouter = {
  path: 'partner',
  component: Partner,
  children:[
    {
      meta: {tab: false, title: "加入合伙人",needJsSdk:true, notRequiredValid: true},
      path: "/",
      name: "PartnerIndex",
      component: PartnerIndex
    },
    {
      meta:{title:"成为合伙人",needJsSdk: true},
      path: "partnerEnterForm",
      name: "PartnerEnterForm",
      component: PartnerEnterForm,
    },
    {
      meta:{title:"合伙人中心",needJsSdk: true},
      path: "partnerHome",
      name: "PartnerHome",
      component: PartnerHome,
    }
    ,
    {
      meta:{title:"我的收入",needJsSdk: true},
      path: "partnerWdsr",
      name: "PartnerWdsr",
      component: PartnerWdsr,
    },
    {
      meta:{title:"我的特权",needJsSdk: true},
      path: "partnerWdqy",
      name: "PartnerWdqy",
      component: PartnerWdqy,
    },
    {
      meta:{title:"收入详情",needJsSdk: true},
      path: "partnerSrdl",
      name: "PartnerSrdl",
      component: PartnerSrdl,
    },
    {
      meta:{title:"我的粉丝",needJsSdk: true},
      path: "partnerWdfs",
      name: "PartnerWdfs",
      component: PartnerWdfs,
    },
    {
      meta:{title:"邀请好友-合伙人",needJsSdk: true},
      path: "partnerInvite",
      name: "PartnerInvite",
      component: PartnerInvite,
    },
    {
      meta:{title:"合伙人提现",needJsSdk: true},
      path: "partnerCash",
      name: "PartnerCash",
      component: PartnerCash,
    },
    {
      meta:{title:"提现明细",needJsSdk: true},
      path: "partnerCashlist",
      name: "PartnerCashlist",
      component: PartnerCashlist,
    },{
      meta:{title:"提现详情",needJsSdk: true},
      path: "partnerCashdetail",
      name: "PartnerCashdetail",
      component: PartnerCashdetail,
    },
    ]
};
