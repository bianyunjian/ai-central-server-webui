import request from '@/utils/request'


function getRealtimeData(data) {
  return request({
    url: '/event/getRealtimeEvent',
    method: 'post',
    data
  })
}

function getHistoryData(data) {
  return request({
    url: '/event/getHistoryEvent',
    method: 'post',
    data
  })
}

/**
 * 事件数据查询服务端API接口
 */
export default {
  getRealtimeData,
  getHistoryData
}