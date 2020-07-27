<template>
  <div>
    <el-container>
      <el-header style="padding-top:20px;">
        <div style="text-align:left;">
          <el-input v-model="tableQuery.deviceName" style="width:200px;" 
            placeholder="请输入设备名称" clearable>
          </el-input>
          <el-button type="primary" icon="el-icon-search" @click="changePage(1)">查询</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width:100%;"
          :span-method="objectSpanMethod"
        >
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
export default {
  name: 'RealtimeDataTable',
  data() {
    return {
      // 测试数据
      tableData: [{
        eventId: 2,
        deviceId: 2,
        cameraId: 1,
        eventType: "garbage",
        eventTypeValue: 2,
        eventTime: "2020-07-24T08:13:57.555Z",
        description: "垃圾未分类",
        eventImagePath: "/eventImage/fff.jpg",
        deviceName: "device02",
        cameraName: "byj-测试相机(萤石云)",
        firstMerge: [4, 1],
        secondMerge: [3, 1]
      },{
        eventId: 2,
        deviceId: 2,
        cameraId: 1,
        eventType: "garbage",
        eventTypeValue: 2,
        eventTime: "2020-07-24T08:13:57.555Z",
        description: "垃圾未分类",
        eventImagePath: "/eventImage/fff.jpg",
        deviceName: "device02",
        cameraName: "byj-测试相机(萤石云)",
        firstMerge: [0, 0],
        secondMerge: [0, 0]
      },{
        eventId: 2,
        deviceId: 2,
        cameraId: 1,
        eventType: "garbage",
        eventTypeValue: 2,
        eventTime: "2020-07-24T08:13:57.555Z",
        description: "垃圾未分类",
        eventImagePath: "/eventImage/fff.jpg",
        deviceName: "device02",
        cameraName: "byj-测试相机(萤石云)",
        firstMerge: [0, 0],
        secondMerge: [0, 0]
      },{
        eventId: 2,
        deviceId: 2,
        cameraId: 1,
        eventType: "garbage",
        eventTypeValue: 2,
        eventTime: "2020-07-24T08:13:57.555Z",
        description: "垃圾未分类",
        eventImagePath: "/eventImage/fff.jpg",
        deviceName: "device02",
        cameraName: "byj-测试相机(萤石云)",
        firstMerge: [0, 0],
        secondMerge: [1, 1]
      },{
        eventId: 2,
        deviceId: 2,
        cameraId: 1,
        eventType: "garbage",
        eventTypeValue: 2,
        eventTime: "2020-07-24T08:13:57.555Z",
        description: "垃圾未分类",
        eventImagePath: "/eventImage/fff.jpg",
        deviceName: "device02",
        cameraName: "byj-测试相机(萤石云)",
        firstMerge: [2, 1],
        secondMerge: [1, 1]
      },{
        eventId: 2,
        deviceId: 2,
        cameraId: 1,
        eventType: "garbage",
        eventTypeValue: 2,
        eventTime: "2020-07-24T08:13:57.555Z",
        description: "垃圾未分类",
        eventImagePath: "/eventImage/fff.jpg",
        deviceName: "device02",
        cameraName: "byj-测试相机(萤石云)",
        firstMerge: [0, 0],
        secondMerge: [1, 1]
      }],
      tableQuery: {
        deviceName: ''
      },
      tablePage: {
        pageNum: 1,
        pageSize: 10,
        total: 100
      }
    }
  },
  mounted() {
    // this.changePage(1)
  },
  computed: {},
  methods: {
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      // 合并第一列
      if (columnIndex === 0) {
        return row.firstMerge
      }
      // 合并第二列
      if (columnIndex === 1) {
        return row.secondMerge
      }
    },
    refreshTable() {
      let self = this
      let data = {
        deviceName: ''
      }
      // eventService.getRealtimeData(data).then(res => {
      //   if (res.errorCode == 0) {
      //     self.tableData = res.data.list
      //     self.tablePage.total = res.data.total
      //   }
      // }).catch(err => {
      //   console.log('查询事件实时数据出错,data='+JSON.stringify(data))
      //   console.log(err)
      // })
    },
    changePage(page) {
      this.tablePage.pageNum = page
      this.refreshTable()
    }
  }
}
</script>
<style scoped>

</style>