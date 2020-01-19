import {requestByGet,requestByPost} from '../../util/request';
import {utilMixins} from '../../plugins/util-mixins.js';
import axios from 'axios'


 export default {
    namespaced: true,
    state:{},
    mutations:{},
    actions:{
        async getSearchByKeyword ({commit},params){
         try {
            const searchList = await requestByGet("city/api/information/search",params);
            return searchList
         } catch (error){
            return false
         }
        }
    }

 }