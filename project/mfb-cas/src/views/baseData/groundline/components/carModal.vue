<template>
  <div>
    <Form
      ref="formValidateCar"
      :model="formValidate"
      :rules="boxRuleValidate"
      :label-width="130"
    >
      <FormItem label="所在大区" prop="regionCode">
        <Select
          v-model="formValidate.regionCode"
          @on-change="changeRegionCode"
          @on-clear="resetForm1"
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
          placeholder="全部"
          @on-change="changeWarehouseName"
          v-model="formValidate.warehouseName"
          ref="warehouseName1"
          @on-clear="resetwarehouseName"
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
          placeholder="请输入大仓编码"
          disabled
        ></Input>
      </FormItem>

      <FormItem label="货主名称" prop="merchantNo">
        <Select v-model="formValidate.merchantNo" ref="merchantNo1"  placeholder="请选择货主名称">
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
                :options="options"
                @on-change="selectDate"
                type="date"
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
          ref="receiveCityId1"
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

      <FormItem label="承运商名称" prop="carrierCode">
        <CASFuzzyQuerySelect
          :persistQuery="true"
          ref="carrier"
          queryKey="nameQuery"
          @on-change="onFuzzyQuerySelectChange(arguments, 'carrierCode')"
          placeholder="请输入承运商名称"
          :remoteMethod="getCarrierQuery"
          keyName="valueName"
          valName="valueCode"
          :renderFormat='renderFormat'
        />
      </FormItem>
      <FormItem label="车单价" prop="unitPrice">
        <InputNumber v-model="formValidate.unitPrice" :min="0" :precision="4"></InputNumber> 元/车
      </FormItem>

      <FormItem label="车型" prop="vehicleModel">
        <Select v-model="formValidate.vehicleModel" placeholder="请选择车型">
                <Option
                v-for="item in truckTypeList"
                :value="item.selectCode"
                :key="item.selectCode"
                >{{ item.selectName }}</Option
              >
        </Select>
      </FormItem>
      <FormItem label="发车数" prop="departureCount">
        <InputNumber v-model="formValidate.departureCount" :precision="0"></InputNumber> 辆
      </FormItem>
      <FormItem label="发货筐数" prop="basketCount">
        <InputNumber v-model="formValidate.basketCount" :precision="0"></InputNumber> 筐
      </FormItem>

      <FormItem label="发货纸箱数" prop="cartonCount">
        <InputNumber v-model="formValidate.cartonCount" :precision="0"></InputNumber> 个
      </FormItem>

      <FormItem label="发货保温包(箱)数" prop="keepWarmCount">
        <InputNumber v-model="formValidate.keepWarmCount" :precision="0"></InputNumber> 个
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
          @click="handleReset('formValidateCar')"
          style="margin:0 20px 0 200px"
          >取消</Button
        >
        <Button type="primary" @click="handleSubmit('formValidateCar')"
          >保存</Button
        >
      </FormItem>
    </Form>
  </div>
</template>
<script>
import moment from 'moment'
import { groundlineCarAdd , groundlineCarSave} from "@/apis/baseData/groundlineCar";
import commonService from "@/apis/common";
import { listCity,carrierQuery } from '@/apis/common'
import {numberFormat} from '@/utils'

export default {
  name: "carModal",
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
    truckTypeList:Array
  },
  data() {
    return {
      options:{
          disabledDate (date) {
              return (date && date.valueOf() > moment().subtract(1, 'days'))
          }
      },
      getCarrierQuery: carrierQuery,
      warehouseList: [],
      merchantList: [],
      slectCityList:[],
      boxRuleValidate: {
        regionCode: [
          { required: true, message: "请选择所在大区", trigger: "change" }
        ],
        warehouseName: [
          { required: true, message: "请输入大仓名称"}
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

        unitPrice: [{ required: true, message: "请输入车单价" }],

        vehicleModel: [{ required: true, message: "请选择车型" }],
        departureCount: [{ required: true, message: "请输入发车数" }],
        cartonCount: [{ required: true, message: "请输入发货纸箱数" }],

        basketCount: [{ required: true, message: "请输入发货筐数" }],
        keepWarmCount: [{ required: true, message: "请输入发货保温包数" }],
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
          this.$refs.carrier.resetData()
          this.featchSelectorList()
          this.getCityList()
          this.featchCarrierQuery()
        }
      },
    // 'formValidate.regionCode':{
    //     handler: function() {
    //         this.featchSelectorList()
    //         this.getCityList()
    //      },
    //      immediate: true
    //   },
    //   'formValidate.carrierName':{
    //     handler: async function() {
    //       if(this.formValidate.id){
    //         let  res = await carrierQuery({nameQuery:this.formValidate.carrierName});
    //         if (res.code == 200) {
    //           const data = res.result
    //           const defaultVal = data.filter(item => item.valueCode == this.formValidate.carrierCode)
    //           this.$refs.carrier.setDefaultVal(defaultVal)
    //         } else {
    //           this.$Message.error(res.message);
    //         }
    //       } 
    //      },
    //      immediate: true
    //   },
      dailyPrice(newVal, oldVal){
          if(newVal){
              this.formValidate.dailyPrice = newVal
          }else {
              this.formValidate.dailyPrice = 0
          }
      }
      
  },
  computed:{
    days() {
        if(this.formValidate.effectiveDateStart && this.formValidate.effectiveDateEnd) {
          return moment(this.formValidate.effectiveDateEnd).diff(this.formValidate.effectiveDateStart, 'days') + 1
        }
        return 0
    },
    dailyPrice() {
        if(this.days && (this.formValidate.departureCount  || this.formValidate.departureCount ==0 )&& (this.formValidate.unitPrice == 0  || this.formValidate.unitPrice) ) {
          return numberFormat(((this.formValidate.departureCount * this.formValidate.unitPrice) / this.days), 4)
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
          this.$refs.carrier.setDefaultVal(defaultVal)
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
      this.$refs.receiveCityId1.clearSingleSelect()
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
    changeRegionCode() {
      this.clearData()
      this.featchSelectorList();
    },
    clearData(){
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
      this.$set(this.formValidate, "warehouseName", "");
    },
    featchSelectorList() {
      if(!this.formValidate.regionCode) return
      commonService
        .getSelectorList({
          selectType: ["warehouse", "merchant"],
          regionCode: this.formValidate.regionCode
        })
        .then(res => {
          if (res.code == 200) {
            const { warehouse, merchant } = res.result;
            this.warehouseList = warehouse || [];
            this.merchantList = merchant || [];
            if(this.oporateType == "edit"){
              if(!this.formValidate.merchantNo) return
              let obj = this.merchantList.find(i => i.selectCode == this.formValidate.merchantNo) 
              if(!obj){
                this.merchantList.push({selectCode: this.formValidate.merchantNo,selectName:this.formValidate.merchantName})
                this.$forceUpdate()
              }
            }
          }
        });
    },
    changeWarehouseName(name) {
      if(!name) return
      this.formValidate.warehouseCode =
        this.warehouseList.find(item => item.selectName == name).selectCode ||
        "";
        this.getCityList()
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formValidate.effectiveDateStart = moment(this.formValidate.effectiveDateStart ).format('YYYY-MM-DD')
          this.formValidate.effectiveDateEnd = moment(this.formValidate.effectiveDateEnd ).format('YYYY-MM-DD')
          let res
          if(this.oporateType =='add'){
            res = await groundlineCarAdd(this.formValidate);
          }else{
            res = await groundlineCarSave(this.formValidate);
          }
          if (res.code == 200) {
            this.$Message.success("提交成功！");
            this.$refs[name].resetFields();
            this.$refs['carrier'].resetData()
            this.$emit("handleSubmit");
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
      this.$refs['carrier'].resetData()
      this.$emit("handleReset");
    },
    resetForm1(){
      this.warehouseList = []
      this.merchantList = []
      this.slectCityList = []
      this.clearData()
      this.$refs.warehouseName1.clearSingleSelect()
      this.$refs.merchantNo1.clearSingleSelect()
      this.$refs.receiveCityId1.clearSingleSelect()
    }
  }
};
</script>

<style lang="scss" scoped></style>
