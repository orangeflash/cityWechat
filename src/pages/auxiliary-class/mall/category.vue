<template>
  <div class="mall-category">
    <!--<div class="mall-category_top">-->
      <!--<Search-->
        <!--placeholder="搜索商品"-->
        <!--@search="search"-->
        <!--searchType="8"-->
      <!--&gt;</Search>-->
    <!--</div>-->
    <div class="mall-category_list">
      <ul class="mall-category_list_tabs">
        <li
          v-for="(item,key) in category"
          :key="key"
          @click="changeCategory(key)"
          :class="{'active':item.active}"
        >{{item.name}}
        </li>
      </ul>
      <div class="mall-category_list_info">
        <div class="goods-category" v-for="(item,key) in itemCategory" :key="key">
          <div class="goods-category_title">{{item.name}}</div>
          <ul class="goods-category_list">
            <li class="goods-category_list_single"
                v-for="(itemSon,index) in item.son"
                :key="index"
                @click="goPointPage({path:'/auxiliary/mall/categoryDetails',query:itemSon})"
                v-if="itemSon.name"
            >
              <div class="goods-icon">
                <img :src="itemSon.icon&&getSingleImg(JSON.parse(itemSon.icon)[0].url)">
              </div>
              <span>{{itemSon.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Search from '@/components/template/search';

  import {mapActions, mapState} from 'vuex';
  import {utilMixins} from "@/plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    data() {
      return {
        category: [],
        itemCategory: []
      }
    },
    components: {Search},
    methods: {
      ...mapActions('mall', ['getMallCategory']),
      /** 切换指定分类 */
      changeCategory(key) {
        this.category.forEach((item, index) => {
          if (index == key) {
            item.active = true;
            this.itemCategory = [this.category[key]];
          } else {
            item.active = false;
          }
        })
      },
      search(val) {
        this.goPointPage({
          path: '/auxiliary/mall/categoryDetails',
          query: {
            word: val,
          }
        })
      }
    },
    computed: {
      ...mapState('mall', {})
    },
    created() {

      const value = this.$route.query.value ? this.$route.query.value.split("#") : [];
      if (value.length < 2) {
        this.getMallCategory().then(result => {
          console.log('getMallCategory', result);
          this.itemCategory = this.category = result;
          this.category.forEach((item, key) => {
            if (item.id == value[0]) {
              this.changeCategory(key);
            }
          })
        })
      } else {
        this.goPointPage({
          path: '/auxiliary/mall/categoryDetails',
          query: {
            pid: value[0],
            id: value[1]
          }
        })
      }


    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .mall-category {
    &_top {
      background: $themeColor;
      padding: 30px 30px 60px;
    }

    &_list {
      position: fixed;
      width: 100%;
      top: 0px;
      bottom: 95px;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      background: #F8F8F8;
      overflow: auto;
      display: flex;

      &_tabs {
        background: #fff;
        width: 140px;
        overflow: auto;

        li {
          padding: 40px 35px;
          font-size: 26px;
          line-height: 32px;
        }

        .active {
          background: #F8F8F8;
          color: $themeColor;
        }
      }

      &_info {
        width: calc(100% - 140px);
        padding: 0 30px 30px;
        overflow: auto;

        .goods-category {
          &_title {
            font-size: 28px;
            padding: 30px 0;
          }

          &_list {
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;
            padding-bottom: 20px;

            li {
              width: 33.333%;
              text-align: center;
              padding: 10px 0;

              div {
                width: 90px;
                height: 90px;
                overflow: hidden;
                margin: 20px auto;

                img {
                  width: 100%;
                  height: 100%;
                }
              }

              span {
                color: #666;
                font-size: 26px;
              }
            }
          }
        }
      }
    }
  }
</style>
