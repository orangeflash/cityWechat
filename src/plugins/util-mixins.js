import {
  computedDate, getType,
  isNotUndefined,
  randomColor,
  randomNumber,
  splitStrBySeparator
} from "../util";
import dayjs from "dayjs";
import {mapState} from "vuex";

export const utilMixins = {
  computed: {
    ...mapState({
      platform: state => state.platform,
      assetPath: s => s.assetPath,
    }),
  },
  methods: {
    randomColor, randomNumber,
    //将时间戳转换成指定格式
    formatDateByTimeStamp(timeStamp, format = "YYYY-MM-DD HH:mm:ss") {
      timeStamp = +timeStamp ? timeStamp * 1000 : Date.now();
      return dayjs(timeStamp).format(format);
    },
    //将字符串转换成日期对象
    formatDateByString(date, format = "YYYY-MM-DD") {
      return format ? dayjs(date, format).unix() : dayjs(+date).unix();
    },
    //获取10位的时间戳
    getTimeStamp(date) {
      return parseInt(new Date(date).getTime() / 1000)
    },
    //获取当天或几天前后时间戳
    getDayTimeStamp(day = 0, pointTime = false) {
      if (pointTime) {
        return new Date(new Date().setDate(new Date().getDate() + day)).setHours(0, 0, 0, 0) / 1000
      } else {
        return parseInt(new Date(new Date().setDate(new Date().getDate() + day)).getTime() / 1000)
      }
    },
    //获取后台返回的图片，格式化为完整图片路径的数组
    getImgArr(arr) {
      let imgarr = []
      imgarr = arr.map(item => {
        return this.getSingleImg(item.url)
      })
      return imgarr
    },
    getSingleImg(url) {
      return `${this.assetPath}${url}`
    },
    getMediaList(original) {
      try {
        if (isNotUndefined(original)) {
          //console.log('getType',getType(original))
          const list = getType(original) != 'array' ? JSON.parse(original) : original;

          const obj = {};
          list.forEach(({url, type}) => {
            if (url.trim()) {
              obj[type] = obj[type] ? obj[type] : [];
              type != 'qqVideo' ? obj[type].push(`${this.assetPath}${url}`) : obj[type].push(url);

            }
          });
          return obj;
        }
      } catch (e) {
        return [];
      }
      return [];
    },
    getArrbyType(arr, typename, type) {
      let a = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].typename == type) {
          a.push(arr[i])
        }
      }
      return a
    },
    // 数据进行初始化
    fieldDataInit(fillData) {

      // 防止v-model拿上次的数据进行渲染渲染
      for (let field in fillData) {
        if (typeof fillData[field] == 'string') {
          fillData[field] = '';
        } else if (typeof this.fillData[field] == 'array') {
          fillData[field] = [];
        } else if (typeof this.fillData[field] == 'number') {
          fillData[field] = 0;
        } else if (typeof this.fillData[field] == 'object') {
          fillData[field] = {};
        }
      }
      return fillData
    },

    splitStrBySeparator,
    computedDate,

  }
};
