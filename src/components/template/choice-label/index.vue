<template>
  <div class="dd-choice-lable">
    <em v-for="(item,key) in itemLabels"
        v-if="item[field || 'name']"
        :class="{active:item.active}"
        :key="key"
        :style="{background:item.disabled?'#eee':'',borderColor:item.disabled?'#eee':''}"
        @click.stop="!item.disabled&&choice(item,key)">
          {{(before|| '') + item[field || 'name'] + (after || '') }}
    </em>
  </div>
</template>

<script>

  import {showText} from "../../../util";

  export default {
    props:['labels','field','isSingle','after','before','labelsDefault',"max"],
    model:{

    },
    data(){
      return{
        labelArray:[],
        itemLabels:[],
      }
    },
    methods:{
      choice(item,key){
        if(!this.isSingle){
          const index = this.labelArray.indexOf(item);
          if(!this.itemLabels[key].active){
            if(this.labelArray.length >= this.max){
              return showText('最多选择'+this.max+'个标签')
            }
            this.$set(this.itemLabels[key],"active", true);
          }else{
            this.$set(this.itemLabels[key],"active", false);
          }
          if(item.active){
            this.labelArray.push(item)
          }else{
            this.labelArray.splice(index,1);
          }
          this.$emit('choice',this.labelArray);
          console.log('this.labelArray',this.labelArray);
        }else{
          for (let i=0;i<this.itemLabels.length;i++)  this.$set(this.itemLabels[i],"active", false);
          this.$set(this.itemLabels[key],"active", true);
          this.$emit('choice',item);
        }
      },
      labelsList(){
        this.labelArray = [];
        this.itemLabels = JSON.parse(JSON.stringify(this.labels));
        this.itemLabels.forEach(item=>{
          item.active&&(item.active = false);
        });
        if(this.labelsDefault){
          for(let i=0;i< this.itemLabels.length;i++){
            if(this.labelsDefault.indexOf(this.itemLabels[i].name) >= 0){
              this.choice(this.itemLabels[i],i);
            }
          }
        }
      }
    },
    watch:{
      labels:function () {
        this.labelsList(true);
      }
    },
    created(){
      this.labelsList(true);
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/common";
  .dd-choice-lable{
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    em{
      padding: 18px 20px 14px;
      margin-right: 20px;
      text-align: center;
      border: 1.1px solid #bbb;
      color: #999;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    em.active{
      border: 1.1px solid $themeColor;
      color: $themeColor;
    }

  }

</style>
