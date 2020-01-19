/**
 * 求职招聘
 */
const JobHuntContainer = () => import('@/pages/auxiliary-class/job-hunt/contatiner');
const JobHuntIndex = () => import('@/pages/auxiliary-class/job-hunt/index');
const Collection = () => import('@/pages/auxiliary-class/job-hunt/collection');
const MyJobHunt = () => import('@/pages/auxiliary-class/job-hunt/my-job-hunt');
const MyGetJob = () => import('@/pages/auxiliary-class/job-hunt/my-getjob');
const JobHuntSettled = () => import('@/pages/auxiliary-class/job-hunt/hunt-settled');
const JobJobSettled = () => import('@/pages/auxiliary-class/job-hunt/job-settled');
const JobJobDetails = () => import('@/pages/auxiliary-class/job-hunt/job-details');
const JobHuntDetails = () => import('@/pages/auxiliary-class/job-hunt/hunt-details');
const JobHuntList = () => import('@/pages/auxiliary-class/job-hunt/job-hunt-list');
const AddExperience = () => import('@/pages/auxiliary-class/job-hunt/add-experience');
const JobFind = () => import('@/pages/auxiliary-class/job-hunt/index-job');
const HuntFind = () => import('@/pages/auxiliary-class/job-hunt/index-hunt');
const JobHuntAllHuntInfo = () => import('@/pages/auxiliary-class/job-hunt/all-hunt-info');


export const jobHuntRouter = {
  path: 'jobHunt',
  component: JobHuntContainer,
  children: [
    {
      meta: {title: "求职招聘", needJsSdk: true, defaultTab: true,},
      path: "/",
      name: "JobHuntIndex",
      component: JobHuntIndex,
      children: [
        {
          meta: {title: '找工作', needJsSdk: true, defaultTab: true},
          path: '/',
          name: 'JobFind',
          component: JobFind
        }, {
          meta: {title: '招人才', needJsSdk: true, defaultTab: true},
          path: 'HuntFind',
          name: 'HuntFind',
          component: HuntFind
        }
      ]
    },
    {
      meta: {title: "收藏-求职招聘"},
      path: "collection",
      name: "Collection",
      component: Collection
    },
    {
      meta: {title: "我的-求职招聘", defaultTab: true,},
      path: "myJobHunt",
      name: "MyJobHunt",
      component: MyJobHunt
    },
    {
      meta: {title: "收到的简历"},
      path: "myGetJob",
      name: "MyGetJob",
      component: MyGetJob
    },
    {
      meta: {title: "发布-招聘", needJsSdk: true,},
      path: "jobHuntSettled",
      name: "JobHuntSettled",
      component: JobHuntSettled
    },
    {
      meta: {title: "发布-求职", needJsSdk: true,},
      path: "jobJobSettled",
      name: "JobJobSettled",
      component: JobJobSettled
    },
    {
      meta: {title: "详情页-求职", needJsSdk: true,},
      path: "jobJobDetails",
      name: "JobJobDetails",
      component: JobJobDetails
    },
    {
      meta: {title: "详情页-招聘", needJsSdk: true,},
      path: "jobHuntDetails",
      name: "JobHuntDetails",
      component: JobHuntDetails
    },
    {
      meta: {title: "求职招聘列表", needJsSdk: true,},
      path: "jobHuntList",
      name: "JobHuntList",
      component: JobHuntList
    },
    {
      meta: {title: "经历-求职招聘", needJsSdk: true,},
      path: "addExperience",
      name: "AddExperience",
      component: AddExperience
    },
    {
      meta: {title: '招聘列表', needJsSdk: true},
      path: 'allHuntInfo',
      name: 'JobHuntAllHuntInfo',
      component: JobHuntAllHuntInfo
    }
  ]
};
