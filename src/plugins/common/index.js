import {getSuccessData} from "../../util";

export function getOperation(deleteObj = []) {

  let operation = [
    {
      name: '分享扩散',
      field: 'share'
    }, {
      name: '置顶信息',
      field: 'top'
    }, {
      name: '刷新信息',
      field: 'refresh'
    }, {
      name: '编辑',
      field: 'edit'
    }, {
      name: '结束',
      field: 'over'
    }, {
      name: '下架',
      field: 'upOrDown'
    }, {
      name: '删除',
      field: 'delete'
    }
  ];
  deleteObj.length > 0 && deleteObj.forEach((v, i) => {
    operation.forEach((o, j) => {
      o.field == v && operation.splice(j, 1);
    })
  })

  return operation
}

// 当前页面是否清除路由
export function getReplaceRouterPath(path) {
  const routers = [
    '/home',
    '/classification',
    'publication',
    '/publication',
    '/personal',
    '/auxiliary/freeRide',
    '/auxiliary/housingDeal',
    '/auxiliary/jobHunt',
    '/auxiliary/mall'
  ]
  return routers.indexOf(path) > -1
}

