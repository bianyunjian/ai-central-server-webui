<template>
  <div>
    <el-container>
      <el-header style="padding-top:20px;">
        <el-row>
          <el-col :span="12">
            <div>
              <el-input v-model="tableQuery.personName" suffix-icon="el-icon-search" 
                placeholder="请输入人员名称，enter键搜索" clearable @keyup.enter.native="changePage(1)">
              </el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align:right;">
              <el-button type="primary" icon="el-icon-plus" @click="addFace">注册人脸</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width:100%;">
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="人员名称"></el-table-column>
          <el-table-column prop="image" label="图片">
            <template slot-scope="scope">
              <el-image
                style="width:100px;height:100px;"
                :src="'data:image/png;base64,' + scope.row.image"
                fit="cover"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-link type="danger" @click="deleteFace(scope.row)">删除</el-link>
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

    <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" width="400px">
      <el-form :model="editForm" ref="faceForm" :rules="editFormRules" label-width="80px">
        <el-form-item prop="name" label="人员名称">
          <el-input 
            v-model="editForm.name" 
            autocomplete="off" 
            placeholder="请输入人员名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="image" label="人脸图片">
          <div class="" style="text-align:left;">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              action="#"
              :data="upload.data"
              :show-file-list="false"
              :on-change="onImageChange"
              :auto-upload="false"
              accept=".jpg, .jpeg, .png"
            >
              <img v-if="upload.imageUrl" :src="upload.imageUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog.visible = false">取消</el-button>
        <el-button v-if="editDialog.type == 'add'" type="primary" @click="doAdd">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import faceService from '@/api/face'

export default {
  name: 'FaceManage',
  data() {
    return {
      tableData: [{
        id: 1,
        name: '王军',
        faceFtrArray: [],
        image: '',
        phoneNum: '18344332223'
      },{
        id: 2,
        name: '李梅梅',
        faceFtrArray: [],
        image: '',
        phoneNum: '15122345543'
      }],
      tableQuery: {
        personName: ''
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
        name: '',
        image: '',
        phoneNum: ''
      },
      upload: {
        data: null,
        imageUrl: null
      },
      editFormRules: {
        name: [
          {required: true, message: '必填项', trigger: 'blur'}
        ],
        image: [
          {required: true, message: '请选择一个图片', trigger: 'blur'}
        ]
      },
    }
  },
  mounted() {
    this.changePage(1)
  },
  computed: {

  },
  methods: {
    refreshTable() {
      let self = this
      let data = {
        pagedParams: {
          pageNum: self.tablePage.pageNum,
          pageSize: self.tablePage.pageSize
        },
        queryParams: {
          personName: self.tableQuery.personName
        }
      }
      faceService.queryTable(data).then(res => {
        if (res.status === 'SUCCESS') {
          self.tableData = res.data.list
          self.tablePage.total = res.data.total
        } else {
          self.showErrorMessage(res.errorCode)
        }
      }).catch(err => {
        console.log('查询人脸数据出错,data='+JSON.stringify(data))
        console.log(err)
      })
    },
    changePage(page) {
      this.tablePage.pageNum = page
      this.refreshTable()
    },
    addFace() {
      this.editDialog.title = '注册人脸'
      this.editDialog.type = 'add'
      this.resetEditForm()
      this.editDialog.visible = true
    },
    resetEditForm() {
      // 移除表单验证结果
      this.$nextTick(() => {
        this.$refs.faceForm.clearValidate()
      })
      this.editForm = {
        id: null,
        name: '',
        image: '',
        phoneNum: ''
      }
      // 清除缓存图片
      this.upload = {
        data: null,
        imageUrl: null
      }
    },
    onImageChange(file) {
      let self = this
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = function(e) {
        console.log('读取base64图片')
        self.editForm.image = reader.result
        self.upload.imageUrl = reader.result
      }
      // this.upload.imageUrl = URL.createObjectURL(file.raw)
    },
    deleteFace(row) {
      let self = this
      let message = '是否确定删除该人脸？'
      this.$confirm(message, '请确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        let data = {id: row.id}
        faceService.deleteData(data).then(res => {
          if (res.status === 'SUCCESS') {
            self.$message({
              message: '删除人脸成功!',
              type: 'success'
            })
            self.refreshTable()
          } else {
            self.showErrorMessage(res.errorCode)
          }
        }).catch(err => {
          console.log('删除人脸出错,data='+JSON.stringify(data))
          console.log(err)
        })
      })
    },
    doAdd() {
      let self = this
      this.$refs['faceForm'].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false
          let base64 = self.editForm.image
          console.log(base64)
          let index = base64.indexOf('base64,')+7
          base64 = base64.substring(index)
          let data = {
            personName: self.editForm.name,
            image: base64,
            phoneNum: self.editForm.phoneNum
          }
          
          console.log(data)
          faceService.addData(data).then(res => {
            if (res.status === 'SUCCESS') {
              self.$message({
                message: '新增人脸成功!',
                type: 'success'
              })
              self.refreshTable()
            } else {
              self.showErrorMessage(res.errorCode)
            }
          }).catch(err => {
            console.log('新增人脸出错,data='+JSON.stringify(data))
            console.log(err)
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
          case 100401: 
            message = '人员数据不存在' 
            break
          case 100402:
            message = '人员名称重复'
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
<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>