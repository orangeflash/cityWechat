import { requestByGet ,requestByPost} from "../../util/request";

export default {
  namespaced: true,
  state: {
    searchHistoryList: [],
  },
  mutations: {
    setKeyWordsToHistory(state, keyWords) {
      if (state.searchHistoryList.indexOf(keyWords) < 0)
        keyWords.trim() && state.searchHistoryList.push(keyWords);
    }, cleanHistoryKeyWords(state) {
      state.searchHistoryList = []
    },

  },
  actions: {
    async getPostListByUser({ commit }, params) {
      const { data } = await requestByGet("city/api/post/post_list", {
        status: 'display',
        ...params
      });
      return data;
    }, async searchPostByType({ commit }, params) {
      const { keyWords } = params;
      const { data } = await requestByGet("city/api/post/post_list", {
        word: keyWords,
        ...params
      });
      return data;
    }, async searchStoreByType({ commit }, params) {
      const { keyWords } = params;
      const { data } = await requestByGet("city/api/Business/search", {
        storeName: keyWords,
        ...params
      });
      return data;
    }, async searchYellowByType({ commit }, params) {
      const { keyWords } = params;
      const { data } = await requestByGet("city/api/yellow_page/list", {
        ...params
      });
      return data;
    },
  },
}
