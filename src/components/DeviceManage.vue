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
                placeholder="请输入设备名称，enter键查询"
                clearable
                @keyup.enter.native="changePage(1)"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="text-align:right;">
              <el-button type="primary" icon="el-icon-plus" @click="addDevice">添加设备</el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width:100%;">
          <el-table-column prop="id" label="编号" width="70"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 0" type="success" size="medium">正常</el-tag>
              <el-tag v-if="scope.row.status == 1" type="danger" size="medium">离线</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deviceScenario" label="使用场景">
            <template slot-scope="scope">{{ scenarioFormat(scope.row.deviceScenario) }}</template>
          </el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="axPlcId" label="艾信PLC ID"></el-table-column>
          <el-table-column prop="appId" label="安卓APP ID"></el-table-column>
          <el-table-column prop="deviceGroupId" label="设备分组ID"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-link type="primary" @click="updateDevice(scope.row)" style="margin-right:10px;">修改</el-link>
              <el-link type="danger" @click="deleteDevice(scope.row)">删除</el-link>
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

    <el-dialog :title="editDialog.title" :visible.sync="editDialog.visible" width="450px">
      <el-form :model="editForm" ref="deviceForm" :rules="editFormRules" label-width="80px">
        <el-form-item prop="name" label="设备名称">
          <el-col :span="22">
            <el-input v-model="editForm.name" autocomplete="off" placeholder="请输入设备名称"></el-input>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="该设备名称很重要， AI程序需要设置该名称，以便从中心算法控制器获取相关配置" placement="bottom">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item prop="status" label="设备状态">
          <div style="text-align:left;">
            <el-switch
              v-model="editForm.status"
              active-text="正常"
              inactive-text="离线"
              :active-value="0"
              :inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </div>
        </el-form-item>
        <el-form-item prop="deviceScenario" label="使用场景">
          <el-select style="width:100%;" v-model="editForm.deviceScenario" placeholder="请选择">
            <el-option
              v-for="item in scenarioEnum"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="描述">
          <el-input
            v-model="editForm.description"
            autocomplete="off"
            type="textarea"
            :rows="3"
            placeholder="设备相关描述"
          ></el-input>
        </el-form-item>
        <el-form-item prop="axPlcId" label="PLC编号">
          <el-col :span="22">
            <el-input
              type="number"
              v-model="editForm.axPlcId"
              autocomplete="off"
              placeholder="请输入PLC编号"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="PLC编号代表了艾信的PLC设备，中心算法控制器使用该编号区分多个PLC" placement="bottom">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item prop="appId" label="APP编号">
          <el-col :span="22">
            <el-input
              type="number"
              v-model="editForm.appId"
              autocomplete="off"
              placeholder="请输入APP编号"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="APP编号代表了艾信的APP程序，中心算法控制器使用该编号区分多个APP程序" placement="bottom">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item prop="deviceGroupId" label="分组编号">
          <el-col :span="22">
            <el-input
              type="number"
              v-model="editForm.deviceGroupId"
              autocomplete="off"
              placeholder="请输入分组编号"
            ></el-input>
          </el-col>
          <el-col :span="2">
            <el-tooltip class="item" effect="dark" content="将多个设备分为一组， 同一组的设备在同一时间只能有一个在使用中；当某个设备在使用时，其他设备都会被设置为【繁忙中】状态" placement="bottom">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
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
import deviceService from "@/api/device";

export default {
  name: "DeviceManage",
  data() {
    return {
      // 测试数据
      tableData: [
        {
          id: 1,
          name: "D001",
          status: 0,
          deviceScenario: "1",
          description: "三楼实验室",
          axPlcId: "1",
          appId: "12",
          deviceGroupId: 1,
        },
        {
          id: 2,
          name: "D002",
          status: 1,
          deviceScenario: "2",
          description: "三楼实验室",
          axPlcId: "2",
          appId: "21",
          deviceGroupId: 1,
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
      editForm: {
        id: null,
        name: "",
        status: 0,
        deviceScenario: null,
        description: "",
        axPlcId: null,
        appId: null,
        deviceGroupId: null,
      },
      editFormRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        status: [{ required: true, message: "必填项", trigger: "blur" }],
        deviceScenario: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        axPlcId: [{ required: true, message: "必填项", trigger: "blur" }],
        appId: [{ required: true, message: "必填项", trigger: "blur" }],
        deviceGroupId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      statusEnum: [
        { value: 0, label: "正常" },
        { value: 1, label: "离线" },
      ],
      scenarioEnum: [
        { value: "0", label: "未知" },
        { value: "1", label: "中型物流护士站点" },
        { value: "2", label: "气力式垃圾站点投递口" },
      ],
    };
  },
  mounted() {
    this.changePage(1);
  },
  computed: {
    // statusFormat(status) {
    //   let message = status
    //   if (null != status) {
    //     switch (status) {
    //       case 0:
    //         message = '正常'
    //         break
    //       case 1:
    //         message = '离线'
    //         break
    //       default:
    //     }
    //   }
    //   return message
    // },
  },
  methods: {
    scenarioFormat(scenario) {
      let message = "";
      if (null != scenario) {
        switch (scenario) {
          case "0":
            message = "未知";
            break;
          case "1":
            message = "中型物流护士站点";
            break;
          case "2":
            message = "气力式垃圾站点投递口";
            break;
          default:
        }
      }
      return message;
    },
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
      deviceService
        .queryDevice(data)
        .then((res) => {
          if (res.errorCode == 0) {
            self.tableData = res.data.list;
            self.tablePage.total = res.data.total;
          }
        })
        .catch((err) => {
          console.log("查询设备列表出错,data=" + JSON.stringify(data));
          console.log(err);
        });
    },
    changePage(page) {
      this.tablePage.pageNum = page;
      this.refreshTable();
    },
    addDevice() {
      this.editDialog.title = "新增设备";
      this.editDialog.type = "add";
      this.resetEditForm();
      this.editDialog.visible = true;
    },
    updateDevice(row) {
      this.editDialog.title = "修改设备";
      this.editDialog.type = "update";
      this.resetEditForm();
      this.editForm = {
        id: row.id,
        name: row.name,
        status: row.status,
        deviceScenario: row.deviceScenario,
        description: row.description,
        axPlcId: row.axPlcId,
        appId: row.appId,
        deviceGroupId: row.deviceGroupId,
      };
      this.editDialog.visible = true;
    },
    resetEditForm() {
      // 移除表单验证结果
      this.$nextTick(() => {
        this.$refs.deviceForm.clearValidate();
      });
      this.editForm = {
        id: null,
        name: "",
        status: 0,
        deviceScenario: null,
        description: "",
        axPlcId: null,
        appId: null,
        deviceGroupId: null,
      };
    },
    deleteDevice(row) {
      let self = this;
      let message = "是否确定删除设备：" + row.name + " ?";
      this.$confirm(message, "请确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
      }).then(() => {
        let data = { id: row.id };
        deviceService
          .deleteDevice(data)
          .then((res) => {
            if (res.status === "SUCCESS") {
              self.$message({
                message: "删除设备成功!",
                type: "success",
              });
              self.refreshTable();
            } else {
              self.showErrorMessage(res.errorCode);
            }
          })
          .catch((err) => {
            console.log("删除设备出错,data=" + JSON.stringify(data));
            console.log(err);
          });
      });
    },
    doAdd() {
      let self = this;
      this.$refs["deviceForm"].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false;
          let data = {
            name: self.editForm.name,
            status: self.editForm.status,
            scenario: self.editForm.deviceScenario,
            description: self.editForm.description,
            axPlcId: self.editForm.axPlcId,
            appId: self.editForm.appId,
            deviceGroupId: self.editForm.deviceGroupId,
          };
          deviceService
            .addDevice(data)
            .then((res) => {
              if (res.status === "SUCCESS") {
                self.$message({
                  message: "新增设备成功!",
                  type: "success",
                });
                self.refreshTable();
              } else {
                self.showErrorMessage(res.errorCode);
              }
            })
            .catch((err) => {
              console.log("新增设备出错,data=" + JSON.stringify(data));
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    doUpdate() {
      let self = this;
      this.$refs["deviceForm"].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false;
          let data = {
            id: self.editForm.id,
            name: self.editForm.name,
            status: self.editForm.status,
            scenario: self.editForm.deviceScenario,
            description: self.editForm.description,
            axPlcId: self.editForm.axPlcId,
            appId: self.editForm.appId,
            deviceGroupId: self.editForm.deviceGroupId,
          };
          deviceService
            .updateDevice(data)
            .then((res) => {
              if (res.status === "SUCCESS") {
                self.$message({
                  message: "修改设备成功!",
                  type: "success",
                });
                self.refreshTable();
              } else {
                self.showErrorMessage(res.errorCode);
              }
            })
            .catch((err) => {
              console.log("修改设备出错,data=" + JSON.stringify(data));
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
          case 100201:
            message = "设备数据不存在";
            break;
          case 100202:
            message = "设备名称重复";
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