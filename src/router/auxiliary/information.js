/**
 * 信息定制
 */

const xxContainer = () => import('@/pages/auxiliary-class/information/contatiner');
const Index = () => import('@/pages/auxiliary-class/information/index');
const xxDetails = () => import('@/pages/auxiliary-class/information/details');
const ReleaseXx = () => import('@/pages/auxiliary-class/information/releasexx');
const Wd = () => import('@/pages/auxiliary-class/information/wd');
const Kt = () => import('@/pages/auxiliary-class/information/kt');
const Xxcategory = () => import('@/pages/auxiliary-class/information/category');
const Xxwdzl = () => import('@/pages/auxiliary-class/information/wdzl');
const Xxzlxq = () => import('@/pages/auxiliary-class/information/zlxq');
export const xxRouter = {
  path: 'xx',
  component: xxContainer,
  children: [
    {
      meta: {title: "信息首页",  notRequiredValid: true,needJsSdk: true,defaultTab:true},
      path: "/",
      name: "Index",
      component: Index
    },
    {
      meta: {title: "信息详情", needJsSdk: true},
      path: "details",
      name: "xxDetails",
      component: xxDetails
    },
    {
      meta: {title: "发布信息", needJsSdk: true},
      path: "releasexx",
      name: "ReleaseXx",
      component: ReleaseXx
    },
    {
      meta: {title: "我的",needJsSdk: true,defaultTab:true},
      path: "wd",
      name: "Wd",
      component: Wd
    },
    {
      meta: {title: "开通频道",needJsSdk: true,defaultTab:true},
      path: "kt",
      name: "Kt",
      component: Kt
    },
    {
      meta: {title: '信息分类', needJsSdk: true},
      path: 'category',
      name: 'Xxcategory',
      component: Xxcategory
    },
    {
      meta: {title: '我的资料', needJsSdk: true},
      path: 'wdzl',
      name: 'Xxwdzl',
      component: Xxwdzl
    },
    {
      meta: {title: '资料详情', needJsSdk: true},
      path: 'zlxq',
      name: 'Xxzlxq',
      component: Xxzlxq
    },
  ]
};
