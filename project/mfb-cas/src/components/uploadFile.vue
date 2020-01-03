<template>
    <Modal
      :title="title"
      :value="isShowModal"
      footer-hide
      :mask-closable="false"
      @on-visible-change="change"
    >
      <Form :label-width="100">
        <FormItem style="text-align:left;" label="数据上传:" prop="typeStatus">
            <Upload
                ref="upload"
                :multiple="false"
                :with-credentials="false"
                accept=".xlsx, .xls"
                :headers="headers"
                :before-upload="beforeUpload"
                action="//jsonplaceholder.typicode.com/posts/">
                <div v-if="fileName"> {{fileName}}</div>
                <Button icon="ios-cloud-upload-outline">选择文件</Button>
            </Upload>
        </FormItem>
          <Button
            type="primary"
            @click="toSubmit()"
          >文件上传</Button>
      </Form>
    </Modal>
</template>
<script>
// import {updateType, addType} from 'service/work/orderConfiguration'
// import {statusList} from '../config/base'
import { uploadFile } from '@/apis/common'
import axios from 'axios'
export default {
    name: 'uploadFile',
    props:{
        title:{
            default: '文件上传'
        },
        isShowModal:{
            type: Boolean,
            default: false
        },
        filename: {
            type: String,
            default: '错误文件'
        },
        url: {
            type: String,
            default: ''
        }
    },
    data(){
        return {
            headers: {
                Authorization: this.$store.state.user.accessToken
            },
            fileName: '',
            file: null,
        }
    },
    methods:{
        exportFile( option={filename: filename ='错误文件'}) {
            let blob = new Blob([option.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'});
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = option.filename + ".xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        beforeUpload(file) {
            this.file = file
            this.fileName = file.name
            return false
        },
        change(status) {
            if(!status) {
                this.fileName = ''
                this.file = null
                this.$emit('update:isShowModal', false)
            }
        },
        async toSubmit() {
            if(!this.file) {
                this.$Message.error('请选择文件')
                return
            }
            if(!this.url) return
            let formData = new FormData()
            formData.append('file', this.file)
            formData.append('type', '1')
            let res = await uploadFile(this.url, formData)
            // console.log(res)
            if(res.code == 200) {
                if(res.result instanceof Blob) {
                    this.$Message.error('文件上传失败，错误模板已下载到本地。')
                    this.exportFile({
                        data: res.result,
                        filename: this.filename
                    })
                }else {
                    this.$Message.success(res.message || '文件上传成功！')
                    this.$emit('success')
                    this.change(false)
                    // this.$Modal.success({
                    //     title: '提示',
                    //     content: res.message || '文件上传成功！',
                    //     onOk: () => {
                    //         this.$emit('succces')
                    //         this.change(false)
                    //     }
                    // });
                }
                
            }else{
                this.$Modal.error({
                    title: '提示',
                    content: res.message || '文件上传失败！',
                    okText: '确定'
                });
            }         
        }
    },
}
</script>
<style lang="scss" scoped>
    /deep/ .ivu-modal-body{
        text-align: center;
    }
</style>