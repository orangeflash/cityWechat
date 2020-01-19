<template>
  <div class="dd-button-group bg-f" ref="buttonGroup" :class="parentClass" v-if="getBtsGroup.length>0">

    <van-swipe
      :loop="false"
      style="width: 100%"
      class="pad-b"
      @change="onChange"
      :width="getWidth"
    >
      <van-swipe-item v-for="(buttonList,chunkBtnKey) in getBtsGroup" :key="chunkBtnKey">
        <ul class="dd-button-group_row" :class="className">
          <li class="dd-button-group_row_single"
              v-for="(item,key) in buttonList"
              :key="key"
              @click.stop="changeUrl(item,key)"
              :class="item.parentClass"
          >
            <div class="dd-button-group_row_single_icon"
                 :class="item.class"
                 :style="item.style"
            >
              <img v-if="item.src || (getType(item.icon) == 'array' && item.icon.length )"
                   :src="item.src || (item.icon&&getSingleImg(item.icon[0].url))"/>
              <i v-if="item.icon && getType(item.icon) == 'string'" class="iconfont" :class="item.icon"></i>
              <div v-else class="bg-e-i hei100"></div>
            </div>
            <h3 :class="{'col-t':item.active}">{{item.name}}</h3>
          </li>
        </ul>

      </van-swipe-item>
      <div slot="indicator" v-if="getBtsGroup && getBtsGroup.length > 1"
           class="posi-a zIndex99 b0 w100 dh-30 flex-center">
        <div class="flex">
            <span class="w-30 dh-8 br-r-4 mar-l-10" v-for="i in getBtsGroup.length" :key="i"
                  :class="current+1 == i ?'bg-t':'bg-e'"></span>
        </div>
      </div>
    </van-swipe>


  </div>
</template>

<script>

  import {utilMixins} from "@/plugins/util-mixins";
  import {Toast} from 'vant';

  export default {
    mixins: [utilMixins],
    props: ['btns', 'deliver', 'className', 'parentClass'],
    data() {
      return {
        row: 0,
        current: 0
      };
    },
    methods: {
      onChange(index) {
        this.current = index;
      },

      /**
       * 获取相对应的链接地址
       * */
      getPathUrl(url) {
        switch (url) {
          case 'index':
            return '/home';
          case 'post':
            return '/classification';
          case 'put':
            return '/publication';
          case 'business':
            return '/businessDistrict';
          case 'news':
            return '/cityInformation';
          case 'businessJoin':
            return '/publication/businessEnterForm';
          case 'userCenter':
            return '/personal';
          case 'sign':
            return '/sign';
          case 'task':
            return '/personal/integralMall/task';
          case 'redPage':
            return '/redbag';
          case 'storeRank':
            return '/businessDistrict/storeRankingList';
          case 'integralShop':
            return '/personal/integralMall';
          case 'shopCategory':
            return '/auxiliary/mall/category'
          case 'rush':
            return '/auxiliary/rushBuy';
          case 'group':
            return '/auxiliary/assemble';
          case 'activity':
            return '/auxiliary/activity';
          case 'bargain':
            return '/auxiliary/bargain';
          case 'job':
            return '/auxiliary/jobHunt';
          case 'car':
            return '/auxiliary/freeRide';
          case 'coupon':
            return '/auxiliary/coupon';
          case 'vip':
            return '/auxiliary/vip';
          case 'yellow':
            return '/wechat/yellowPage';
          case 'renting':
            return '/auxiliary/housingDeal';
          case 'superCard':
            return '/auxiliary/card';
          case 'partner':
            return '/partner';

        }
      },
      changeUrl(item, key) {
        console.log(item)
        if (item.url) {
          if (item.url.indexOf('http') == 0) {
            window.location.href = item.url
          } else {
            this.goPointPage({
              path: this.getPathUrl(item.url),
              query: item.val ? {
                value: item.val,
              } : {}
            })
          }
        } else {
          this.deliver ? this.$emit("click", {
            name: 'buttonGround',
            value: {...item, key}
          }) : this.$emit("click", {...item, key})


          // Toast({
          //   message:'敬请期待',
          //   duration:1500
          // })
        }

      }
    },
    computed: {
      getWidth() {
        setTimeout(() => {
          return this.$refs.buttonGroup.clientWidth;
        }, 10)

      },
      getBtsGroup() {
        let group = [],
          itemGroup = [];
        try {
          this.btns && this.btns.forEach((item, i) => {
            if (i % 10) {
              itemGroup.push(item);
            } else {
              itemGroup = [];
              itemGroup.push(item);
              group.push(itemGroup)
            }
          });
        } catch (e) {
          console.log(e)
        }

        return group
      },
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-button-group {
    padding: 20px 0 0;

    &_row {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      &_single {
        width: 20%;
        text-align: center;
        margin: 10px 0;
        overflow: hidden;

        &_icon {
          width: 72px;
          height: 72px;
          overflow: hidden;
          margin: 0 auto 12px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
</style>
