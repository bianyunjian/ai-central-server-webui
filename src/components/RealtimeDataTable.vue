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
          <el-table-column prop="deviceName" label="设备" width="200"></el-table-column>

          <el-table-column prop="eventType" label="实时事件" width="100"></el-table-column>
          <el-table-column prop="eventTypeValue" label="事件值" width="100"></el-table-column>
          <el-table-column prop="eventTime" label="发生时间" width="180"></el-table-column>
          <el-table-column prop="description" label="事件说明"></el-table-column>
          <el-table-column prop="deviceId" label="设备Id" width="80"></el-table-column>
          <el-table-column prop="cameraId" label="摄像头Id" width="80"></el-table-column>
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
      mockdata: [
        {
          deviceName: "ai-device-01",
          deviceId: 3,
          eventList: [
            {
              eventType: "face",
              eventTypeValue: 1,
              eventTime: "2020-09-02 10:42:04",
              description:
                '人员通过识别{"eventTypeValue":"8","eventType":"face"}',
              cameraId: 3,
            },
            {
              eventType: "box",
              eventTypeValue: 1,
              eventTime: "2020-09-02 10:42:04",
              description: "box",
              cameraId: 3,
            },
          ],
        },
        {
          deviceName: "ai-device-02",
          deviceId: 2,
          eventList: [
            {
              eventType: "face",
              eventTypeValue: 2,
              eventTime: "2020-09-02 10:42:04",
              description:
                '人员通过识别{"eventTypeValue":"8","eventType":"face"}',
              cameraId: 2,
            },
          ],
        },
        {
          deviceName: "ai-device-04",
          deviceId: 4,
          eventList: [
            {
              eventType: "face",
              eventTypeValue: 4,
              eventTime: "2020-09-02 10:42:04",
              description:
                '人员通过识别{"eventTypeValue":"8","eventType":"face"}',
              cameraId: 4,
            },
            {
              eventType: "face",
              eventTypeValue: 4,
              eventTime: "2020-09-02 10:42:04",
              description:
                '人员通过识别{"eventTypeValue":"8","eventType":"face"}',
              cameraId: 4,
            },
          ],
        },
      ],
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
      let self = this;
      if (columnIndex === 0) {
        return {
          rowspan: row.rowSpan,
          colspan: row.colSpan,
        };
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
            // let originList = self.mockdata;
            if (originList == null || originList.length === 0) {
              console.log("未能获取实时数据");
              console.log(res);
            } else {
              let tableData = [];
              for (let i = 0, len = originList.length; i < len; i++) {
                let dev = originList[i];

                for (let k = 0; k < dev.eventList.length; k++) {
                  let event = dev.eventList[k];
                  let data = {
                    deviceId: dev.deviceId,
                    deviceName: dev.deviceName,
                  };

                  data.eventType = event.eventType;
                  data.eventTypeValue = event.eventTypeValue;
                  data.eventTime = event.eventTime;
                  data.description = event.description;
                  data.cameraId = event.cameraId;

                  if (k == 0) {
                    data.rowSpan = dev.eventList.length;
                    data.colSpan = 1;
                  } else {
                    data.rowSpan = 0;
                    data.colSpan = 0;
                  }
                  tableData.push(data);
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