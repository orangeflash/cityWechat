/**
 * 求职招聘
 */
const StoreBalanceContainer = () => import('@/pages/store-auxiliary/store-balance/contatiner');
const StoreBalanceIndex = () => import('@/pages/store-auxiliary/store-balance/balance-index');
const StoreBalanceList = () => import('@/pages/store-auxiliary/store-balance/balance-list');
const StoreCash = () => import('@/pages/store-auxiliary/store-balance/store-cash');
const StoreCashList = () => import('@/pages/store-auxiliary/store-balance/store-cashlist');
const storeCashDetail = () => import('@/pages/store-auxiliary/store-balance/store-cashdetail');
export const storeBalanceRouter = {
  path: 'storeBalance',
  component: StoreBalanceContainer,
  children:[
    {
      meta: {title: "商家余额",defaultTab: true, },
      path: "/",
      name: "StoreBalanceIndex",
      component: StoreBalanceIndex
    },
    {
      meta: {title: "收入记录", },
      path: "storeBalanceList",
      name: "StoreBalanceList",
      component: StoreBalanceList
    },
    {
      meta: {title: "商家提现", },
      path: "storeCash",
      name: "StoreCash",
      component: StoreCash
    },
    {
      meta: {title: "提现记录",},
      path: "storeCashList",
      name: "StoreCashList",
      component: StoreCashList
    },
    {
      meta: {title: "提现明细",},
      path: "storeCashDetail",
      name: "StoreCashDetail",
      component: storeCashDetail
    },
    ]
};
