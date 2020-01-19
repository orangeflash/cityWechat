// localStorage.setItem('debug', 'leancloud*,LC*');
import AV, {User, Query} from 'leancloud-storage';
import {Realtime, TextMessage, Event, MessagePriority, MessageQueryDirection} from 'leancloud-realtime';
import icon17 from '../assets/img/other/icon_17.png'
import _ from 'lodash'

let realtime = null;
const placeHolderAvatar = icon17;

/****
 * 基础使用：
 * 1.当用户打开网页,我们使用他的微信信息给他注册一个通讯服务“账户”,并保存为通讯id
 *   - 初始化通讯服务
 * 2.当用户与他人发起会话时:
 *   1.登录该用户的通讯服务
 *   2.使用该用户生成该用户的IMClient
 *   3.将该用户的通讯id与其他用户的通讯id组成为一个会话
 *      - 用户可以监听会话里他人推送的消息（不会接受到自己的消息）
 *      - 用户可以向生成的会话里发送消息
 *
 * 3.用户可以监听clientIM获取所有用户向自己发送的信息
 * 并从回调中拿到相应会话对象（与上面的发起会话对象一致，可以使用该对象向发送者回复信息）
 * tips:会话对象中可以拿到所有会话成员的通讯id,可以用于查询是谁和谁发起的会话
 * tips2:会话信息监听应该监听在会话对象上,clientIM的会话监听应该仅用户判断谁与当前用户发起了一个新会话
 * tips3:没有被监听的会话才是未读会话
 */


/********************** 用户相关 ************************/
export async function signUp(username, password, userInfo) {
  const user = new User();
  user.setUsername(username);
  user.setPassword(password);
  _.forEach(userInfo, function (val, key) {
    user.set(key, val);
  });
  user.set("avatar", placeHolderAvatar);
  const promise = user.signUp();
  return await catchWrap(promise);
}

export async function signIn(username, password) {
  const promise = User.logIn(username, password);
  return await catchWrap(promise);
}

export async function signOut(user) {
  const promise = user.close();
  return await catchWrap(promise);
}

//将用户id排序后连接
export function sortZipUserId(userIds) {
  return userIds ? userIds.sort((c, t) => c > t ? 1 : -1).join("--") : '';
}

//还原出目标用户
export function unZipTargetUserId(userIdStr, cId) {
  const ids = userIdStr ? userIdStr.split("--") : [];
  return _.find(ids, function (o) {
    return o !== cId
  });
}

/********************** 用户相关 ************************/


/********************** 初始化 ************************/
export function initIM(appId, appKey) {
  if (window._IM_IS_INIT) return;
  // 初始化存储 SDK
  // AV.init('JULFcrH83qeUJgnDTe6lwnQV-gzGzoHsz', 'Nwy9PBW1KrbtrAFP8XSvf2WD');

  appKey = appKey ? appKey : '7OjSU0jOVVXTQaCjzXraog3D';
  appId = appId ? appId : 'BULEB08pUi2Qk8E0nik7mDiF-gzGzoHsz'

  AV.init(appId, appKey);

  // 初始化即时通讯 SDK
  realtime = new Realtime({
    appId,
    appKey,
    server: {
      api: 'avoscloud.com',
      RTMRouter: 'router-g0-push.avoscloud.com',
    },
    pushOfflineMessages: true, //是否需要用户上线时推送消息
    region: 'cn', // 美国节点为 "us"
  });
  console.log("realtime", realtime)
  window._IM_IS_INIT = true;
  // var imageMessage = new ImageMessage(file);
}

/***
 * 初始化IMClient
 */
export async function initIMClient(clientId) {
  console.log(realtime);
  return await realtime.createIMClient(clientId);
}

/***
 * 初始化会话
 */
export async function createConversation(client, members, conversationName) {
  const promise = client.createConversation({
    members,
    name: conversationName,
  }).catch(console.error);

  console.log(promise);

  return await catchWrap(promise);
}

/********************** 初始化 ************************/


/********************** 信息相关 ************************/
/***
 * 用于离线用户首次登录获取未读信息
 * 获取到所有的未读会话
 * 未读信息和未读条数都可以获取到
 * 读取完未读信息后需要将信息改为已读状态
 * @param client
 * @returns {Promise<void>}
 */
export async function getUnReadMsg(client) {
  return new Promise(function (resolve, reject) {
    client.on(Event.UNREAD_MESSAGES_COUNT_UPDATE, function (conversations) {
      //返回所有会话
      resolve(conversations);
      // //将信息改为已读状态
      // for (let conv of conversations) {
      //   conv.read().catch(console.error.bind(console));
      // }
    })
  });
}

/***
 * 发信息
 * @param conversation
 * @param msg
 * @returns {Promise<*|void>}
 */
export async function postMsg(conversation, msgObj) {
  //priority可配置信息的实时性, {priority: MessagePriority.NORMAL} 会话必须设置 transient: true
  const promise = conversation.send(msgObj);
  return await catchWrap(promise);
}

/***
 * 添加客户端监听
 * @param client
 * @returns {Promise<*|void>}
 */
export async function addClientListener(client, callback) {
  client.on(Event.MESSAGE, function (message, conversation) {

    callback && callback(conversation);
  });
}

/***
 * 添加会话监听
 * @returns {Promise<*|void>}
 * @param conversation
 * @param callback
 */
export async function addMsgListener(conversation, callback) {
  conversation.on(Event.MESSAGE, function messageEventHandler(message) {

    callback && callback(message);
    //当获取到信息后改为已读状态
    conversation.read().catch(console.error.bind(console));
  });
}


/***
 * 更改会话状态
 * @param conversation
 */
export async function changeConversationState(conversation) {
  await conversation.read().catch(console.error.bind(console));
}

/********************** 信息相关 ************************/


/********************** 网络相关 ************************/
export function addNetWorkListener(callback) {
  let msg = '';
  realtime.on(Event.DISCONNECT, function () {
    msg = '服务器连接已断开'
  });
  realtime.on(Event.OFFLINE, function () {
    msg = '离线（网络连接已断开）'
  });
  realtime.on(Event.ONLINE, function () {
    msg = '已恢复在线'
  });
  realtime.on(Event.SCHEDULE, function (attempt, delay) {
    msg = delay + 'ms 后进行第' + (attempt + 1) + '次重连'
  });
  realtime.on(Event.RETRY, function (attempt) {
    msg = '正在进行第' + (attempt + 1) + '次重连'
  });
  realtime.on(Event.RECONNECT, function () {
    msg = '与服务端连接恢复'
  });
  callback && callback(msg);
}

/********************** 网络相关 ************************/

/********************** 其他服务 ************************/
/***
 * 查询会话聊天记录，可根据消息类型查询
 * @param conversation
 * @returns {Promise<*|void>}
 */
export async function queryMessage(conversation) {
  if (!conversation) return null;
  const promise = await conversation.queryMessages();
  return catchWrap(promise);
}

/********************** 其他服务 ************************/
























async function catchWrap(promise) {
  try {
    return await promise;
  } catch (e) {
    return {}
  }
}
