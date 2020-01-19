const CityAgent = () => import('@/pages/city-agent/city-agent-center/contatiner');
const CityAgentIndex = () => import('@/pages/city-agent/city-agent-center/index');
const CityAgentSet = () => import('@/pages/city-agent/city-agent-center/city-agent');
const CitySetUp = () => import('@/pages/city-agent/city-agent-center/city-set-up');
const CityApply = () => import('@/pages/city-agent/city-agent-center/city-apply');
const CityBonus = () => import('@/pages/city-agent/city-agent-center/city-bonus');
const CityProfit = () => import('@/pages/city-agent/city-agent-center/city-profit');
const CityCash = () => import('@/pages/city-agent/city-agent-center/city-cash');
const CityLogin = () => import('@/pages/city-agent/city-agent-center/city-login');
export const cityAgentRouter = {
  path:'cityAgent',
  component: CityAgent,
  children:[
    {
      meta: {title: "手机端城市后台",defaultTab: true, },
      path: "/",
      name: "cityAgentIndex",
      component: CityAgentIndex
    },
    {
      meta: {title: "代理",defaultTab: true, },
      path: "cityAgentSet",
      name: "CityAgentSet",
      component: CityAgentSet,
    },
    {
      meta: {title: "代理设置",defaultTab: true, },
      path: "citySetUp",
      name: "CitySetUp",
      component: CitySetUp
    },
    {
      meta: {title: "代理提现申请",defaultTab: true, },
      path:"cityApply",
      name:"CityApply",
      component:CityApply
    },
    {
      meta: {title: "区域佣金明细",defaultTab: true, },
      path:"cityBonus",
      name:"CityBonus",
      component:CityBonus
    },
    {
      meta: {title: "城市收益明细",defaultTab: true, },
      path:"cityProfit",
      name:"CityProfit",
      component:CityProfit
    },
    {
      meta: {title: "提现",defaultTab: true, },
      path:"cityCash",
      name:"CityCash",
      component:CityCash
    },
    {
      meta: {title: "手机端城市后台"},
      path:"cityLogin",
      name:"CityLogin",
      component:CityLogin
    }
  ]
}
