<template>
  <div>
    <el-container>
      <el-main>
        <el-table :data="tableData" border style="width:100%;">
          <el-table-column prop="deviceId" label="设备编号"></el-table-column>
          <el-table-column prop="deviceName" label="设备名称"></el-table-column>
          <el-table-column prop="garbageType" label="垃圾投递类型编号"></el-table-column>
          <el-table-column prop="garbageTypeDesc" label="垃圾投递类型"></el-table-column>

          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-link type="primary" @click="updateConfig(scope.row)" style="margin-right:10px;">修改</el-link>
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
      <el-form :model="editForm" ref="configForm" :rules="editFormRules" label-width="120px">
        <el-form-item prop="deviceId" label="设备">{{editForm.deviceName}}</el-form-item>
        <el-form-item prop="garbageType" label="垃圾投递类型">
          <el-select
            style="width:100%;"
            v-model="editForm.garbageType"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in garbageTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
import runtimeService from "@/api/runtime";

export default {
  name: "RuntimeManage",
  data() {
    return {
      // 测试数据
      tableData: [
        {
          deviceId: 1,
          deviceName: "测试001",
          garbageType: 1,
          garbageTypeDesc: "干垃圾",
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
        type: "update", // 'add'或者'update'
      },
      // 表单
      editForm: {
        deviceId: null,
        deviceName: null,
        garbageType: null,
      },
      garbageTypeList: [
        { value: 1, label: "干垃圾" },
        { value: 2, label: "湿垃圾" },
      ],

      editFormRules: {
        deviceId: [{ required: true, message: "必选项", trigger: "change" }],
        garbageType: [{ required: true, message: "必选项", trigger: "change" }],
      },
    };
  },
  mounted() {
    this.changePage(1);
    let self = this;
    runtimeService.getGarbageTypeList().then((res) => {
      if (res && res.errorCode == 0) {
        let list = res.data;
        self.garbageTypeList = list;

        console.log(list);
      }
    });
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
      runtimeService
        .getDeviceGarbageTypeList(data)
        .then((res) => {
          if (res.errorCode == 0) {
            self.tableData = res.data;
            self.tablePage.total = res.data.length;
          }
        })
        .catch((err) => {
          console.log(
            "查询设备当前支持的垃圾投递类型列表出错,data=" +
              JSON.stringify(data)
          );
          console.log(err);
        });
    },
    changePage(page) {
      this.tablePage.pageNum = page;
      this.refreshTable();
    },

    updateConfig(row) {
      this.editDialog.title = "修改配置";
      this.editDialog.type = "update";
      this.resetEditForm();
      this.editForm = {
        deviceId: row.deviceId,
        deviceName: row.deviceName,
        garbageType: row.garbageType,
      };
      this.editDialog.visible = true;
    },
    resetEditForm() {
      // 移除表单验证结果
      this.$nextTick(() => {
        this.$refs.configForm.clearValidate();
      });
      this.editForm = {
        deviceId: null,
        deviceName: null,
        garbageType: null,
      };
    },
    doUpdate() {
      let self = this;
      this.$refs["configForm"].validate((valid) => {
        if (valid) {
          self.editDialog.visible = false;
          let data = {
            deviceId: self.editForm.deviceId,
            garbageType: self.editForm.garbageType,
          };
          runtimeService
            .updateDeviceGarbageType(data)
            .then((res) => {
              if (res.errorCode === 0) {
                self.$message({
                  message: "修改设备当前支持的垃圾投递类型成功!",
                  type: "success",
                });
                self.refreshTable();
              } else {
                self.showErrorMessage(res.errorCode);
              }
            })
            .catch((err) => {
              console.log(
                "修改设备当前支持的垃圾投递类型出错,data=" +
                  JSON.stringify(data)
              );
              console.log(err);
            });
        } else {
          return false;
        }
      });
    },
    showErrorMessage(errorCode) {
      let message = "未知错误" + errorCode;

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