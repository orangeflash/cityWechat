/***
 * 首页
 */
const Home = () => import('@/pages/home/container');
const HomeIndex = () => import('@/pages/home/index');
const ChoiceLocation = () => import('@/pages/home/choice-location');
const HelpPage = () => import('@/pages/home/help-page.vue');

export const homeRouter = {
  path: 'home',
  component: Home,
  children: [
    {
      meta: {title: "选择城市",  notRequiredValid: true,needJsSdk:true},
      path: 'choiceLocation',
      name: 'ChoiceLocation',
      component: ChoiceLocation,
    }, {
      meta: {tab: true,  notRequiredValid: true,needJsSdk: true,alive:true},
      path: '/',
      name: 'HomeIndex',
      component: HomeIndex,
    }, {
      meta: {title: "帮助中心", notRequiredValid: true,tab:true,needJsSdk:true},
      path: 'helpPage',
      name: 'HelpPage',
      component: HelpPage,
    }]
};
