const AssembleContainer = () => import('@/pages/auxiliary-class/assemble/contatiner');
const AssembleIndex = () => import('@/pages/auxiliary-class/assemble/index');
const AssembleGoodsDetails = () => import('@/pages/auxiliary-class/assemble/details');
const AssembleDetails = () => import('@/pages/auxiliary-class/assemble/assemble-details');
const AssembleSeparateBuy = () => import('@/pages/auxiliary-class/assemble/separate -buy');
const AssembleReceiveDetails = () => import('@/pages/auxiliary-class/assemble/receive-details');
const AssembleMyOrder = () => import('@/pages/auxiliary-class/assemble/my-order');
const AssembleCategory = () => import('@/pages/auxiliary-class/assemble/category');
const AssembleCategoryDetails = () => import('@/pages/auxiliary-class/assemble/category-details');


export const AssembleRouter = {
  path: 'assemble',
  component: AssembleContainer,
  children: [
    {
      meta: {title: "拼团抢购", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "AssembleIndex",
      component: AssembleIndex
    }, {
      meta: {title: "拼团详情", needJsSdk: true},
      path: "goodsDetails",
      name: "AssembleGoodsDetails",
      component: AssembleGoodsDetails
    }, {
      meta: {title: "我的拼团", needJsSdk: true, defaultTab: true,},
      path: "myOrder",
      name: "AssembleMyOrder",
      component: AssembleMyOrder
    }, {
      meta: {title: "拼团详情", needJsSdk: true,},
      path: "assembleDetails",
      name: "AssembleDetails",
      component: AssembleDetails
    }, {
      meta: {title: "拼团订单支付", needJsSdk: true,},
      path: "separateBuy",
      name: "AssembleSeparateBuy",
      component: AssembleSeparateBuy
    }, {
      meta: {title: "领取详情", needJsSdk: true,},
      path: "receiveDetails",
      name: "AssembleReceiveDetails",
      component: AssembleReceiveDetails
    }, {
      meta: {title: "拼团分类", needJsSdk: true, defaultTab: true,},
      path: "category",
      name: "AssembleCategory",
      component: AssembleCategory
    }, {
      meta: {title: "分类详情", needJsSdk: true, defaultTab: true,},
      path: "categoryDetails",
      name: "AssembleCategoryDetails",
      component: AssembleCategoryDetails
    }]
}
