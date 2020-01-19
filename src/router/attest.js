/**
 *  认证
 */

const attestContainer = () => import('@/pages/attest/container');
const attestIndex = () => import('@/pages/attest/index');
const attestPersonal = () => import ('@/pages/attest/personal-attest')
const firmAttest = () => import ('@/pages/attest/firm-attest')
const attestMargin = () => import ('@/pages/attest/margin')

export const attestRouter = {
  meta:{title:"认证中心"},
  path: 'attestIndex',
  component: attestContainer,
  children:[{
    meta:{title:"认证中心",tab:true,needJsSdk:true},
    path: '/',
    name:"attestIndex",
    component: attestIndex,
  },{
    meta:{title:"个人认证",needJsSdk:true},
    path: 'attestPersonal',
    name:'attestPersonal',
    component: attestPersonal,
  },{
    meta:{title:"企业认证",needJsSdk:true},
    path: 'firmAttest',
    name:'firmAttest',
    component:firmAttest,
  },{
    meta:{title:"诚信保证金",needJsSdk:true},
    path: 'attestMargin',
    name:'attestMargin',
    component:attestMargin,
  }]
};
