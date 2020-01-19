export function getEntryPath(entry) {
  if (!entry) return null;
  switch (entry.value) {
    case "singlePage":
      return getPathSinglePage(entry.param);
    case "businessCategory":
      return `/businessDistrict/storeList?activeId=${entry.param}`;
    case "postCategory":
      return `/classification/secondaryClassification?pid=${entry.param}`;
    case "newsCategory": //暂无页面
      return `/cityInformation/categoryList?id=${entry.param}`;
    case "postInfo":
      return `/postDetail?postId=${entry.param}`;
    case "businessInfo":
      return `/shopDetail?storeId=${entry.param}`;
    case "newsInfo":
      return `/cityInformation/detail?id=${entry.param}`;
    case "call":
      // return `redirect:tel://${entry.param.phone}`;
      return location.href=`tel://${entry.param.phone}`
    case "link":
      // 跳转外部链接
      window.location.href = entry.category
      return false;
  }
}

function getPathSinglePage(param) {
  switch (param) {
    case "index":
      return "/home";
    case "post":
      return "/classification";
    case "put":
      return "/publication";
    case "business":
      return "/businessDistrict";
    case "userCenter":
      return "/personal";
    case "news":
      return "/cityInformation";
    case "businessJoin":
      return "/publication/businessEnterForm";
    case "sign":
      return "/sign";
    case "task":
      return "/personal/integralMall/task";
    case "redPage":
      return "/redbag";
    case "integralShop":
      return "/personal/integralMall";
    case 'storeRank':
      return "/businessDistrict/storeRankingList";
    case 'yellow':
      return '/yellowPage';
    case 'partner':
      return '/partner';
    case 'car':
      return '/auxiliary/freeRide';
    case 'job':
      return '/auxiliary/jobHunt';
    case 'renting':
      return '/auxiliary/housingDeal';
    case 'shop':
      return '/auxiliary/mall';
    case 'activity':
      return '/auxiliary/activity';
    case 'superCard':
      return '/auxiliary/card';
    case 'coupon':
      return '/auxiliary/coupon';
    case 'vip':
      return '/auxiliary/vip';
    case 'group':
      return '/auxiliary/assemble';
    case 'rush':
      return '/auxiliary/rushBuy';
    case 'bargain':
      return '/auxiliary/bargain';
    case 'friend':
      return '/auxiliary/cityLove';
    case 'reward':
      return '/auxiliary/ys/jhList';
    case 'helpCenter':
      return '/home/helpPage';
    case 'cropsPost':
      return '/auxiliary/xx';
  }
}
