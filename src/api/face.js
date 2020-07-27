import request from '@/utils/request'

function queryTable(data) {
  return request({
    url: '/face/table',
    method: 'post',
    data
  })
}

function addData(data) {
  return request({
    url: '/face/add',
    method: 'post',
    data
  })
}

function deleteData(data) {
  return request({
    url: '/face/delete',
    method: 'post',
    data
  })
}

/**
 * 人脸库服务端API接口
 */
export default {
  queryTable,
  addData,
  deleteData
}