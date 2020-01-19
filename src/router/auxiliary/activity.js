/** 活动报名 */

const ActivityContatiner = () => import("@/pages/auxiliary-class/activity/contatiner")
const ActivityIndex = () => import("@/pages/auxiliary-class/activity/index")
const ActivityDetails = () => import("@/pages/auxiliary-class/activity/details")
const ActivityWriterOff = () => import("@/pages/auxiliary-class/activity/write-off")
const ActivityEnroll = () => import("@/pages/auxiliary-class/activity/enroll")
const ActivityOrder = () => import("@/pages/auxiliary-class/activity/order")
const ActivityEnrollDetails = () => import("@/pages/auxiliary-class/activity/enroll-details")
const ActivityCategory = () => import("@/pages/auxiliary-class/activity/category")
const ActivityCollection = () => import("@/pages/auxiliary-class/activity/collection")

const ActivityComment = () => import("@/pages/auxiliary-class/activity/comment")
const ActivityCommentDetails = () => import("@/pages/common/clover/comment")
const ActivityCommentList = () => import("@/pages/common/clover/comment-list")


export const ActivityRouter = {
  path: 'activity',
  component: ActivityContatiner,
  children: [
    {
      meta: {title: "同城活动", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "ActivityIndex",
      component: ActivityIndex
    }, {
      meta: {title: "活动详情", needJsSdk: true,},
      path: "details",
      name: "ActivityDetails",
      component: ActivityDetails
    }, {
      meta: {title: "订单核销", needJsSdk: true,},
      path: "writerOff",
      name: "ActivityWriterOff",
      component: ActivityWriterOff
    }, {
      meta: {title: '报名参加', needJsSdk: true,},
      path: "enroll",
      name: "ActivityEnroll",
      component: ActivityEnroll
    }, {
      meta: {title: '我的报名', needJsSdk: true, defaultTab: true},
      path: "order",
      name: "ActivityOrder",
      component: ActivityOrder
    }, {
      meta: {title: '报名详情', needJsSdk: true},
      path: 'enrollDetails',
      name: 'ActivityEnrollDetails',
      component: ActivityEnrollDetails
    }, {
      meta: {title: '活动评论', needJsSdk: true},
      path: 'comment',
      name: 'ActivityComment',
      component: ActivityComment
    }, {
      meta: {title: '评论详情', needJsSdk: true},
      path: 'commentDetails',
      name: 'ActivityCommentDetails',
      component: ActivityCommentDetails
    }, {
      meta: {title: '评论详情', needJsSdk: true},
      path: 'activityCommentList',
      name: 'ActivityCommentList',
      component: ActivityCommentList
    }, {
      meta: {title: '活动分类', needJsSdk: true},
      path: 'category',
      name: 'ActivityCategory',
      component: ActivityCategory
    }, {
      meta: {title: '我的收藏', needJsSdk: true, defaultTab: true},
      path: 'collection',
      name: 'ActivityCollection',
      component: ActivityCollection
    }
  ]
}
