<template>
  <div>
    <Form
      ref="formValidateBox"
      :model="formValidate"
      :rules="boxRuleValidate"
      :label-width="130"
    >
      <FormItem label="所在大区" prop="regionCode">
        <Select
          v-model="formValidate.regionCode"
          @on-change="changeRegionCode"
          @on-clear="resetForm"
          clearable
          filterable
          placeholder="请选择所在大区"
        >
          <Option
            v-for="item in regionList"
            :value="item.selectCode"
            :key="item.selectCode"
            >{{ item.selectName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="大仓名称" prop="warehouseName">
        <Select
          placeholder="请选择大仓名称"
          v-model="formValidate.warehouseName"
          @on-change="changeWarehouseName"
          @on-clear="resetwarehouseName"
          ref="warehouseName"
          clearable
          filterable
        >
          <Option
            v-for="item in warehouseList"
            :value="item.selectName"
            :key="item.selectCode"
            >{{ item.selectName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="大仓编码" prop="warehouseCode">
        <Input
          v-model="formValidate.warehouseCode"
          placeholder="请选择大仓编码"
          disabled
        ></Input>
      </FormItem>
      <FormItem label="货主名称" prop="merchantNo">
        <Select
         v-model="formValidate.merchantNo" 
         placeholder="请选择货主名称"
         @on-change="changemerchantNo"
         ref="merchantNo"
         clearable
         filterable
         >
          <Option
            v-for="(item, index) in merchantList"
            :value="item.selectCode"
            :key="index"
            >{{ item.selectName }}</Option
          >
        </Select>
      </FormItem>
      <FormItem label="费用类型" prop="costItemCode">
        <Select
          v-model="formValidate.costItemCode"
          placeholder="请选择费用类型"
          @on-change="changecostItemCode"
        >
          <Option
            v-for="item in itemCodeList"
            :value="item.selectCode"
            :key="item.selectCode"
            >{{ item.selectName }}</Option
          >
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
              <DatePicker
                type="date"
                :options="options"
                @on-change="selectDate"
                placeholder="请选择开始日期"
                v-model="formValidate.effectiveDateStart"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
            <FormItem prop="effectiveDateEnd">
              <DatePicker
                disabled
                type="date"
                placeholder="请选择结束日期"
                v-model="formValidate.effectiveDateEnd"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="收货城市" prop="receiveCityId">
        <Select
          v-model="formValidate.receiveCityId"
          placeholder="请选择收货城市"
          @on-change="changereceiveCityId"
          ref="receiveCityId"
          clearable
          filterable
        >
          <Option
          v-for="(item,index) in slectCityList"
          :value="item.cityCode"
          :key="index"
          >{{ item.cityName }}</Option
        >
        </Select>
      </FormItem>
      <FormItem label="承运商名称"  prop="carrierCode">
        <CASFuzzyQuerySelect
          :persistQuery="true"
          ref="carrierQuery"
          queryKey="nameQuery"
          @on-change="onFuzzyQuerySelectChange(arguments, 'carrierCode')"
          placeholder="请输入承运商名称"
          :remoteMethod="getCarrierQuery"
          keyName="valueName"
          valName="valueCode"
          :renderFormat='renderFormat'
        />
      </FormItem>
      <FormItem label="筐单价" prop="basketPrice">
        <InputNumber v-model="formValidate.basketPrice" 
        :min="0"
        :precision="4"></InputNumber> 元/筐
      </FormItem>
      <FormItem
        label="纸箱折算比例"
        prop="cartonPercent1"
        style="display:inline-block;"
      >
        <InputNumber
          v-model="formValidate.cartonPercent1"
          placeholder="纸箱比例"
          :min="1"
          :precision="0"
    
        ></InputNumber>

        <span>
          <span style="margin:0 10px;">比 </span>
          <FormItem
            prop="cartonPercent2"
            style="display:inline-block;width:100px;"
          >
            <InputNumber
              v-model="formValidate.cartonPercent2"
              placeholder="筐比例"
              :min="1"
              :precision="0"
            ></InputNumber>
          </FormItem>
        </span>
      </FormItem>

      <FormItem label="发货纸箱数" prop="cartonCount">
        <InputNumber v-model="formValidate.cartonCount" :precision="0"></InputNumber> 个
      </FormItem>
      <FormItem label="发货筐数" prop="basketCount" >
        <InputNumber v-model="formValidate.basketCount" :precision="0"></InputNumber> 筐
      </FormItem>
      <FormItem label="发货保温包(箱)数" prop="keepWarmCount">
        <InputNumber v-model="formValidate.keepWarmCount" :precision="0"></InputNumber> 个
      </FormItem>
      <FormItem label="折算后筐合计" prop="totalCount" >
        <Input v-model="formValidate.totalCount" disabled style="display:inline-block;width:80px;"></Input> 筐
      </FormItem>
      <FormItem label="日发生额" prop="dailyPrice">
        <Input v-model="formValidate.dailyPrice" disabled style="display:inline-block;width:80px;"></Input> 元
      </FormItem>
      <FormItem label="备注" prop="remarks">
        <Input
          v-model="formValidate.remarks"
          type="textarea"
          :maxlength="200"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="最长支持200汉字、标点、字母、特殊字符"
        ></Input>
      </FormItem>
      <FormItem>
        <Button
          @click="handleReset('formValidateBox')"
          style="margin:0 20px 0 200px"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('formValidateBox')"
          >保存</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import moment from 'moment'
import { groundlineBoxAdd ,groundlineBoxSave} from "@/apis/baseData/groundlineBox";
import { listCity,carrierQuery } from '@/apis/common'
import commonService from '@/apis/common'
import {numberFormat} from '@/utils'

export default {
  name: "boxModal",
  props: {
    oporateType: String,
    formValidate: {
      type: Object,
      default: {}
    },
    showModal:{
      type: Boolean,
      default: false
    },
    regionList: Array,
    itemCodeList: Array,
  },
  data() {
    function validatetypeName(rule, value, callback) {
      if(value <= 0){
          callback(new Error('只能输入正整数'))
          return
      }
      callback()
    } 
    return {
      options:{
          disabledDate (date) {
              return (date && date.valueOf() > moment().subtract(1, 'days'))
          }
      },
      getCarrierQuery: carrierQuery,
      warehouseList:[],
      merchantList:[],
      slectCityList:[],
      boxRuleValidate: {
        regionCode: [
          { required: true, message: "请选择所在大区", trigger: "change" }
        ],
        warehouseName: [
          { required: true, message: "请输入大仓名称" }
        ],
        warehouseCode: [
          { required: true, message: "请输入大仓编码", trigger: "change" }
        ],
        merchantNo: [
          { required: true, message: "请选择货主名称", trigger: "change" }
        ],
        costItemCode: [
          { required: true, message: "请选择费用类型", trigger: "change" }
        ],
        adjustFlag: [
          { required: true, message: "请选择是否为调整额", trigger: "change" }
        ],
        effectiveDateStart: [
          {
            required: true,
            message: "请选择开始日期",
          }
        ],
        effectiveDateEnd: [
          {
            required: true,
            message: "请选择结束日期",
          }
        ],
        receiveCityId: [
          { required: true, message: "请选择收货城市", trigger: "change" }
        ],

        carrierCode: [
          { required: true, message: "请输入承运商名称", trigger: "change" }
        ],
        basketPrice: [{ required: true, message: "请输入筐单价" }],
        cartonPercent1: [{ required: true, message: "请输入纸箱比例" },
        { required: true, validator: validatetypeName}],
        cartonPercent2: [{ required: true, message: "请输入筐比例" },
        { required: true, validator: validatetypeName}],
        cartonCount: [{ required: true, message: "请输入发货纸箱数" }],
        basketCount: [{ required: true, message: "请输入发货筐数" }],
        keepWarmCount: [{ required: true, message: "请输入发货保温包数" }],
        totalCount: [{ required: true, message: "请输入折算后筐合计" }],
        dailyPrice: [{ required: true, message: "请输入日发生额" }],
        remarks: [
          {
            required: false,
            message: "最长支持200汉字、标点、字母、特殊字符",
            trigger: "blur"
          },
          {
            type: "string",
            max: 200,
            message: "最多200的字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch:{
        showModal(newVal) {
          console.log(newVal,1111)
          if(newVal && this.oporateType == 'edit') {
            this.$refs.carrierQuery.resetData()
            this.featchSelectorList()
            this.getCityList()
            this.featchCarrierQuery()
          }
        },
      //  'formValidate.regionCode':{
      //   handler: function() {
      //     if(this.formValidate.id){
      //       this.featchSelectorList()
      //       this.getCityList()
      //     } 
      //    },
      //    immediate: true
      // },
      // 'formValidate.carrierName':{
      //   handler: async function() {
      //     if(this.formValidate.id){
      //       // let  res = await carrierQuery({nameQuery:this.formValidate.carrierName});
      //       // if (res.code == 200) {
      //       //   const data = res.result
      //       //   const defaultVal = data.filter(item => item.valueCode == this.formValidate.carrierCode)
      //       //   this.$refs.carrierQuery.setDefaultVal(defaultVal)
      //       // } else {
      //       //   this.$Message.error(res.message);
      //       // }
      //     } 
      //    },
      //    immediate: true
      // },
      dailyPrice(newVal, oldVal){
          if(newVal){
              this.formValidate.dailyPrice = newVal
          }else {
              this.formValidate.dailyPrice = 0
          }
      },
      totalCount(newVal, oldVal){
          if(newVal){
              this.formValidate.totalCount = newVal
          }else {
              this.formValidate.totalCount = 0
          }
      },
      
  },
  computed:{
    days() {
        if(this.formValidate.effectiveDateStart && this.formValidate.effectiveDateEnd) {
          return moment(this.formValidate.effectiveDateEnd).diff(this.formValidate.effectiveDateStart, 'days') + 1
        }
        return 0
    },
    dailyPrice() {
        if(this.days && this.formValidate.totalCount && (this.formValidate.basketPrice == 0 || this.formValidate.basketPrice )) {
          return numberFormat(((this.formValidate.totalCount * this.formValidate.basketPrice) / this.days), 4)
        }
        return 0
    },
   
    totalCount() {
        let flag = (this.formValidate.cartonCount || this.formValidate.cartonCount == 0)
         && (this.formValidate.cartonPercent1 || this.formValidate.cartonPercent1 == 0)
         && (this.formValidate.cartonPercent2 || this.formValidate.cartonPercent2 == 0) 
         && (this.formValidate.basketCount || this.formValidate.basketCount == 0)
         && (this.formValidate.keepWarmCount || this.formValidate.keepWarmCount == 0)

        if(flag) {
          return numberFormat(((this.formValidate.cartonCount / (this.formValidate.cartonPercent1/this.formValidate.cartonPercent2))+ this.formValidate.basketCount + this.formValidate.keepWarmCount), 2)
        }
        return 0
    }
  },
  methods: {
    async featchCarrierQuery(){
      let  res = await carrierQuery({nameQuery:this.formValidate.carrierName});
      if (res.code == 200) {
        const data = res.result
        const defaultVal = data.filter(item => item.valueName == this.formValidate.carrierName)
        console.log(defaultVal,1111111)
        if(defaultVal && defaultVal.length){
          this.$refs.carrierQuery.setDefaultVal(defaultVal)
        }
      } else {
        this.$Message.error(res.message);
      }
    },
    selectDate(val) {
      // console.log(val)
      this.$set(this.formValidate, 'effectiveDateEnd', val)
    },
    
    resetwarehouseName(){
      this.slectCityList = []
      this.$refs.receiveCityId.clearSingleSelect()
    },
    onFuzzyQuerySelectChange(args, fieldKey) {
      const item = args[1];
      if (item) {
        this.$set(this.formValidate, fieldKey, item.valueCode);
      } else {
        // clear
        this.$set(this.formValidate, fieldKey, "");
      }
    },
    renderFormat(item) {
      return item.valueName
    },
    async getCityList(){
      if(!this.formValidate.warehouseCode) return 
      let  res = await listCity({warehouseCode:this.formValidate.warehouseCode});
      if (res.code == 200) {
        this.slectCityList = res.result || []
      } else {
        this.$Message.error(res.message);
      }
    },
    changemerchantNo(code){
      if(!code) return
      this.formValidate.merchantName = this.merchantList.find(item => item.selectCode == code).selectName || "";
    },
    changereceiveCityId(code){
      if(!code) return
      this.formValidate.receiveCityName = this.slectCityList.find(item => item.cityCode == code).cityName || "";
    },
    changecostItemCode(code){
      if(!code) return
      this.formValidate.costItemName = this.itemCodeList.find(item => item.selectCode == code).selectName || "";
    },
    changeRegionCode(code){
      if(!code) return
      this.clearData()
      //清空数据
      this.formValidate.regionName = this.regionList.find(item => item.selectCode == code).selectName || "";
      this.featchSelectorList()
      
    },
    clearData(){
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
      this.$set(this.formValidate, "merchantName", "");
      this.$set(this.formValidate, "warehouseName", "");
    },
    featchSelectorList(){
      commonService.getSelectorList({selectType:['warehouse', 'merchant'], regionCode:this.formValidate.regionCode}).then (res => {
        if (res.code == 200) {
          const {warehouse, merchant} = res.result
          this.warehouseList = warehouse || []
          this.merchantList = merchant || []
          if(this.oporateType == "edit"){
            if(!this.formValidate.merchantNo) return
            let obj = this.merchantList.find(i => i.selectCode == this.formValidate.merchantNo) 
            if(!obj){
              this.merchantList.push({selectCode: this.formValidate.merchantNo,selectName:this.formValidate.merchantName})
              this.$forceUpdate()
            }
          }
        }
      })
    },
    changeWarehouseName(name) {
      if(!name) return
      this.formValidate.warehouseCode = this.warehouseList.find(item => item.selectName == name).selectCode || "";
      this.getCityList()//查询大仓下的城市
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formValidate.cartonPercent = `${this.formValidate.cartonPercent1}:${this.formValidate.cartonPercent2}`;
          this.formValidate.effectiveDateStart = moment(this.formValidate.effectiveDateStart ).format('YYYY-MM-DD')
          this.formValidate.effectiveDateEnd = moment(this.formValidate.effectiveDateEnd ).format('YYYY-MM-DD')
          let res
          if(this.oporateType =='add'){
            res = await groundlineBoxAdd(this.formValidate);
          }else{
            res = await groundlineBoxSave(this.formValidate);
          }
          if (res.code == 200) {
            this.$Message.success("提交成功！");
            this.$emit("handleSubmit");
            this.$refs[name].resetFields();
            this.$refs['carrierQuery'].resetData()
          } else {
            this.$Message.error(res.message);
          }
        } else {
          this.$Message.error("请输入必填信息！");
        }
      });
    },

    handleReset(name) {
      this.$refs[name].resetFields();
      this.warehouseList = []
      this.merchantList = []
      this.slectCityList = [] 
      this.$refs['carrierQuery'].resetData()
      this.$emit("handleReset");
    },
    resetForm(){
      this.warehouseList = []
      this.merchantList = []
      this.slectCityList = []
      this.clearData()
      this.$refs.warehouseName.clearSingleSelect()
      this.$refs.merchantNo.clearSingleSelect()
      this.$refs.receiveCityId.clearSingleSelect()
    }
  }
};
</script>

<style lang="scss" scoped></style>
