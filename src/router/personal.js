/**
 * 个人中心
 */

const Personal = () => import('@/pages/personal/container');
const PersonalIndex = () => import('@/pages/personal/index');
const PersonalMyPublication = () => import('@/pages/personal/my-publication');
const PersonalMyPublicationContent = () => import('@/pages/personal/my-publication-content');


const PersonalMyCollection = () => import('@/pages/personal/my-collection');
const PersonalHomePage = () => import('@/pages/personal/homepage');
const PersonalSettings = () => import('@/pages/personal/settings');
const PersonalSettingsPhone = () => import('@/pages/personal/setting-phone');
const PersonalSettingsPhoneGetCord = () => import('@/pages/personal/setting-phone-get-cord');
const PersonalAttention = () => import ('@/pages/personal/my-attention');
const personalShippingAddress = () => import("@/pages/personal/shipping-address");
const personalEditAddress = () => import("@/pages/personal/edit-address");

const personalIntegralMall = () => import("@/pages/personal/integral-mall/container");
const personalIntegralMallIndex = () => import("@/pages/personal/integral-mall/index");
const goodsDetails = () => import("@/pages/personal/integral-mall/goods-details");
const myOrderIndex = () => import("@/pages/personal/integral-mall/my-order/index");
const orderPay = () => import("@/pages/personal/integral-mall/order-pay");
const task = () => import("@/pages/personal/integral-mall/task");
const writeOff = () => import("@/pages/personal/integral-mall/my-order/write-off")

const personalMyIntegral = () => import("@/pages/personal/my-integral");
const integralCategory = () => import("@/pages/personal/integral-mall/integral-category")
const StoreWriteOff = () => import("@/pages/auxiliary-class/mall/write-off")

const personalMyBalance = () => import("@/pages/personal/my-balance");
const personalMyOrder = () => import("@/pages/personal/my-order");
const personalMyGroupBuy = () => import("@/pages/personal/my-group-buy");
const personalMySecondBuy = () => import("@/pages/personal/my-second-buy");

const personalMyHuckster = () => import("@/pages/personal/my-huckster");
const personalMySignUp = () => import("@/pages/personal/my-sign-up");
const personalMyTicket = () => import("@/pages/personal/my-ticket");
const PersonalRechargeCenter = () => import("@/pages/personal/recharge-center");
const CustomerSerivce = () => import("@/pages/common/customer-service");
export const personalRouter = {
  path: 'personal',
  component: Personal,
  children: [
    {
      meta: {tab: true, title: "个人中心", needJsSdk: true, notRequiredValid: true},
      path: "/",
      name: "Personal",
      component: PersonalIndex
    }, {
      path: "myPublication",
      component: PersonalMyPublication,
      children: [
        {
          meta: {title: "我的发布", needJsSdk: true, tab: true},
          path: "/",
          name: "PersonalMyPublication",
          component: PersonalMyPublicationContent
        }
      ]
    }, {
      meta: {title: "我的收藏", tab: true, needJsSdk: true},
      path: "myCollection",
      name: "PersonalMyCollection",
      component: PersonalMyCollection
    }, {
      meta: {title: "个人主页", tab: true, needJsSdk: true},
      path: "homepage",
      name: "PersonalHomePage",
      component: PersonalHomePage
    }, {
      meta: {title: "修改资料", needJsSdk: true},
      path: "setting",
      name: "PersonalSettings",
      component: PersonalSettings,
    }, {
      meta: {title: "设置手机号", needJsSdk: true},
      path: "settingsPhone",
      name: "PersonalSettingsPhone",
      component: PersonalSettingsPhone,
    }, {
      meta: {title: "获取验证码", needJsSdk: true},
      path: "getCord",
      name: "PersonalSettingsPhoneGetCord",
      component: PersonalSettingsPhoneGetCord,
    }, {
      meta: {title: "我的收藏", tab: true, needJsSdk: true},
      path: "myAttention",
      name: "PersonalAttention",
      component: PersonalAttention,

    }, {
      meta: {title: "收货地址", needJsSdk: true},
      path: 'shippingAddress',
      name: "personalShippingAddress",
      component: personalShippingAddress,
    }, {
      meta: {title: "编辑地址", needJsSdk: true},
      path: 'editAddress',
      name: "personalEditAddress",
      component: personalEditAddress,
    }, {
      path: 'integralMall',
      component: personalIntegralMall,
      children: [
        {
          meta: {title: "积分商城", needJsSdk: true},
          path: "/",
          name: "PersonalIntegralMallIndex",
          component: personalIntegralMallIndex
        }, {
          meta: {title: "商品详情", needJsSdk: true},
          path: "goodsDetails",
          name: "GoodsDetails",
          component: goodsDetails
        }, {
          meta: {title: "订单支付", needJsSdk: true},
          path: "orderPay",
          name: "OrderPay",
          component: orderPay
        }, {
          meta: {title: "我的订单", needJsSdk: true},
          path: "myOrderIndex",
          name: "MyOrderIndex",
          component: myOrderIndex
        }, {
          meta: {title: "任务中心", tab: true, needJsSdk: true},
          path: "task",
          name: "Task",
          component: task
        }, {
          meta: {title: '物品分类', needJsSdk: true},
          path: "integralCategory",
          name: "IntegralCategory",
          component: integralCategory
        }, {
          meta: {title: '订单详情', needJsSdk: true},
          path: "writeOff",
          name: "WriteOff",
          component: writeOff
        }, {
          meta: {title: '商品核销', needJsSdk: true},
          path: 'storeWriteOff',
          name: "StoreWriteOff",
          component: StoreWriteOff
        }
      ]
    }, {
      meta: {title: "我的积分", tab: true, needJsSdk: true},
      path: 'myIntegral',
      name: "personalMyIntegral",
      component: personalMyIntegral,
    }, {
      meta: {title: "我的余额", tab: true, needJsSdk: true},
      path: 'myBalance',
      name: "personalMyBalance",
      component: personalMyBalance,
    }, {
      meta: {title: "我的订单", tab: true, needJsSdk: true},
      path: 'myOrder',
      name: "personalMyOrder",
      component: personalMyOrder,
    }, {
      meta: {title: "我的拼团", tab: true, needJsSdk: true},
      path: 'myGroupBuy',
      name: "personalMyGroupBuy",
      component: personalMyGroupBuy,
    }, {
      meta: {title: "我的秒杀", tab: true, needJsSdk: true},
      path: 'mySecondBuy',
      name: "personalMySecondBuy",
      component: personalMySecondBuy,
    }, {
      meta: {title: "我的砍价", tab: true, needJsSdk: true},
      path: 'myHuckster',
      name: "personalMyHuckster",
      component: personalMyHuckster,
    }, {
      meta: {title: "我的报名", tab: true, needJsSdk: true},
      path: 'mySignUp',
      name: "personalMySignUp",
      component: personalMySignUp,
    }, {
      meta: {title: "我的卡券", tab: true, needJsSdk: true},
      path: 'myTicket',
      name: "personalMyTicket",
      component: personalMyTicket,
    }, {
      meta: {title: "充值中心", needJsSdk: true},
      path: 'rechargeCenter',
      name: "PersonalRechargeCenter",
      component: PersonalRechargeCenter,
    }, {
      meta: {title: '客服 - 个人中心'},
      path: 'customerService',
      name: "CustomerService",
      component: CustomerSerivce
    }]
};
