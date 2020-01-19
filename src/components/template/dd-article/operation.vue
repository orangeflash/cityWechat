<template>
  <div>
    <van-actionsheet
      v-model="showTopOption"
      :actions="toppingOptions"
      cancel-text="取消"
      @select="onTopOptionSelect"
      @cancel="onCancel"
    />

    <van-actionsheet
      v-model="showMore"
      :actions="actions"
      cancel-text="取消"
      @select="onFeatureSelect"
      @cancel="onCancel"
    />


    <dd-layout-div height="100vh" v-if="showInput" class="bg-0-5 posi-f t0 l0 b0 r0 flex-center zIndex999">

      <dd-layout-div :width="690" :height="500" :fillet="30" class="over-h mar-lr-10 bg-f flex flex-col flex-bt">
        <textarea placeholder="请输入反馈详情" v-model="body" class="flex-g-1 lineH-48 br-n out-n pad-30 fon-lg"></textarea>
        <p class="t-r fon-lg pad-30" :class="body.length > 100 && 'col-r'">{{body.length}}/100</p>
        <dd-layout-div :height="96" class="flex flex-y-center" bg="#f0f0f0">
          <span class="flex-g-1 fon-w5 fon-xll flex-center dh-96" @click="showInput = !showInput">取消</span>
          <span class="col-t flex-g-1 fon-w5 fon-xll flex-center dh-96" @click="confirm">确认</span>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

  </div>
</template>


<script>

  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {mapActions, mapState} from 'vuex'

  export default {
    data() {
      return {
        body: '',
        showInput: false,
        showTopOption: false,
        showMore: false,
        toppingOptions: [],
        redEnvelopesConfig: {},
        showFooter: true,
        actions: [],
        config: {},
        reportType: null,
        operationType: 'article',
        isCustom: false,
        isCustomTop: false,

        callBack: () => {
        },
      }
    },
    methods: {
      ...mapActions("post", ["getToppingOptions", "deletePostAction", "cancelPostAction", "PayPostRefreshAction", "getFreeRefreshNum"]),
      ...mapActions("publication", ["createToppingOrder", "getRedEnvelopesConfig", 'getPublicationPrice']),
      ...mapActions("common", ["getPostConfig"]),
      ...mapActions(["reportInfo"]),
      openPicker({actions = []} = {}, callBack) {
        this.actions = actions;
        this.isCustom = true;
        this.showMore = true
        callBack && (this.callBack = callBack)
      },
      openTopPicker({actions = []} = {}, callBack) {
        this.isCustomTop = true
        this.toppingOptions = actions;
        this.toppingOptions = this.topActions();
        this.showTopOption = true;
        callBack && (this.callBack = callBack)

      },
      async confirm() {
        if (!this.body.trim()) return Toast({
          message: '请输入反馈详情',
          duration: 1500
        })
        if (this.body.length > 100) return Toast({
          message: '反馈内容请控制在100字以内',
          duration: 1500
        })
        try {
          this.showInput = false;
          await showDialog("是否举报该信息？");
          const res = await this.reportInfo({
            type: this.reportType,
            details: this.body,
            accusationId: this.postId
          })
          showHandleStatusByFlag(res.code, '感谢您的反馈', '系统繁忙，请稍后再试')
        } catch (e) {

        }

      },
      /** 举报操作 */
      openReport({id, type}, fn, showFooter) {
        // this.post = item;
        this.postId = id;
        this.reportType = type;
        this.actions = [
          {name: '不实信息', type: 1},
          {name: '号码无效', type: 2},
          {name: '非法内容', type: 3},
          {name: '其它反馈', type: 0},
        ];
        this.operationType = 'report'
        this.showMore = true;
      },
      async postConfig() {
        this.config = await this.getPostConfig();
        console.log("this.config", this.config)
      },
      async openArticleTop(item, fn, showFooter) {
        this.operationType = 'article'
        showLoading();
        await this.postConfig();
        hideLoading();
        this.callBack = fn;
        this.post = item;
        this.showFooter = showFooter
        this.postId = item.postId;
        this.showTopOption = true;
        this.fillData(this.postId)
      },
      async openArticleMore(item, fn, showFooter) {
        this.operationType = 'article'
        showLoading();
        await this.postConfig();
        hideLoading();
        this.callBack = fn;
        this.showFooter = showFooter
        this.post = item;
        this.postId = item.postId;
        this.actions = await this.featureActions(this.postId);
        this.showMore = true;
      },
      onCancel() {
        this.showTopOption = false;
        this.showMore = false;
        if (this.showFooter) {
          const footer = document.querySelector('#FooterBar');
          if (footer) footer.style.display = "none";
        }
      },
      async cancelPost() {
        const postId = this.postId;
        const code = await this.cancelPostAction({
          postId
        });
        showHandleStatusByFlag(code);
        if (code) this.callBack && this.callBack('end');
      },
      async deletePost() {
        const postId = this.postId;
        const code = await this.deletePostAction({
          postId
        });
        showHandleStatusByFlag(code);
        if (code) this.callBack && this.callBack('delete');
        this.onCancel();
      },
      topActions() {
        if (this.toppingOptions) {
          return [{
            name: `请选择置顶类型`,
            className: "action-sheet-topic",
          },
            ...this.toppingOptions.map(item => ({...item, name: item.body}))
          ]
        } else {
          return [];
        }
      },
      //置顶信息选择后的回调
      async fillData(postId) {
        this.toppingOptions = await this.getToppingOptions({postId})
        if (this.toppingOptions.length <= 0) {
          this.showTopOption = false;
          Toast('没有置顶的选项');
        } else {
          this.showTopOption = true;

          if (this.showFooter) {
            const footer = document.querySelector('#FooterBar');
            if (footer) footer.style.display = "none";
          }

          this.toppingOptions = this.topActions();
        }
      },
      async onTopOptionSelect(item) {
        if (this.isCustomTop) {
          this.callBack(item);
          this.isCustomTop = false;
          this.showTopOption = false;
          return false;
        }


        showLoading("请求中...");
        const data = await this.createToppingOrder({
          postId: this.postId,
          topId: item.id,
          isTop: 1
        });
        hideLoading();
        try {
          await showDialog("需要支付" + (+item.money).toFixed(2) + "元");
          this.$router.push({
            name: 'cashier',
            params: {
              type: 2,
              param: {
                money: +item.money,
                orderId: data.data
              },
              info: {
                money: +item.money,
                type: "置顶帖子"
              }
            }
          });
        } catch (e) {
          console.log("老板，" + item.money + "元都不愿给我，置顶帖子这件事，我很难帮你办啊！");
        }
        this.onCancel();

        return false;
      },
      async onFeatureSelect(item) {


        this.showMore = false;
        if (this.isCustom) {
          this.callBack(item);
          this.isCustom = false;
          return false;
        }
        if (!this.postId) return showDialog("非法操作");

        const id = item.id,
          type = item.type;


        if (this.operationType == 'article') {
          switch (id) {
            case 0:

              console.log("this.redConfig.redEnvelopes", this.redConfig.redEnvelopes)

              if (this.redConfig.redEnvelopes == "open") {
                return this.goPointPage({
                  obj: this,
                  path: "/publication/publishStatus",
                  query: {
                    redId: 1,
                    postId: this.postId
                  }
                });
              } else {
                return Toast('红包功能已关闭')
              }
            case 1:
              this.showTopOption = true;
              this.fillData(this.postId)
              return false;
            case 2:
              return this.goPointPage({
                path: "/postEdit",
                query: {
                  postId: this.postId
                }
              });
            case 3:
              await showDialog("结束信息后，此信息将不能被其他用户查看，请再次确认是否结束？");
              return this.cancelPost();
            case 4:
              await showDialog("确定删除此条帖子吗？");
              return this.deletePost();
            case 5:
              return this.refreshPostItem();
            case 6:
              return this.goPointPage({
                obj: this,
                path: "/publication/publishStatus",
                query: {
                  rewardId: 1,
                  postId: this.postId
                }
              });
          }
        } else {
          console.log(this.actions[type - 1])
          console.log("是举报操作")
          if (this.reportType) {

            if (type == 0) {
              this.body = ''
              this.showMore = false;
              this.showInput = true;
            } else {
              try {
                await showDialog("是否举报该信息？");

                const res = await this.reportInfo({
                  type: this.reportType,
                  details: this.actions[type - 1].name,
                  accusationId: this.postId
                })
                showHandleStatusByFlag(res.code, '感谢您的反馈', '系统繁忙，请稍后再试')
              } catch (e) {

              }

            }
          } else {
            console.log("缺少信息类型")
          }
        }

      },
      async featureActions(postId) {

        let arr = [
          {
            name: `信息ID：${postId}`,
            className: "action-sheet-topic",
          }, {
            id: 6,
            name: '发布悬赏'
          }, {
            id: 0,
            name: '红包扩散'
          },
          {
            id: 1,
            name: '置顶'
          },
          {
            id: 5,
            name: '刷新',
          },
          {
            id: 2,
            name: '编辑'
          }, {
            id: 3,
            name: '结束信息',
          },
          // {
          //   id: 4,
          //   name: '删除',
          // },

        ]
        console.log("this.redConfig", this.redConfig, this.platform);


        if (!this.redConfig || !this.redConfig.redEnvelopes) {
          await this.getRedEnvelopesConfig()
        }

        // console.log('%c this.post ',
        //   'color: white; background-color: #2274A5',
        //   this.post);
        if (this.redConfig.redEnvelopes == 'close' || this.post.isRedBag == 1) {
          arr.forEach((item, index) => {
            if (item.id == 0) arr.splice(index, 1)
          })
        }

        if (this.config.top != 'open') {
          arr.forEach((item, index) => {
            if (item.id == 1) arr.splice(index, 1)
          })
        }
        if (this.config.reward != true || this.post.isReward != 1 || this.post.offerReward == 1) {
          arr.forEach((item, index) => {
            if (item.id == 6) arr.splice(index, 1)
          })
        }

        return arr
      },
      async refreshPostItem() {

        let isFree = false, money = 0;
        if (this.platform.openVip && this.userInfo.isVip) {
          showLoading();
          const res = await this.getFreeRefreshNum({
            postId: this.postId
          })
          hideLoading();
          if (res.isFree == 1 && res.freeNum > 0) {
            try {
              await showDialog("会员免费刷新，剩余次数：" + res.freeNum, '会员');
              isFree = true;
            } catch (e) {
              return false;
            }
          }
        }
        if (!isFree) {
          let resData = await this.getPublicationPrice({
            cid: this.post.typeId
          });

          resData = resData.data;
          money = this.post.cityId != '0' ? +resData.refreshMoney : +resData.countryRefreshMoney;
        }
        // const res = await this.PayPostRefreshAction({
        //   postId: this.postId,
        // });
        if (money > 0) {
          try {
            await showDialog(`刷新帖子需要支付${(+money).toFixed(2)}元，是否确认？`, "刷新信息");
            this.showTopOption = false;
            this.$router.push({
              name: 'cashier',
              params: {
                type: 1,
                param: {
                  postId: this.postId,
                },
                info: {
                  money: money,
                  type: "刷新帖子",
                  // hasParam: res
                }
              }
            })
          } catch (e) {
            console.log("老板，" + money + "元都不愿给我，刷新帖子这件事，我很难帮你办啊！");
          }
          return false;
        } else {
          const res = await this.PayPostRefreshAction({
            postId: this.postId
          });
          showHandleStatusByFlag(res.code, "刷新成功", res.msg, () => {
            this.showTopOption = false;
            this.callBack && this.callBack('end')
          })
        }


      },
    },
    computed: {
      ...mapState({
        platform: s => s.platform,
        userInfo: s => s.user,
      }),
      ...mapState("publication", {
        redConfig: s => s.redConfig
      })
    },
  }

</script>
