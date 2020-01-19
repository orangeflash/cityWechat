import {computedDate, format} from "../util";
import {backendPath} from "./base";

const cmpNameConfig = {
  customSwiper: "Banner",
  searchBox: "SearchWithLocation",
  noticeGroup: "notice",
  noticeWithInfo: "statistics",
  entryButtonGroup: "entryButtonGroup",
  imageGroup: "ImageGroup",
  whiteSpace: "WhiteSpace",
  recommendation: "HotBusiness",
  magicCube: "MagicCube",
  tabGroup: "HomeTab",
  segmentLine: "SegmentLine",
  customTitle: "CustomTitle",
  textAndImage: 'textAndImage',
};

export function getCmpName(cmpName) {
  return cmpNameConfig[cmpName] || cmpName;
}


/**
 * 首页拖拽式布局的tab键根据值来返回相对应的模板名称
 *
 *        method:请求数据的函数的名字
 *        name:组件的名字
 *        params:请求参数
 *        bind:绑定的数据字段
 *        ergodic:是否需要遍历有的组件是循环体有的是在组件内部循环
 *        dataChange:对数据进行操作
 *        other:默认的一下组件参数
 *        parentClassName:给容器添加的Class名
 *        parentStyle:给容器添加的行内样式
 *        className:给组件添加的class名
 * */
export function getRightTemplate(key) {

  let result = {
    className: "l-list",
    ergodic: true,
    params: {}
  }

  /** key是后台返回的是字符串型的数字 */
  switch (+key) {
    case -2:    //求职招聘 （招）
      result.name = "hunt-find";
      result.bind = "list";
      result.method = "getJobList";
      result.ergodic = false;
      break;
    case -1:      //同城交友的动态信息搜索
      result.method = "cityLoveGetDynamicList";
      result.name = "city-love-notice";
      result.ergodic = false;
      result.bind = "list"
      result.parentClassName = "bg-f-i";
      result.dataChange = ({item}) => {
        return item.map(solo => {
          return {
            ...solo,
            face: `${localStorage.assetPath}${solo.icon}`,
            nickname: solo.name,
            age: solo.birthday,
            city: solo.address,
            love: solo.love,
            loveNum: solo.loveNum || 0,
            share: solo.share || 0,
            browse: solo.viewNum || 0,
            sex: +solo.sex,
            photos: solo.media ? solo.media.map(solo => {
              return `${localStorage.assetPath}${solo.url}`;
            }) : [],
            time: computedDate(solo.createdAt)
          }
        })
      }
      result.params = {
        type: 2,
      }
      break;
    case 0:       //最新信息
      result.method = "getPostListByParams";
      result.name = "basic-note-item";
      result.bind = "postData"
      result.other = {
        hideOper: true
      }
      result.params = {
        sort: 'new',
      }
      break;
    case 1:       // 最新商家
      result.method = "getShopListByParams";
      result.name = "store-tab-item";
      result.bind = "business"

      result.dataChange = ({item, params}) => {
        return {
          logo: `${localStorage.assetPath}${JSON.parse(item.storeLogo)[0].url}`,
          name: item.storeName,
          viewNum: item.viewNum,
          startTime: item.businessStartTime,
          endTime: item.businessEndTime,
          tag: item.storeLabel,
          address: item.address,
          id: item.id,
          list: item.list,
          isAuth: +item.isAuth,
          typeName: item.typeName,
          newName: item.newName,
          distance: item.distance,
          enterTime: computedDate(item.enterTime)
        }
      }

      result.params = {
        sort: 'new',
      }
      break;
    case 2:       // 最新资讯
      result.method = "getCityInfoList";
      result.name = "post-cord"
      result.bind = "infoData";
      result.className = 'bg-f br-e'
      result.path = "/cityInformation/detail";
      result.fields = {
        id: 'id'
      }
      result.dataChange = ({item, params}) => {
        let pictures = [];

        if (item.media && item.media.length > 2) {
          pictures = JSON.parse(item.media).map(item => {
            return `${localStorage.assetPath}${item.url}`
          })
        }
        return {
          title: item.title,
          attribute: +item.attribute,
          pictures,
          time: computedDate(item.createdAt) + '发布',
          like: +item.loveNum || 0,
          comment: +item.commentNum || 0,
          browse: +item.browseNum || 0,
          id: +item.id
        }
      }


      break;
    case 3:       // 黄页114
      result.method = "getYellowList";
      result.name = "list-item"
      result.bind = "store";
      result.ergodic = false;
      result.other = {
        type: 0,
        tab: 0
      }
      break;
    case 4:       // 合伙人
      break;
    case 5:       // 顺风车
      result.method = "getCarList";
      result.name = "free-ride-card";
      result.bind = "freeRide"
      result.className = "mar-30"
      break;
    case 6:       // 求职招聘
      result.name = "job-find";
      result.bind = "list";
      result.method = "getHuntList";
      result.ergodic = false;
      break;
    case 7:       // 房屋租售
      result.name = "housing-deal-card";
      result.bind = "item";
      result.method = "housingDealList"
      result.params = {
        type: 3,
      }
      break;
    case 8:       // 多商户商城
      result.name = "goods-card"
      result.method = "getMallGoodsList"
      result.ergodic = false;
      result.bind = "list"
      break;
    case 9:       // 同城活动
      result.name = "dd-article-activity"
      result.method = "getActivityList"
      result.bind = "infoData"
      result.dataChange = ({item, params}) => {
        const now = new Date().getTime();

        let status = 0;
        if (item.startTime * 1000 > now) { //未开始
          status = 3
        } else if (item.endTime * 1000 > now) {//进行中
          status = 1
        } else { //已结束
          status = 2
        }

        return {
          cover: item.showImgs.length && `${localStorage.assetPath}${item.showImgs[0].url}`,
          info: item.name,
          time: computedDate(item.createdAt),
          tag: item.typeName,
          price: item.originalPrice,
          money: item.currentPrice,
          startTime: format(item.startTime * 1000),
          isOver: now >= item.endTime * 1000,
          id: item.id,
          count: item.count,
          residue: item.residue,
          status,
          isSelected: +item.isSelected
        }
      }
      break;
    case 10:       // 超级名片
      result.name = "card";
      result.method = "getCardList"
      result.bind = "list";
      result.ergodic = false;
      break;
    case  11:     //全民拼团
      result.method = "getAssembleList";
      result.name = "assemble";
      result.bind = "order"
      result.dataChange = ({item}) => {
        return {
          id: item.id,
          cover: {
            src: item.showImgs[0] && `${localStorage.assetPath}${item.showImgs[0].url}`,
            width: 2.4,
            height: 2.4,
            borderRadius: 0.16
          },
          name: item.title,
          lables: (() => {
            let arr = []
            for (let key in item.label) arr.push(item.label[key]);
            return arr
          })(),
          money: item.groupPrice,
          originalPrice: item.originalPrice,
          salesNum: item.salesNum,
          groupNum: item.groupNum
        }
      }
      break;
    case 12:  //限时抢购
      result.method = "getRushGoodsList";
      result.name = "rush-buy";
      result.bind = "dataInfo"
      result.other = {
        countDown: 1,
      }
      break;
    case 13: //优惠卷
      result.method = "getCouponList";
      result.name = "dd-coupon";
      result.bind = "list"
      result.ergodic = false;
      // result.path = "/auxiliary/coupon/details";
      // result.className = "mar-30"
      // result.fields = {
      //   id: 'couponId'
      // }
      // result.dataChange = ({item, platform}) => {
      //   let coupon = JSON.parse(JSON.stringify(item));
      //   coupon.logo = `${localStorage.assetPath}${coupon.logo}`;
      //   if (coupon.type == 1 || coupon.type == 3) {
      //     coupon.discount = coupon.reduce + '元'
      //   } else if (coupon.type == 2) {
      //     coupon.discount = coupon.discount + '折'
      //   }
      //   coupon.type = +coupon.type == 1 ? '优惠卷' : +coupon.type == 3 ? '代金卷' : '折扣卷'
      //
      //   coupon.money = +coupon.money > 0 ? coupon.money + '元' : +coupon.stock > 0 ? '免费' : '不可'
      //   if (+coupon.condition > 0) {
      //     coupon.condition = '满' + coupon.condition + '元，可使用'
      //   } else {
      //     coupon.condition = '无最低消费'
      //   }
      //   coupon.percentage = coupon.receiveNum ? coupon.receiveNum * 100 / coupon.count : coupon.receiveNum;
      //
      //   coupon.vipMoney = platform.openVip && coupon.vipMoney && +coupon.vipMoney > 0 ? '会员价：' + coupon.vipMoney : '';
      //   return coupon;
      // }
      break;
    case
    14
    :   //会员卡
      result.method = "getPrivilegeList";
      result.name = "vip-privilege"
      result.bind = "dataInfo"
      break;
    case
    15
    :  //天天砍价
      result.method = "getBargainList";
      result.name = "dd-bargain";
      result.bind = "item"
      result.dataChange = ({item}) => {
        let bargain = {
          cover: localStorage.assetPath + item.logo,
          nowPrice: item.floorPrice,
          oldPrice: item.price,
          title: item.title,
          joinNum: item.receiveNum || 0,
          browseNum: item.viewNum || 0,
          id: item.id
        }
        return bargain;
      }
      break;
    case
    16
    :
      result.method = "cityLoveFriends";
      result.name = "city-love";
      result.ergodic = false;
      result.bind = "list"
      result.parentClassName = "bg-f-i";
      result.dataChange = ({item}) => {

        return item.map(solo => {
          let city = solo.city.split("-")[1];
          if (city.length > 3) city = city.substring(0, 4) + "..."
          return {
            cover: `${localStorage.assetPath}${solo.icon}`,
            nickname: solo.name,
            age: solo.birthday,
            city,
            follow: solo.follow,
            sex: solo.sex,
            tel: solo.tel,
            id: solo.id
          }
        })
      }
      result.params = {
        type: 2,
      }
      break;
    case 17:       // 信息定制
      result.name = "list-itemxx"
      result.method = "XxList"
      result.bind = "infoData"
      result.dataChange = ({item, params}) => {
        return {
          typeName: item.typeName,
          address: item.address,
          brand: item.brand,
          buyType: item.buyType,
          createdAt: item.createdAt,
          id: item.id,
          isAuth: item.isAuth,
          number: item.number,
          price: item.price,
          spec: item.spec,
          unit: item.unit,
          guarantee: item.guarantee,
        }
      }
      break;
  }

  return result;
}


