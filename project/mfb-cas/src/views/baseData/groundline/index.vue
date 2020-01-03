<template>
  <div>
    <Tabs :animated="false" @on-click="changeTab" :value="vStore.tablename">
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
                  v-for="(item,index) in merchantList"
                  :value="item.selectCode"
                  :key="index"
                  >{{ item.selectName }}</Option
                >
              </Select>
            </FormItem>
            <FormItem label="费用类型">
              <Select
                placeholder="全部"
                v-model="vStore.queryParams.costItemCode"
                clearable
                filterable
              >
                <Option
                  v-for="item in itemCodeList"
                  :value="item.selectCode"
                  :key="item.selectCode"
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
              >
                <Option
                  v-for="item in itemStatusList"
                  :value="item.selectCode"
                  :key="item.selectCode"
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
            <FormItem label="承运商名称">
              <CASFuzzyQuerySelect
                ref="carrierCode"
                queryKey="nameQuery"
                @on-change="onFuzzyQuerySelectChange(arguments, 'carrierCode')"
                placeholder="请输入承运商名称"
                :remoteMethod="getCarrierQuery"
                keyName="valueName"
                valName="valueName"
                :renderFormat='renderFormat'
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
      </mfb-page-table>

      <TabPane label="按筐结算" name="box">
        <div style="text-align:left;margin-bottom: 10px;">
          <Button type="primary" v-if="hasPermission('boxAdd')" @click="toAdd"
            >新增</Button
          >
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('boxDelete')"
            @click="toDelete"
            >删除</Button
          >
          <a :href="boxDownload" download> 
            <Button
              type="primary"
              class="mgl10"
              v-if="hasPermission('boxDownload')"
              >模板下载</Button
            >
          </a>
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('boxUpload')"
            @click="toUpload"
            >上传</Button
          >
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('boxExport')"
            @click="toExport"
            >导出</Button
          >
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('boxSubmit')"
            @click="toSubmit"
            >提交数据</Button
          >
        </div>
        <MfbDataList
          :table-options="tableOptions"
          :columns="boxColumns"
          :data="listData"
          :page-options="vStore.pageOptions"
          @on-page-size-change="onPageSizeChange"
          @on-change="onPageChange"
          @on-selection-change="onSelectionChange"
        />
      </TabPane>

      <TabPane label="按车结算" name="car">
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
          <a :href="carDownload" download> 
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
          :columns="carColumns"
          :data="listData"
          :page-options="vStore.pageOptions"
          @on-page-size-change="onPageSizeChange"
          @on-change="onPageChange"
          @on-selection-change="onSelectionChange"
        />
      </TabPane>
    </Tabs>
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
      @on-cancel="cancelSubmit"
    >
      <boxModal
        ref="boxModal"
        :showModal="showModal"
        :oporateType="oporateType"
        :formValidate="formValidate"
        :regionList="regionList"
        :itemCodeList="itemCodeList"
        :warehouseList="warehouseList"
        :merchantList="merchantList"
        @handleReset="handleReset"
        @handleSubmit="handleSubmit"
        v-if="tabType == 'box'"
      ></boxModal>
      <carModal
        ref="carModal"
        :showModal="showModal"
        :oporateType="oporateType"
        :formValidate="formValidate"
        :regionList="regionList"
        :itemCodeList="itemCodeList"
        :truckTypeList="truckTypeList"
        @handleReset="handleReset"
        @handleSubmit="handleSubmit"
        v-if="tabType == 'car'"
      ></carModal>
    </Modal>
  </div>
</template>
<script>
import { MfbDataList } from "@mfb/pc-components-micro";
import * as moment from "moment";
import { distributionList } from "@/apis/baseData/distribution";
import commonService from '@/apis/common'
import { listCity,carrierQuery } from '@/apis/common'
import {
  groundlineBoxList,
  groundlineBoxDetail,
  groundlineBoxAdd,
  groundlineBoxDelete,
  groundlineBoxSave,
  groundlineBoxSubmit
} from "@/apis/baseData/groundlineBox";
import {
  groundlineCarList,
  groundlineCarDetail,
  groundlineCarAdd,
  groundlineCarDelete,
  groundlineCarSave,
  groundlineCarSubmit
} from "@/apis/baseData/groundlineCar";
import apis from '@/apis/index'
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import { listMixin } from "@/mixins/list.mixin";
import boxModal from "./components/boxModal.vue";
import carModal from "./components/carModal.vue";

export default {
  name: "cas-baseData-groundline",
  data() {
    return {
      url:apis['GROUND_LINE_BOX'].IMPORT,
      getCarrierQuery: carrierQuery,
      tableOptions: {
        loading: false
      },
      isShowUpload:false,
      carDownload: 'http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/大仓干线-车.xlsx'  + `?${Date.now()}`,
      boxDownload: 'http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/大仓干线-筐模板.xlsx' + `?${Date.now()}`,
      formValidate:{
        adjustFlag:'0',
        unitPrice:null,
        departureCount:null,
        cartonCount:null,
        basketCount: null,
        keepWarmCount: null,
        dailyPrice:null ,

        basketPrice:null,
        cartonPercent1:null,
        cartonPercent2:null,
        totalCount:null,
      },
      itemCodeList: [],
      cityList:[],
      listData: {
        list: [],
        total: 0
      },
      oporateType:"add",
      tabType: "box",
      showModal: false,
      boxColumns: [
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
          key: "adjustFlagStr",
          width: 120
        },
        {
          title: "数据状态",
          key: "commitFlagStr",
          width: 120
        },
        {
          title: "收货城市",
          key: "receiveCityName",
          width: 120
        },
        {
          title: "筐单价",
          key: "basketPrice",
          width: 120
        },
        {
          title: "纸箱折算比例",
          key: "cartonPercent",
          width: 120
        },
        {
          title: "发货筐数",
          key: "basketCount",
          width: 120
        },
        {
          title: "发货纸箱数",
          key: "cartonCount",
          width: 120
        },
        {
          title: "发货保温包(箱)数",
          key: "keepWarmCount",
          width: 120
        },

        {
          title: "折算后筐合计",
          key: "totalCount",
          width: 120
        },
        {
          title: "日发生额",
          key: "dailyPrice",
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
          title: "承运商名称",
          key: "carrierName",
          width: 120
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
            if(params.row.commitFlag == 0 &&  this.hasPermission('boxEdit')) {
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
      ],
      carColumns: [
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
          key: "adjustDisplay",
          width: 120
        },
        {
          title: "数据状态",
          key: "commitStatus",
          width: 120
        },
        {
          title: "收货城市",
          key: "receiveCityName",
          width: 120
        },
        {
          title: "车单价",
          key: "unitPrice",
          width: 120
        },
        {
          title: "车型",
          key: "vehicleModelName",
          width: 120
        },
        {
          title: "发车数",
          key: "departureCount",
          width: 120
        },
        {
          title: "发货筐数",
          key: "basketCount",
          width: 120
        },
        {
          title: "发货纸箱数",
          key: "cartonCount",
          width: 120
        },
        {
          title: "发货保温包(箱)数",
          key: "keepWarmCount",
          width: 120
        },
        {
          title: "日发生额",
          key: "dailyPrice",
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
          title: "承运商名称",
          key: "carrierName",
          width: 120
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
    MfbDataList,
    boxModal,
    carModal
  },
  deactivated() {},
  mixins: [listMixin],
  created() {
    this.queryList(); // 分页
    this.featchSelectorList('LineBasket')//获取数据类型
    this.featchCityList()//获取城市列表
  },
  methods: {
    cancelSubmit(){
      console.log(11111)
      if (this.tabType == "car") {
        this.$refs.carModal.$refs.carrier.resetData()
        this.$refs.carModal.$refs.formValidateCar.resetFields()
        this.$refs.carModal.resetForm1()
      } else {
        this.$refs.boxModal.$refs.carrierQuery.resetData()
        this.$refs.boxModal.$refs.formValidateBox.resetFields()
        this.$refs.boxModal.resetForm()
      }
    },
    onFuzzyQuerySelectChange(args, fieldKey) {
      const item = args[1];
      if (item) {
        this.$set(this.vStore.queryParams, fieldKey, item.valueCode);
      } else {
        // clear
        this.$set(this.vStore.queryParams, fieldKey, "");
      }
    },
    renderFormat(item) {
      return item.valueName
    },
    featchSelectorList(costTypeCode){
      commonService.getSelectorList({selectType:['itemCode'],costTypeCode:costTypeCode}).then (res => {
        if (res.code == 200) {
          const {itemCode} = res.result
          this.itemCodeList = itemCode || []
        }
      })
    },
    async featchCityList(){
      let  res = await listCity();
      if (res.code == 200) {
        this.cityList = res.result || []
      } else {
        this.$Message.error(res.message);
      }
    },
   
    fortmatTime(time = '', patten) {
      if(time) {
         time = moment(time).format(patten)
      }
      return time
    },
    formatParams() {
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
    async queryList() {
      let queryParams = this.formatParams();
      // 添加分页信息
      queryParams = Object.assign(queryParams, this.vStore.pageOptions)
      delete this.vStore.queryParams.idList
      this.selectionData = [];//清除选中
      delete queryParams.idList
      let res
      if (this.tabType == "car") {
        res = await groundlineCarList(queryParams);
      } else {
        res = await groundlineBoxList(queryParams);
      }
      if (res.code == 200) {
        this.listData = {
          total: res.result.totalCount,
          list: res.result.list || []
        };
      } else {
        this.$Message.error(res.message);
      }
    },
    changeTab(item) {
      this.tabType = item;
      if (this.tabType == "car") {
        this.featchSelectorList('LineTruck')//获取数据类型
      } else {
        this.featchSelectorList('LineBasket')//获取数据类型
      }
      this.$set(this.vStore.pageOptions, 'pageNum', 1)
      this.selectionData = [];//清除选中
      this.queryList()
    },
    //增加
    toAdd() {
      this.oporateType = "add"
      this.formValidate.id = null
      this.formValidate.carrierName = null

      if (this.tabType == "car") {
        this.$refs.carModal.$refs.carrier.resetData()
        this.$refs.carModal.$refs.formValidateCar.resetFields()
        this.$refs.carModal.resetForm1()
      } else {
        this.$refs.boxModal.$refs.carrierQuery.resetData()
        this.$refs.boxModal.$refs.formValidateBox.resetFields()
        this.$refs.boxModal.resetForm()
      }

      this.formValidate = {
        adjustFlag:'0',
        unitPrice:null,
        departureCount:null,
        cartonCount:null,
        basketCount: null,
        keepWarmCount: null,
        dailyPrice:null ,

        basketPrice:null,
        cartonPercent1:null,
        cartonPercent2:null,
        totalCount:null,
      }

      this.showModal = true;
    },

    //去删除
    toDelete() {
      if(!this.checkStatus()) {
        this.$Message.error('仅支持新创建的费用数据删除')
        return
      }
      if (this.selectionData.length) {
        return this.$Modal.confirm({
          title: "提示",
          okText: "确定",
          cancelText: "取消",
          content: `您将删除${this.selectionData.length}条费用数据请确认？`,
          onOk: async () => {
            let selectItem = _.cloneDeep(this.selectionData);
            selectItem = selectItem.map(item => item.id)
            
            let res;
            if (this.tabType == "car") {
              res = await groundlineCarDelete({carList:selectItem,genre:2});
            } else {
              res = await groundlineBoxDelete({ids:selectItem});
            }
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
      this.isShowUpload = true
      if(this.tabType == "car"){
        this.url = apis['GROUND_LINE_CAR'].IMPORT
      }else{
        this.url = apis['GROUND_LINE_BOX'].IMPORT
      }

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
        let url
        if(this.tabType == "box"){
          url = "/cost-data/data/lineBasket/export"
          commonService.exportFlie(url, queryParams,"大仓干线-筐")
        }else{
          url = "/cost-data/data/line/car/export"
          commonService.exportFlie(url, queryParams,"大仓干线-车")
        }
        
      } else {
        this.$Message.error("请选择条件导出或勾选数据导出");
      }      
    },

    //编辑
    async edit(item) {
      this.oporateType = 'edit'
      let id = item.id;
      let res;
      this.$set(this, 'formValidate', {})
      if (this.tabType == "car") {
        res = await groundlineCarDetail({ id });
      } else {
        res = await groundlineBoxDetail({ id });
      }

      if (res.code == 200) {
        this.formValidate = res.result;
        if(this.tabType == "box"){
          let cartonPercentthis = this.formValidate.cartonPercent.split(':')
          // this.formValidate.cartonPercent1 = parseInt(cartonPercentthis[0])
          // this.formValidate.cartonPercent2 = parseInt(cartonPercentthis[1])
          this.$set(this.formValidate, 'cartonPercent1', parseInt(cartonPercentthis[0]))
          this.$set(this.formValidate, 'cartonPercent2', parseInt(cartonPercentthis[1]))
        }
        this.formValidate.adjustFlag = res.result.adjustFlag + ''
        this.showModal = true;
      } else {
        this.$Message.error(res.message);
      }
    },
    checkStatus() {
      console.log(this.selectionData,12345)
      return this.selectionData.every(item=>item.commitFlag == 0)
    },
    //提交数据
    toSubmit() {
      if(!this.checkStatus()) {
        this.$Message.error('仅支持新创建的费用数据提交')
        return
      }
      if (this.selectionData.length) {
        return this.$Modal.confirm({
          title: "提示",
          okText: "确定",
          cancelText: "取消",
          content: `您将提交${this.selectionData.length}条费用数据请确认？`,
          onOk: async () => {
            let selectItem = _.cloneDeep(this.selectionData);
            selectItem = selectItem.map(item => item.id)
            let res;
            if (this.tabType == "car") {
              res = await groundlineCarSubmit({carList:selectItem,genre:1});
            } else {
              res = await groundlineBoxSubmit({ids:selectItem});
            }
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
    handleSubmit(name) {
      this.showModal = false;
      this.queryList();
    },

    handleReset(name) {
      this.showModal = false;
    },
    resetParams() {
      this.resetQueryParams();
      this.$refs['carrierCode'].resetData()
    },
    onQueryHandler() {
      this.queryList();
    },
    onPageSizeChange (size) {
      this.$set(this.vStore.pageOptions, 'pageNum', 1)
      this.$set(this.vStore.pageOptions, 'pageSize', size)
      this.queryList()
    },
    // page change
    onPageChange (page) {
      this.$set(this.vStore.pageOptions, 'pageNum', page)
      this.queryList()
    },
  }
};
</script>
<style lang="scss" scoped></style>
