<template>
  <mfb-page-table>
    <div slot="queryForm">
      <Form inline :label-width="110">
        <FormItem label="所在大区">
          <Select placeholder="全部" v-model="vStore.queryParams.regionCode" filterable clearable>
            <Option
              v-for="(item, index) in regionList"
              :value="item.selectCode"
              :key="index+'n1'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="大仓名称">
          <Select placeholder="全部" v-model="vStore.queryParams.warehouseCode" filterable clearable>
            <Option
              v-for="(item, index) in warehouseList"
              :value="item.selectCode"
              :key="index+'n2'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="货主名称">
          <Select placeholder="全部" v-model="vStore.queryParams.merchantNo" clearable filterable>
            <Option
              v-for="(item, index) in merchantList"
              :value="item.selectCode"
              :key="index+'n3'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="费用类型">
          <Select placeholder="全部" v-model="vStore.queryParams.costItemCode" clearable filterable>
            <Option
              v-for="(item, index) in itemCodeList"
              :value="item.selectCode"
              :key="index+'n4'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据状态">
          <Select placeholder="全部" v-model="vStore.queryParams.commitFlag" clearable filterable>
            <Option
              v-for="(item, index) in itemStatusList"
              :value="item.selectCode"
              :key="index+'n5'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="岗位">
          <Select placeholder="全部" v-model="vStore.queryParams.positionCode" clearable filterable>
            <Option
              v-for="(item, index) in positionList"
              :value="item.selectCode"
              :key="index+'n6'"
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
        <FormItem label="创建时间" class="date-picker-container">
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="createTimeStart"
            end-key="createTimeEnd"
            type="datetime"
          />
        </FormItem>
        <FormItem label="生效起始日期" :label-width="90" class="date-picker-container">
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="effectiveDateStartLeft"
            end-key="effectiveDateStartRight"
          />
        </FormItem>
        <FormItem label="生效结束日期" :label-width="90" class="date-picker-container">
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="effectiveDateEndLeft"
            end-key="effectiveDateEndRight"
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

    <div style="text-align:left;margin-bottom: 10px;">
      <Button type="primary" v-if="hasPermission('add')" @click="toAdd">新增</Button>
      <Button type="primary" class="mgl10" v-if="hasPermission('delete')" @click="toDelete">删除</Button>
      <a :href="downLoadUrl" download>
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
      :page-options="vStore.pageOptions"
      :table-options="tableOptions"
      :columns="columns"
      :data="listData"
      @on-page-size-change="onPageSizeChange"
      @on-selection-change="onSelectionChange"
      @on-change="onPageChange"
    />
    <CASMfbUploadFile :isShowModal.sync="isShowUpload" @success="queryList" :url="url"></CASMfbUploadFile>
    <Modal
      :title="oporateType=='add'?'新增':'编辑'"
      :mask-closable="false"
      v-model="showModal"
      footer-hide
      style="width:800px;"
      @on-cancel="cancelModal"
    >
      <Form ref="formValidate" :model="formValidate" :rules="rentRuleValidate" :label-width="120">
        <FormItem label="所在大区" prop="regionCode">
          <Select
            placeholder="请选择大区"
            ref="StationSelectRef"
            v-model="formValidate.regionCode"
            @on-change="changeRegion"
            clearable
            filterable
            @on-clear="clearRegion"
          >
            <Option
              v-for="(item, index) in regionList"
              :value="item.selectCode"
              :key="index+'m1'"
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
              v-for="(item, index) in warehouseAddList"
              :value="item.selectCode"
              :key="index+'m2'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="大仓编码" required>
          <Input v-model="formValidate.warehouseCode" disabled placeholder="选择大仓名称带出大仓编码"></Input>
        </FormItem>
        <FormItem label="货主名称" prop="merchantNo">
          <Select placeholder="请选择货主" v-model="formValidate.merchantNo" clearable filterable>
            <Option
              v-for="(item, index) in merchantAddList"
              :value="item.selectCode"
              :key="index+'m3'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="费用类型" prop="costItemCode">
          <Select placeholder="请选择费用类型" v-model="formValidate.costItemCode" clearable filterable>
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
                <DatePicker
                  type="date"
                  placeholder="请选择日期"
                  v-model="formValidate.effectiveDateStart"
                ></DatePicker>
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
            placeholder="请输入纳税人识别号"
            @on-blur="changeTaxNo"
          />
        </FormItem>
        <FormItem label="供应商名称" prop="supplierName">
          <Input type="text" disabled clearable v-model="formValidate.supplierName" placeholder="输入纳税人识别号带出供应商名称"/>
        </FormItem>
        <FormItem label="岗位" prop="positionCode">
          <Select
            placeholder="请选择岗位"
            ref="StationSelectRef"
            v-model="formValidate.positionCode"
            clearable
            filterable
          >
            <Option
              v-for="(item, index) in positionList"
              :value="item.selectCode"
              :key="index+'m4'"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="出勤人数" prop="attendance">
          <InputNumber
            style="width:100%"
            :precision="2"
            :min="0"
            v-model="formValidate.attendance"
            placeholder="请输入出勤人数"
          ></InputNumber>
        </FormItem>
        <FormItem label="日发生额" prop="dailyPrice">
          <InputNumber
            :precision="4"
            style="width:95%"
            v-model="formValidate.dailyPrice"
            placeholder="请输入日发生额"
          ></InputNumber>元
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
    </Modal>
  </mfb-page-table>
</template>
<script>
import {
  taskList,
  taskAdd,
  taskUpdate,
  taskDetail,
  taskExport,
  taskImport,
  taskCommit
} from "@/apis/baseData/warehousetask";
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import { listMixin } from "@/mixins/list.mixin";
import commonService from "@/apis/common";
import apis from "@/apis/index";
import { async } from "q";
export default {
  name: "cas-baseData-warehousetask",
  data() {
    return {
      downLoadUrl: "",
      tableOptions: {
        loading: false
      },
      listData: {
        list: [],
        total: 0
      },
      url: apis["BASE_DATA_TASK"].IMPORT,
      oporateType: "add",
      isShowUpload: false,
      taxpayerRemoteMethod: commonService.listLikeSupplierInfo,
      supplierNoRemoteMethod: commonService.listLikeSupplierInfo,
      getListService: taskList,
      warehouseAddList: [],
      merchantAddList: [],
      selectionData: [],
      showModal: false,
      itemCodeList: [], //费用类型
      formValidate: {
        adjustFlag: "0",
        attendance: null,
        dailyPrice: null
      },
      queryDateFormat: "",
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
            message: "请输入纳税人识别号"
          }
        ],
        supplierName: [
          {
            required: true,
            message: "请输入对应纳税人识别号获取供应商名称"
          }
        ],
        positionCode: [
          {
            required: true,
            message: "请选择岗位"
          }
        ],
        attendance: [
          {
            required: true,
            message: "请输入出勤人数"
          }
        ],
        dailyPrice: [
          {
            required: true,
            message: "请输入日发生额"
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
          key: "adjustDisplay",
          width: 120
        },
        {
          title: "数据状态",
          key: "commitStatus",
          width: 120
        },
        {
          title: "岗位",
          key: "positionName",
          width: 120
        },
        {
          title: "出勤人数",
          key: "attendance",
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
            if (params.row.commitFlag == 0 &&  this.hasPermission('edit')) {
              ids.push({
                id: "edit",
                name: "编辑",
                method: "toEdit",
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
  components: {},
  deactivated() {},
  mixins: [listMixin],
  created() {
    this.queryList(); // 分页
    this.getCostList();
    this.downLoadUrl =
      "http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/大仓作业模板.xlsx?" +
      Date.parse(new Date());
  },
  methods: {
    renderFormat(item) {
      return item.taxNo;
    },
    rendersupplierFormat(item) {
      return item.supplierName;
    },
    onFuzzyQuerySelectChange(args, fieldKey) {
      const item = args[0];
      if (item) {
        this.$set(this.vStore.queryParams, fieldKey, item.value);
      } else {
        this.$set(this.vStore.queryParams, fieldKey, "");
      }
    },
    changeRegion(val) {
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
      if (val) {
        this.getWarehouseList(val);
      }
    },
    clearRegion() {
      this.$set(this.formValidate, "merchantNo", "");
      this.$set(this.formValidate, "warehouseCode", "");
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
    getCostList() {
      commonService
        .getSelectorList({ selectType: ["itemCode"], costTypeCode: "Work" })
        .then(res => {
          if (res.code == 200) {
            const { itemCode } = res.result;
            this.itemCodeList = itemCode || [];
          }
        });
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
    //增加
    toAdd() {
      this.oporateType = "add";
      this.showModal = true;
      this.formValidate = {
        adjustFlag: "0",
        attendance: null,
        dailyPrice: null
      };
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
              return item.id;
            });
            let res = await taskUpdate(params);
            this.queryList();
            this.selectionData = [];
            if (res.code == 200) {
              this.$Message.success('删除成功');
            } else {
              this.$Message.error(res.message);
            }
          }
        });
      }
      return this.$Message.error("请选择需要删除的数据！");
    },
    objectKeyIsEmpty(obj) {
      let empty = null;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] === null || obj[key] === "") {
            empty = true;
          } else {
            empty = false;
            break;
          }
        }
      }
      return empty;
    },
    //导出
    toExport() {
      let params = this.vStore.queryParams;
      this.customFormatParams(params);
      let status = Object.keys(this.vStore.queryParams).filter(item=> item != 'pageSize' && item != 'pageNum').some(key=>{
        return this.vStore.queryParams[key]
      })
      params = MfbObjUtil.removeNull(params)
      if (status|| this.selectionData.length) {
        params.idList = this.selectionData.map(item => {
          return item.id;
        });
        commonService.exportFlie(
          "/cost-data/data/work/export",
          params,
          "大仓作业"
        );
        delete params.idList;
      } else {
        this.$Message.error("请选择条件导出或勾选数据导出");
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
              return item.id;
            });
            let res = await taskCommit(params);
            this.queryList();
            this.selectionData = [];
            if (res.code == 200) {
              this.$Message.success('提交成功');
            } else {
              this.$Message.error(res.message);
            }
          }
        });
      }
      return this.$Message.error("请选择需要提交的数据！");
    },
    //获取编辑详情
    async toGetEditdetail(id) {
      let res = await taskDetail({ id: id });
      if (res.code == 200) {
        this.formValidate = res.result;
        if (this.formValidate.regionCode) {
          this.getWarehouseList(this.formValidate.regionCode);
        }

        this.formValidate.adjustFlag = this.formValidate.adjustFlag + "";
      } else {
        this.$Message.error(res.message);
      }
    },
    //编辑
    toEdit(row) {
      this.oporateType = "edit";
      this.toGetEditdetail(row.id);
      this.showModal = true;
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
          let res = await taskAdd(formValidate);
          if (res.code == 200) {
            this.$Message.success(res.message);
            this.queryList();
            this.afterSubmit();
          } else {
            this.$Message.error(res.message);
          }
        }
      });
    },
    afterSubmit() {
      this.reset()
      this.formValidate = {
        adjustFlag: "0",
        attendance: null,
        dailyPrice: null
      };
    },
    reset() {
     this.showModal = false;
       if (this.$refs["formValidate"]) { 
         this.$refs['formValidate'].resetFields();
       }
    },
    handleReset() {
      this.reset()
      this.warehouseAddList = []
      this.merchantAddList = []
    },
    cancelModal() {
      this.handleReset()
    },
    //清空数据
    resetParams() {
      this.resetQueryParams();
      this.$refs['rendersupplier'].resetData()
      this.$refs['taxpayerRemote'].resetData()
    },

    //查询列表
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
  
  