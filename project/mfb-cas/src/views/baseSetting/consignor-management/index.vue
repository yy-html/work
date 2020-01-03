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
          <FormItem label="所属大区" :model="vStore.queryParams">
            <Select placeholder="全部" v-model="vStore.queryParams.regionCode" clearable filterable>
              <Option v-for="item in regionList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="货主名称">
            <Input type="text" clearable v-model.trim="vStore.queryParams.merchantNameLike" placeholder="请输入货主名称"></Input>
          </FormItem>       
          <FormItem label="状态">
            <Select placeholder="全部" v-model="vStore.queryParams.auditStatus" clearable>
              <Option v-for="item in statusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="启用状态">
            <Select placeholder="全部" v-model="vStore.queryParams.enableFlag" clearable>
              <Option v-for="item in forbiddenStatusList" :value="item.selectCode" :key="item.selectCode">{{ item.selectName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="创建时间" class="date-picker-container">
            <MfbDatePicker type="datetime" :query-params="vStore.queryParams" start-key="createTimeStart" end-key="createTimeEnd" />
          </FormItem>
        </Form>
        <div class="query-buttons">
          <Button type="primary" @click="queryList">查询</Button>
          <Button type="primary" @click="resetQueryParams">重置</Button>
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
      <Form style="padding-right:12px;" ref="ConsignorFormRef" :model="formBody" :label-width="100" :rules="formRules">
        <!-- <FormItem label="货主名称" prop="merchantName">
          <Input type="text" clearable v-model.trim="formBody.merchantName" placeholder="请输入货主名称"></Input>
        </FormItem> -->
        <FormItem label="货主名称" prop="merchantName">
          <CASFuzzyQuerySelect  
            :disabled="!!(formBody&&formBody.merchantItemId)" 
            ref="ConsignorFuzzyQuerySelectRef" 
            queryKey="merchantNameLike" 
            :persistQuery="true"
            @on-change="onConsignorChange" 
            placeholder="请输入货主名称" 
            :remoteMethod="consignorRemoteMethod" 
            keyName="merchantName" 
            valName="merchantNo"
            :renderFormat="renderFormat" />
        </FormItem>

        <FormItem label="所属大区">
          <CheckboxGroup v-model="formBody.regionList" >
            <Checkbox v-for="item in regionListForSave" :key="item.selectCode" :label="item.selectCode">{{item.selectName}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
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
import apiService from '@/apis/baseSetting/consignor'
import commonService from '@/apis/common'
import {listMixin} from '@/mixins/list.mixin'

export default {
  name: 'cas-basic-setting-consignor',
  data () {
    const validateMerchantName = (rule, value, callback) => {
      const {merchantName} = this.formBody
      const maxLen = 20
      if (!merchantName) {
        callback('请选择货主名称')
      } else if (merchantName.length>maxLen) {
        callback(`货主名称最大长度为${maxLen}`)
      } else {
        callback()
      }
    }
    return {
      logData: {
        list: []
      },
      consignorRemoteMethod: apiService.getConsignorByName,
      showAuditRejectModal: false,
      auditRejectFormBody: {},
      auditRejectFormRules: {
        remark: [
          { required: true, message: '请输入审核不通过原因' }
        ]
      },
      getListService: apiService.getList,
      shipCityList: [],
      shipCityListForAdd: [],
      statusList: [],
      regionListForSave: [],
      showLogModal: false,
      queryDateFormat: 'YYYY-MM-DD HH:mm:ss',
      showModal: false,
      modalTitle: '',
      formBody: {},
      extraParams: {},
      formRules: {
        merchantName: [
          { required: true, validator: validateMerchantName }
        ]
      },
      actions: [
        {id: 'ADD', name: '新增',  type: 'primary', path: 'ADD'},
        {id: 'SUBMIT_AUDIT', name: '提交审核',  type: 'primary', path: 'SUBMIT_AUDIT'},
        {id: 'AUDIT_PASS', name: '审核通过',  type: 'primary', path: 'AUDIT_PASS'},
        {id: 'AUDIT_REJECT', name: '审核不通过',  type: 'primary', path: 'AUDIT_REJECT'},
        {id: 'RETURN_BACK', name: '回退为待提交',  type: 'primary', path: 'RETURN_BACK'}
      ],
      logColumns: [{
        type: 'index',
        title: '序号',
        width: 60,
      },{
        title: '操作人',
        key: 'operateUserName',
        width: 100
      },{
        title: '操作时间',
        key: 'createTimeDisplay',
        width: 150
      }, {
        title: '操作内容',
        key: 'operateType',
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
        title: '货主编号',
        key: 'merchantNo',
        minWidth: 80
      }, {
        title: '货主名称',
        key: 'merchantName',
        minWidth: 150
      },{
        title: '所属大区',
        key: 'regionName',
        minWidth: 110
      }, {
        title: '启用状态',
        key: 'enableFlagName',
        minWidth: 80
      }, {
        title: '状态',
        key: 'auditStatusName',
        minWidth: 80
      }, {
        title: '创建时间',
        key: 'createTime',
        width: 150
      }, {
        title: '操作',
        key: 'action',
        width: 80,
        fixed: 'right',
        render: (h, params) => {
          let self = this 
          const { merchantItemId, enableFlag, auditStatus} = params.row
          // 待提交 || 审核不通过
          let edit = self.generateOptBtn(h, merchantItemId, 'primary', '编辑', self.editHander)
          // 审核通过 & 已禁用
          let restart = self.generateOptBtn(h,  {operator: 4, merchantItemIdList: [merchantItemId]}, 'primary', '启用', self.batchUpdateStatus)
          // 审核通过 & 已启用
          let forbid = self.generateOptBtn(h, {operator: 5, merchantItemIdList: [merchantItemId]}, 'primary', '禁用', self.batchUpdateStatus)
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
          const { merchantItemId, status} = params.row
          let lookupLog = self.generateOptBtn(h, merchantItemId, 'primary', '查看', self.lookupLogHandler)
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
    this.getStatusList()
    this.queryList()
  },
  methods: {
    resetAuditRejectFields() {
      this.$refs['AuditRejectFormRef'].resetFields()
      this.auditRejectFormBody = {}
    },
    renderFormat(item) {
      return item.merchantName
    },
    onConsignorChange(item, originalItem) {
      if (item) {
        this.$set(this.formBody, 'merchantName', item.label)
      } else {
        this.$set(this.formBody, 'merchantName', '')
      }
    },
    onAuditRejectCancel() {
      this.resetAuditRejectFields()
      this.showAuditRejectModal = false
    },
    onAuditRejectConfirm() {
      this.$refs.AuditRejectFormRef.validate(valid => {
        if (valid) {
          apiService.updateStatus({...this.auditRejectFormBody, operator:2}).then(res => {
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
          }).catch(() => {
            this.loadingText = ''
          })
        }
      })
    },
    cancelSubmit() {
      this.showModal = false
      this.resetFields()
    },
    editHander(merchantItemId) {
      apiService.detail({merchantItemId}).then(res => {
        if (res.code == 200) {
          this.ensureData()
          const data = res.result
          this.formBody = data
          const {regionCode, regionName} = data
          this.formBody.regionList = [regionCode]
          // 编辑的时候 只能操作当前记录所对应的大区 
          this.regionListForSave = [{selectCode:regionCode,selectName:regionName}]
          this.$refs.ConsignorFuzzyQuerySelectRef.setDefaultVal([{
            merchantName: data.merchantName,
            merchantNo: data.merchantNo
          }])
          this.modalTitle = '更新货主'
          this.showModal = true
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    // 批量更新状态：  operator 1 提交审核 2 审核通过 3 审核不通过 4 启用 5 停用
    batchUpdateStatus(params) {
      let handler = null
      const {operator} = params
      let optName = ""
      if (operator==1) {
        optName = '提交审核'
      } else if (operator==3) {
        optName = '审核通过'
      } else if (operator==4) {
        optName = '启用'
      } else if (operator==5) {
        optName = '禁用'
      } else if (operator==6) {
        optName = '回退为待提交'
      }
      this.$Modal.confirm({
        onOk: () => {
          apiService.updateStatus(params).then(res => {
            if (res.code == 200) {
              this.$Message.success(`执行${optName}操作成功`);
              this.resetSelectionChange()
              this.queryList();
            } else {
              this.$Message.error(res.message)
            }
          })
        },
        content: `<p>点击确定按钮后信息将被${optName}，请确认</p>`,
        title: `${optName}`,
        onCancel:()=>{}
      })
    },
    lookupLogHandler(merchantItemId) {
      apiService.lookUpLog({merchantItemId}).then(res => {
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
    getStatusList() {
      // 状态
      apiService.getStatusList({enumType: '1'}).then (res => {
        if (res.code == 200) {
          this.statusList = res.result
        }
      })
    },
    onSubmit () {
      this.$refs.ConsignorFormRef.validate(valid => {
        if (valid) {
          this.loadingText = `正在${this.modalTitle}`
          let saveHandler = apiService.add
          const {merchantName, regionList, merchantItemId} = this.formBody
          const data = {merchantName, regionList}
          if (typeof merchantItemId !== 'undefined') {
            saveHandler = apiService.save
            data.merchantItemId = merchantItemId
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
      this.$refs['ConsignorFormRef'].resetFields()
      this.$refs.ConsignorFuzzyQuerySelectRef.resetData()
      this.formBody = {}
    },
    ensureData() {
      if (!this.regionList.length) {
        this.getEnumList()
      }
    },
    actionClick (item) {
      if (item.id === 'ADD') {
        this.ensureData()
        // 添加的时候可以选择 有权限的所有大区
        this.regionListForSave = this.regionList
        this.modalTitle = '新增货主'
        this.showModal = true
        this.resetFields()        
      } else {
        const selectionDataLen = this.selectionData.length
        if (!selectionDataLen) {
          this.$Message.error('请选择需要操作的数据！')
          return
        }
        if (item.id === 'SUBMIT_AUDIT') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=0)
          if (invalideList.length) {
            this.$Message.error('仅支持待提交状态货主提交审核')
            return
          }
          const params = {
            operator: 1,
            merchantItemIdList: this.selectionData.map(item=>item.merchantItemId)
          }
          this.batchUpdateStatus(params)
        } else if (item.id === 'AUDIT_PASS') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=1)
          if (invalideList.length) {
            this.$Message.error('仅支持待审核状态货主审核通过')
            return
          }
          const params = {
            operator: 3,
            merchantItemIdList: this.selectionData.map(item=>item.merchantItemId)
          }
          this.batchUpdateStatus(params)
        } else if (item.id === 'AUDIT_REJECT') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=1)
          if (invalideList.length) {
            this.$Message.error('仅支持待审核状态货主审核不通过')
            return
          }
          this.showAuditRejectModal = true
          this.auditRejectFormBody.merchantItemIdList = this.selectionData.map(item=>item.merchantItemId)
          this.auditRejectFormBody.operator = 3
        } else if (item.id === 'RETURN_BACK') {
          const invalideList = this.selectionData.filter(item=>item.auditStatus!=3)
          if (invalideList.length) {
            this.$Message.error('仅支持审核通过状态货主回退为待提交')
            return
          }
          const params = {
            operator: 6,
            merchantItemIdList: this.selectionData.map(item=>item.merchantItemId)
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