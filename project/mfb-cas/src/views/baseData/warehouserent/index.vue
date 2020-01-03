<template>
  <div>
    <Tabs :animated="false" @on-click="changeTab" :value="vStore.tablename">
      <mfb-page-table>
        <div slot="queryForm">
          <Form inline :label-width="110">
            <FormItem label="所在大区">
              <Select placeholder="全部" v-model="vStore.queryParams.regionCode" clearable filterable>
                <Option
                  v-for="(item,index) in regionList"
                  :value="item.selectCode"
                  :key="index"
                >{{ item.selectName }}</Option>
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
                  v-for="(item, index) in warehouseList"
                  :value="item.selectCode"
                  :key="index"
                >{{ item.selectName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="货主名称">
              <Select placeholder="全部" v-model="vStore.queryParams.merchantNo" clearable filterable>
                <Option
                  v-for="(item,index) in merchantList"
                  :value="item.selectCode"
                  :key="index"
                >{{ item.selectName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="费用类型">
              <Select
                placeholder="全部"
                ref="Station1SelectRef"
                v-model="vStore.queryParams.costItemCode"
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
            <FormItem label="数据状态">
              <Select placeholder="全部" v-model="vStore.queryParams.commitFlag" clearable filterable>
                <Option
                  v-for="(item, index) in itemStatusList"
                  :value="item.selectCode"
                  :key="index"
                >{{ item.selectName }}</Option>
              </Select>
            </FormItem>
            <FormItem label="纳税人识别号">
              <CASFuzzyQuerySelect
                ref="taxpayerRemote"
                queryKey="codeQuery"
                @on-change="onFuzzyQuerySelectChange(arguments, 'taxNo')"
                placeholder="请输入纳税人识别号"
                :remoteMethod="taxpayerRemoteMethod"
                keyName="taxNo"
                valName="taxNo"
                :renderFormat="renderFormat"
              />
            </FormItem>
            <FormItem label="供应商名称">
              <CASFuzzyQuerySelect
                ref="rendersupplier"
                queryKey="nameQuery"
                @on-change="onFuzzyQuerySelectChange(arguments, 'supplierName')"
                placeholder="请输入供应商名称"
                :remoteMethod="supplierNoRemoteMethod"
                keyName="supplierName"
                valName="supplierName"
                :renderFormat="rendersupplierFormat"
              />
            </FormItem>
            <FormItem label="生效起始日期" class="date-picker-container">
              <MfbDatePicker
                :query-params="vStore.queryParams"
                start-key="effectiveDateStartLeft"
                end-key="effectiveDateStartRight"
              />
            </FormItem>
            <FormItem label="生效结束日期" class="date-picker-container">
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
                type="datetime"
              />
            </FormItem>
            <FormItem label="提交时间" class="date-picker-container">
              <MfbDatePicker
                :query-params="vStore.queryParams"
                start-key="commitTimeStart"
                end-key="commitTimeEnd"
                type="datetime"
              />
            </FormItem>
          </Form>

          <div class="query-buttons">
            <Button type="primary" @click="onQueryHandler">查询</Button>
            <Button type="primary" @click="resetParams">清空</Button>
          </div>
        </div>
      </mfb-page-table>

      <TabPane label="大仓仓租" name="rent">
        <div style="text-align:left;margin-bottom: 10px;">
          <Button type="primary" v-if="hasPermission('rentAdd')" @click="toAdd">新增</Button>
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('rentDelete')"
            @click="toDelete"
          >删除</Button>
          <a :href="downLoadRentUrl" download>
            <Button type="primary" class="mgl10" v-if="hasPermission('rentDownload')">模板下载</Button>
          </a>
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('rentUpload')"
            @click="isShowUpload = true"
          >上传</Button>
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('rentExport')"
            @click="toExport"
          >导出</Button>
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('rentSubmit')"
            @click="toSubmit"
          >提交数据</Button>
        </div>
        <MfbDataList
          :table-options="tableOptions"
          :columns="rentColumns"
          :data="listData"
          :page-options="vStore.pageOptions"
          @on-page-size-change="onPageSizeChange"
          @on-change="onPageChange"
          @on-selection-change="onSelectionChange"
        />
      </TabPane>

      <TabPane label="大仓运营费" name="operate">
        <div style="text-align:left;margin-bottom: 10px;">
          <Button type="primary" v-if="hasPermission('add')" @click="toAdd">新增</Button>
          <Button type="primary" class="mgl10" v-if="hasPermission('delete')" @click="toDelete">删除</Button>
          <a :href="downLoadOperateUrl" download>
            <Button type="primary" class="mgl10" v-if="hasPermission('download')">模板下载</Button>
          </a>
          <Button
            type="primary"
            class="mgl10"
            v-if="hasPermission('upload')"
            @click="isShowUpload = true"
          >上传</Button>
          <Button type="primary" class="mgl10" v-if="hasPermission('export')" @click="toExport">导出</Button>
          <Button type="primary" class="mgl10" v-if="hasPermission('submit')" @click="toSubmit">提交数据</Button>
        </div>
        <MfbDataList
          :table-options="tableOptions"
          :columns="operateColumns"
          :data="listData"
          :page-options="vStore.pageOptions"
          @on-page-size-change="onPageSizeChange"
          @on-change="onPageChange"
          @on-selection-change="onSelectionChange"
        />
      </TabPane>
    </Tabs>
    <Modal
      :title="oporateType=='add'?'新增':'编辑'"
      :mask-closable="false"
      v-model="showModal"
      footer-hide
      style="width:800px;"
      @on-cancel="cancelModal"
    >
      <rentModal
        ref="rentModal"
        :oporateType="oporateType"
        :formValidate="formValidate"
        @handleReset="handleReset"
        @handleSubmit="handleSubmit"
        @getWarehouseList="getWarehouseList"
        v-if="tabType =='rent'"
        :regionList="regionList"
        :merchantAddList="merchantAddList"
        :warehouseAddList="warehouseAddList"
        :itemCodeList="itemCodeList"
      ></rentModal>
      <operateModal
        ref="operateModal"
        :oporateType="oporateType"
        :formValidate="formValidate"
        @handleReset="handleReset"
        @handleSubmit="handleSubmit"
        @getWarehouseList="getWarehouseList"
        v-if="tabType =='operate'"
        :regionList="regionList"
        :merchantAddList="merchantAddList"
        :warehouseAddList="warehouseAddList"
        :itemOprateCodeList="itemOprateCodeList"
      ></operateModal>
    </Modal>
    <CASMfbUploadFile :isShowModal.sync="isShowUpload" @success="queryList" :url="url"></CASMfbUploadFile>
  </div>
</template>
  <script>
import { MfbDataList } from "@mfb/pc-components-micro";
import {
  rentList,
  rentImport,
  rentUpload,
  rentExport,
  rentUpdate,
  rentDetail
} from "@/apis/baseData/warehouserent";
import {
  operateList,
  operateImport,
  operateUpload,
  operateExport,
  operateUpdate,
  operateDetail
} from "@/apis/baseData/warehouseoperate";
import apis from "@/apis/index";
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import { listMixin } from "@/mixins/list.mixin";
import rentModal from "./components/rentModal.vue";
import operateModal from "./components/operateModal.vue";
import commonService from "@/apis/common";
export default {
  name: "cas-baseData-warehouserent",
  data() {
    return {
      tableOptions: {
        loading: false
      },
      downLoadRentUrl:
        "http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/大仓仓租模板.xlsx" +
        `?${Date.now()}`,
      downLoadOperateUrl:
        "http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/大仓运营模板.xlsx" +
        `?${Date.now()}`,
      warehouseAddList: [],
      merchantAddList: [],
      itemCodeList: [],
      itemOprateCodeList:[],
      listData: {
        list: [],
        total: 0
      },
      queryDateFormat: "",
      isShowUpload: false,
      taxpayerRemoteMethod: commonService.listLikeSupplierInfo,
      supplierNoRemoteMethod: commonService.listLikeSupplierInfo,
      tabType: "rent",
      oporateType: "add",
      showModal: false,
      getListService: rentList,
      url: apis["BASE_DATA_RENT"].UPLOAD,
      formValidate: {
        adjustFlag: "0",
        area: null,
        unitPrice: null,
        dailyPrice: null
      },
      rentColumns: [
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
          title: "面积（㎡）",
          key: "area",
          width: 120
        },
        {
          title: "单价（元/㎡/天）",
          key: "unitPrice",
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
          title: "供应商名称",
          key: "supplierName",
          width: 120
        },

        {
          title: "纳税人识别号",
          key: "taxNo",
          width: 150
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 150
        },
        {
          title: "创建人",
          key: "createUserName",
          width: 120
        },
        {
          title: "提交时间",
          key: "commitTime",
          width: 150
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
            if (params.row.commitFlag == 0 &&  this.hasPermission('editRent')) {
              ids.push({
                id: "editRent",
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
      operateColumns: [
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
          title: "所属大区",
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
          title: "费用子类型",
          key: "costItemSubName",
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
          title: "供应商名称",
          key: "supplierName",
          width: 120
        },
        {
          title: "纳税人识别号",
          key: "taxNo",
          width: 120
        },
        {
          title: "创建时间",
          key: "createTime",
          width: 150
        },
        {
          title: "创建人",
          key: "createUserName",
          width: 120
        },
        {
          title: "提交时间",
          key: "commitTime",
          width: 150
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
            if (params.row.commitFlag == 0 &&  this.hasPermission('editOperate')) {
              ids.push({
                id: "editOperate",
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
    rentModal,
    operateModal
  },
  deactivated() {},
  mixins: [listMixin],
  created() {
    this.queryList(); // 分页
    this.getCostList("WarehouseRent");
  },
  methods: {
    renderFormat(item) {
      return item.taxNo;
    },
    rendersupplierFormat(item) {
      return item.supplierName;
    },
    changeTab(item) {
      this.tabType = item;
      if (this.tabType == "rent") {
        this.getListService = rentList;
        this.url = apis["BASE_DATA_RENT"].UPLOAD;
        this.getCostList("WarehouseRent"); //获取数据类型
      } else {
        this.getListService = operateList;
        this.url = apis["BASE_DATA_OPERATE"].UPLOAD;
        this.getCostList("OperationExpenses"); //获取数据类型
        this.getCostLevelList("OperationExpenses");
      }
      this.$set(this.vStore.pageOptions, 'pageNum', 1)
      this.selectionData = [];//清除选中
      this.queryList();
    },

    customFormatParams(queryParams) {
      queryParams.effectiveDateStartLeft = this.fortmatTime(
        queryParams.effectiveDateStartLeft,
        "YYYY-MM-DD"
      );
      queryParams.effectiveDateStartRight = this.fortmatTime(
        queryParams.effectiveDateStartRight,
        "YYYY-MM-DD"
      );
      queryParams.effectiveDateEndLeft = this.fortmatTime(
        queryParams.effectiveDateEndLeft,
        "YYYY-MM-DD"
      );
      queryParams.effectiveDateEndRight = this.fortmatTime(
        queryParams.effectiveDateEndRight,
        "YYYY-MM-DD"
      );
      queryParams.createTimeStart = this.fortmatTime(
        queryParams.createTimeStart,
        "YYYY-MM-DD HH:mm:ss"
      );
      queryParams.createTimeEnd = this.fortmatTime(
        queryParams.createTimeEnd,
        "YYYY-MM-DD HH:mm:ss"
      );
      queryParams.commitTimeStart = this.fortmatTime(
        queryParams.commitTimeStart,
        "YYYY-MM-DD HH:mm:ss"
      );
      queryParams.commitTimeEnd = this.fortmatTime(
        queryParams.commitTimeEnd,
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    fortmatTime(time = "", patten) {
      if (time) {
        time = this.moment(time).format(patten);
      }
      return time;
    },
    //大仓、货主
    getWarehouseList(val) {
      commonService
        .getSelectorList({
          selectType: ["warehouse", "merchant"],
          regionCode: val
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
    //获取费用类型枚举
    getCostList(costTypeCode) {
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
     //获取1级费用类型枚举
     getCostLevelList() {
      commonService
        .getSelectorList({
          selectType: ["itemCode"],
          costTypeCode: 'OperationExpenses',
          level:1
        })
        .then(res => {
          if (res.code == 200) {
            const { itemCode } = res.result;
            this.itemOprateCodeList = itemCode || [];
          }
        });
    },
    
    //增加
    toAdd() {
      this.showModal = true
      this.oporateType = "add";
      if (this.tabType == "rent") {
        this.$refs.rentModal && this.$refs.rentModal.$refs.formValidate.resetFields();
      } else {
        this.$refs.operateModal && this.$refs.operateModal.$refs.formValidate.resetFields();
      }
      (this.formValidate = {
        adjustFlag: "0",
        area: null,
        unitPrice: null,
        dailyPrice: null
      })
       
    },

    //删除
    toDelete() {
      if (this.selectionData.length) {
        for (let i = 0; i < this.selectionData.length; i++) {
          const selectionData = this.selectionData;
          if (selectionData[i].commitFlag == 1) {
            this.$Message.error("仅支持新创建的数据删除！");
            return;
          }
        }
        return this.$Modal.confirm({
          title: "提示",
          okText: "确定",
          cancelText: "取消",
          content: `您将删除${this.selectionData.length}条数据请确认？`,
          onOk: async () => {
            let params = this.selectionData.map(item => {
              return { id: item.id, delFlag: 1 };
            });

            let res;
            if (this.tabType == "rent") {
              res = await rentUpdate(params);
            } else {
              res = await operateUpdate(params);
            }
            if (res.code == 200) {
              this.queryList();
              this.selectionData = [];
              this.$Message.success('删除成功');
            } else {
              this.$Message.error(res.message);
            }
          }
        });
      }
      return this.$Message.error("请选择需要删除数据！");
    },

    //导出
    toExport() {
      let params = this.vStore.queryParams;
      this.customFormatParams(params);
      let status = Object.keys(this.vStore.queryParams).filter(item=> item != 'pageSize' && item != 'pageNum').some(key=>{
        return this.vStore.queryParams[key]
      })
      params = MfbObjUtil.removeNull(params)
      if (status || this.selectionData.length) {
        params.idList = this.selectionData.map(item => {
          return item.id;
        });
        if (this.tabType == "rent") {
          commonService.exportFlie(
            "/cost-data/data/warehouseRent/export",
            params,
            "大仓仓租"
          );
        } else {
          commonService.exportFlie(
            "/cost-data/data/operatingCost/export",
            params,
            "大仓运营费"
          );
        }
        delete params.idList;
      } else {
        this.$Message.error("请选择条件导出或勾选数据导出");
      }
    },

    //编辑
    async edit(row) {
      this.oporateType = "edit";
      let id = row.id;
      let res;
      if (this.tabType == "rent") {
        res = await rentDetail({ id });
        this.getCostList("WarehouseRent");
      } else {
        res = await operateDetail({ id });
      }
      if (res.code == 200) {
        this.showModal = true;
        this.formValidate = res.result;
        this.getWarehouseList(this.formValidate.regionCode);
        this.formValidate.adjustFlag = res.result.adjustFlag + "";
        this.$forceUpdate();
      } else {
        this.$Message.error(res.message);
      }
    },
    //提交数据
    toSubmit() {
      if (this.selectionData.length) {
        for (let i = 0; i < this.selectionData.length; i++) {
          const selectionData = this.selectionData;
          if (selectionData[i].commitFlag == 1) {
            this.$Message.error("仅支持新创建的数据提交！");
            return;
          }
        }
        return this.$Modal.confirm({
          title: "提示",
          okText: "确定",
          cancelText: "取消",
          content: `您将提交${this.selectionData.length}条数据请确认？`,
          onOk: async () => {
            let params = this.selectionData.map(item => {
              return { id: item.id, commitFlag: 1 };
            });
            let res;
            if (this.tabType == "rent") {
              res = await rentUpdate(params);
            } else {
              res = await operateUpdate(params);
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
      this.formValidate = {
        adjustFlag: "否",
        area: null,
        unitPrice: null,
        dailyPrice: null
      };
    },
    reset() {
      this.showModal = false;
      this.warehouseAddList = []
      this.merchantAddList = []
       if (this.$refs["formValidate"]) { 
         this.$refs['formValidate'].resetFields();
       }
    },
    cancelModal() {
      this.handleReset()
    },
    handleReset(name) {
      this.reset()
      this.formValidate = {
        adjustFlag: "否",
        area: null,
        unitPrice: null,
        dailyPrice: null
      };
    },
    onFuzzyQuerySelectChange(args, fieldKey) {
      const item = args[0];
      if (item) {
        // select change
        this.$set(this.vStore.queryParams, fieldKey, item.value);
      } else {
        // clear
        this.$set(this.vStore.queryParams, fieldKey, "");
      }
    },
    resetParams() {
      this.resetQueryParams();
      this.$refs['rendersupplier'].resetData()
      this.$refs['taxpayerRemote'].resetData()
    },
    onQueryHandler() {
      delete this.vStore.queryParams.idList
      this.selectionData = [];//清除选中
      this.queryList();
    },
    onSelectionChange(item) {
      this.selectionData = item;
      // this.selectionData = item.map(i => {
      //   return i.id;
      // });
    }
  }
};
</script>
  <style lang="scss" scoped>
</style>
  
  