/**
 *  辅助
 */
import {storeCouponRouter} from './store-coupon'/*优惠券*/
import {storeGoodRouter} from './store-good'/*商城商品*/
import {storeBalanceRouter} from './store-balance'/*商家余额*/
import {storeActivityRouter} from './store-activity'/*商家活动*/
import {storePrivilegeRouter} from './store-privilege'/*商家会员特权*/
import {storeAssembleRouter} from './store-assemble'/*商家拼团*/
import {storeRushbuyRouter} from './store-rushbuy'/*商家限时抢购*/
import {storeBargainRouter} from './store-bargain'/*商家砍价*/
import {storeStaffRouter} from './store-staff'/*商家砍价*/

const auxiliaryContainer = () => import('@/pages/store-auxiliary')

export const storeAuxiliaryRouter = {
  path: 'storeAuxiliary',
  component: auxiliaryContainer,
  children: [
    storeStaffRouter,
    storeCouponRouter,
    storeGoodRouter,
    storeBalanceRouter,
    storeActivityRouter,
    storePrivilegeRouter,
    storeAssembleRouter,
    storeRushbuyRouter,
    storeBargainRouter
  ]
};
