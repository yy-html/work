
<template>
  <div>
    <Spin fix v-show="loadingText">
      <Icon type="ios-loading" size=18 class="spin-icon-load" ></Icon>
      <div>{{loadingText}}</div>
    </Spin>
    <!-- 查询表单 -->
    <MfbPageTable>
      <div slot="queryForm">
        <Form inline :label-width="100">
          <FormItem label="所属大区">
            <Select placeholder="全部" v-model="vStore.queryParams.regionCode" clearable filterable>
              <Option v-for="item in regionList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
            </Select>
          </FormItem>
          <FormItem style="width:400px" label="承运方名称">
            <CASFuzzyQuerySelect :renderFormat="renderFormat" ref="CarrierFuzzySelectRef" queryKey="word" @on-change="onFuzzyQuerySelectChange(arguments, 'carrierId')" placeholder="请输入承运方名称" :remoteMethod="carrierRemoteMethod" keyName="name" valName="id" />
          </FormItem>
          <FormItem style="width:400px" label="纳税人识别号" >
            <CASFuzzyQuerySelect refName="TaxNoFuzzySelectRef" ref="TaxNoFuzzySelectRef"  queryKey="word" @on-change="onFuzzyQuerySelectChange(arguments, 'taxNo')" placeholder="请输入纳税人识别号" :remoteMethod="taxpayerRemoteMethod" keyName="name" valName="taxNo" />
          </FormItem>
          <FormItem label="收货城市">
            <Select placeholder="全部" v-model="vStore.queryParams.shipCityCode" clearable filterable>
              <Option v-for="item in shipCityList" :value="item.shipCityCode" :key="item.shipCityCode">{{ item.shipCityName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态">
            <Select placeholder="全部" v-model="vStore.queryParams.auditStatus" clearable>
              <Option v-for="item in statusList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="启用状态">
            <Select placeholder="全部" v-model="vStore.queryParams.enableFlag" clearable>
              <Option v-for="item in forbiddenStatusList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="创建时间" class="date-picker-container">
            <MfbDatePicker type="datetime" :query-params="vStore.queryParams" start-key="createDateBegin" end-key="createDateEnd" />
          </FormItem>
        </Form>
        <div class="query-buttons">
          <Button type="primary" @click="queryList">查询</Button>
          <Button type="primary" @click="onResetQueryParams">重置</Button>
        </div>
      </div>
      <div slot="table">
        <MfbDataList 
        :page-options="vStore.pageOptions" 
        :table-options="tableOptions" 
        :columns="columns" 
        :actions="tableActions" 
        :data="listData"
        @on-action-click="actionClick"
        @on-page-size-change="onPageSizeChange"
        @on-selection-change="onSelectionChange"
        @on-change="onPageChange" />
      </div>
    </MfbPageTable>

     <Modal 
      v-model="showModal" 
      footer-hide 
      :title="modalTitle" 
      :mask-closable="false" 
      @on-cancel="cancelSubmit"
      :closable="true">
      <Form style="padding-right:30px;" ref="NextDaySettingFormRef" :model="formBody" :label-width="120" :rules="formRules">
        <FormItem label="所属大区" prop="regionCode">
          <Select @on-change="onRegionChange" placeholder="全部" v-model="formBody.regionCode" filterable>
            <Option v-for="item in regionList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="承运方名称" prop="carrierId">
          <CASFuzzyQuerySelect ref="CarrierFuzzyQuerySelectRef" queryKey="word" @on-change="onCarrierChange" placeholder="请输入承运方名称" :extraParams="extraParams" :remoteMethod="carrierRemoteMethod" keyName="name" valName="id" />
        </FormItem>
        <FormItem label="纳税人识别号" prop="taxNo">
          <Input disabled type="text" clearable v-model.trim="formBody.taxNo"></Input>
        </FormItem>
        <FormItem label="收货城市" prop="shipCityCode">
          <Select ref="ShipCitySelectRef" multiple placeholder="全部" v-model="formBody.shipCityCode" clearable>
            <Option v-for="item in shipCityListForAdd" :value="item.shipCityCode" :key="item.shipCityCode">{{ item.shipCityName }}</Option>
          </Select>
        </FormItem>
        <div class="flex">
          <FormItem prop="avgPrice" label="平均单价">
            <InputNumber style="width:250px;" placeholder="请输入平均单价" v-model.trim="formBody.avgPrice" :min="0" :precision="4" :step="0.01" :max="1000000">
            </InputNumber>
          </FormItem>
          <div style="padding-left:12px;margin-top:10px;color:rgba(62,63,66,0.65);">元/单</div>
        </div>
      </Form>
      <div class="footer">
        <Button class="cancel-btn" type="default" @click="cancelSubmit">取消</Button>
        <Button type="primary" :loading="!!loadingText" @click="onSubmit">保存</Button>
      </div>
    </Modal>
    <Modal 
      v-model="showLogModal" 
      footer-hide 
      title="操作日志" 
      :width="750"
      :mask-closable="false" 
      :closable="true">
      <MfbDataList 
        :table-options="tableOptions"
        :show-page="false"
        :columns="logColumns" 
        :data="logData"/>
    </Modal>
    <Modal 
      title="审核不通过"
      :mask-closable="false" 
      :closable="false"
      :footer-hide="true" 
      v-model="showAuditRejectModal">
      <Form ref="AuditRejectFormRef" :model="auditRejectFormBody" :rules="auditRejectFormRules">
        <FormItem label="请输入审核不通过原因" prop="remark">
          <Input 
            v-model.trim="auditRejectFormBody.remark" 
            type="textarea" 
            :maxlength="80"
            :autosize="{minRows: 4}" 
            placeholder="请输入1~80个汉字" />
        </FormItem>
        <div class="footer">
          <Button class="cancel-btn" type="default" @click="onAuditRejectCancel">取消</Button>
          <Button type="primary" @click="onAuditRejectConfirm">确定</Button>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import apiService from '@/apis/baseSetting/next-day-setting'
import commonService from '@/apis/common'
import {listMixin} from '@/mixins/list.mixin'

export default {
  name: 'cas-basic-setting-next-dat-setting',
  data () {
    return {
      logData: {
        list: []
      },
      showAuditRejectModal: false,
      auditRejectFormBody: {},
      auditRejectFormRules: {
        remark: [
          { required: true, message: '请输入审核不通过原因' }
        ]
      },
      carrierRemoteMethod: commonService.getCarrierByName,
      taxpayerRemoteMethod: commonService.getTaxpayerByNo,
      getListService: apiService.getList,
      shipCityList: [],
      shipCityListForAdd: [],
      statusList: [],
      queryDateFormat: 'YYYY-MM-DD HH:mm:ss',
      showLogModal: false,
      showModal: false,
      modalTitle: '',
      formBody: {
        shipCityCode: []
      },
      extraParams: {},
      formRules: {
        regionCode: [
          { required: true, message: '请选择所属大区' }
        ],
        carrierId: [
          { required: true, message: '请输入承运方名称' }
        ],
        shipCityCode: [
          { required: true, message: '请选择收货城市' }
        ],
        taxNo: [
          { required: true, message: '纳税人识别号不能为空' }
        ],
        avgPrice: [
          { required: true, message: '请输入平均单价' }
        ]
      },
      actions: [
        {id: 'ADD', name: '新增',  type: 'primary', path: 'ADD'},
        {id: 'SUBMIT_AUDIT', name: '提交审核',  type: 'primary', path: 'SUBMIT_AUDIT'},
        {id: 'AUDIT_PASS', name: '审核通过',  type: 'primary', path: 'AUDIT_PASS'},
        {id: 'AUDIT_REJECT', name: '审核不通过',  type: 'primary', path: 'AUDIT_REJECT'},
        {id: 'RETURN_BACK', name: '回退为待提交',  type: 'primary', path: 'RETURN_BACK'},
      ],
      logColumns: [{
        type: 'index',
        title: '序号',
        width: 65,
      },{
        title: '操作人',
        key: 'operateUserName',
        width: 100
      },{
        title: '操作时间',
        width: 150,
        render: (h, params) => {
          const {createTime} = params.row
          if (!createTime) return h('div','')
          return h('div', this.moment(createTime).format('YYYY-MM-DD HH:mm:ss'))
        }
      }, {
        title: '操作内容',
        key: 'optValue',
        minWidth: 100
      }, {
        title: '备注',
        key: 'remark',
        minWidth: 100
      }],
      columns: [{
        type: 'selection',
        width: 45
      }, {
        type: 'index',
        title: '序号',
        width: 50,
      },{
        title: '规则编号',
        key: 'ruleCode',
        minWidth: 120
      },{
        title: '大区',
        key: 'regionName',
        minWidth: 90
      }, {
        title: '承运方名称',
        key: 'carrierName',
        minWidth: 120
      }, {
        title: '纳税人识别号',
        key: 'taxNo',
        minWidth: 140
      },{
        title: '收货城市',
        key: 'shipCityName',
        minWidth: 90
      }, {
        title: '平均单价（元/单）',
        key: 'avgPrice',
        minWidth: 120
      },{
        title: '启用状态',
        key: 'enableFlagName',
        minWidth: 80
      },{
        title: '状态',
        key: 'auditStatusName',
        minWidth: 80
      }, {
        title: '创建时间',
        width: 150,
        render: (h, params) => {
          const {createTime} = params.row
          if (!createTime) return h('div','')
          return h('div', this.moment(createTime).format('YYYY-MM-DD HH:mm:ss'))
        }
      }, {
        title: '操作',
        key: 'action',
        width: 80,
        fixed: 'right',
        render: (h, params) => {
          // 0 待提交  1 待审核 2 审核不通过  3 审核通过
          let self = this 
          const { id, enableFlag, auditStatus} = params.row
          // 待提交 || 审核不通过
          let edit = self.generateOptBtn(h, id, 'primary', '编辑', self.editHander)
          // 审核通过 & 已禁用
          let restart = self.generateOptBtn(h, {type: 'start', id}, 'primary', '启用', self.updateStatus)
          // 审核通过 & 已启用
          let forbid = self.generateOptBtn(h, {type: 'forbid', id}, 'primary', '禁用', self.updateStatus)
          let opts = []
          if (this.hasPermission('EDIT_BTN') && (auditStatus==0 || auditStatus==2)) {
            opts.push(edit)
          }
          if (this.hasPermission('FORBID_BTN') && (enableFlag==0 && auditStatus==3)) {
            opts.push(forbid)
          } 
          if (this.hasPermission('START_BTN') && (enableFlag==1 && auditStatus==3)) {
            opts.push(restart)
          }
          return h('div', opts)
        }
      }, {
        title: '日志',
        key: 'action',
        width: 80,
        fixed: 'right',
        render: (h, params) => {
          let self = this 
          const { id, status} = params.row
          let lookupLog = self.generateOptBtn(h, id, 'primary', '查看', self.lookupLogHandler)
          let opts = []
          if (this.hasPermission('LOOK_UP_LOG_BTN')) {
            opts.push(lookupLog)
          }
          return h('div', opts)
        }
      }]
    }
  },
  mixins: [listMixin],
  created () {
    this.getShipCityList()
    this.getStatusList()
    this.queryList()
  },
  methods: {
    renderFormat(item) {
      return `${item.regionName}_${item.name}`
    },
    resetAuditRejectFields() {
      this.$refs['AuditRejectFormRef'].resetFields()
      this.auditRejectFormBody = {}
    },
    onResetQueryParams() {
      this.$refs.CarrierFuzzySelectRef.resetData()
      this.$refs.TaxNoFuzzySelectRef.resetData()
      this.resetQueryParams()
    },
    getStatusList() {
      commonService.getSelectorList({selectType:['odRuleAuditStatus']}).then (res => {
        if (res.code == 200) {
          const {odRuleAuditStatus} = res.result
          this.statusList = odRuleAuditStatus || []
        }
      })
    },
    onAuditRejectCancel() {
      this.resetAuditRejectFields()
      this.showAuditRejectModal = false
    },
    onAuditRejectConfirm() {
      this.$refs.AuditRejectFormRef.validate(valid => {
        if (valid) {
          apiService.auditReject(this.auditRejectFormBody).then(res => {
            if (res.code == 200) {
              this.showAuditRejectModal = false
              this.resetAuditRejectFields()
              this.resetSelectionChange()
              this.queryList()
              this.$Message.success(`执行审核不通过操作成功`)
            } else {
              this.$Message.error(res.message)
            }
            this.loadingText = ''
          })
        }
      })
    },
    onRegionChange(regionCode) {
      // 清空承运方和收货城市
      this.$refs.CarrierFuzzyQuerySelectRef.resetData()
      this.$set(this.formBody, 'carrierId', '')
      this.$set(this.formBody, 'taxNo', '')
      this.$set(this.formBody, 'shipCityCode', [])
      this.shipCityListForAdd = []
      this.extraParams = {}
      if (regionCode) {
        this.extraParams.regionCode = regionCode
      }
    },
    onCarrierChange(item, originalItem) {
      if (item) {
        // 重新获取收货城市
        const carrierId = item.value
        this.$set(this.formBody, 'carrierId', carrierId)
        this.$set(this.formBody, 'taxNo', originalItem.taxNo)
        this.getShipCityList(carrierId)
      } else {
        // 收货城市
        this.$set(this.formBody, 'shipCityCode', [])
        this.$set(this.formBody, 'taxNo', '')
        this.shipCityListForAdd == []
      }
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
    getShipCityList (carrierId) {
      // 收货城市
      const data = {
        pageSize: 10000
      }
      if (carrierId) {
        data.carrierId = carrierId
      }
      apiService.getShipCityList(data).then(res => {
        if (res.code == 200) {
          const list = res.result
          if (Array.isArray(list)) {
            if (carrierId) {
              this.shipCityListForAdd = list
            } else {
              this.shipCityList = list
            }
          }
        }
      })
    },
    cancelSubmit() {
      this.showModal = false
      this.resetFields()
    },
    editHander(id) {
      apiService.detail({id}).then(res => {
        if (res.code == 200) {
          const data = res.result
          if (Array.isArray(data.carrierItems)) {
            const defaultVal = data.carrierItems.filter(item=>item.id==data.carrierId)
            this.$refs.CarrierFuzzyQuerySelectRef.setDefaultVal(defaultVal)
          }
          this.shipCityListForAdd = data.shipCityItems
          this.formBody = data
          if (typeof data.shipCityCode === 'string') {
            this.formBody.shipCityCode = data.shipCityCode.split(",")
          }
          this.modalTitle = '更新规则'
          this.showModal = true
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    // 更新状态 ： 启用、禁用
    updateStatus(params) {
      let optName = ""
      let handler = null
      const {id, type} = params
      if (type=='start') {
        optName = '启用'
        handler = apiService.start
      } else if (type=='forbid') {
        optName = '禁用'
        handler = apiService.forbid
      }
      this.$Modal.confirm({
        onOk: () => {
          handler.call(null, {id}).then(res => {
            if (res.code == 200) {
              this.$Message.success(`执行${optName}操作成功`);
              this.queryList();
            } else {
              this.$Message.error(res.message)
            }
          });
        },
        content: `<p>点击确定按钮后规则将被${optName}，请确认</p>`,
        title: `${optName}`,
        onCancel:()=>{}
      });
    },
    // 批量更新状态： 提交审核、审核通过
    batchUpdateStatus(params) {
      let optName = ""
      let handler = null
      const {ids, type} = params
      if (type=='submit_audit') {
        optName = '提交审核'
        handler = apiService.submitAudit
      } else if (type=='audit_pass') {
        optName = '审核通过'
        handler = apiService.auditPass
      } else if (type=='return_back') {
        optName = '回退为待提交'
        handler = apiService.returnBack
      }
      this.$Modal.confirm({
        onOk: () => {
          handler.call(null, {ids}).then(res => {
            if (res.code == 200) {
              this.$Message.success(`执行${optName}操作成功`);
              this.resetSelectionChange()
              this.queryList();
            } else {
              this.$Message.error(res.message)
            }
          });
        },
        content: `<p>点击确定按钮后信息将被${optName}，请确认</p>`,
        title: `${optName}`,
        onCancel:()=>{}
      });
    },
    lookupLogHandler(businessNo) {
      apiService.lookUpLog({businessNo}).then(res => {
        if (res.code == 200) {
          const list = res.result
          if (Array.isArray(list)) {
            this.logData.list = list
            this.showLogModal = true
          }
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    onSubmit () {
      this.$refs.NextDaySettingFormRef.validate(valid => {
        if (valid) {
          this.loadingText = `正在${this.modalTitle}`
          let saveHandler = apiService.add
          const {carrierId, shipCityCode, avgPrice, id} = this.formBody
          const data = {carrierId, shipCityCode, avgPrice}
          if (typeof id !== 'undefined') {
            saveHandler = apiService.save
            data.id = id
          }
          saveHandler.call(null, data).then(res => {
            if (res.code == 200) {
              this.showModal = false
              this.resetFields()
              this.queryList()
              this.$Message.success(`${this.modalTitle}成功`)
            } else {
              this.$Message.error(res.message)
            }
            this.loadingText = ''
          })
        }
      })
    },
    resetFields() {
      this.$refs.NextDaySettingFormRef.resetFields()
      this.$refs.CarrierFuzzyQuerySelectRef.resetData()
      this.$refs.ShipCitySelectRef.clearSingleSelect()
      this.formBody = {}
    },
    actionClick (item) {
      if (item.id === 'ADD') {
        if (!this.regionList.length) {
          this.getEnumList()
        }
        this.resetFields()       
        this.$set(this.formBody, 'avgPrice', null) 
        this.modalTitle = '新增规则'
        this.showModal = true
      } else {
        const selectionDataLen = this.selectionData.length
        if (!selectionDataLen) {
          this.$Message.error('请选择需要操作的数据！')
          return
        }
        if (item.id === 'SUBMIT_AUDIT') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=0)
          if (invalideList.length) {
            this.$Message.error('仅支持待提交状态规则提交审核')
            return
          }
          const params = {
            type: 'submit_audit',
            ids: this.selectionData.map(item=>item.id)
          }
          this.batchUpdateStatus(params)
        } else if (item.id === 'AUDIT_PASS') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=1)
          if (invalideList.length) {
            this.$Message.error('仅支持待审核状态规则审核通过')
            return
          }
          const params = {
            type: 'audit_pass',
            ids: this.selectionData.map(item=>item.id)
          }
          this.batchUpdateStatus(params)
        } else if (item.id === 'AUDIT_REJECT') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=1)
          if (invalideList.length) {
            this.$Message.error('仅支持待审核状态规则审核不通过')
            return
          }
          this.showAuditRejectModal = true
          this.auditRejectFormBody.ids = this.selectionData.map(item=>item.id)
        } else if (item.id === 'RETURN_BACK') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=3)
          if (invalideList.length) {
            this.$Message.error('仅支持审核通过状态规则回退为待提交')
            return
          }
          const params = {
            type: 'return_back',
            ids: this.selectionData.map(item=>item.id)
          }
          this.batchUpdateStatus(params)
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 45px;

  .cancel-btn {
    margin-right: 24px;
  }
}
</style>