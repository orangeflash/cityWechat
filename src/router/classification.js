/**
 * 分类
 */
const Classification = () => import('../pages/classification/container');
const ClassificationIndex = () => import('../pages/classification/index');
const SecondaryClassification = () => import('../pages/classification/secondary-classification');

export const classificationRouter = {
  meta: {title: "信息首页"},
  path: 'classification',
  component: Classification,
  children: [{
    meta: {tab: true, title: "信息首页", notRequiredValid: true, needJsSdk: true, alive: true},
    path: "/",
    name: "ClassificationIndex",
    component: ClassificationIndex,
  }, {
    meta: {notRequiredValid: true, tab: true, needJsSdk: true},
    path: "secondaryClassification",
    name: "SecondaryClassification",
    component: SecondaryClassification,
  }]
};

