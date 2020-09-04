import request from '@/utils/request'


function getGarbageTypeList() {
  return request({
    url: '/runtime/getGarbageTypeList',
    method: 'get'
  })
}

function getDeviceGarbageTypeList(data) {
  return request({
    url: '/runtime/getDeviceGarbageTypeList',
    method: 'post',
    data
  })
}

function updateDeviceGarbageType(data) {
  return request({
    url: '/runtime/updateDeviceGarbageType',
    method: 'post',
    data
  })
}

/**
 * 算法配置服务端API接口
 */
export default {
  getGarbageTypeList,
  getDeviceGarbageTypeList,
  updateDeviceGarbageType
}