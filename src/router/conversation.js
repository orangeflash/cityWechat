/**
 * 会话
 */

const Conversation = () => import('@/pages/conversation/container');
const ConversationIndex = () => import('@/pages/conversation/index');
const ConversationHistory = () => import('@/pages/conversation/history');

export const ConversationRouter = {
  path: 'conversation',
  component: Conversation,
  children: [{
    meta: {title: "会话",needJsSdk: true},
    path: '/',
    name: 'ConversationIndex',
    component: ConversationIndex,
  }, {
    meta: {title: "我的私信",needJsSdk: true,tab:true},
    path: 'history',
    name: 'ConversationHistory',
    component: ConversationHistory,
  },]
};

