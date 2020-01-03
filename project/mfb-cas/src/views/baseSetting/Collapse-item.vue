<template>
  <Collapse @on-change="change" v-model="value2">
    <Panel name="1">
      <Checkbox v-model="single">大仓仓租</Checkbox>
      <div slot="content">
        <radio-line></radio-line>
        <radio-line></radio-line>
        <radio-line></radio-line>
        <radio-line></radio-line>
        <radio-line></radio-line>
      </div>
    </Panel>
  </Collapse>
</template>

<script>
import radioLine from './radio-line'
export default {
  name: "CollapseItem",
  components:{
    radioLine
  },
  data() {
    return {
      value2: '',
      single: ''
    };
  },
  methods: {
    change(index) {
      console.log(index)
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .ivu-collapse-content>.ivu-collapse-content-box .radio-line:first-child{
 margin-top: 0;
}
</style>

