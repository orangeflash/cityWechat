/***
 * 发布
 */
const Publication = () => import('@/pages/publication/container');
const PublicationIndex = () => import('@/pages/publication/index');
const PublicationEditInformation = () => import('@/pages/publication/edit-information');
const PublicationBusinessEnterForm = () => import('@/pages/publication/business-enter-form');
const PublicationBusinessEditForm = () => import('@/pages/publication/business-edit-form');
const PublicationStatus = () => import('@/pages/publication/publish-status');
const PublicationSaveShareImg = () => import('@/pages/publication/save-share-img');

export const publicationRouter = {
  path: 'publication',
  component: Publication,
  children: [
    {
      meta: {tab: true, title: "发布信息",needJsSdk:true},
      path: '/',
      name: 'PublicationIndex',
      component: PublicationIndex,
    }, {
      meta: {title: "编辑信息", needJsSdk: true},
      path: 'editInformation',
      name: 'PublicationEditInformation',
      component: PublicationEditInformation,
    }, {
      meta: {title: "商家入驻", needJsSdk: true},
      path: 'businessEnterForm',
      name: 'PublicationBusinessEnterForm',
      component: PublicationBusinessEnterForm,
    }, {
      meta: {title: "商家编辑", needJsSdk: true},
      path: 'businessEditForm',
      name: 'PublicationBusinessEditForm',
      component: PublicationBusinessEditForm,
    }, {
      meta: {title: "分享", needJsSdk: true},
      path: 'saveShareImg',
      name: 'PublicationSaveShareImg',
      component: PublicationSaveShareImg,
    }, {
      meta: {title: "发布结果", needJsSdk: true},
      path: 'publishStatus',
      name: 'PublicationStatus',
      component: PublicationStatus,
    },
  ]
};
