<template>
  <div>
    <Form ref="formValidate" :model="formValidate" :rules="rentRuleValidate" :label-width="120">
      <FormItem label="所在大区" prop="regionCode">
        <Select
          placeholder="请选择大区"
          ref="StationSelectRef"
          v-model="formValidate.regionCode"
          @on-change="changeRegion"
          @on-clear="clearRegion"
          clearable
          filterable
        >
          <Option v-for="item in regionList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
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
          <Option v-for="item in warehouseAddList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
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
          <Option v-for="item in merchantAddList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="费用类型" prop="costItemCode">
        <Select
          placeholder="请选择费用类型"
          ref="StationSelectRef"
          v-model="formValidate.costItemCode"
          @on-change="changeCostItemCode"
          clearable
          filterable
        >
          <Option v-for="item in itemOprateCodeList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="费用子类型" :prop="showItemCostType?'costItemSubCode':''" v-if="showItemCostType">
        <Select
          placeholder="请选择费用子类型"
          ref="StationSelectRef"
          v-model="formValidate.costItemSubCode"
          @on-change="changeCostItemSubCode"
          clearable
          filterable
        >
          <Option v-for="item in itemCostTypeList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
        </Select>
      </FormItem>

      <FormItem label="是否为调整额" prop="adjustFlag">
        <RadioGroup v-model="formValidate.adjustFlag" >
          <Radio label="1">是</Radio>
          <Radio label="0">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="生效日期"  required>
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
        <Input type="text" clearable v-model.trim="formValidate.taxNo"  @on-blur="changeTaxNo" placeholder="请输入纳税人识别号" />
      </FormItem>
      <FormItem label="供应商名称" prop="supplierName">
        <Input type="text" disabled clearable v-model="formValidate.supplierName" placeholder="输入纳税人识别号带出供应商名称"/>
      </FormItem>
      <FormItem label="日发生额" prop="dailyPrice">
        <InputNumber style="width:95%" :precision="4" v-model="formValidate.dailyPrice" placeholder="请输入日发生额"></InputNumber>元
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
import { operateAdd } from "@/apis/baseData/warehouseoperate";
import commonService from "@/apis/common";
import { async } from 'q';
export default {
  name: "operateModal",
  props: {
    formValidate: Object,
    regionList: Array,
    itemOprateCodeList:Array,
    warehouseAddList: Array,
    merchantAddList: Array
  },
  data() {
    return {
      itemCostTypeList : [],
      // showItemCostType:false,
      rentRuleValidate: {
        regionCode: [
          {
            required: true,
            message: "请选择大区",
            trigger: 'change' 
          }
        ],
        warehouseCode: [
          {
            required: true,
            message: "请选择大仓",
            trigger: 'change' 
          }
        ],
        merchantNo: [
          {
            required: true,
            message: "请选择货主名称",
            trigger: 'change' 
          }
        ],
        costItemCode: [
          { required: true, message: "请选择费用类型", trigger: 'change'}
        ],
        costItemSubCode: [
          { required: true, message: "请选择费用子类型", trigger: 'change'}
        ],
        adjustFlag: [
          {
            required: true,
            message: "请选择是否为调整额",
          }
        ],
        effectiveDateStart: [
          {
            required: true,
            message: "请选择生效开始日期",
          }
        ],
        
        effectiveDateEnd: [
          {
            required: true,
            message: "请选择生效结束日期",
          
          },
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
            message: "请输入对应纳税人识别号获取供应商名称",
         
          }
        ],
        dailyPrice: [
          {
            required: true,
            message: "请输入日发生额",
          }
        ],
      }
    };
  },
  watch:{
       'formValidate.costItemCode':{
        handler: function() {
          let obj = this.itemOprateCodeList.find(item => item.selectCode == this.formValidate.costItemCode)
          if(obj && obj.hasChild){
            this.changeCostItemCode(obj.selectCode)
          } 
         },
         immediate: true
      } 
  },
  computed:{
    showItemCostType() {
        if(this.itemOprateCodeList && this.formValidate.costItemCode) {
          let obj = this.itemOprateCodeList.find(item => item.selectCode == this.formValidate.costItemCode)
          return obj && obj.hasChild ? true: false
        }
    }
  },
  methods: {
    changeCostItemSubCode(val){
      this.$set(this.formValidate, "costItemSubCode", val);
    },
    changeCostItemCode(val){
      let obj = this.itemOprateCodeList.find(item => item.selectCode == val)
      if(obj){
        if(obj.hasChild){
          this.getCostList('OperationExpenses',obj.selectCode)
        }else{
          this.itemCostTypeList = [];
          this.$set(this.formValidate, "costItemSubCode", '');
        }
      }
    },
     //获取费用类型枚举
    getCostList(costTypeCode,code) {
      commonService
        .getSelectorList({
          selectType: ["itemCode"],
          costTypeCode: costTypeCode,
          costItemCode:code
        })
        .then(res => {
          if (res.code == 200) {
            const { itemCode } = res.result;
            this.itemCostTypeList = itemCode || [];
          }
        });
    },
    changeRegion(val) {
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
      if (val) {
        this.$emit('getWarehouseList', val)
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
             this.formValidate.supplierName = ""
            this.$Message.error(res.message);
          }
           this.$forceUpdate()
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
         let res = await operateAdd(formValidate);
          if (res.code == 200) {
            this.$Message.success('保存成功');
            this.$emit('handleSubmit')
            this.afterSubmit();
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