<template>
 <div class="rectangle-wrapper flex flex-vertical">
   <div class="flex-text-vertical top">（日）维度</div>
   <div class="flex-text-vertical bottom">成本项</div>
 </div>
</template>

<script>
export default {
  name: 'table-rectangle',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.rectangle-wrapper {
  height: 100%;
  position: relative;
  background:linear-gradient(
    to top right,
    rgba(255,255,255, 0) 0%,
    rgba(255,255,255, 0) calc(50% - 1px),
    rgba(232,234,236, 1) 50%,
    rgba(255,255,255, 0) calc(50% + 1px),
    rgba(255,255,255, 0) 100%
  );
  .top {
    flex:1;
    padding-left: 40%;
  }
  .bottom {
    flex:1;
    padding-right: 40%;
  }
}
</style>

