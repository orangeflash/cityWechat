const paramsSet = {
  /** 房屋租售的请求参数集 */
  housingDeal: {
    typeId: '',
    renovation: '',
    orientation: '',
    rentType: '',    //租房类型
    linkMan: '',
    linkTel: '',
    faceToFace: false,
    rent: '',   //租金
    apartment: '', //户型
    title: '', //标题
    area: '',
    communityName: '', //小区名称
    measure: '',//面积
    address: '',  //详细地址
    deposit: '',   //押金
    floor: '',   //楼层
    lat: '',
    lng: '',
    data: {},    //房屋配置标签
    label: {},   //特色标签
    body: '',     //描述
    imgs: [],    //图片
    wholeCountry: 1
  },
  releaseCoupon: {
    name: '',
    startTime: '',
    endTime: '',
    discount: '',
    reach: '',
    num: '',
    // superposition:false,
    introduce: '',
    type: {name: '满减券', type: 1},
  },
  releaseGood: {
    storeId: '',
    title: '',
    originalPrice: '',
    currentPrice: '',
    typePid: '',
    typeId: '',
    num: '',
    showImgs: [],
    delivery: {name: '快递配送', type: 1},
    detailImgs: [],
    details: '',
    freight: '',
    isRefund: false,
    sort: '200',
    subhead: '',
    isPost: false,
    satisfy: '',
    label: '',
    spec: [],
    group: [],
    isSpec: false,
    distributionModel:'1',
    primaryDistribution:'',
    secondaryDistribution:'',
  },
  releaseCard: {
    name: "",
    tel: "",
    logo: "",
    wechat: "",
    company: "",
    department: "",
    position: "",
    body: "",
    address: "",
    typePid: "",
    typeId: '',
    isWechat: '',
    isTel: '',
    isAddress: "",
    lng: "",
    lat: "",
    mealId: "",
    wholeCountry: "",
    vipMoney: null,
  }
}

export function getParmasField(name) {

  return paramsSet[name] || {};

}
