import request from '@/utils/request'

function queryDevice(data) {
  return request({
    url: '/device/table',
    method: 'post',
    data
  })
}

function addDevice(data) {
  return request({
    url: '/device/add',
    method: 'post',
    data
  })
}

function updateDevice(data) {
  return request({
    url: '/device/update',
    method: 'post',
    data
  })
}

function deleteDevice(data) {
  return request({
    url: '/device/delete',
    method: 'post',
    data
  })
}

/**
 * 设备服务端API接口
 */
export default {
  queryDevice,
  addDevice,
  updateDevice,
  deleteDevice
}