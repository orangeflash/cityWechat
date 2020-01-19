/**
 *   提现
 */

const withdrawContainer = () => import ("@/pages/withdraw/container")
const withdrawIndex = () => import ("@/pages/withdraw/index")
const presentationDetails = () => import ("@/pages/withdraw/presentation_details")
const presentationDetailsContent= () => import ("@/pages/withdraw/presentation_details/content")
const details = () => import ("@/pages/withdraw/presentation_details/details")

export const withdrawRouter = {
  path: 'withdraw',
  component: withdrawContainer,
  children: [
    {
      meta: {title: "提现",needJsSdk:true},
      path: '/',
      name: 'withdrawIndex',
      component: withdrawIndex,
    },{
      path: 'presentationDetails',
      component: presentationDetails,
      children: [
        {
          meta: {title: "提现明细",needJsSdk:true},
          path: '/',
          name: 'presentationDetailsContent',
          component:presentationDetailsContent
        }
      ]
    },{
      meta: {title: "明细详情",needJsSdk:true},
      path: "details",
      name: "details",
      component:details
    },
  ]
}
