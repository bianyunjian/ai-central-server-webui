<template>
  <div>
    <el-container>
      <el-header style="padding-top:20px;">
        <div style="text-align:left;float:left;">
          <el-input
            v-model="tableQuery.deviceName"
            style="width:200px;"
            placeholder="请输入设备名称"
            clearable
          ></el-input>
          <el-button type="primary" icon="el-icon-search" @click="changePage(1)">查询</el-button>
        </div>
        <div style="text-align:left;float:left; margin-left:50px;line-height:40px;color:#646464">
          <el-switch
            v-model="enableAutoIntervalRefresh"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>自动刷新
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width:100%;" :span-method="objectSpanMethod">
          <el-table-column prop="deviceName" label="设备"></el-table-column>
          <el-table-column prop="cameraName" label="摄像头"></el-table-column>
          <el-table-column prop="eventType" label="实时事件"></el-table-column>
          <el-table-column prop="eventTypeValue" label="事件值"></el-table-column>
          <el-table-column prop="eventTime" label="发生时间"></el-table-column>
          <el-table-column prop="description" label="事件说明"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import eventService from "@/api/eventData";

export default {
  name: "RealtimeDataTable",
  data() {
    return {
      tableData: [],
      // 测试数据
      // tableData: [{
      //   eventId: 2,
      //   deviceId: 2,
      //   cameraId: 1,
      //   eventType: "garbage",
      //   eventTypeValue: 2,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: "垃圾未分类",
      //   eventImagePath: "/eventImage/fff.jpg",
      //   deviceName: "device02",
      //   cameraName: "byj-测试相机(萤石云)",
      //   firstMerge: [4, 1],
      //   secondMerge: [3, 1]
      // },{
      //   eventId: 2,
      //   deviceId: 2,
      //   cameraId: 1,
      //   eventType: "garbage",
      //   eventTypeValue: 2,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: "垃圾未分类",
      //   eventImagePath: "/eventImage/fff.jpg",
      //   deviceName: "device02",
      //   cameraName: "byj-测试相机(萤石云)",
      //   firstMerge: [0, 0],
      //   secondMerge: [0, 0]
      // },{
      //   eventId: 2,
      //   deviceId: 2,
      //   cameraId: 1,
      //   eventType: "garbage",
      //   eventTypeValue: 2,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: "垃圾未分类",
      //   eventImagePath: "/eventImage/fff.jpg",
      //   deviceName: "device02",
      //   cameraName: "byj-测试相机(萤石云)",
      //   firstMerge: [0, 0],
      //   secondMerge: [0, 0]
      // },{
      //   eventId: 2,
      //   deviceId: 2,
      //   cameraId: 1,
      //   eventType: "garbage",
      //   eventTypeValue: 2,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: "垃圾未分类",
      //   eventImagePath: "/eventImage/fff.jpg",
      //   deviceName: "device02",
      //   cameraName: "byj-测试相机(萤石云)",
      //   firstMerge: [0, 0],
      //   secondMerge: [1, 1]
      // },{
      //   eventId: 2,
      //   deviceId: 2,
      //   cameraId: 1,
      //   eventType: "garbage",
      //   eventTypeValue: 2,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: "垃圾未分类",
      //   eventImagePath: "/eventImage/fff.jpg",
      //   deviceName: "device02",
      //   cameraName: "byj-测试相机(萤石云)",
      //   firstMerge: [2, 1],
      //   secondMerge: [1, 1]
      // },{
      //   eventId: 2,
      //   deviceId: 2,
      //   cameraId: 1,
      //   eventType: "garbage",
      //   eventTypeValue: 2,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: "垃圾未分类",
      //   eventImagePath: "/eventImage/fff.jpg",
      //   deviceName: "device02",
      //   cameraName: "byj-测试相机(萤石云)",
      //   firstMerge: [0, 0],
      //   secondMerge: [1, 1]
      // }],
      tableQuery: {
        deviceName: "",
      },
      tablePage: {
        pageNum: 1,
        pageSize: 10,
        total: 100,
      },
      enableAutoIntervalRefresh: false,
      autoRefreshInterval: null,
    };
  },
  mounted() {
    let self = this;
    self.autoRefreshInterval = setInterval(() => {
      var deviceName = self.tableQuery.deviceName;
      if (deviceName && self.enableAutoIntervalRefresh) {
        self.refreshTable();
      }
    }, 1000);
  },
  destroyed() {
    let self = this;
    if (self.autoRefreshInterval) {
      clearInterval(self.autoRefreshInterval);
    }
  },

  computed: {},
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 合并第一列
      if (columnIndex === 0) {
        return row.firstMerge;
      }
      // 合并第二列
      if (columnIndex === 1) {
        return row.secondMerge;
      }
    },
    refreshTable() {
      let self = this;
      let data = {
        deviceName: self.tableQuery.deviceName,
      };
      eventService
        .getRealtimeData(data)
        .then((res) => {
          if (res.errorCode == 0) {
            let originList = res.data;
            if (originList == null || originList.length === 0) {
              console.log("未能获取实时数据");
              console.log(res);
            } else {
              let tableData = [];
              for (let i = 0, len = originList.length; i < len; i++) {
                let dev = originList[i];
                let camSize = dev.cameraList.length;
                for (let j = 0, len1 = camSize; j < len1; j++) {
                  let cam = dev.cameraList[j];
                  let evtSize = cam.eventList.length;
                  let secondMerge = [evtSize, 1];
                  let firstMerge = [evtSize * camSize, 1];
                  for (let k = 0, len2 = evtSize; k < len2; k++) {
                    let event = cam.eventList[k];
                    let data = {
                      deviceId: dev.deviceId,
                      deviceName: dev.deviceName,
                      cameraId: cam.cameraId,
                      cameraName: cam.cameraName,
                    };
                    if (k == 0) {
                      data.firstMerge = firstMerge;
                      data.secondMerge = secondMerge;
                    } else {
                      data.firstMerge = [0, 0];
                      data.secondMerge = [0, 0];
                    }
                    data.eventType = event.eventType;
                    data.eventTypeValue = event.eventTypeValue;
                    data.eventTime = event.eventTime;
                    data.description = event.description;

                    tableData.push(data);
                  }
                }
              }
              // console.log(tableData)
              self.tableData = tableData;
              if (tableData.length === 0) {
                console.log(originList);
                this.$message({
                  message: "暂无实时事件",
                  type: "warning",
                });
              }
            }
          }
        })
        .catch((err) => {
          console.log("查询事件实时数据出错,data=" + JSON.stringify(data));
          console.log(err);
        });
    },
    changePage(page) {
      // 检查是否输入设备名称
      if (
        this.tableQuery.deviceName == null ||
        this.tableQuery.deviceName == ""
      ) {
        this.$message({
          message: "请先输入设备名称",
          type: "warning",
        });
        return false;
      } else {
        this.tablePage.pageNum = page;
        this.refreshTable();
      }
    },
  },
};
</script>
<style scoped>
</style>