import {requestByGet, requestByPost} from "../../util/request";
import releaseGood from './release-good'
import storeCoupon from './store-coupon'
import storeBalance from './store-balance'
import storePrivilege from './store-privilege'
import storeAssemble from './store-assemble'
import storeRushbuy from './store-rushbuy'
import storeBargain from './bargain-bargain'
import storeStaff from './store-staff'

export default {
  namespaced: true,
  state: {},
  mutations: {
    // SET_JOB_CONFIG(state, data) {
    //   state.jobConfig = data;
    // },
  },
  getters: {},
  actions: {},
  modules: {
    releaseGood,
    storeCoupon,
    storeBalance,
    storePrivilege,
    storeAssemble,
    storeRushbuy,
    storeBargain,
    storeStaff
  }
}
