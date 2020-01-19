/**
 * 求职招聘
 */
import yszx from "../../pages/auxiliary-class/ying-shang/yszx";

const YsContainer = () => import('@/pages/auxiliary-class/ying-shang/contatiner');
const ReleaseYs = () => import('@/pages/auxiliary-class/ying-shang/releaseys');
const AppealYs = () => import('@/pages/auxiliary-class/ying-shang/appealys');
const JhList = () => import('@/pages/auxiliary-class/ying-shang/jhlist');
const YsYe = () => import('@/pages/auxiliary-class/ying-shang/ysye');
const YsCash = () => import('@/pages/auxiliary-class/ying-shang/yscash');
const YsCashlist = () => import('@/pages/auxiliary-class/ying-shang/yscashlist');
const Yszx = () => import('@/pages/auxiliary-class/ying-shang/yszx');
const wdfs = () => import('@/pages/auxiliary-class/ying-shang/wdfs');
const wdys = () => import('@/pages/auxiliary-class/ying-shang/wdys');
export const ysRouter = {
  path: 'ys',
  component: YsContainer,
  children: [
    // {
    //   meta: {title: "会员卡"},
    //   path: "/",
    //   name: "VipIndex",
    //   component: VipIndex
    // },
    {
      meta: {title: "我要应赏", needJsSdk: true},
      path: "releaseYs",
      name: "ReleaseYs",
      component: ReleaseYs
    },
    {
      meta: {title: "我要申诉", needJsSdk: true},
      path: "appealYs",
      name: "AppealYs",
      component: AppealYs
    },
    {
      meta: {title: "悬赏", needJsSdk: true, tab: true},
      path: "jhList",
      name: "JhList",
      component: JhList
    },
    {
      meta: {title: "悬赏中心", tab: true},
      path: "yszx",
      name: "Yszx",
      component: Yszx
    },
    {
      meta: {title: "我的粉丝",},
      path: "wdfs",
      name: "Wdfs",
      component: wdfs
    },
    {
      meta: {title: "我的应赏",},
      path: "wdys",
      name: "Wdys",
      component: wdys
    },
    {
      meta: {title: "悬赏余额", tab: false},
      path: "ysYe",
      name: "YsYe",
      component: YsYe
    },
    {
      meta: {title: "提现",},
      path: "ysCash",
      name: "YsCash",
      component: YsCash
    },
    {
      meta: {title: "提现列表",},
      path: "ysCashlist",
      name: "YsCashlist",
      component: YsCashlist
    },
  ]
};
