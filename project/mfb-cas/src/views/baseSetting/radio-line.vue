<template>
  <div class="radio-line">
    <Checkbox class="radio-line-checkbox" v-model="single">大仓仓租</Checkbox>
    <div class="radio-item">
      <span>分摊货主：</span>
      <RadioGroup v-model="phone">
        <Radio label="apple">
          <span>不分摊</span>
        </Radio>
        <Radio label="android">
          <span>补货原料</span>
        </Radio>
      </RadioGroup>
    </div>
    <div class="radio-item">
      <span>分摊货主：</span>
      <RadioGroup v-model="phone">
        <Radio label="apple">
          <span>不分摊</span>
        </Radio>
        <Radio label="android">
          <span>补货原料</span>
        </Radio>
      </RadioGroup>
    </div>
  </div>
</template>
<script>
export default {
  name: 'radio-line',
  props: {
    width: Number,
    row: Object
  },
  data() {
    return {
      single: '',
      phone: ''
    }
  }
};
</script>

<style lang="scss" scoped>
.radio-line {
  display: flex;
  height: 50px;
  line-height: 50px;
  // border-bottom: 1px solid #dcdee2;
}
.radio-line + .radio-line {
  border-top: 1px solid #dcdee2;
}
.radio-line-checkbox{
    margin-left: 30px;
    position: relative;
    width: 130px;
    border-right: 1px solid #dcdee2;
}
.radio-item {
  margin: 0 50px;
}
/deep/ .ivu-radio-group {
  vertical-align: bottom;
}
</style>