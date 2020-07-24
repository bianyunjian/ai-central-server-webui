<template>
  <div>
    <el-container>
      <el-header style="padding-top:20px;">
        <el-row>
          <el-col :span="12">
            <div>
              <el-input v-model="tableQuery.name" suffix-icon="el-icon-search" 
                placeholder="请输入相机名称，enter键查询" clearable @keyup.enter.native="changePage(1)">
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align:right;">
              <el-button type="primary" icon="el-icon-plus" @click="addCamera">添加摄像头</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width:100%;">
          <el-table-column prop="id" label="编号" width="70"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="rtsp" label="RTSP地址"></el-table-column>
          <el-table-column prop="axCameraNumber" label="艾信匹配编号" width="120"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-link type="primary" @click="updateCamera(scope.row)" style="margin-right:10px;">修改</el-link>
              <el-link type="danger" @click="deleteCamera(scope.row)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <div style="text-align:left;">
          <el-pagination background layout="prev, pager, next" 
            :page-size="tablePage.pageSize" 
            :current-page.sync="tablePage.pageNum" 
            :total="tablePage.total" 
            @current-change="changePage">
          </el-pagination>
        </div>
      </el-footer>
    </el-container>

    <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" width="600px">
      <el-form :model="editForm" ref="cameraForm" :rules="editFormRules" label-width="120px">
        <el-form-item prop="name" label="摄像头名称">
          <el-input 
            v-model="editForm.name" 
            autocomplete="off" 
            placeholder="请输入摄像头名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rtsp" label="RTSP地址">
          <el-input 
            v-model="editForm.rtsp"
            autocomplete="off"
            type="textarea" :rows="2"
            placeholder="请输入RTSP格式的url连接地址"
          ></el-input>
        </el-form-item>
        <el-form-item prop="axCameraNumber" label="艾信匹配编号">
          <el-input-number style="width:100%;"
            v-model="editForm.axCameraNumber"
            placeholder="输入艾信指定对应编号"
            :min="1" :step="1"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="editForm.description"
            autocomplete="off"
            type="textarea" :rows="2"
            placeholder="摄像头相关描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button v-if="editDialog.type == 'add'" type="primary" @click="doAdd">提交</el-button>
        <el-button v-if="editDialog.type == 'update'" type="primary" @click="doUpdate">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cameraService from '@/api/camera'

export default {
  name: 'CameraManage',
  data() {
    var checkRtspFormat = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入内容'))
      }
      if (!value.startsWith('rtsp')) {
        return callback(new Error('URL请以rtsp开头'))
      }
      callback()
    };
    return {
      // 测试数据
      tableData: [{
        id: '1',
        name: 'camera1',
        rtsp: '',
        axCameraNumber: '1',
        description: '测试相机1'
      },{
        id: '2',
        name: 'camera2',
        rtsp: '',
        axCameraNumber: '3',
        description: '测试相机2'
      },{
        id: '3',
        name: 'camera3',
        rtsp: '',
        axCameraNumber: '2',
        description: '测试相机3'
      }],
      tableQuery: {
        name: ''
      },
      tablePage: {
        pageNum: 1,
        pageSize: 10,
        total: 100
      },
      editDialog: {
        visible: false,
        title: '',
        type: 'add' // 'add'或者'update'
      },
      editForm: {
        id: null,
        name: '',
        rtsp: '',
        axCameraNumber: '',
        description: ''
      },
      editFormRules: {
        name: [
          {required: true, message: '必填项', trigger: 'blur'}
        ],
        rtsp: [
          {required: true, message: '必填项', trigger: 'blur'},
          {validator: checkRtspFormat, trigger: 'blur'}
        ],
        axCameraNumber: [
          {required: true, message: '必填项', trigger: 'blur'}
        ]
      }
    }
  },
  mounted() {
    this.changePage(1)
  },
  computed: {},
  methods: {
    refreshTable() {
      let self = this
      let data = {
        pagedParams: {
          pageNum: self.tablePage.pageNum,
          pageSize: self.tablePage.pageSize
        },
        queryParams: {
          name: self.tableQuery.name
        }
      }
      cameraService.queryCamera(data).then(res => {
        if (res.errorCode == 0) {
          self.tableData = res.data.list
          self.tablePage.total = res.data.total
        }
      }).catch(err => {
        console.log('查询相机表出错,data='+JSON.stringify(data))
        console.log(err)
      })
    },
    changePage(page) {
      this.tablePage.pageNum = page
      this.refreshTable()
    },
    addCamera() {
      this.editDialog.title = '新增相机'
      this.editDialog.type = 'add'
      this.resetEditForm()
      this.editDialog.visible = true
    },
    updateCamera(row) {
      this.editDialog.title = '修改相机'
      this.editDialog.type = 'update'
      this.resetEditForm()
      this.editForm = {
        id: row.id,
        name: row.name,
        rtsp: row.rtsp,
        axCameraNumber: row.axCameraNumber,
        description: row.description
      }
      this.editDialog.visible = true
    },
    deleteCamera(row) {
      let self = this
      let message = '是否确定删除摄像机：'+row.name+' ?'
      this.$confirm(message, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        let data = {id: row.id}
        cameraService.deleteCamera(data).then(res => {
          if (res.status === 'SUCCESS') {
            self.$message({
              message: '删除摄像机成功!',
              type: 'success'
            })
            self.refreshTable()
          } else {
            self.showErrorMessage(res.errorCode)
          }
        })
      })
    },
    resetEditForm() {
      // 移除表单验证结果
      this.$nextTick(() => {
        this.$refs.cameraForm.clearValidate()
      })
      this.editForm = {
        id: null,
        name: '',
        rtsp: '',
        axCameraNumber: '',
        description: ''
      }
    },
    doAdd() {
      let self = this
      this.$refs['cameraForm'].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false
          let data = {
            name: self.editForm.name,
            rtsp: self.editForm.rtsp,
            axCameraNumber: self.editForm.axCameraNumber,
            description: self.editForm.description
          }
          cameraService.addCamera(data).then(res => {
            if (res.status === 'SUCCESS') {
              self.$message({
                message: '新增相机成功!',
                type: 'success'
              })
              self.refreshTable()
            } else {
              self.showErrorMessage(res.errorCode)
            }
          }).catch(err => {

          })
        } else {
          return false
        }
      })
    },
    doUpdate() {
      let self = this
      this.$refs['cameraForm'].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false
          let data = {
            id: self.editForm.id,
            name: self.editForm.name,
            rtsp: self.editForm.rtsp,
            axCameraNumber: self.editForm.axCameraNumber,
            description: self.editForm.description
          }
          cameraService.updateCamera(data).then(res => {
            if (res.status === 'SUCCESS') {
              self.$message({
                message: '修改相机成功!',
                type: 'success'
              })
              self.refreshTable()
            } else {
              self.showErrorMessage(res.errorCode)
            }
          }).catch(err => {

          })
        } else {
          return false
        }
      })
    },
    showErrorMessage(errorCode) {
      let message = '未知错误'
      if (errorCode != null) {
        switch (errorCode) {
          case 100101: 
            message = '相机数据不存在' 
            break
          case 100102:
            message = '相机数据已存在'
            break
          case 100103:
            message = '相机名称重复'
            break
          case 100104:
            message = '相机已关联设备'
            break
          default: message = '未知错误码：'+errorCode
        }
      }
      this.$message({
        message: message,
        type: 'warning'
      })
    }
  }
}
</script>
<style scoped>

</style>