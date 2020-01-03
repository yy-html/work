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
            :label-in-value="true" v-model="formInfo.regionCode" placeholder="请选择所在大区">
                <Option v-for="(item) in regionList" 
                :value="item.selectCode"
                :key="item.selectCode"
                >{{ item.selectName }}</Option>
            </Select>
        </FormItem>
        <FormItem style="width:350px" label="大仓名称:" prop="warehouseName">
            <Select
            placeholder="请选择大仓"
            v-model="formInfo.warehouseName"
            clearable
            filterable 
            @on-change="selectHouse"
          >
            <Option
              v-for="item in warehouseAddList"
              :value="item.selectName"
              :key="item.selectCode"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem style="width:350px" label="大仓编码:" prop="warehouseCode">
            <Input disabled v-model.trim="formInfo.warehouseCode"></Input> 
        </FormItem>
        <FormItem style="width:350px" label="货主名称:" prop="merchantNo">
            <Select
            placeholder="请选择货主名称"
            ref="Station1SelectRef"
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
            ref="StationSelectRef"
            v-model="formInfo.costItemCode"
            clearable
            filterable
            style="width:200px"
          >
            <Option v-for="(item,index) in costCode" :value="item.selectCode" :key="index">{{ item.selectName }}</Option>
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
                        <DatePicker :options="options" @on-change="selectDate"  type="date" placeholder="年/月/日" v-model="formInfo.effectiveDateStart"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="2" style="text-align: center">至</Col>
                <Col span="11">
                    <FormItem prop="effectiveDateEnd">
                        <DatePicker disabled  type="date" placeholder="年/月/日" v-model="formInfo.effectiveDateEnd"></DatePicker>
                    </FormItem>
                </Col>
            </Row>
        </FormItem>
        <FormItem style="width:450px" label="原料编码:" prop="materialCode">
            <CASFuzzyQuerySelect 
            ref="FuzzyQuerySelect"
            :renderFormat="renderFormat" 
            @on-change="onFuzzyQuerySelectChange(arguments, 'valueCode')" 
            placeholder="请输入原料编码" 
            queryKey="nameQuery" 
            :extraParams="extraParams" 
            :remoteMethod="materialQuery" 
            keyName="valueCode" 
            valName="valueName" />
        </FormItem>
        <FormItem style="width:450px" label="原料名称:" prop="materialName">
            <Input disabled  v-model.trim="formInfo.materialName"></Input> 
        </FormItem>
        <FormItem  label="日使用量:" prop="dailyUsage">
            <InputNumber style="width:150px" :min="0" :precision="0"  clearable  v-model="formInfo.dailyUsage" placeholder="大仓进销存中领用数量"></InputNumber> 
            <span class="tips">个</span>
        </FormItem>
        <FormItem style="width:350px" label="加权平均单价:" prop="weightedAveragePrice">
            <Input disabled  v-model.trim="formInfo.weightedAveragePrice"></Input> 
            <span class="tips">元</span>
        </FormItem>
        <FormItem style="width:350px" label="日发生额:" prop="dailyPrice">
            <Input clearable disabled  v-model.trim="formInfo.dailyPrice"></Input> 
            <span class="tips">元</span>
        </FormItem>
        <FormItem label="备注:">
            <Input
                v-model.trim="formInfo.remarks"
                type="textarea"
                :rows="4"
                :autosize="{maxRows: 6,minRows: 4}"
                :maxlength="200"
                placeholder="最长支持长度200（包含汉字、标点、字母、特殊字符等）"
            />
            <div style="color:#aaa;">{{formInfo.remarks && formInfo.remarks.length || 0}}/200</div>
        </FormItem>
        <FormItem class="footer-container">
          <Button style="margin-right:12px" @click="toReset">取消</Button>
          <Button
            type="primary"
            @click="toSubmit('addBatchForm')"
          >保存</Button>
        </FormItem>
      </Form>
    </Modal>
</template>
<script>
import moment from 'moment'
import { edit } from '@/apis/baseData/packageMaterial'
import commonService from "@/apis/common";
import {numberFormat} from '@/utils'

export default {
    name: 'createMaterial',
    props:{
        isShowModal:{
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'add'
        },
        defaultVal: {
            type: Array,
            default: (val)=>{
                return val ? val : []
            }
        },
        formInfo: {
            type: Object,
            default: (val) => {
                return val ? val :{ dailyUsage: null }
            }
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
        }
    },
    watch:{
        dayPrice(newVal, oldVal) {
            if(newVal) {
                this.formInfo.dailyPrice = numberFormat(newVal, 4)
            }else{
                this.formInfo.dailyPrice = 0
            }
        },
        isShowModal(newVal) {
            if(newVal && this.type == 'edit') {
                this.$refs['FuzzyQuerySelect'].setDefaultVal([{
                    valueCode: this.formInfo.materialCode,
                    valueName: this.formInfo.materialName
                }])
                this.getWarehouseList(this.formInfo.regionCode)

            }
        },
        isSendRequest(val) {
            if(val) {
                this.queryWeightedAveragePrice()
            }
        }

    },
    
    data(){
        return {
            extraParams: {},
            warehouseAddList: [],
            merchantAddList: [],
            materialQuery: commonService.materialQuery,
            options:{
                disabledDate (date) {
                    return (date && date.valueOf() > moment().subtract(1, 'days'))
                }
            },
            formRules:{
                regionCode: [{ required: true, message: "所在大区不能为空", }],
                warehouseName: [{ required: true, message: "大仓名称不能为空", }],
                merchantNo: [{ required: true, message: "货主名称不能为空", }],
                costItemCode: [{ required: true, message: "费用类型不能为空", }],
                adjustFlag: [{ required: true, message: "是否为调整额不能为空",}],
                effectiveDateStart: [{ required: true, message: "生效日期不能为空", }],
                // effectiveDateEnd: [{ required: true, message: "生效日期不能为空", }],
                dailyUsage: [{ required: true, message: "日使用量不能为空", }],
                materialCode: [{ required: true, message: "原料编码不能为空", }],
            }
        }
    },
    methods:{
        selectDate(val) {
            this.formInfo.effectiveDateEnd = val
        },
        renderFormat(item) {
            return `${item.valueCode}`
        },
        initData() {
            this.formInfo.warehouseName = ''
            this.formInfo.warehouseCode = ''
            this.formInfo.merchantNo = ''
            this.formInfo.materialCode = ''
            this.$refs['FuzzyQuerySelect'].resetData()
            // this.$refs["addBatchForm"].resetFields();
        },
        changeRegion(item) {
            if (item) {
                this.extraParams.regionCode = item.value
                this.getWarehouseList(item.value);
                this.initData()
            }else{
                this.extraParams.regionCode = ''
                this.initData()

            }
        },
        //大仓
        getWarehouseList(val) {
        commonService
            .getSelectorList({ selectType: ["warehouse", 'merchant'], regionCode: val })
            .then(res => {
            if (res.code == 200) {
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
        async queryWeightedAveragePrice() {
            let res = await commonService.selectPackMaterial({
                packMaterialCode: this.formInfo.materialCode,
                regionCode: this.formInfo.regionCode,
                warehouseCode: this.formInfo.warehouseCode,
                // statisticDate:  moment(this.formInfo.effectiveDateStart).format('YYYY-MM-DD')
                statisticDate: this.formInfo.effectiveDateStart ? moment(this.formInfo.effectiveDateStart).format('YYYY-MM-DD'): ''
            })
            if(res.code == 200) {
                this.$set(this.formInfo, 'weightedAveragePrice', res.result.materialCost || 0)
            }
        },
        onFuzzyQuerySelectChange(args, fieldKey) {
            const item = args[0]
            console.log(item)
            if (item) {
                // select change
                this.$set(this.formInfo, 'materialCode', item.label)
                this.$set(this.formInfo, 'materialName', item.value)
                // this.queryWeightedAveragePrice()
            } else {
                // clear
                this.$set(this.formInfo, 'materialCode', '')
                this.$set(this.formInfo, 'materialName', '')
            }
            },
        selectHouse(val) {
            if(val) {
                let obj = this.warehouseAddList.find(item=>item.selectName == val)
                this.$set(this.formInfo, "warehouseCode", obj.selectCode);
            }else{
                this.$set(this.formInfo, "warehouseCode", '');
            }
        },
        change(status) {
            if(!status) {
                this.warehouseAddList = []
                this.$refs['FuzzyQuerySelect'].resetData()
                this.$refs['region'].clearSingleSelect()
                this.toReset()
            }
        },
        async toSubmit(name) {
            this.$refs[name].validate(async valid => {
                if(valid) {
                    this.formInfo.effectiveDateStart = moment(this.formInfo.effectiveDateStart ).format('YYYY-MM-DD')
                    this.formInfo.effectiveDateEnd = moment(this.formInfo.effectiveDateEnd ).format('YYYY-MM-DD')
                    let res = await edit(
                        this.formInfo
                    )
                    if(res.code == 200) {
                        this.$Message.success('保存成功')
                        this.toReset()
                        this.$emit('success')
                    }else{
                        this.$Message.error(res.message)
                    }
                }
            })
        },
        toReset() {
            this.$refs['addBatchForm'].resetFields()
            this.$emit('update:isShowModal', false)
        }
    },
    computed:{
        title() {
            return this.type == "add" ? "新增" : "编辑"
        },

        dayPrice() {
            if((this.formInfo.dailyUsage || this.formInfo.dailyUsage == 0 )&& (this.formInfo.weightedAveragePrice || this.formInfo.weightedAveragePrice == 0)) {
                return this.formInfo.dailyUsage * this.formInfo.weightedAveragePrice
            }
            return NaN
        },
        isSendRequest() {
            if(this.formInfo.materialCode && this.formInfo.regionCode && this.formInfo.effectiveDateStart) {
                return this.formInfo.materialCode + this.formInfo.regionCode + this.formInfo.effectiveDateStart
            }else {
                return false
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .footer-container{
        text-align: center;
    }
    .tips{
        position: absolute;
        margin-left: 10px;
        color: #aaa;
        width: 200px;
    }
</style>