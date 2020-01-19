import {requestByGet,requestByPost} from '../../util/request';
import {utilMixins} from '../../plugins/util-mixins.js';
export default {
  namespaced: true,
  state: {
  },
  mutations:{},
  actions:{
      async getCategroyList ({commit},params) {
         try {
          let {data} = await requestByGet("city/api/post/category",params);
          return  data.map(({id, name, son}) => ({
              id,
              text: name,
              children: [{id:'', text: "全部"}, ...son.map(({id, name, son}) => ({id, text: name}))],
            }))
         } catch (error) {
           return false
         }
      },
      async getListNoNeedFilter({commit},params){
        let {data} = await requestByGet("city/api/post/category",params);
        return data
      },
      async getCityList ({commit},params) {
        try {
          const data = await requestByGet("city/api/user/get_zone",params);
          let arr = [{id:'',text:'全部'}];
          let arrTow = data.zone.map(({name,id})=>({id,text:name}))

          return arr.concat(arrTow);
        } catch (error) {
          return false
        }
      },
      async getIndexCategroyList({commit},params) {
        try {
         let {data} = await requestByGet("city/api/post/category",params);
           return data;
        } catch (error) {
          return false
        }
     },
  }
}
