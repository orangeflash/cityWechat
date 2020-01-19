/**
 *  活动
 */
const StoreActivityContainer = () => import("@/pages/store-auxiliary/activity/container")
const StoreActivityMy = () => import("@/pages/store-auxiliary/activity/my-activity")
const StoreActivityEnrollList = () => import("@/pages/store-auxiliary/activity/enroll-list")
const StoreActivityEntryRecord = () => import("@/pages/store-auxiliary/activity/entry-record")
const StoreActivityRelease = () => import("@/pages/store-auxiliary/activity/release")

export const storeActivityRouter = {
  path: 'storeActivity',
  component: StoreActivityContainer,
  children: [
    {
      meta: {title: "我发布的活动", defaultTab: true,},
      path: "/",
      name: "StoreActivityMy",
      component: StoreActivityMy
    }, {
      meta: {title: "报名详情", defaultTab: true,needJsSdk: true},
      path: "enrollList",
      name: "StoreActivityEnrollList",
      component: StoreActivityEnrollList
    }, {
      meta: {title: "入账记录", defaultTab: true,},
      path: "entryRecord",
      name: "StoreActivityEntryRecord",
      component: StoreActivityEntryRecord
    }, {
      meta: {title: "发布活动",needJsSdk: true},
      path: "storeActivityRelease",
      name: "StoreActivityRelease",
      component: StoreActivityRelease
    },
  ]
};

