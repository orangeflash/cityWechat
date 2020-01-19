const BargainContainer = () => import("@/pages/auxiliary-class/bargain/contatiner");
const BargainIndex = () => import("@/pages/auxiliary-class/bargain/index");
const BargainDetails = () => import("@/pages/auxiliary-class/bargain/details");
const BargainMyJoin = () => import("@/pages/auxiliary-class/bargain/my-join");
const BargainWriteOff = () => import("@/pages/auxiliary-class/bargain/write-off");


export const BargainRouter = {
  path: 'bargain',
  component: BargainContainer,
  children: [
    {
      meta: {title: "砍价", needJsSdk: true, defaultTab: true,},
      path: '/',
      name: 'BargainIndex',
      component: BargainIndex
    }, {
      meta: {title: "我参加的", needJsSdk: true, defaultTab: true,},
      path: 'myJoin',
      name: 'BargainMyJoin',
      component: BargainMyJoin
    }, {
      meta: {title: "商品详情", needJsSdk: true,},
      path: 'details',
      name: 'BargainDetails',
      component: BargainDetails
    }, {
      meta: {title: "商品核销", needJsSdk: true,},
      path: 'writeOff',
      name: 'BargainWriteOff',
      component: BargainWriteOff
    }
  ]
}
