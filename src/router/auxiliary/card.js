const CardContainer = () => import('@/pages/auxiliary-class/card/contatiner');
const CardIndex = () => import('@/pages/auxiliary-class/card/index');
const CardDetails = () => import('@/pages/auxiliary-class/card/details');
const CardMyCard = () => import('@/pages/auxiliary-class/card/my-card');
const Cardcase = () => import('@/pages/auxiliary-class/card/cardcase');
const CreateCard = () => import('@/pages/auxiliary-class/card/create-card');


export const cardRouter = {
  path: 'card',
  component: CardContainer,
  children: [
    {
      meta: {title: "名片库", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "CardIndex",
      component: CardIndex
    }, {
      meta: {title: "名片详情", needJsSdk: true,},
      path: "details",
      name: "CardDetails",
      component: CardDetails
    }, {
      meta: {title: "我的名片", needJsSdk: true, defaultTab: true},
      path: "myCard",
      name: "CardMyCard",
      component: CardMyCard
    },{
      meta: {title: "名片夹", needJsSdk: true, defaultTab: true},
      path: "cardcase",
      name: " Cardcase",
      component: Cardcase

    },{
      meta: {title: "创建名片", needJsSdk: true, },
      path: "createCard",
      name: " CreateCard",
      component: CreateCard
    }
  ]
}
