<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="rentRuleValidate" :label-width="120">
      <FormItem label="所在大区" prop="regionCode">
        <Select
          placeholder="请选择大区"
          v-model="formValidate.regionCode"
          clearable
          filterable
          @on-change="changeRegion"
          @on-clear="clearRegion"
        >
          <Option
            v-for="item in regionList"
            :value="item.selectCode"
            :key="item.selectCode"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="大仓名称" prop="warehouseCode">
        <Select
          placeholder="请选择大仓"
          ref="StationSelectRef"
          v-model="formValidate.warehouseCode"
          clearable
          filterable
        >
          <Option
            v-for="item in warehouseAddList"
            :value="item.selectCode"
            :key="item.selectCode"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="大仓编码" required>
        <Input v-model="formValidate.warehouseCode" disabled placeholder="选择大仓名称带出大仓编码"></Input>
      </FormItem>
      <FormItem label="货主名称" prop="merchantNo">
        <Select
          placeholder="请选择货主"
          ref="StationSelectRef"
          v-model="formValidate.merchantNo"
          clearable
          filterable
        >
          <Option
            v-for="item in merchantAddList"
            :value="item.selectCode"
            :key="item.selectCode"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="费用类型" prop="costItemCode">
        <Select
          placeholder="请选择费用类型"
          ref="StationSelectRef"
          v-model="formValidate.costItemCode"
          clearable
          filterable
        >
          <Option
            v-for="item in itemCodeList"
            :value="item.selectCode"
            :key="item.selectCode"
          >{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="是否为调整额" prop="adjustFlag">
        <RadioGroup v-model="formValidate.adjustFlag">
          <Radio label="1">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="生效日期" required>
        <Row>
          <Col span="11">
            <FormItem prop="effectiveDateStart">
              <DatePicker type="date" placeholder="请选择日期" v-model="formValidate.effectiveDateStart"></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center">至</Col>
          <Col span="11">
            <FormItem prop="effectiveDateEnd">
              <DatePicker type="date" placeholder="请选择日期" v-model="formValidate.effectiveDateEnd"></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="纳税人识别号" prop="taxNo">
        <Input
          type="text"
          clearable
          v-model.trim="formValidate.taxNo"
          @on-blur="changeTaxNo"
          placeholder="请输入纳税人识别号"
        />
      </FormItem>
      <FormItem label="供应商名称" prop="supplierName">
        <Input type="text" disabled clearable v-model="formValidate.supplierName" placeholder="输入纳税人识别号带出供应商名称"/>
      </FormItem>
      <FormItem label="租赁面积" prop="area">
        <InputNumber
          style="width:95%"
          :min="0"
          :precision="4"
          v-model="formValidate.area"
          placeholder="请输入租赁面积"
        ></InputNumber>㎡
      </FormItem>
      <FormItem label="单价" prop="unitPrice">
        <InputNumber
          style="width:85%"
          :precision="4"
          v-model="formValidate.unitPrice"
          placeholder="请输入单价"
        ></InputNumber>元/㎡/天
      </FormItem>
      <FormItem label="日发生额" required>
        <Input type="text" disabled style="width:95%" v-model="formValidate.dailyPrice" />元
      </FormItem>
      <FormItem label="备注">
        <Input
          v-model="formValidate.remarks"
          type="textarea"
          :maxlength="200"
          :autosize="{minRows: 2,maxRows: 5}"
          placeholder="最长支持200汉字、标点、字母、特殊字符等"
        ></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button @click="handleReset('formValidate')">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { rentAdd } from "@/apis/baseData/warehouserent";
import {numberFormat} from '@/utils'

import commonService from "@/apis/common";
export default {
  name: "boxModal",
  props: {
    formValidate: Object,
    regionList: Array,
    itemCodeList: Array,
    warehouseAddList: Array,
    merchantAddList: Array
  },
  data() {
    return {
      rentRuleValidate: {
        regionCode: [
          {
            required: true,
            message: "请选择大区",
            trigger: "change"
          }
        ],
        warehouseCode: [
          {
            required: true,
            message: "请选择大仓",
            trigger: "change"
          }
        ],
        merchantNo: [
          {
            required: true,
            message: "请选择货主名称",
            trigger: "change"
          }
        ],
        costItemCode: [
          { required: true, message: "请选择费用类型", trigger: "change" }
        ],
        adjustFlag: [
          {
            required: true,
            message: "请选择是否为调整额"
          }
        ],
        effectiveDateStart: [
          {
            required: true,
            message: "请选择生效开始日期"
          }
        ],

        effectiveDateEnd: [
          {
            required: true,
            message: "请选择生效结束日期"
          }
        ],
        taxNo: [
          {
            required: true,
            message: "请输入纳税人识别号",
          }
        ],
        supplierName: [
          {
            required: true,
            message: "请输入对应纳税人识别号获取供应商名称"
          }
        ],
        area: [
          {
            required: true,
            message: "请输入租赁面积"
          }
        ],
        unitPrice: [
          {
            required: true,
            message: "请输入单价"
          }
        ]
        // dailyPrice: [
        //   {
        //     required: true,
        //     message: "请输入日发生额",
        //   }
        // ],
      }
    };
  },
  created() {},
  watch: {
    dailyPrice(newVal, oldVal) {
      if (newVal) {
        this.formValidate.dailyPrice = newVal;
      } else {
        this.formValidate.dailyPrice = null;
      }
    },
  },
  computed: {
    // days() {
    //     if(this.formValidate.effectiveDateStart && this.formValidate.effectiveDateEnd) {
    //       return this.moment(this.formValidate.effectiveDateEnd).diff(this.formValidate.effectiveDateStart, 'days') + 1
    //     }
    //     return 0
    // },
    dailyPrice() {
      if ((this.formValidate.area || this.formValidate.area == 0) && (this.formValidate.unitPrice || this.formValidate.unitPrice == 0)) {
        return numberFormat((this.formValidate.area * this.formValidate.unitPrice), 4)
      }
      return 0;
    },
  },
  methods: {
    changeRegion(val) {
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
      if (val) {
        this.$emit("getWarehouseList", val);
      }
    },
    clearRegion() {
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
    },
    //纳税人识别号查询公司信息
    changeTaxNo(val) {
      if (val && this.formValidate.taxNo) {
        this.getSupplierInfoList();
      }
    },
    getSupplierInfoList() {
      commonService
        .listSupplierInfo({ taxNo: this.formValidate.taxNo })
        .then(res => {
          if (res.code == 200) {
            this.formValidate.supplierName = res.result.supplierName;
          } else {
            this.formValidate.supplierName = "";
            this.$Message.error(res.message);
          }
          this.$forceUpdate();
        });
    },
    handleSubmit(name) {
      let formValidate = this.formValidate;
      if (formValidate.effectiveDateStart) {
        formValidate.effectiveDateStart = this.moment(
          formValidate.effectiveDateStart
        ).format("YYYY-MM-DD");
      }
      if (formValidate.effectiveDateEnd) {
        formValidate.effectiveDateEnd = this.moment(
          formValidate.effectiveDateEnd
        ).format("YYYY-MM-DD");
      }
      this.$refs[name].validate(async valid => {
        if (valid) {
          let res = await rentAdd(formValidate);
          if (res.code == 200) {
            this.$Message.success("保存成功");
            this.afterSubmit();
            this.$emit("handleSubmit");
          } else {
            this.$Message.error(res.message);
          }
        }
      });
    },
    afterSubmit() {
      if (this.$refs["formValidate"]) {
        this.$refs["formValidate"].resetFields();
      }
    },
    handleReset(name) {
      this.$refs[name].resetFields();
      this.$emit("handleReset");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>