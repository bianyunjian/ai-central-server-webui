<template>
  <div>
    <el-container>
      <el-header style="padding-top:20px;">
        <div style="text-align:left;">
          <el-input v-model="tableQuery.deviceName" style="width:200px;" 
            placeholder="请输入设备名称" clearable>
          </el-input>
          <span>查询时间：</span>
          <el-date-picker
            v-model="tableQuery.timeDate"
            type="datetimerange"
            :picker-options="timePickerOptions"
            range-separator="至"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
          ></el-date-picker>
          <el-button type="primary" icon="el-icon-search" @click="changePage(1)">查询</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width:100%;">
          <el-table-column prop="eventId" label="事件编号" width="90"></el-table-column>
          <el-table-column prop="deviceName" label="设备"></el-table-column>
          <el-table-column prop="cameraName" label="摄像头"></el-table-column>
          <el-table-column prop="eventType" label="事件类型"></el-table-column>
          <el-table-column prop="eventTypeValue" label="事件值"></el-table-column>
          <el-table-column prop="eventTime" label="时间" width="200"></el-table-column>
          <el-table-column prop="description" label="描述" width="300"></el-table-column>
          <el-table-column prop="eventImagePath" label="关联图片">
            <template slot-scope="scope">
              <el-link
                type="primary"
                :href="scope.row.eventImagePath"
                target="_blank"
              >点击查看</el-link>
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
  </div>
</template>
<script>
import eventService from '@/api/eventData'

export default {
  name: 'HistoryDataTable',
  data() {
    return {
      tableData: [],
      // 测试数据
      // tableData: [{
      //   eventId: 1,
      //   deviceId: 1,
      //   cameraId: 1,
      //   eventType: "box",
      //   eventTypeValue: 1,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: '安全防护周转箱',
      //   eventImagePath: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595915030509&di=749d541bae695680048a0c2e0615640a&imgtype=0&src=http%3A%2F%2Fpicture.ik123.com%2Fuploads%2Fallimg%2F181106%2F12-1Q106154J7.jpg",
      //   deviceName: "device01",
      //   cameraName: "测试相机2"
      // },{
      //   eventId: 2,
      //   deviceId: 2,
      //   cameraId: 1,
      //   eventType: "garbage",
      //   eventTypeValue: 2,
      //   eventTime: "2020-07-24T08:13:57.555Z",
      //   description: "垃圾未分类",
      //   eventImagePath: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595915205450&di=736c0ce5a26e01e288c0a8ba3ab45499&imgtype=0&src=http%3A%2F%2Fcar0.autoimg.cn%2Fcar%2Fupload%2F2015%2F5%2F14%2Fv_201505141101295103686112.jpg",
      //   deviceName: "device02",
      //   cameraName: "byj-测试相机(萤石云)"
      // }],
      tableQuery: {
        deviceName: '',
        timeDate: []
      },
      tablePage: {
        pageNum: 1,
        pageSize: 10,
        total: 100
      },
      timePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  mounted() {
    // this.changePage(1)
  },
  computed: {},
  methods: {
    refreshTable() {
      let self = this
      let startTime = self.tableQuery.timeDate[0] == null ? null : self.dateToString(self.tableQuery.timeDate[0])
      let endTime = self.tableQuery.timeDate[1] == null ? null : self.dateToString(self.tableQuery.timeDate[1])
      let data = {
        pagedParams: {
          pageNum: self.tablePage.pageNum,
          pageSize: self.tablePage.pageSize
        },
        queryParams: {
          deviceName: self.tableQuery.deviceName,
          startTime: startTime,
          endTime: endTime
        }
      }
      console.log(this.tableQuery)
      eventService.getHistoryData(data).then(res => {
        if (res.errorCode == 0) {
          self.tableData = res.data.list
          self.tablePage.total = res.data.total
        }
      }).catch(err => {
        console.log('查询事件历史数据出错,data='+JSON.stringify(data))
        console.log(err)
      })
    },
    changePage(page) {
      this.tablePage.pageNum = page
      this.refreshTable()
    },
    dateToString(date) {
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString()
      let day = (date.getDate()).toString()
      if (month.length === 1) {
        month = '0'+month
      }
      if (day.length === 1) {
        day = '0'+day
      }
      let hour = date.getHours()
      hour = hour < 10 ? ('0' + hour) : hour
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      let second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second
    }
  }
}
</script>
<style scoped>

</style>