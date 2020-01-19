import {Toast} from "vant";
import {mapActions, mapState} from 'vuex'
import {requestByUpload} from "../util/request";
import placeholder from "../assets/img/other/video_placeholder.jpg"


import {
  chooseImage,
  onVoicePlayEnd,
  playVoice,
  startRecord,
  stopRecord,
  uploadImage,
  uploadVoice
} from "../util/wechat-util";

function showSpinnerLoading(msg) {
  Toast.loading({
    duration: 0,       // 持续展示 toast
    forbidClick: true, // 禁用背景点击
    loadingType: 'spinner',
    message: msg
  });
}

const ConversationActions = {
  methods: {
    ...mapActions('conversation', ['postTextMsgAction', 'postAudioMsgAction', 'postImgMsgAction', 'postVideoMsgAction', 'setTargetUserById']),
    /***
     * 开始录音
     * @param event
     * @returns {Promise<void>}
     */
    async beginRecord(event) {
      event.preventDefault();
      const vm = this;
      vm.recordState = true;
      //第一次授权
      if (localStorage.rainAllowRecord !== 'true') {
        await startRecord();
        localStorage.rainAllowRecord = 'true';
        await stopRecord();
      } else {
        showSpinnerLoading("录音中...");
        this.recordStartTime = Date.now();
        await startRecord();
        //如果等调起录制按钮时 已经松开了手 则直接结束
        if (!vm.recordState) {
          vm.stopRecord();
        }
      }
    },
    /***
     * 结束录音
     * @returns {Promise<void>}
     */
    async stopRecord() {
      //未授权状态
      if (localStorage.rainAllowRecord !== 'true') return;
      const vm = this;
      vm.recordState = false;
      Toast.clear();
      const {localId} = await stopRecord();
      const duration = Math.ceil((Date.now() - vm.recordStartTime) / 1000);
      const {serverId} = await uploadVoice(localId);
      vm.postAudioMsgAction({
        conversation: vm.conversation,
        serverId, localId, duration
      });
    },
    /***
     * 上传图片
     * @returns {Promise<void>}
     */
    async uploadImg() {
      const vm = this;
      const {localIds} = await chooseImage();
      const promiseArr = localIds.map(async (localId) => {
        const {serverId} = await uploadImage(localId);
        return {localId, serverId}
      });
      showSpinnerLoading("上传中...");
      //获取所有的服务端id
      const serverAndLocalIds = await Promise.all(promiseArr);
      const uploadPromiseArr = serverAndLocalIds.map(async ({localId, serverId}) => {
        return vm.postImgMsgAction({
          conversation: vm.conversation,
          serverId, localId
        });
      });
      await Promise.all(uploadPromiseArr);
      Toast.clear();
    },
    /***
     * 播放音频
     * @param localId
     * @param index
     */
    async playAudio(localId, index) {
      this.playVideoIndex = index;
      playVoice(localId);
      await onVoicePlayEnd();
      this.playVideoIndex = null;
    },
    /***
     * 播放视频
     * @param url
     */
    playVideo(url) {
      this.videoUrl = url;
      const element = this.$refs.commonVideo;
      setTimeout(() => {
        element.play();
      }, 100);
    },
    /***
     * 上传视频
     * @param e
     * @returns {Promise<void>}
     */
    async uploadVideo(e) {
      showSpinnerLoading("上传中...");
      const videoFile = e.file;
      let formData = new FormData();
      formData.append("file", videoFile);
      const {src} = await requestByUpload(formData);
      //TODO 需要从后端获取视频第一帧
      // const captureImageUrl = await _requestFirstStempToTestServer(formData);
      Toast.clear();
      this.postVideoMsgAction({
        conversation: this.conversation,
        videoUrl: src,
        captureImageUrl: placeholder,
      });
    },
  }
};
export default ConversationActions;
