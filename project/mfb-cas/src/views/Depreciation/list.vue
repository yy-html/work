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
            <Option v-for="(item,index) in costCode" 
            :value="item.selectCode" 
            :key="index">{{ item.selectName }}</Option>
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
        <!-- <Button type="primary" @click="exportExcel" >导出</Button> -->
        <Button type="primary" @click="handleReset">清空</Button>
      </div>
    </div>

    <div style="text-align:left;margin-bottom: 10px;">
      <Button v-if="hasPermission('add')" type="primary" @click="add">新增</Button>
      <Button v-if="hasPermission('del')" type="primary" @click="del" class="mgl10">删除</Button>
      <a v-if="hasPermission('model')" href="http://missfresh-gorilla-ops.cn-bj.ufileos.com/cas/大仓折旧模板.xlsx" download>
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
      :type="type" 
      :isShowModal.sync="isShowModal" 
      @success="queryList"
      :costCode="costCode"
      :regionList="regionList"
      :merchantList="merchantList"
      :formInfo.sync="formInfo"></createItem>
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
import { getList, del, getDetail, exportFile, importFile, submit } from "@/apis/baseData/depreciation";
import { listMixin } from "@/mixins/list.mixin";
import createItem from './createItem'
import commonService from "@/apis/common";
import apis from '@/apis/index'

export default {
  name: "DepreciationList",
  data() {
    return {
      url: apis['BASE_SETTING_DEPRECIATION'].import,
      type: "add",
      formInfo:{
        monthlyPrice: null
      },
      costCode: [],
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
          title: "月发生额",
          key: "monthlyPrice",
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
          width: 100,
          render: (h, { row, column, index })=> {
            const arr = []
            let edit = this.generateOptBtn(h, row, 'primary', '编辑', this.edit)
            if(this.hasPermission('edit') && row.commitFlag == 0){
              arr.push(edit)
            }
            return h("div", arr);
          }
        },{
            title: "备注",
            key: "remarks",
            fixed: "right",
            tooltip: true,
            width: 150,
          }
      ],
      listData: {
        list: [],
        total: 0
      },
      ids: [],
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
      costTypeCode: 'Depreciation'
    })
    if(res.code == 200) {
      this.costCode = res.result.itemCode || []
    }
  },
  methods: {
    resultHandle(data, fun) {
      if(data.code == 200) {
        fun && fun.call(this, data)
      }else {
        this.$Message.error(data.message)
      }
    },
    // 搜索
    async queryList() {
      let res = await getList(this.vStore.queryParams);
      if (res.code == 200) {
        if(res.result) {
          this.listData = {
            total: res.result.totalCount || 0,
            list: res.result.list || []
          };
        }
      } else {
        this.$Message.error(res.message);
      }
    },
    // 重置
    handleReset() {
      this.vStore.queryParams = {
        pageNum: 1,
        pageSize: 10
      }
      this.vStore.pageOptions = {
          pageNum: 1,
          pageSize: 10
      }
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
    // 搜索
    onQueryHandler() {
      this.vStore.queryParams.pageNum = 1
      this.ids = []
      this.formatParams()
      this.queryList();
    },
    onSelectionChange(value) {
      this.ids = value.map(item=>{
        return {
          id: item.id,
          status: item.commitFlag
        }
      })
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
          monthlyPrice: null,
          dailyPrice: '',
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
        // this.formInfo = {
        //   id: data.result.id,
        //   regionCode: data.result.regionCode,
        //   warehouseName: data.result.warehouseName,
        //   warehouseCode: data.result.warehouseCode,
        //   merchantNo: data.result.merchantNo,
        //   costItemCode: data.result.costItemCode,
        //   adjustFlag: data.result.adjustFlag,
        //   effectiveDateStart: data.result.effectiveDateStart,
        //   effectiveDateEnd: data.result.effectiveDateEnd,
        //   monthlyPrice: data.result.monthlyPrice,
        //   dailyPrice: data.result.dailyPrice,
        //   remarks: data.result.remarks,
        // }
      })
    },

    checkStatus() {
      return this.ids.every(item=>item.status == 0)
    },
    async del(data) {
      if(!this.ids.length) {
        this.$Message.error('请选择需要删除的数据')
        return
      }
      if(!this.checkStatus()) {
        this.$Message.error('仅支持新创建的费用数据删除')
        return
      }
      const ids = this.ids.map(item=>item.id)
      // if(this.ids.length) {
      this.$Modal.confirm({
          title: '提示',
          content: `您将删除${this.ids.length}条费用数据请确认？`,
          okText: '确认',
          onOk: async() => {
              let res = await del(ids)
              this.resultHandle(res, ()=>{
                this.$Message.success('删除成功')
                this.queryList()
                this.ids = []
              })
          }
      });
      // }
      
    },
    exportFile() {
      let status = Object.keys(this.vStore.queryParams).filter(item=> item != 'pageSize' && item != 'pageNum').some(key=>{
        return this.vStore.queryParams[key]
      })
      if(status || this.ids.length) {
         const params = {
          ...this.vStore.queryParams,
          idList: this.ids.map(item=>item.id)
        }
        commonService.exportFlie('/cost-data/data/depreciation/export', params, '大仓折旧')
      }else{
        this.$Message.error("请选择条件导出或勾选数据导出");
      }
     
    },

    submit() {
      if(!this.ids.length) {
        this.$Message.error('请选择需要提交的数据')
        return
      }
      if(!this.checkStatus()) {
        this.$Message.error('仅支持新创建的费用数据提交')
        return
      }
      const ids = this.ids.map(item=>item.id)
      // if(this.ids.length) {
        this.$Modal.confirm({
            title: '提示',
            content: `您将提交${this.ids.length}条大仓折旧数据请确认？`,
            okText: '确认',
            onOk: async() => {
                let res = await submit(ids)
                this.resultHandle(res, ()=>{
                  this.$Message.success('审核成功')
                  this.queryList()
                  this.ids = []
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
  
  