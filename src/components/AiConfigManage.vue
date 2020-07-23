<template>
  <div>
    <el-container>
      <el-header style="padding-top:20px;">
        <el-row>
          <el-col :span="12">
            <div>
              <el-input v-model="tableQuery.name" suffix-icon="el-icon-search" 
                placeholder="请输入设备或摄像头名称，enter键查询" clearable @keyup.enter.native="changePage(1)">
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align:right;">
              <el-button type="primary" icon="el-icon-plus" @click="addConfig">添加配置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width:100%;">
          <el-table-column prop="id" label="编号" width="70"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="cameraName" label="摄像头名称"></el-table-column>
          <el-table-column prop="aiTypeArray" label="算法配置"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-link type="primary" @click="updateConfig(scope.row)" style="margin-right:10px;">修改</el-link>
              <el-link type="danger" @click="deleteConfig(scope.row)">删除</el-link>
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

    <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" width="360px">
      <el-form :model="editForm" ref="configForm" :rules="editFormRules" label-width="60px">
        <el-form-item prop="deviceId" label="设备">
          <el-select style="width:100%;"
            v-model="editForm.deviceId"
            placeholder="请选择"
            filterable
            :disabled="editDialog.type == 'update' ? true : false"
          >
            <el-option
              v-for="item in deviceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cameraId" label="摄像头">
          <el-select style="width:100%;"
            v-model="editForm.cameraId"
            placeholder="请选择"
            filterable
            :disabled="editDialog.type == 'update' ? true : false"
          >
            <el-option
              v-for="item in cameraList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="aiTypeArray" label="算法">
          <el-checkbox-group v-model="editForm.aiTypeArray" style="text-align:left;">
            <el-row>
              <el-col :span="11">
                <el-checkbox label="box" name="aiTypeArray"></el-checkbox>
              </el-col>
              <el-col :span="11">
                <el-checkbox label="face" name="aiTypeArray"></el-checkbox>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-checkbox label="person" name="aiTypeArray"></el-checkbox>
              </el-col>
              <el-col :span="11">
                <el-checkbox label="garbage" name="aiTypeArray"></el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
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
export default {
  name: 'AiConfigManage',
  data() {
    return {
      // 测试数据
      tableData: [{
        id: 1,
        deviceId: 1,
        deviceName: '测试001',
        cameraId: 1,
        cameraName: '黑石相机',
        aiTypeArray: 'person,garbage'
      },{
        id: 1,
        deviceId: 2,
        deviceName: '测试002',
        cameraId: 2,
        cameraName: '海康v87',
        aiTypeArray: 'box,face'
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
      // 表单
      editForm: {
        id: null,
        deviceId: null,
        cameraId: null,
        aiTypeArray: []
      },
      deviceList: [
        {value: 1, label: '测试设备001'},
        {value: 2, label: '测试设备002'}
      ],
      cameraList: [
        {value: 1, label: '黑石相机'},
        {value: 2, label: '海康v87'}
      ],
      aiList: [
        {value: 1, label: ''}
      ],
      editFormRules: {},
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
          //todo 这里需要增加名称参数
        }
      }
      // deviceService.queryDevice(data).then(res => {
      //   if (res.errorCode == 0) {
      //     self.tableData = res.data.list
      //     self.tablePage.total = res.data.total
      //   }
      // }).catch(err => {
      //   console.log('查询设备列表出错,data='+JSON.stringify(data))
      //   console.log(err)
      // })
    },
    changePage(page) {
      this.tablePage.pageNum = page
      this.refreshTable()
    },
    addConfig() {
      this.editDialog.title = '新增配置'
      this.editDialog.type = 'add'
      this.resetEditForm()
      this.editDialog.visible = true
    },
    updateConfig(row) {
      this.editDialog.title = '修改配置'
      this.editDialog.type = 'update'
      this.resetEditForm()
      let aiArray = row.aiTypeArray.split(',')
      this.editForm = {
        id: row.id,
        deviceId: row.deviceId,
        cameraId: row.cameraId,
        aiTypeArray: aiArray
      }
      console.log('edit Form ：')
      console.log(this.editForm)
      this.editDialog.visible = true
    },
    resetEditForm() {
      //todo 从后台获取未配置的设备与相机
      // 移除表单验证结果
      this.$nextTick(() => {
        this.$refs.configForm.clearValidate()
      })
      this.editForm = {
        id: null,
        deviceId: null,
        cameraId: null,
        aiTypeArray: []
      }
    },
    deleteConfig(row) {
      
      let self = this
      let message = '是否确定删除该配置？'
      this.$confirm(message, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        //todo
        alert('删除配置')
        // let data = {id: row.id}
        // deviceService.deleteDevice(data).then(res => {
        //   if (res.status === 'SUCCESS') {
        //     self.$message({
        //       message: '删除设备成功!',
        //       type: 'success'
        //     })
        //     self.refreshTable()
        //   } else {
        //     self.showErrorMessage(res.errorCode)
        //   }
        // }).catch(err => {
        //   console.log('删除设备出错,data='+JSON.stringify(data))
        //   console.log(err)
        // })
      })
    },
    doAdd() {
      //todo 
      alert('新增配置')
    },
    doUpdate() {
      //todo
      alert('修改配置')
    },
    showErrorMessage(errorCode) {
      //todo 修改对应错误码
      let message = '未知错误'
      if (errorCode != null) {
        switch (errorCode) {
          case 100201: 
            message = '设备数据不存在' 
            break
          case 100202:
            message = '设备名称重复'
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