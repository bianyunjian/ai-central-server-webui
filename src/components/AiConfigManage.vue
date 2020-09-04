<template>
  <div>
    <el-container>
      <el-header style="padding-top:20px;">
        <el-row>
          <el-col :span="12">
            <div>
              <el-input
                v-model="tableQuery.name"
                suffix-icon="el-icon-search"
                placeholder="请输入设备或摄像头名称，enter键查询"
                clearable
                @keyup.enter.native="changePage(1)"
              ></el-input>
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
          <!-- <el-table-column prop="id" label="编号" width="70"></el-table-column> -->
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
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="tablePage.pageSize"
            :current-page.sync="tablePage.pageNum"
            :total="tablePage.total"
            @current-change="changePage"
          ></el-pagination>
        </div>
      </el-footer>
    </el-container>

    <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" width="380px">
      <el-form :model="editForm" ref="configForm" :rules="editFormRules" label-width="80px">
        <el-form-item prop="deviceId" label="设备">
          <el-select
            style="width:100%;"
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
          <el-select
            style="width:100%;"
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
              <el-col :span="10">
                <el-checkbox label="box" name="aiTypeArray"></el-checkbox>
              </el-col>
              <el-col :span="2">
                <el-tooltip style="font-size:13px;"
                  class="item"
                  effect="dark"
                  content="周转箱检测"
                  placement="top-start"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-col>

              <el-col :span="10">
                <el-checkbox label="face" name="aiTypeArray"></el-checkbox>
              </el-col>
              <el-col :span="2">
                <el-tooltip style="font-size:13px;"
                  class="item"
                  effect="dark"
                  content="人脸识别"
                  placement="top-start"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-checkbox label="person" name="aiTypeArray"></el-checkbox>
              </el-col>
              <el-col :span="2">
                <el-tooltip style="font-size:13px;"
                  class="item"
                  effect="dark"
                  content="人员检测"
                  placement="top-start"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-col>
              <el-col :span="10">
                <el-checkbox label="garbage" name="aiTypeArray"></el-checkbox>
              </el-col>
              <el-col :span="2">
                <el-tooltip style="font-size:13px;"
                  class="item"
                  effect="dark"
                  content="垃圾检测"
                  placement="top-start"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-checkbox label="clothing" name="aiTypeArray"></el-checkbox>
              </el-col>
              <el-col :span="2">
                <el-tooltip style="font-size:13px;"
                  class="item"
                  effect="dark"
                  content="被服检测"
                  placement="top-start"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
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
import configService from "@/api/aiConfig";

export default {
  name: "AiConfigManage",
  data() {
    return {
      // 测试数据
      tableData: [
        {
          id: 1,
          deviceId: 1,
          deviceName: "测试001",
          cameraId: 1,
          cameraName: "黑石相机",
          aiTypeArray: "person,garbage",
        },
        {
          id: 1,
          deviceId: 2,
          deviceName: "测试002",
          cameraId: 2,
          cameraName: "海康v87",
          aiTypeArray: "box,face",
        },
      ],
      tableQuery: {
        name: "",
      },
      tablePage: {
        pageNum: 1,
        pageSize: 10,
        total: 100,
      },
      editDialog: {
        visible: false,
        title: "",
        type: "add", // 'add'或者'update'
      },
      // 表单
      editForm: {
        id: null,
        deviceId: null,
        cameraId: null,
        aiTypeArray: [],
      },
      deviceList: [
        { value: 1, label: "测试设备001" },
        { value: 2, label: "测试设备002" },
      ],
      cameraList: [
        { value: 1, label: "黑石相机" },
        { value: 2, label: "海康v87" },
      ],
      aiList: [{ value: 1, label: "" }],
      editFormRules: {
        deviceId: [{ required: true, message: "必选项", trigger: "change" }],
        cameraId: [{ required: true, message: "必选项", trigger: "change" }],
        aiTypeArray: [{ required: true, message: "必选项", trigger: "change" }],
      },
    };
  },
  mounted() {
    this.changePage(1);
  },
  computed: {},
  methods: {
    refreshTable() {
      let self = this;
      let data = {
        pagedParams: {
          pageNum: self.tablePage.pageNum,
          pageSize: self.tablePage.pageSize,
        },
        queryParams: {
          name: self.tableQuery.name,
        },
      };
      configService
        .queryTable(data)
        .then((res) => {
          if (res.errorCode == 0) {
            self.tableData = res.data.list;
            self.tablePage.total = res.data.total;
          }
        })
        .catch((err) => {
          console.log("查询算法配置列表出错,data=" + JSON.stringify(data));
          console.log(err);
        });
    },
    changePage(page) {
      this.tablePage.pageNum = page;
      this.refreshTable();
    },
    addConfig() {
      // 从后台获取未配置的设备与相机
      let self = this;
      configService
        .getFormData()
        .then((res) => {
          if (res.status === "SUCCESS") {
            console.log("获取下拉列表成功");
            self.deviceList = res.data.deviceOptions;
            self.cameraList = res.data.cameraOptions;
            // 打开界面
            this.editDialog.title = "新增配置";
            this.editDialog.type = "add";
            this.resetEditForm();
            this.editDialog.visible = true;
          } else {
            self.showErrorMessage(res.errorCode);
          }
        })
        .catch((err) => {
          console.log("获取设备与相机下拉选出错");
          console.log(err);
        });
    },
    updateConfig(row) {
      this.editDialog.title = "修改配置";
      this.editDialog.type = "update";
      this.deviceList = [{ value: row.deviceId, label: row.deviceName }];
      this.cameraList = [{ value: row.cameraId, label: row.cameraName }];
      this.resetEditForm();
      let aiArray = row.aiTypeArray.split(",");
      this.editForm = {
        id: row.id,
        deviceId: row.deviceId,
        cameraId: row.cameraId,
        aiTypeArray: aiArray,
      };
      this.editDialog.visible = true;
    },
    resetEditForm() {
      // 移除表单验证结果
      this.$nextTick(() => {
        this.$refs.configForm.clearValidate();
      });
      this.editForm = {
        id: null,
        deviceId: null,
        cameraId: null,
        aiTypeArray: [],
      };
    },
    deleteConfig(row) {
      let self = this;
      let message = "是否确定删除该配置？";
      this.$confirm(message, "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        let data = { id: row.id };
        configService
          .deleteData(data)
          .then((res) => {
            if (res.status === "SUCCESS") {
              self.$message({
                message: "删除算法配置成功!",
                type: "success",
              });
              self.refreshTable();
            } else {
              self.showErrorMessage(res.errorCode);
            }
          })
          .catch((err) => {
            console.log("删除算法配置出错,data=" + JSON.stringify(data));
            console.log(err);
          });
      });
    },
    doAdd() {
      let self = this;
      this.$refs["configForm"].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false;
          let data = {
            deviceId: self.editForm.deviceId,
            cameraId: self.editForm.cameraId,
            aiTypeArray: self.editForm.aiTypeArray,
          };
          configService
            .addData(data)
            .then((res) => {
              if (res.status === "SUCCESS") {
                self.$message({
                  message: "新增算法配置成功!",
                  type: "success",
                });
                self.refreshTable();
              } else {
                self.showErrorMessage(res.errorCode);
              }
            })
            .catch((err) => {
              console.log("新增算法配置出错,data=" + JSON.stringify(data));
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    doUpdate() {
      let self = this;
      this.$refs["configForm"].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false;
          let data = {
            id: self.editForm.id,
            deviceId: self.editForm.deviceId,
            cameraId: self.editForm.cameraId,
            aiTypeArray: self.editForm.aiTypeArray,
          };
          configService
            .updateData(data)
            .then((res) => {
              if (res.status === "SUCCESS") {
                self.$message({
                  message: "修改算法配置成功!",
                  type: "success",
                });
                self.refreshTable();
              } else {
                self.showErrorMessage(res.errorCode);
              }
            })
            .catch((err) => {
              console.log("修改算法配置出错,data=" + JSON.stringify(data));
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    showErrorMessage(errorCode) {
      let message = "未知错误";
      if (errorCode != null) {
        switch (errorCode) {
          case 100301:
            message = "算法配置数据不存在";
            break;
          case 100302:
            message = "该设备已配置摄像头算法";
            break;
          default:
            message = "未知错误码：" + errorCode;
        }
      }
      this.$message({
        message: message,
        type: "warning",
      });
    },
  },
};
</script>
<style scoped>
</style>