/**
 * 资讯
 */
const Concat = () => import('@/pages/common/concat');
const Search = () => import('@/pages/common/search');
const LaunchPage = () => import('@/pages/common/launch-page');
const SearchList = () => import('@/pages/common/search-list');
const Login = () => import('@/pages/common/login');
const PostDetail = () => import('@/pages/common/post-detail');
const PostEdit = () => import('@/pages/common/post-edit');
const ShopDetail = () => import('@/pages/common/shop-detail');
const CommentDetail = () => import('@/pages/common/comment-detail');
const RedAndWhite = () => import("@/pages/common/red-and-white");
const NotFound = () => import("@/pages/common/not-found");
const StoreManage = () => import("@/pages/common/store-manage");
const Announcement = () => import("@/pages/common/announcement");
const Album = () => import("@/pages/common/album");
const Rule = () => import("@/pages/common/rule");
const Share = () => import("@/pages/common/share");

export const commonRouter = [{
  meta: {title: "会话"},
  path: 'concat',
  component: Concat,
}, {
  meta: {title: "帖子详情页", notRequiredValid: true,needJsSdk:true},
  path: 'launchPage',
  name: 'LaunchPage',
  component: LaunchPage,
}, {
  meta: {title: "帖子详情页", notRequiredValid: true,needJsSdk:true},
  path: 'postDetail',
  name: 'PostDetail',
  component: PostDetail,
}, {
  meta: {title: "红包详情",needJsSdk:true},
  path: 'redAndWhite',
  name: 'RedAndWhite',
  component: RedAndWhite,
}, {
  meta: {title: "商铺详情页",needJsSdk:true},
  path: 'shopDetail',
  name: 'ShopDetail',
  component: ShopDetail,
}, {

  meta: {title: "信息编辑",needJsSdk: true},
  path: 'postEdit',
  name: 'PostEdit',
  component: PostEdit,
},{
  meta: {title: "暂无数据", notRequiredValid: true,needJsSdk:true},
  path: 'notFound',
  name: 'NotFound',
  component: NotFound,
},
  {
    meta: {title: "搜索", notRequiredValid: true,needJsSdk:true},
    path: 'search',
    name: "Search",
    component: Search,
}, {
  meta: {title: "用户登录", notRequiredValid: true,needJsSdk:true},
  path: 'login',
  name: "Login",
  component: Login,
}, {
  meta: {title: "搜索结果", notRequiredValid: true,needJsSdk:true},
  path: 'searchList',
  name: "SearchList",
  component: SearchList,
}, {
  meta: {title: "评论详情页",tab:true,needJsSdk:true},
  path: 'commentDetail',
  name: 'CommentDetail',
  component: CommentDetail,
}, {
  meta: {title: "商铺管理",needJsSdk:true},
  path: 'storeManage',
  name: 'StoreManage',
  component: StoreManage,
},{
  meta: {title: "公告详情",needJsSdk:true},
  path: 'announcement',
  name: 'Announcement',
  component: Announcement,
},{
    meta: {title: "相册",needJsSdk:true},
    path: 'album',
    name: 'Album',
    component: Album
  }
  ,{
    meta: {title: "规则",needJsSdk:true},
    path: 'rule',
    name: 'Rule',
    component: Rule
  },{
    meta: {title: "",needJsSdk:true},
    path: 'share',
    name: 'Share',
    component: Share
  }
];

