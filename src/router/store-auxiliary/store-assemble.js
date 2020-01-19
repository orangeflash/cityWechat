const StoreCouponContainer = () => import('@/pages/store-auxiliary/store-assemble/contatiner');
const StoreAssembleRelease = () => import('@/pages/store-auxiliary/store-assemble/release');
const StoreAssembleMyRelease = () => import('@/pages/store-auxiliary/store-assemble/my-release');


export const storeAssembleRouter = {
  path: 'storeAssemble',
  component: StoreCouponContainer,
  children: [
    {
      meta: {title: "发布拼团", needJsSdk: true},
      path: "release",
      name: "StoreAssembleRelease",
      component: StoreAssembleRelease
    }, {
      meta: {title: "我的发布", defaultTab: true},
      path: "myRelease",
      name: "StoreAssembleMyRelease",
      component: StoreAssembleMyRelease
    },
  ]
};
