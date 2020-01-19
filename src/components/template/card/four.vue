<template>
      <div class="plug" >
        <ul class="flex pad-30 mar-30">
          <li v-for="(item,key) in config" :key="key"
              @click.stop="$emit('click',key,item)"
          >
            <i class=" iconfont"
              :class="item.icon"
            ></i>
            <p>{{item.name}}</p>
          </li>
        </ul>

      </div>
</template>

<script>
    export default {
      name:'UserSet',
      props:{
        cardItem:'',
        config:{
          type:Array,
          default:[]
        }
      },
      methods:{

      },
      created() {
        console.log("card",this.cardItem)
      }

    }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .plug{
    ul{
      li{
        flex: 1;

        text-align: center;
        i {
          font-size: 45px;

        }
        .icon-xuqi{
          color: #FF1E1E;
        }
        .icon-bianjianxia, .icon-zhiding,.icon-wodefabu{
          color: #5DB271;
        }
        p {
          margin-top: 10px;
          font-size: 28px;
          color:rgba(102, 102, 102, 1);
        }



      }
    }

  }

</style>
