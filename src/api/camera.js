import request from '@/utils/request'

function queryCamera(data) {
  return request({
    url: '/camera/table',
    method: 'post',
    data
  })
}

function addCamera(data) {
  return request({
    url: '/camera/add',
    method: 'post',
    data
  })
}

function updateCamera(data) {
  return request({
    url: '/camera/update',
    method: 'post',
    data
  })
}

function deleteCamera(data) {
  return request({
    url: '/camera/delete',
    method: 'post',
    data
  })
}

/**
 * 相机操作服务端API接口
 */
export default {
  queryCamera,
  addCamera,
  updateCamera,
  deleteCamera
}