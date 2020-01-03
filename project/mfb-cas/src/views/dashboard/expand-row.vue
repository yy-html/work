<template>
  <div class="flex" style="height:100%">
    <div class="flex-text-vertical" :style="{'width':width+'px'}">大仓运营费-电费</div>
    <div v-for="item in 7" :key="item" class="flex" style="flex:1">
      <div class="flex-text-vertical" style="flex:1">绝对值</div>
      <div class="flex-text-vertical" style="flex:1">单均</div>
    </div>
  </div>
</template>
<script>
    export default {
        props: {
          width: Number,
          row: Object
        }
    };
</script>

<style scoped>
    .expand-row{
    }
</style>