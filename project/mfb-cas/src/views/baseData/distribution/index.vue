<template>
  <mfb-page-table>
    <div slot="queryForm">
      <Form inline :label-width="85">
        <FormItem label="所在大区">
          <Select
            placeholder="全部"
            v-model="vStore.queryParams.regionCode"
            clearable
            filterable
          >
            <Option
              v-for="item in regionList"
              :value="item.selectCode"
              :key="item.selectCode"
              >{{ item.selectName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="大仓名称">
          <Select
            placeholder="全部"
            v-model="vStore.queryParams.warehouseCode"
            clearable
            filterable
          >
            <Option
              v-for="item in warehouseList"
              :value="item.selectCode"
              :key="item.selectCode"
              >{{ item.selectName }}</Option
            >
          </Select>
        </FormItem>

        <FormItem label="货主名称">
          <Select
            placeholder="全部"
            v-model="vStore.queryParams.merchantNo"
            clearable
            filterable
          >
            <Option
              v-for="item in merchantList"
              :value="item.selectCode"
              :key="item.regionCode"
              >{{ item.selectName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="数据状态">
          <Select
            placeholder="全部"
            v-model="vStore.queryParams.commitFlag"
            clearable
            filterable
            style="width:200px"
          >
            <Option
              v-for="item in itemStatusList"
              :value="item.selectCode"
              :key="item.regionCode"
              >{{ item.selectName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="收货城市" class="mgr150">
          <Select
            placeholder="全部"
            class="station-select-width"
            v-model="vStore.queryParams.receiveCityId"
            clearable
            filterable
          >
            <Option
            v-for="(item,index) in cityList"
            :value="item.cityCode"
            :key="index"
            >{{ item.cityName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="创建时间" class="date-picker-container">
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="createTimeStart"
            end-key="createTimeEnd"
            :type="'datetime'"
          />
        </FormItem>
        <FormItem label="提交时间" class="date-picker-container">
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="commitTimeStart"
            end-key="commitTimeEnd"
            :type="'datetime'"
          />
        </FormItem>
        <FormItem
          label="生效起始日期"
          :label-width="90"
          class="date-picker-container"
        >
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="effectiveDateStartLeft"
            end-key="effectiveDateStartRight"
          />
        </FormItem>
        <FormItem
          label="生效结束日期"
          :label-width="90"
          class="date-picker-container"
        >
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="effectiveDateEndLeft"
            end-key="effectiveDateEndRight"
          />
        </FormItem>
      </Form>

      <div class="query-buttons">
        <Button
          type="primary"
          @click="onQueryHandler"
          v-if="hasPermission('search')"
          >查询</Button
        >
        <Button type="primary" @click="resetParams">清空</Button>
      </div>
    </div>

    <div style="text-align:left;margin-bottom: 10px;">
      <Button type="primary" v-if="hasPermission('add')" @click="toAdd"
        >新增</Button
      >
      <Button
        type="primary"
        class="mgl10"
        v-if="hasPermission('delete')"
        @click="toDelete"
        >删除</Button
      >
      <a :href="downloadUrl" download> 
        <Button
          type="primary"
          class="mgl10"
          v-if="hasPermission('download')"
          >模板下载</Button
        >
      </a>
      
      <Button
        type="primary"
        class="mgl10"
        v-if="hasPermission('upload')"
        @click="toUpload"
        >上传</Button
      >
      <Button
        type="primary"
        class="mgl10"
        v-if="hasPermission('export')"
        @click="toExport"
        >导出</Button
      >
      <Button
        type="primary"
        class="mgl10"
        v-if="hasPermission('submit')"
        @click="toSubmit"
        >提交数据</Button
      >
    </div>
    <MfbDataList
      :table-options="tableOptions"
      :columns="columns"
      :data="listData"
      :page-options="vStore.pageOptions"
      @on-page-size-change="onPageSizeChange"
      @on-change="onPageChange"
      @on-selection-change="onSelectionChange"
    />
    <CASMfbUploadFile
      :isShowModal.sync="isShowUpload"
      @success="queryList"
      :url="url"
      >
    </CASMfbUploadFile>

    <Modal
      :title="oporateType=='add'?'新增':'编辑'"
      :mask-closable="false"
      v-model="showModal"
      footer-hide
      style="width:800px;"
      @on-cancel="handleReset('formValidate')"
    >
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="120"
      >
        <FormItem label="所在大区" prop="regionCode">
          <Select
            v-model="formValidate.regionCode"
            @on-change="changeRegionCode"
            @on-clear="clearRegion"
            placeholder="请选择所在大区"
            clearable
            filterable
          >
            <Option
              v-for="item in regionList"
              :value="item.selectCode"
              :key="item.selectCode"
              >{{ item.selectName }}</Option
            >
          </Select>
        </FormItem>

        <FormItem label="大仓名称" prop="warehouseCode">
          <Select
            placeholder="请选择大仓名称"
            v-model="formValidate.warehouseCode"
            clearable
            filterable
            ref="warehouseCode"
          >
            <Option
              v-for="item in warehouseAddList"
              :value="item.selectCode"
              :key="item.selectCode"
              >{{ item.selectName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="大仓编码" required>
          <Input
            v-model="formValidate.warehouseCode"
            placeholder="请输入大仓编码"
            disabled
          ></Input>
        </FormItem>
        <FormItem label="货主名称" prop="merchantNo">
          <Select
            v-model="formValidate.merchantNo"
            placeholder="请选择货主名称"
            ref="merchantNo"
          >
            <Option
              v-for="(item, index) in merchantAddList"
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

        <FormItem label="承运方"  prop="carrierId">
          <CASFuzzyQuerySelect  ref="distributionCarrierId" queryKey="word" @on-change="onFuzzyQuerySelectChange(arguments, 'carrierId')" placeholder="请输入承运方名称" :extraParams="extraParams"  :remoteMethod="carrierRemoteMethod" keyName="name" valName="id" />
        </FormItem>

        <FormItem label="纳税人识别号"  required>
          <Input
            v-model="formValidate.taxNo"
            placeholder="请输入纳税人识别号"
            disabled
          ></Input>
        </FormItem>

        <FormItem label="生效日期" required>
          <Row>
            <Col span="11">
              <FormItem prop="effectiveDateStart">
                <DatePicker
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
                  type="date"
                  placeholder="请选择结束日期"
                  v-model="formValidate.effectiveDateEnd"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="收货城市"  prop="receiveCityId">
          <Select
            v-model="formValidate.receiveCityId"
            placeholder="请选择收货城市"
            @on-change="selectChangeCityIdList"
            ref="receiveCityId"
            clearable
            filterable
          >
            <Option
              v-for="item in receiveCityIdList"
              :value="item.shipCityCode"
              :key="item.shipCityCode"
              >{{ item.shipCityName }}</Option
            >
          </Select>
        </FormItem>

        <FormItem label="运单数" prop="waybillQty">
          <InputNumber v-model="formValidate.waybillQty" :precision="0"></InputNumber> 单
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
            @click="handleReset('formValidate')"
            style="margin:0 20px 0 200px"
            >取消</Button
          >
          <Button type="primary" @click="handleSubmit('formValidate')"
            >保存</Button
          >
        </FormItem>
      </Form>
    </Modal>
  </mfb-page-table>
</template>
<script>
import { MfbDataList } from "@mfb/pc-components-micro";
import * as moment from "moment";
import {
  distributionList,
  distributionDetail,
  distributionAdd,
  distributionDelete,
  distributionSave,
  distributionSubmit,
  distributionCitylist
} from "@/apis/baseData/distribution";
import commonService from "@/apis/common";
import { listCity } from '@/apis/common'
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import { listMixin } from "@/mixins/list.mixin";
import apis from '@/apis/index'
import {numberFormat} from '@/utils'

export default {
  name: "cas-baseData-distribution",
  data() {
    return {
      carrierRemoteMethod: commonService.getCarrierByName,
      receiveCityIdList:[],
      url:apis['BASE_DATA_DISTRIBUTION'].IMPORT,
      downloadUrl:'http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/次日达配送模板.xlsx'+ `?${Date.now()}`,
      tableOptions: {
        loading: false
      },
      oporateType:"add",
      listData: {
        list: [],
        total: 0
      },
      extraParams:{},
      extraParamsCarrierId:{},
      isShowUpload:false,
      showModal: false,
      itemCodeList: [],
      cityList:[],
      warehouseAddList:[],
      merchantAddList:[],
      formValidate: {
        regionCode: "",
        warehouseCodeName: null,
        warehouseCode: "",
        merchantNo: "",
        costItemCode: "",
        adjustFlag: '0',
        carrierId: "",
        effectiveDateStart: "",
        effectiveDateEnd: "",
        receiveCityId: "",
        waybillQty: null
      },
      ruleValidate: {
        regionCode: [
          { required: true, message: "请选择所在大区", trigger: "change" }
        ],
        warehouseCode: [
          { required: true, message: "请输入大仓名称" }
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

        carrierId: [
          { required: true, message: "请选择承运方"}
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
          { required: true, message: "请选择收货城市"}
        ],
        waybillQty: [{ required: true, message: "请输入运单数" }],
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
      },
      columns: [
        {
          type: "selection",
          width: 50,
          align: "center"
        },
        {
          title: "序号",
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "数据编号",
          key: "costNo",
          width: 120,
          tooltip: true
        },
        {
          title: "大区",
          key: "regionName",
          width: 120
        },
        {
          title: "大仓名称",
          key: "warehouseName",
          width: 120
        },
        {
          title: "大仓编码",
          key: "warehouseCode",
          width: 120
        },
        {
          title: "货主名称",
          key: "merchantName",
          width: 120,
          tooltip: true
        },
        {
          title: "费用类型",
          key: "costItemName",
          width: 120
        },
        {
          title: "是否为调整额",
          key: "adjustFlagName",
          width: 120
        },
        {
          title: "数据状态",
          key: "commitFlagName",
          width: 120
        },
        {
          title: "运单数",
          key: "waybillQty",
          width: 120
        },
        {
          title: "平均单价",
          key: "avgPrice",
          width: 120
        },
        {
          title: "日发生额",
          key: "dailyPrice",
          width: 120
        },
        {
          title: "收货城市",
          key: "carrierReceiveCityName",
          width: 120
        },
        {
          title: "生效起始日",
          key: "effectiveDateStart",
          width: 120
        },
        {
          title: "生效结束日",
          key: "effectiveDateEnd",
          width: 120
        },
        {
          title: "承运方名称",
          key: "carrierName",
          width: 120
        },
        {
          title: "纳税人识别号",
          key: "taxNo",
          width: 140
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 140
        },
        {
          title: "创建人",
          key: "createUserName",
          width: 120
        },
        {
          title: "提交时间",
          key: "commitTime",
          width: 140
        },
        {
          title: "提交人",
          key: "commitUserName",
          width: 120
        },

        {
          title: "操作",
          align: "center",
          fixed: "right",
          width: 150,

          render: (h, params) => {
            let arr = [];
            let ids = [];
            if(params.row.commitFlag == 0 &&  this.hasPermission('edit')) {
                ids.push({
                id: "edit",
                name: "编辑",
                method: "edit",
                type: "primary"
              });
            }
            ids.forEach(item => {
              arr.push(
                h(
                  "Button",
                  {
                    props: {
                      type: item.type || "primary",
                      size: "small",
                      icon: item.icon
                    },
                    style: {
                      marginRight: "10px"
                    },
                    on: {
                      click: () => {
                        this[item.method](params.row);
                      }
                    }
                  },
                  item.name
                )
              );
            });
            return h("div", arr);
          }
        },
        {
          title: "备注",
          key: "remarks",
          fixed: "right",
          tooltip: true,
          width: 120
        }
      ]
    };
  },
  components: {
    MfbDataList
  },
  deactivated() {},
  mixins: [listMixin],
  created() {
    this.queryList(); // 分页
    this.featchSelectorItemCode("OvernightDelivery");
    this.featchCityList()//获取城市列表
  },
  watch:{
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
        if(this.days && (this.formValidate.waybillQty || this.formValidate.waybillQty == 0 ) && this.formValidate.avgPrice ) {
          return numberFormat(((this.formValidate.waybillQty * this.formValidate.avgPrice) / this.days), 4)
        }
        return 0
    }
  },
  methods: {
    async featchCityList(){
      let  res = await listCity();
      if (res.code == 200) {
        this.cityList = res.result || []
      } else {
        this.$Message.error(res.message);
      }
    },
    onFuzzyQuerySelectChange(args, fieldKey) {
      const item = args[1]
      if (item) {
        // select change
        this.$set(this.formValidate, fieldKey, item.id)
        this.$set(this.formValidate, 'taxNo', item.taxNo)
        this.changeCityIdList()
      } else {
        // clear
        this.$set(this.formValidate, fieldKey, '')
        this.$set(this.formValidate, 'taxNo', '')
        this.receiveCityIdList = []
        this.$refs.receiveCityId.clearSingleSelect()
      }
    },
    async changeCityIdList(){
      let  res = await distributionCitylist({carrierId:this.formValidate.carrierId});
      if (res.code == 200) {
        this.receiveCityIdList = res.result || []
      } else {
        this.$Message.error(res.message);
      }
    },
    selectChangeCityIdList(){
      let obj = this.receiveCityIdList.find(item => item.shipCityCode == this.formValidate.receiveCityId)
      this.$set(this.formValidate, "avgPrice", obj && obj.avgPrice)
    },
    changeRegionCode() {
      if(!this.formValidate.regionCode) return
      this.clearData()
      this.featchSelectorList();
      this.extraParams['regionCode'] = this.formValidate.regionCode
    },
    clearData(){
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
      this.$set(this.formValidate, "merchantName", "");
      this.$set(this.formValidate, "warehouseName", "");
      this.$set(this.formValidate, "taxNo", "");
      this.$refs['distributionCarrierId'].resetData()

    },
    featchSelectorList() {
      commonService
        .getSelectorList({
          selectType: ["warehouse", "merchant"],
          regionCode: this.formValidate.regionCode
        })
        .then(res => {
          if (res.code == 200) {
            const { warehouse, merchant } = res.result;
            this.warehouseAddList = warehouse || [];
            this.merchantAddList = merchant || [];
            if(this.oporateType == "edit"){
              if(!this.formValidate.merchantNo) return
              let obj = this.merchantAddList.find(i => i.selectCode == this.formValidate.merchantNo) 
              if(!obj){
                this.merchantAddList.push({selectCode: this.formValidate.merchantNo,selectName:this.formValidate.merchantName})
                this.$forceUpdate()
              }
            }
          }
        });
    },
    featchSelectorItemCode(costTypeCode) {
      commonService
        .getSelectorList({
          selectType: ["itemCode"],
          costTypeCode: costTypeCode
        })
        .then(res => {
          if (res.code == 200) {
            const { itemCode } = res.result;
            this.itemCodeList = itemCode || [];
          }
        });
    },
    fortmatTime(time = '', patten) {
      if(time) {
         time = moment(time).format(patten)
      }
      return time
    },
    formatParams() {
       // 清除查询对象中的空值
       let queryParams = _.cloneDeep(this.vStore.queryParams)
      // 格式化日期类型
      queryParams.effectiveDateStartLeft = this.fortmatTime(queryParams.effectiveDateStartLeft, 'YYYY-MM-DD')
      queryParams.effectiveDateStartRight = this.fortmatTime(queryParams.effectiveDateStartRight, 'YYYY-MM-DD')

      queryParams.effectiveDateEndLeft = this.fortmatTime(queryParams.effectiveDateEndLeft, 'YYYY-MM-DD')
      queryParams.effectiveDateEndRight = this.fortmatTime(queryParams.effectiveDateEndRight, 'YYYY-MM-DD')

      queryParams.createTimeStart = this.fortmatTime(queryParams.createTimeStart, 'YYYY-MM-DD HH:mm:ss')
      queryParams.createTimeEnd = this.fortmatTime(queryParams.createTimeEnd, 'YYYY-MM-DD HH:mm:ss')

      queryParams.commitTimeStart = this.fortmatTime(queryParams.commitTimeStart, 'YYYY-MM-DD HH:mm:ss')
      queryParams.commitTimeEnd = this.fortmatTime(queryParams.commitTimeEnd, 'YYYY-MM-DD HH:mm:ss')
      queryParams = MfbObjUtil.removeNull(queryParams)
      return queryParams
    },

    //获取列表
    async queryList() {
      let queryParams = this.formatParams();
      queryParams = Object.assign(queryParams, this.vStore.pageOptions)
      delete this.vStore.queryParams.idList
      this.selectionData = [];//清除选中
      delete queryParams.idList
      let res = await distributionList(queryParams);
      if (res.code == 200) {
        this.listData = {
          total: res.result.total,
          list: res.result.list || []
        };
      } else {
        this.$Message.error(res.message);
      }
    },
    //增加
    toAdd() {
      this.oporateType = "add"
      this.showModal = true;
      this.formValidate = {
        regionCode: "",
        warehouseCodeName: null,
        warehouseCode: "",
        merchantNo: "",
        costItemCode: "",
        adjustFlag: '0',
        carrierId: "",
        effectiveDateStart: "",
        effectiveDateEnd: "",
        receiveCityId: "",
        waybillQty: null
      }
      this.$refs.formValidate.resetFields()
      this.warehouseAddList = []
      this.merchantAddList = []
      this.receiveCityIdList = []
      
      this.$refs.receiveCityId.clearSingleSelect()
      this.$refs.warehouseCode.clearSingleSelect()
      this.$refs.merchantNo.clearSingleSelect()
    },

    //去删除
    toDelete() {
      if (this.selectionData.length) {
        return this.$Modal.confirm({
          title: "提示",
          okText: "确定",
          cancelText: "取消",
          content: `您将删除${this.selectionData.length}条费用数据请确认？`,
          onOk: async () => {
            let selectItem = _.cloneDeep(this.selectionData);
            selectItem = selectItem.map(item => item.id)
            let data = {
              ids: selectItem
            };
            let res = await distributionDelete(data);
            if (res.code == 200) {
              this.queryList();
              this.selectionData = [];
              this.$Message.success("删除成功！");
            } else {
              this.$Message.error(res.message);
            }
          }
        });
      }
      return this.$Message.error("请选择需要删除数据！");
    },

    //上传
    toUpload() {
      console.log("上传");
      this.isShowUpload = true
    },

    //导出
    toExport() {
      let queryParams = this.formatParams();
      let status = Object.keys(queryParams).filter(item=> item != 'pageSize' && item != 'pageNum').some(key=>{
        return queryParams[key]
      })
      if (status || this.selectionData.length) {
        let selectItem = _.cloneDeep(this.selectionData);
        selectItem = selectItem.map(item => item.id)
        queryParams.idList = selectItem
        let url = "/cost-data/data/overnightDelivery/export"
        commonService.exportFlie(url, queryParams,"次日达配送")
      } else {
        this.$Message.error("请选择条件导出或勾选数据导出");
      }
    },

    //提交数据
    toSubmit() {
      if (this.selectionData.length) {
        return this.$Modal.confirm({
          title: "提示",
          okText: "确定",
          cancelText: "取消",
          content: `您将提交${this.selectionData.length}条费用数据请确认？`,
          onOk: async () => {
            let selectItem = _.cloneDeep(this.selectionData);
            selectItem = selectItem.map(item => item.id)
            let data = {
              ids: selectItem
            };
            let res = await distributionSubmit(data);
            if (res.code == 200) {
              this.queryList();
              this.selectionData = [];
              this.$Message.success("提交成功！");
            } else {
              this.$Message.error(res.message);
            }
          }
        });
      }
      return this.$Message.error("请选择需要提交数据！");
    },
    //编辑
    async edit(item) {
      this.oporateType = "edit"
      let id = item.id;
      let res = await distributionDetail(id);
      if (res.code == 200) {
        const data = res.result
        this.showModal = true;
        this.formValidate = data;
        this.formValidate.adjustFlag = data.adjustFlag + ''
        if (Array.isArray(data.carrierItems)) {
          const defaultVal = data.carrierItems.filter(item=>item.id==data.carrierId)
          this.$refs.distributionCarrierId.setDefaultVal(defaultVal)
        }
        this.receiveCityIdList = data.carrierReceiveCityItems
        if(this.formValidate.regionCode){
          this.featchSelectorList()
        }
        if(this.formValidate.carrierId){
          this.changeCityIdList()
        }
      } else {
        this.$Message.error(res.message);
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.formValidate.effectiveDateStart = moment(this.formValidate.effectiveDateStart ).format('YYYY-MM-DD')
          this.formValidate.effectiveDateEnd = moment(this.formValidate.effectiveDateEnd ).format('YYYY-MM-DD')
          
          let res 
          if(this.oporateType == "add"){
            res = await distributionAdd(this.formValidate);
          }else{
            res = await  distributionSave(this.formValidate);
          }
          if (res.code == 200) {
            this.showModal = false;
            this.warehouseAddList = []
            this.merchantAddList = []
            this.receiveCityIdList = []
            this.$refs['distributionCarrierId'].resetData()
            this.queryList();
          } else {
            this.$Message.error(res.message);
          }
        } else {
          this.$Message.error("请完善各项信息！");
        }
      });
    },
    clearRegion(){
      this.warehouseAddList = []
      this.merchantAddList = []
      this.receiveCityIdList = []
      this.$refs.warehouseCode.clearSingleSelect()
      this.$refs.merchantNo.clearSingleSelect()
    },
    handleReset(name) {
      this.clearRegion()
      this.$refs[name].resetFields();
      this.$refs['distributionCarrierId'].resetData()
      this.showModal = false;
    },
    //清空数据
    resetParams() {
      this.resetQueryParams();
    },

    //查询列表
    onQueryHandler() {
      this.queryList();
    }
  }
};
</script>
<style lang="scss" scoped></style>
