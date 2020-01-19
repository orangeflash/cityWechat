/**
 * 多商户商城
 */
const MallContainer = () => import('@/pages/auxiliary-class/mall/contatiner');
const MallIndex = () => import('@/pages/auxiliary-class/mall/index');
const MallDetails = () => import('@/pages/auxiliary-class/mall/details');
const MallCategory = () => import('@/pages/auxiliary-class/mall/category');
const MallCart = () => import('@/pages/auxiliary-class/mall/cart');
const MallMy = () => import('@/pages/auxiliary-class/mall/my');
const MallOrder = () => import('@/pages/auxiliary-class/mall/order');
const StoreDetails = () => import('@/pages/auxiliary-class/mall/store-details');
const CategoryDetails = () => import('@/pages/auxiliary-class/mall/category-details');
const OrderPay = () => import('@/pages/auxiliary-class/mall/order-pay');
const MallCommentOrder = () => import('@/pages/auxiliary-class/mall/comment-order');
const MallOrderRefund = () => import('@/pages/auxiliary-class/mall/order-refund');
const MallOrderRefundDetails = () => import('@/pages/auxiliary-class/mall/refund-details');
const MallcommentList = () => import('@/pages/auxiliary-class/mall/comment-list');


export const mallRouter = {
  path: 'mall',
  component: MallContainer,
  children: [
    {
      meta: {title: "商城", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "MallIndex",
      component: MallIndex
    }, {
      meta: {title: "详情页", needJsSdk: true},
      path: "details",
      name: "MallDetails",
      component: MallDetails
    }, {
      meta: {title: "分类", needJsSdk: true, defaultTab: true,},
      path: "category",
      name: "MallCategory",
      component: MallCategory
    }, {
      meta: {title: "购物车", needJsSdk: true, defaultTab: true,},
      path: "cart",
      name: "MallCart",
      component: MallCart
    }, {
      meta: {title: "我的", needJsSdk: true, defaultTab: true,},
      path: "my",
      name: "MallMy",
      component: MallMy
    }, {
      meta: {title: "订单", needJsSdk: true, defaultTab: true,},
      path: "order",
      name: "MallOrder",
      component: MallOrder
    }, {
      meta: {title: "店铺", needJsSdk: true},
      path: "storeDetails",
      name: "StoreDetails",
      component: StoreDetails
    }, {
      meta: {title: "分类详情", needJsSdk: true, defaultTab: true,},
      path: "categoryDetails",
      name: "CategoryDetails",
      component: CategoryDetails
    }, {
      meta: {title: "订单支付", needJsSdk: true},
      path: "orderPay",
      name: "OrderPay",
      component: OrderPay
    }, {
      meta: {title: "评论留言", needJsSdk: true},
      path: "comment",
      name: "MallCommentOrder",
      component: MallCommentOrder
    }, {
      meta: {title: "退款申请", needJsSdk: true},
      path: "orderRefund",
      name: "MallOrderRefund",
      component: MallOrderRefund
    }, {
      meta: {title: "我的订单-退款详情", needJsSdk: true},
      path: "refundDetails",
      name: "MallOrderRefundDetails",
      component: MallOrderRefundDetails
    }, {
      meta: {title: '全部评论', needJsSdk: true},
      path: 'commentList',
      name: 'CommentList',
      component: MallcommentList
    }
  ]

}
