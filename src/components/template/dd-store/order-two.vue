<template>

  <div class="store-order">
    <div class="dh flex-bt bg-f flex-y-center br-b-d pad-l pad-r" v-if="order.orderNum ||order.createTime">
      <span class="col-9" v-html="order.orderNum ||order.createTime" @click.stop="$emit('left')"></span>
      <span class="col-f52c2c" v-html="order.state || order.status"></span>
    </div>
    <div class="flex-bt pad-30" @click="$emit('click')">
      <div
        :style="{'min-width':order.cover.width+'rem','width':order.cover.width+'rem','height':order.cover.height+'rem','overflow': 'hidden','borderRadius':order.cover.borderRadius+'rem'}"
        class="posi-r"
      >
        <img-wrapper :src="order.cover.src"/>
        <slot name="cover-mask"/>
      </div>
      <div class="mar-l flex-g-1">
        <h3 class="fon-sm hide-e mar-b pad-t-10" v-if="order.title">{{order.title}}</h3>
        <slot v-else name="title"/>
        <div class="col-9 mar-b" v-if="order.desc">{{order.desc}}</div>
        <slot v-else name="desc"/>
        <div class="col-9 flex-bt" v-if="order.price">
          <span class="col-price">{{order.price}}</span>
          <span class="col-9">{{order.num}}</span>
        </div>
        <slot v-else name="down"/>
      </div>
    </div>
    <slot name="center"></slot>
    <div class="dh bg-f flex-bt flex-y-center pad-l pad-r br-t-d" v-if="order.tips || order.bts">
      <span class="col-9" v-html="order.tips"></span>
      <div>
        <dd-store-buttons
          class="pad-0"
          :bts="order.bts"
          @click="(v)=>$emit('button',v)"
        />
      </div>
    </div>
  </div>


</template>

<script>
  import DdStoreButtons from './buttons'

  export default {
    components: {DdStoreButtons},
    props: {
      order: {
        type: Object,
        default() {
          return {
            cover: {
              width: 0,
            },
            bts: []
          }
        }
      },
    }
  }

</script>
