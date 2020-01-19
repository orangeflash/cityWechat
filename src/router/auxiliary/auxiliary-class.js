/**
 *  辅助
 */
import {jobHuntRouter} from './job-hunt'/*求职招聘*/
import {housingDealRouter} from './housing-deal'/*求职招聘*/
import {mallRouter} from './mall' /*求职招聘*/
import {cardRouter} from './card' /* 名片 */
import {ActivityRouter} from './activity' /* 活动 */
import {CouponRouter} from './coupon' /* 优惠卷 */
import {vipRouter} from './vip' /* 会员卡 */
import {AssembleRouter} from './assemble' /* 会员卡 */
import {rushBuyRouter} from './rush-buy' /* 限时抢购 */
import {BargainRouter} from './bargain'
import {CityLoveRouter} from "./city-love";
import {ysRouter} from "./ying-shang";
import {xxRouter} from "./information";/* 信息定制 */

const auxiliaryContainer = () => import('@/pages/auxiliary-class')

const freeRideContainer = () => import('@/pages/auxiliary-class/free-ride/contatiner');
const freeRideIndex = () => import('@/pages/auxiliary-class/free-ride');
const freeRideCollection = () => import('@/pages/auxiliary-class/free-ride/collection');
const freeRidePersonal = () => import('@/pages/auxiliary-class/free-ride/personal');
const freeRideDetails = () => import('@/pages/auxiliary-class/free-ride/details');
const freeRideRelease = () => import('@/pages/auxiliary-class/free-ride/release');
const freeRideMyRelease = () => import('@/pages/auxiliary-class/free-ride/my-release');
const freeRideCategory = () => import('@/pages/auxiliary-class/free-ride/category');

export const auxiliaryClassRouter = {
  path: 'auxiliary',
  component: auxiliaryContainer,
  children: [
    {
      path: 'freeRide',
      component: freeRideContainer,
      children: [
        {
          meta: {title: '顺风车', defaultTab: true, needJsSdk: true},
          path: '/',
          name: 'FreeRide',
          component: freeRideIndex
        }, {
          meta: {title: '收藏-顺风车', defaultTab: true, needJsSdk: true},
          path: 'collection',
          component: freeRideCollection
        }, {
          meta: {title: '个人中心', defaultTab: true, needJsSdk: true},
          path: 'personal',
          component: freeRidePersonal
        }, {
          meta: {title: '详情页', needJsSdk: true},
          path: 'details',
          component: freeRideDetails
        }, {
          meta: {title: '发布 - 顺风车', needJsSdk: true},
          path: 'release',
          component: freeRideRelease
        }, {
          meta: {title: '我的发布 - 顺风车', defaultTab: true, needJsSdk: true},
          path: 'myRelease',
          component: freeRideMyRelease
        }, {
          meta: {title: '分类 - 顺风车', needJsSdk: true},
          path: 'category',
          component: freeRideCategory
        }
      ]
    },
    jobHuntRouter,
    housingDealRouter,
    mallRouter,
    cardRouter,
    ActivityRouter,
    CouponRouter,
    vipRouter,
    AssembleRouter,
    rushBuyRouter,
    BargainRouter,
    CityLoveRouter,
    ysRouter,
    xxRouter,
  ]
};
