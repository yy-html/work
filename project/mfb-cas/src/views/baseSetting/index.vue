<template>
  <div class="page-container">
      <CollapseItem></CollapseItem>
      <CollapseItem></CollapseItem>
      <CollapseItem></CollapseItem>
      <CollapseItem></CollapseItem>
  </div>
</template>

<script>
import CollapseItem from './Collapse-item'

export default {
  name: "ruleSetting",
  components: {
    CollapseItem
  },
  data() {
    return {
      phone: "",
      single: '',
      value2: ""
    };
  },
  created() {},
  methods: {
      change(index) {
          console.log(index)
      }
  }
};
</script>

<style lang="scss" scoped>
.page-container {
}

</style>

