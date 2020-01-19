<template>

  <div class="dd-tree-select"
       :class="{'fixedTop':fixedTop}"
  >
    <div class="dd-tree-select_mask" v-if="showTree && !isHideTree" @click.stop="closed"></div>

    <ul class="dd-tree-select_header flex-x-bt">
      <li
        v-for="(item,key) in trees"
        :key="key"
        class="flex-center fon-wb  dh-100 flex-g-1"
        :class="[key == headerIndex?'col-t':'col-3']"
        @click.stop="openTree(key)"
      >
        <span class="fon-xl">{{item.title}}</span>
        <i class="iconfont icon-sanjiaoxing fon-xs mar-l-10"></i>
      </li>
    </ul>
    <div class="dd-tree-select_list"
         v-if="showTree && !isHideTree">
      <ul v-if="itemTree.length>0">
        <li
          v-for="(item,key) in itemTree"
          :key="key"
          class="flex-y-center"
          @click.stop="choiceTree(key)"
        ><span :class="{'col-t':key == itemIndex}">{{item.text}}</span></li>
      </ul>
      <ul v-if="itemChildrenTree.length>0">
        <li
          v-for="(item,key) in itemChildrenTree"
          :key="key"
          class="flex-y-center"
          @click.stop="choiceChildrenTree(key)"
        ><span :class="{'col-t':key == itemChildrenIndex}">{{item.text}}</span></li>
      </ul>
    </div>
  </div>

</template>


<script>
  export default {
    props: {
      isHideTree: {
        type: Boolean,
        default: false,
      },
      fixedTop: {
        type: Boolean,
        default: false,
      },
      trees: {
        type: Array,
        default: []
      },
      value: {        //隐藏式
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        itemIndex: 0,
        itemChildrenIndex: null,
        headerIndex: null,
        showTree: false,
        itemTree: [],
        lastItemIndex: null,
        itemChildrenTree: [],
      }
    },
    methods: {
      openTree(index) {

        // console.log(index);
        if (this.lastItemIndex == index) {

        } else {
          this.lastItemIndex = this.headerIndex = index;
          this.itemIndex = null;
        }


        this.showTree = true;
        this.itemTree = this.trees[index].items;

        this.itemChildrenIndex = null;
        this.itemChildrenTree = [];
        this.highlight();
        this.$emit('openTree', index);
      },
      choiceTree(index, screen) {
        this.itemIndex = index;
        if (this.itemTree[index].children && this.itemTree[index].children.length > 0) {
          this.itemChildrenIndex = null;
          this.itemChildrenTree = this.itemTree[index].children;
        } else {
          this.showTree = false;
          this.$emit('choice', this.itemTree[index], this.headerIndex);
        }

        if (!screen) {
          this.trees[this.headerIndex].title = this.itemTree[index].text
        }
      },
      choiceChildrenTree(index) {
        this.showTree = false;
        this.itemChildrenIndex = index;

        if (this.itemChildrenTree[index].text != '全部') {
          this.trees[this.headerIndex].title = this.itemChildrenTree[index].text;
        } else {
          this.trees[this.headerIndex].title = this.itemTree[this.itemIndex].text
        }
        this.$emit('choice', this.itemChildrenTree[index], this.headerIndex);
      },
      highlight() {
        let isSelect = false;
        this.itemTree && this.itemTree.forEach((item, index) => {
          if (isSelect) return;
          console.log(this.trees[this.headerIndex].title)
          if (item.text == this.trees[this.headerIndex].title) {
            console.log("找到了：", item.text);
            this.itemIndex = index;


            if (item.children && item.children.length > 0) {
              this.choiceTree(index, true);
              this.itemChildrenIndex = 0;
            }
            isSelect = true;
          } else if (item.children && item.children.length > 0) {
            //console.log("======================================>>>>>>>>>>>>>")
            item.children.forEach((child, key) => {
              if (child.text == this.trees[this.headerIndex].title) {
                this.itemIndex = index;
                this.choiceTree(index, true);
                this.itemChildrenIndex = key;
              }
            })
          }
        })
      },
      closed() {
        this.showTree = false;
        this.$emit('closed')
      }
    }
  }


</script>


<style scoped lang="scss">
  @import "../../../assets/theme";

  .fixedTop {
    position: fixed !important;
    z-index: 999 !important;
    top: 0;
    left: 0;
    width: 100%;
  }

  .dd-tree-select {
    background: #fff;
    position: relative;
    z-index: 998;

    &_header {
      height: 88px;
      border-bottom: 1.1px solid #ddd;
      font-size: 28px;
      position: relative;
      z-index: 1;
      background: #fff;
      color: #666;
    }

    &_list {
      max-height: 560px;
      position: absolute;
      z-index: 1;
      width: 100%;
      background: #fff;
      font-size: 28px;
      display: flex;

      ul {
        max-height: 560px;
        overflow: scroll;
        flex: 1;
        border-right: 1.1px solid #ddd;
        padding-left: 30px;

        li {
          height: 88px;
          border-bottom: 1.1px solid #ddd;
          color: #666;

        }

        li:active {
          background: #eee;
        }
      }

    }

    &_mask {
      position: fixed;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: rgba(0, 0, 0, .5);
    }
  }
</style>
