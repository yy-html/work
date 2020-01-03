<template>
  <Modal
    :title="title"
    :value="isShowModal"
    footer-hide
    @on-visible-change="change"
    :mask-closable="false"
  >
    <Form ref="addBatchForm" :model="formInfo" :rules="formRules" :label-width="120">
      <FormItem style="width:350px" label="所在大区:" prop="regionCode">
        <Select
          ref="region"
          @on-change="changeRegion"
          clearable
          :label-in-value="true"
          v-model="formInfo.regionCode"
          placeholder="请选择所在大区"
        >
          <Option
            v-for="(item) in regionList"
            :value="item.selectCode"
            :key="item.selectCode"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem style="width:350px" label="大仓名称:" prop="warehouseName">
        <Select
          placeholder="根据查询选择后带出大仓编码"
          v-model="formInfo.warehouseName"
          clearable
          filterable
          @on-change="selectHouse"
        >
          <Option
            v-for="item in warehouseAddList"
            :value="item.selectName"
            :label="item.selectName"
            :key="item.selectCode"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem style="width:350px" label="大仓编码:" prop="warehouseCode">
        <Input clearable v-model.trim="formInfo.warehouseCode" disabled></Input>
      </FormItem>
      <FormItem style="width:350px" label="货主名称:" prop="merchantNo">
        <Select
          placeholder="请选择货主名称"
          v-model="formInfo.merchantNo"
          clearable
          filterable
        >
          <Option
            v-for="(item, index) in merchantAddList"
            :value="item.selectCode"
            :key="index"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem style="width:350px" label="费用类型:" prop="costItemCode">
        <Select
          placeholder="请选择费用类型"
          v-model="formInfo.costItemCode"
          clearable
          filterable
        >
          <Option
            v-for="(item,index) in costCode"
            :value="item.selectCode"
            :key="index"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="是否为调整额" prop="adjustFlag">
        <RadioGroup v-model="formInfo.adjustFlag">
          <Radio :label="1">是</Radio>
          <Radio :label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="生效日期" required>
        <Row>
          <Col span="11">
            <FormItem prop="effectiveDateStart">
              <DatePicker
                type="date"
                format="yyyy/MM/dd"
                placeholder="年/月/日"
                v-model="formInfo.effectiveDateStart"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <FormItem prop="effectiveDateEnd">
              <DatePicker
                type="date"
                format="yyyy/MM/dd"
                placeholder="年/月/日"
                v-model="formInfo.effectiveDateEnd"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="月发生额:" prop="monthlyPrice">
        <InputNumber
          style="width:150px"
          clearable
          :min="0"
          :precision="4"
          v-model="formInfo.monthlyPrice"
        ></InputNumber>
        <span class="tips">元</span>
      </FormItem>
      <FormItem style="width:350px" label="日发生额:" prop="dailyPrice">
        <Input clearable disabled v-model="formInfo.dailyPrice"></Input>
        <span class="tips">元</span>
      </FormItem>
      <FormItem label="备注:">
        <Input
          v-model.trim="formInfo.remarks"
          type="textarea"
          :rows="4"
          :autosize="{maxRows: 6, minRows: 4}"
          :maxlength="200"
          placeholder="最长支持200汉字、标点、字母、特殊字符"
        />
        <div style="color:#aaa;">{{formInfo.remarks && formInfo.remarks.length || 0}}/200</div>
      </FormItem>
      <FormItem class="footer-container">
        <Button style="margin-right:12px" @click="toReset">取消</Button>
        <Button type="primary" @click="toSubmit('addBatchForm')">保存</Button>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
import { edit } from "@/apis/baseData/depreciation";
import moment from "moment";
import commonService from "@/apis/common";
import {numberFormat} from '@/utils'
export default {
  name: "createClassify",
  props: {
    isShowModal: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "add"
    },
    costCode: {
      type: Array,
      default: []
    },
    regionList: {
      type: Array,
      default: []
    },
    merchantList: {
      type: Array,
      default: []
    },
    formInfo: {
      type: Object,
      default: {
        monthlyPrice: null
      }
    }
  },
  data() {
    return {
      // options: {
      //   disabledDate(date) {
      //     return (
      //       (date && date.valueOf() < moment().startOf("month")) ||
      //       (date && date.valueOf() > moment().endOf("month"))
      //     );
      //   }
      // },
      warehouseAddList: [],
      merchantAddList: [],
      formRules: {
        regionCode: [{ required: true, message: "所在大区不能为空" }],
        warehouseName: [{ required: true, message: "大仓名称不能为空" }],
        merchantNo: [{ required: true, message: "货主名称不能为空" }],
        costItemCode: [{ required: true, message: "费用类型不能为空" }],
        adjustFlag: [{ required: true, message: "是否为调整额不能为空" }],
        effectiveDateStart: [{ required: true, message: "生效日期不能为空" }],
        effectiveDateEnd: [{ required: true, message: "生效日期不能为空" }],
        monthlyPrice: [{ required: true, message: "月发生额不能为空" }]
      }
    };
  },
  watch: {
    dailyPrice(newVal, oldVal) {
      if (newVal) {
        this.formInfo.dailyPrice = numberFormat(newVal, 4)
      } else {
        this.formInfo.dailyPrice = 0;
      }
    },
    isShowModal(newVal) {
      if(newVal && this.type == 'edit') {
        this.getWarehouseList(this.formInfo.regionCode)
      }
    }
  },
  methods: {
    selectHouse(val) {
      if(val) {
        let obj = this.warehouseAddList.find(item=>item.selectName == val)
        this.$set(this.formInfo, "warehouseCode", obj.selectCode);
      }else{
        this.$set(this.formInfo, "warehouseCode", '');
      }
    },
    initData() {
      this.formInfo.warehouseName = ''
      this.formInfo.warehouseCode = ''
      this.formInfo.merchantNo = ''
      // this.$refs["addBatchForm"].resetFields();
      
    },
    // 选择货主
    changeRegion(item) {
      if (item) {
        this.getWarehouseList(item.value);
        this.initData()
      }else {
        this.initData()
      }
    },
    //大仓
    getWarehouseList(val) {
      commonService
        .getSelectorList({ selectType: ["warehouse", "merchant"], regionCode: val })
        .then(res => {
          if (res.code == 200) {
            // const { warehouse } = res.result;
            const { warehouse, merchant } = res.result;
            this.warehouseAddList = warehouse || [];
            this.merchantAddList = merchant || [];
            if(this.type == "edit"){
              if(!this.formInfo.merchantNo) return
              let obj = this.merchantAddList.find(i => i.selectCode == this.formInfo.merchantNo) 
              if(!obj){
                this.merchantAddList.push({selectCode: this.formInfo.merchantNo,selectName:this.formInfo.merchantName})
                this.$forceUpdate()
              }
            }
          }
        });
    },
    change(status) {
      if (!status) {
        this.warehouseAddList = []
        this.$refs['region'].clearSingleSelect()
        this.toReset()
        // this.$emit('update:formInfo', {
        //     monthlyPrice: null
        // })
      }
    },
    async toSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formInfo.effectiveDateStart = moment(this.formInfo.effectiveDateStart ).format('YYYY-MM-DD')
          this.formInfo.effectiveDateEnd = moment(this.formInfo.effectiveDateEnd ).format('YYYY-MM-DD')
          let res = await edit(this.formInfo);
          if (res.code == 200) {
            this.$Message.success('保存成功')
            this.toReset();
            this.$emit("success");
          } else {
            this.$Message.error(res.message);
          }
        }
      });
    },
    toReset() {
      this.$refs["addBatchForm"].resetFields();
      this.$emit("update:isShowModal", false);
    }
  },
  computed: {
    title() {
      return this.type == "add" ? "新增" : "编辑";
    },
    disabled() {
      return this.type != "add";
    },
    days() {
      if (this.formInfo.effectiveDateStart && this.formInfo.effectiveDateEnd) {
        return moment(this.formInfo.effectiveDateEnd).diff(
          this.formInfo.effectiveDateStart,
          "days"
        ) + 1;
      }
      return 0;
    },
    dailyPrice() {
      if (this.days && (this.formInfo.monthlyPrice || this.formInfo.monthlyPrice == 0)) {
        return this.formInfo.monthlyPrice / this.days;
      }
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
.footer-container {
  text-align: center;
}
.tips {
  position: absolute;
  margin-left: 10px;
  color: #aaa;
  width: 200px;
}
</style>