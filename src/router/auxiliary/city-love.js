const CityLoveContainer = () => import('../../pages/auxiliary-class/city-love/contatiner');
const CityLoveIndex = () => import('../../pages/auxiliary-class/city-love/index');
const CityLoveMyData = () => import('../../pages/auxiliary-class/city-love/my-data');
const CityLoveMyFollow = () => import('../../pages/auxiliary-class/city-love/my-follow');
const CityLoveMyMessage = () => import('../../pages/auxiliary-class/city-love/my-message');
const CityLoveDetails = () => import('../../pages/auxiliary-class/city-love/details');
const CityLoveCircle = () => import('../../pages/auxiliary-class/city-love/circle');
const CityLoveReleaseDynamic = () => import('../../pages/auxiliary-class/city-love/release-dynamic');
const CityLoveDynamicDetails = () => import('../../pages/auxiliary-class/city-love/dynamic-details');
const CityLoveMyInfo = () => import('../../pages/auxiliary-class/city-love/my-info');
const CityLoveRegister = () => import('../../pages/auxiliary-class/city-love/register');
const CityLoveRegisterTwo = () => import('../../pages/auxiliary-class/city-love/register-two');
const CityLoveRegisterThree = () => import('../../pages/auxiliary-class/city-love/register-three');
const CityLoveRegisterFour = () => import('../../pages/auxiliary-class/city-love/register-four');
const CityLoveMyDynamic = () => import('../../pages/auxiliary-class/city-love/my-dynamic');
const CityLoveBrowsingTraces = () => import('../../pages/auxiliary-class/city-love/browsing-traces');
const CityLoveAlbums = () => import('../../pages/auxiliary-class/city-love/albums');
const CityLoveTelOrder = () => import('../../pages/auxiliary-class/city-love/tel-order');


export const CityLoveRouter = {
  path: 'cityLove',
  component: CityLoveContainer,
  children: [
    {
      meta: {title: "交友首页", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "CityLoveIndex",
      component: CityLoveIndex
    }, {
      meta: {title: '圈子', defaultTab: true},
      path: 'circle',
      name: 'CityLoveCircle',
      component: CityLoveCircle
    }, {
      meta: {title: "我的资料", needJsSdk: true},
      path: "myData",
      name: "CityLoveMyData",
      component: CityLoveMyData
    }, {
      meta: {title: "我的关注", needJsSdk: true, defaultTab: true},
      path: "myFollow",
      name: "CityLoveMyFollow",
      component: CityLoveMyFollow
    }, {
      meta: {title: "聊天", needJsSdk: true, defaultTab: true},
      path: "myMessage",
      name: " CityLoveMyMessage",
      component: CityLoveMyMessage
    }, {
      meta: {title: '我的', needJsSdk: true, defaultTab: true},
      path: "myInfo",
      name: " CityLoveMyInfo",
      component: CityLoveMyInfo
    }, {
      meta: {title: "用户详情", needJsSdk: true},
      path: "details",
      name: " CityLoveDetails",
      component: CityLoveDetails
    }, {
      meta: {title: '发布动态', needJsSdk: true},
      path: 'releaseDynamic',
      name: 'CityLoveReleaseDynamic',
      component: CityLoveReleaseDynamic
    }, {
      meta: {title: '动态详情', needJsSdk: true},
      path: 'dynamicDetails',
      name: 'CityLoveDynamicDetails',
      component: CityLoveDynamicDetails
    }, {
      meta: {title: '用户注册', needJsSdk: true},
      path: 'register',
      name: 'CityLoveRegister',
      component: CityLoveRegister
    }, {
      meta: {title: '用户注册', needJsSdk: true},
      path: 'registerTwo',
      name: 'CityLoveRegisterTwo',
      component: CityLoveRegisterTwo

    }, {
      meta: {title: '用户注册', needJsSdk: true},
      path: 'registerThree',
      name: 'CityLoveRegisterThree',
      component: CityLoveRegisterThree
    }, {
      meta: {title: '用户注册', needJsSdk: true},
      path: 'registerFour',
      name: 'CityLoveRegisterFour',
      component: CityLoveRegisterFour
    }, {
      meta: {title: '我的动态', needJsSdk: true},
      path: 'myDynamic',
      name: 'CityLoveMyDynamic',
      component: CityLoveMyDynamic
    }, {
      path: 'browsingTraces',
      meta: {title: '浏览痕迹', needJsSdk: true},
      name: 'CityLoveBrowsingTraces',
      component: CityLoveBrowsingTraces
    }, {
      path: 'albums',
      meta: {title: '相册', needJsSdk: true},
      name: 'CityLoveAlbums',
      component: CityLoveAlbums
    }, {
      path: 'telOrder',
      meta: {title: '电话记录', needJsSdk: true},
      name: 'CityLoveTelOrder',
      component: CityLoveTelOrder
    }
  ]
}
