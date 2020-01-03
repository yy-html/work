<template>
  <mfb-page-table>
    <div slot="queryForm">
      <Form inline :label-width="85">
        <FormItem label="所在大区">
          <Select
            placeholder="全部"
            ref="Station1SelectRef"
            v-model="vStore.queryParams.regionCode"
            clearable
            filterable 
            @on-change="selectRegion"
          >
            <Option
              v-for="item in regionList"
              :value="item.selectCode"
              :key="item.selectCode"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="大仓名称">
          <Select
            placeholder="全部"
            ref="Station1SelectRef"
            v-model="vStore.queryParams.warehouseCode"
            clearable
            filterable 
          >
            <Option
              v-for="item in warehouseList"
              :value="item.selectCode"
              :key="item.selectCode"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="货主名称">
          <Select
            placeholder="全部"
            ref="Station1SelectRef"
            v-model="vStore.queryParams.merchantNo"
            clearable
            filterable
          >
            <Option
              v-for="(item, index) in merchantList"
              :value="item.selectCode"
              :key="index"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="费用类型">
          <Select
            placeholder="全部"
            ref="StationSelectRef"
            v-model="vStore.queryParams.costItemCode"
            clearable
            filterable
          >
            <Option v-for="(item,index) in costCode" :value="item.selectCode" :key="index">{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据状态">
          <Select
            placeholder="全部"
            ref="StationSelectRef"
            v-model="vStore.queryParams.commitFlag"
            clearable
            filterable
          >
            <Option
              v-for="(item, index) in itemStatusList"
              :value="item.selectCode"
              :key="index"
            >{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="原料" >
          <CASFuzzyQuerySelect 
          ref="FuzzyQuery"
          :renderFormat="renderFormat" 
          @on-change="onFuzzyQuerySelectChange(arguments, 'materialCode')" 
          placeholder="请输入原料编码" 
          queryKey="nameQuery" 
          :extraParams="extraParams" 
          :remoteMethod="materialQuery" 
          keyName="valueName" 
          valName="valueCode" />
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
        <FormItem label="生效起始日期" :label-width="120" class="date-picker-container">
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="effectiveDateStartLeft"
            end-key="effectiveDateStartRight"
          />
        </FormItem>
        <FormItem label="生效结束日期" :label-width="120" class="date-picker-container">
          <MfbDatePicker
            :query-params="vStore.queryParams"
            start-key="effectiveDateEndLeft"
            end-key="effectiveDateEndRight"
          />
        </FormItem>
      </Form>

      <div class="query-buttons">
        <Button type="primary" @click="onQueryHandler">查询</Button>
        <Button type="primary" @click="handleReset">清空</Button>
      </div>
    </div>

    <div style="text-align:left;margin-bottom: 10px;">
      <Button v-if="hasPermission('add')" type="primary" @click="add">新增</Button>
      <Button v-if="hasPermission('del')" type="primary" @click="del" class="mgl10">删除</Button>
      <a v-if="hasPermission('model')" href="http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/大仓包材模板.xlsx" download>
        <Button type="primary" class="mgl10">模板下载</Button>
      </a>
      <Button v-if="hasPermission('upload')" type="primary" @click="isShowUpload = true" class="mgl10">上传</Button>
      <Button v-if="hasPermission('export')" type="primary" @click="exportFile" class="mgl10">导出</Button>
      <Button v-if="hasPermission('submit')" type="primary" @click="submit" class="mgl10">提交数据</Button>
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
    <createItem
      ref="createItem"
      :type="type"
      :isShowModal.sync="isShowModal"
      @success="createSuccess"
      :formInfo.sync="formInfo"
      :costCode="costCode"
      :regionList="regionList"
      :merchantList="merchantList"
      :defaultVal="defaultVal"
    ></createItem>
    <CASMfbUploadFile
      :isShowModal.sync="isShowUpload"
      @success="queryList"
      :url="url"
      >
    </CASMfbUploadFile>
  </mfb-page-table>
</template>
  <script>
import { MfbDataList } from "@mfb/pc-components-micro";
import * as moment from "moment";
import {
  getList,
  getDetail,
  changeStatus
} from "@/apis/baseData/packageMaterial";
import commonService from "@/apis/common";
import { MfbObjUtil } from "@mfb/pc-utils-micro";
import { listMixin } from "@/mixins/list.mixin";
import createItem from "./createItem";
import apis from '@/apis/index'
export default {
  name: "PackageMaterial",
  data() {
    return {
      url: apis['BASE_SETTING_PACKAGEMATERIAL'].upload,
      materialQuery: commonService.materialQuery,
      type: "add",
      formInfo: {
        dailyUsage: null,
        adjustFlag: 0
      },
      extraParams: {},
      ids: [],
      defaultVal: [],
      costCode: [], //费用类型
      isShowModal: false,
      isShowUpload: false,
      formValidate: {
        status: [],
        city: "",
        msgStation: []
      },
      tableOptions: {
        loading: false
      },
      stationList: [],
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
          title: "原料编码",
          key: "materialCode",
          width: 120
        },
        {
          title: "原料名称",
          key: "materialName",
          width: 120
        },
        {
          title: "日使用量",
          key: "dailyUsage",
          width: 120
        },
        {
          title: "加权成本平均价",
          key: "weightedAveragePrice",
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
          title: "创建时间",
          key: "createTime",
          width: 120
        },
        {
          title: "创建人",
          key: "createUserName",
          width: 120
        },
        {
          title: "提交时间",
          key: "commitTime",
          width: 120
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
          width: 100,
          render: (h, { row, column, index }) => {
            const arr = [];
            let edit = this.generateOptBtn(
              h,
              row,
              "primary",
              "编辑",
              this.edit
            );
            if(this.hasPermission('edit') && row.commitFlag == 0){
              arr.push(edit)
            }
            // arr.push(edit);
            return h("div", arr);
          }
        },
        {
          title: "备注",
          key: "remarks",
          fixed: "right",
          tooltip: true,
          width: 150
        }
      ],
      listData: {
        list: [],
        total: 0
      },
      vStore: {
        // 分页参数对象
        pageOptions: {
          pageNum: 1,
          pageSize: 10
        },
        // 列表查询对象
        queryParams: {
          pageNum: 1,
          pageSize: 10
        }
      }
    };
  },
  components: {
    MfbDataList,
    createItem,
  },
  deactivated() {},
  mixins: [listMixin],
  async mounted() {
    this.queryList(); // 分页
    let res = await commonService.getSelectorList({
      selectType: ['itemCode'],
      costTypeCode: 'PackagingMaterials'
    })
    if(res.code == 200) {
      this.costCode = res.result.itemCode || []
    }
  },
  methods: {
    // 选择大区
    selectRegion(val) {
      this.extraParams['regionCode'] = val
    },
    // 原料模糊搜索
    renderFormat(item) {
      return `${item.valueCode} - ${item.valueName}`
    },
    // 添加，编辑成功
    createSuccess() {
      this.formInfo = {
        dailyUsage: null
      }
      this.queryList()
    },
    onFuzzyQuerySelectChange(args, fieldKey) {
      const item = args[0]
      if (item) {
        // select change
        this.$set(this.vStore.queryParams, fieldKey, item.value)
      } else {
        // clear
        this.$set(this.vStore.queryParams, fieldKey, '')
      }
    },
    resultHandle(data, fun) {
      if(data.code == 200) {
        fun && fun.call(this, data)
      }else {
        this.$Message.error(data.message)
      }
    },
    async queryList() {
      let res = await getList(this.vStore.queryParams);
      if (res.code == 200) {
        this.listData = {
          total: res.result.totalCount,
          list: res.result.list || []
        };
      } else {
        this.$Message.error(res.message);
      }
    },
    // 参数重置
    handleReset() {
      this.vStore.queryParams = {
        pageNum: 1,
        pageSize: 10
      }
      this.vStore.pageOptions = {
          pageNum: 1,
          pageSize: 10
      }
      this.$refs['FuzzyQuery'].resetData()
    },

    fortmatTime(time = '', patten) {
      if(time) {
         time = moment(time).format(patten)
      }
      return time
    },

    formatParams() {
      this.vStore.queryParams.effectiveDateStartLeft = this.fortmatTime(this.vStore.queryParams.effectiveDateStartLeft, 'YYYY-MM-DD')
      this.vStore.queryParams.effectiveDateStartRight = this.fortmatTime(this.vStore.queryParams.effectiveDateStartRight, 'YYYY-MM-DD')

      this.vStore.queryParams.effectiveDateEndLeft = this.fortmatTime(this.vStore.queryParams.effectiveDateEndLeft, 'YYYY-MM-DD')
      this.vStore.queryParams.effectiveDateEndRight = this.fortmatTime(this.vStore.queryParams.effectiveDateEndRight, 'YYYY-MM-DD')

      this.vStore.queryParams.createTimeStart = this.fortmatTime(this.vStore.queryParams.createTimeStart, 'YYYY-MM-DD HH:mm:ss')
      this.vStore.queryParams.createTimeEnd = this.fortmatTime(this.vStore.queryParams.createTimeEnd, 'YYYY-MM-DD HH:mm:ss')

      this.vStore.queryParams.commitTimeStart = this.fortmatTime(this.vStore.queryParams.commitTimeStart, 'YYYY-MM-DD HH:mm:ss')
      this.vStore.queryParams.commitTimeEnd = this.fortmatTime(this.vStore.queryParams.commitTimeEnd, 'YYYY-MM-DD HH:mm:ss')
    },

    onQueryHandler() {
      this.vStore.queryParams.pageNum = 1
      this.ids = []
      this.formatParams()
      this.queryList();
    },

    add() {
      this.isShowModal = true
      this.type = 'add'
      this.formInfo = {
          regionCode: '',
          warehouseName: '',
          warehouseCode: '',
          merchantNo: '',
          costItemCode: '',
          adjustFlag: 0,
          effectiveDateStart: '',
          effectiveDateEnd: '',
          materialCode: '',
          materialName: '',
          weightedAveragePrice: '',
          dailyPrice: '',
          dailyUsage: null,
          remarks: '',
      }
    },

    async edit(data) {
      let res = await getDetail({
        id: data.id
      })
      this.resultHandle(res, (data)=>{
        this.isShowModal = true,
        this.type = 'edit'
        this.formInfo = data.result

      })
    },

    checkStatus(type ='del') {
      let status = true
      this.ids.map(item=>{
        if(item.status == 1) {
          status = false
        }else{
          if(type == 'del') {
            item.delFlag = 1
          }else{
            item.commitFlag = 1
          }
        }
        return item
      })
      return status
    },

    async del(data) {
      if(!this.ids.length) {
        this.$Message.error('请选择需要删除的数据')
        return
      }
      if(!this.checkStatus('del')) {
        this.$Message.error('仅支持新创建的费用数据删除')
        return
      }
      this.$Modal.confirm({
          title: '提示',
          content: `您将删除${this.ids.length}条费用数据请确认？`,
          okText: '确认',
          onOk: async() => {
              let res = await changeStatus(this.ids)
              // this.resultHandle(res, this.queryList)
              this.resultHandle(res, (res)=>{
                this.$Message.success('删除成功')
                this.queryList()
              })
          }
      });
      
    },

    onSelectionChange(value) {
      this.ids = value.map(item=>{
        return {
          id:item.id,
          status: item.commitFlag
        }
      })
    },
    exportFile() {
      let status = Object.keys(this.vStore.queryParams).filter(item=> item != 'pageSize' && item != 'pageNum').some(key=>{
        return this.vStore.queryParams[key]
      })
      if(status || this.ids.length) {
        let ids = this.ids.map(item=>item.id)
        const params = {
          ...this.vStore.queryParams,
          idList: ids
        }
        commonService.exportFlie('/cost-data/data/packagingMaterials/export', params, '大仓包材')
      }else{
        this.$Message.error("请选择条件导出或勾选数据导出");

      }
      
    },
    submit() {
      if(!this.ids.length) {
        this.$Message.error('请选择需要提交的数据')
        return
      }
      if(!this.checkStatus('submit')) {
        this.$Message.error('仅支持新创建的费用数据提交')
        return
      }
      // if(this.ids.length) {
      this.$Modal.confirm({
          title: '提示',
          content: `您将提交${this.ids.length}条大仓包材数据请确认？`,
          okText: '确认',
          onOk: async() => {
              let res = await changeStatus(this.ids)
              this.resultHandle(res, (res)=>{
                this.$Message.success('审核成功')
                this.queryList()
              })
          }
      });
      // }
    },
    onPageSizeChange (size) {
      this.isQueryParamsChange = false
      // 重置页码为1
      this.$set(this.vStore.pageOptions, 'pageNum', 1)
      this.$set(this.vStore.pageOptions, 'pageSize', size)
      this.vStore.queryParams.pageSize = size
      this.vStore.queryParams.pageNum = 1
      this.queryList()
    },

    // page change
    onPageChange (page) {
      this.isQueryParamsChange = false
      this.$set(this.vStore.pageOptions, 'pageNum', page)
      this.vStore.queryParams.pageNum = page
      this.queryList()
    },
  }
};
</script>
  <style lang="scss" scoped>
.btn_margin {
  margin-left: 10px;
}
</style>
  
  