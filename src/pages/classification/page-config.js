export const classificationConfig = {
  bannerConfig() {
    return {
      "padding": 0,
      "height": 200,
      "maxLimit": 300,
      "minLimit": 100,
      "swiper": {
        "children": [
          {
            "id": 677499596,
            "url": "http://192.168.1.88/file/1/jpg/2018/11/28/dmKxwLBif577CzQD.jpg"
          },
          {
            "id": 9220742187,
            "name": "http://192.168.1.88/file/1/jpg/2018/11/27/GuVkFtKW1zlqYn1S.jpg",
            "url": "http://192.168.1.88/file/1/jpg/2018/11/27/GuVkFtKW1zlqYn1S.jpg"
          }
        ]
      }
    }
  },

  searchOptions() {
    return {
      "position": 0,
      "shape": 3,
      "height": 42,
      "borderStyle": 0,
      "fontStyle": "left",
      "recommendSearch": 1,
      "searchBoxList": [
        {
          "id": 1545381832,
          "icon": "http://static.shanjiezhifu.com/zhihui/cert.png",
          "typesetting": 0,
          "style": 0,
          "link": ""
        }
      ],
      "keyWords": ""
    }
  },

  noticeInfoConfig() {
    return {
      "source":'postIndex',
      "limit": 1,
      "maxLimit": 5,
      "link": "",
      "infoList": [
        "浏览",
        "发布",
        "分享",
      ],
      "slidingDirection": "horizontal"
    }
  },
 noticeConfig() {
    return{
        "entry": {"value": "singlePage", "category": "入口页面","param":"news"},
        "icon": "https://ddy.zhycms.com/file/2/jpg/2018/12/07/JzMlo6P5mG1LtxUj.jpg",
        "notice": {"title": "同城头条", "color": "#000", "symbolColor": "#222", "fontWeight": "normal"}
      }
  },

  entryBtnConfig() {
    return {
      "color": "#666",
      "shape": 1,
      "buttonNumberOfCol": 5,
      "buttonNumberOfRow": 2,
      "entryButtonList": []
    }
  }

}
