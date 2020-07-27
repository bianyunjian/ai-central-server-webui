import request from '@/utils/request'


function getFormData() {
  return request({
    url: '/ai-config/getFormData',
    method: 'get'
  })
}

function queryTable(data) {
  return request({
    url: '/ai-config/table',
    method: 'post',
    data
  })
}

function addData(data) {
  return request({
    url: '/ai-config/add',
    method: 'post',
    data
  })
}

function updateData(data) {
  return request({
    url: '/ai-config/update',
    method: 'post',
    data
  })
}

function deleteData(data) {
  return request({
    url: '/ai-config/delete',
    method: 'post',
    data
  })
}


/**
 * 算法配置服务端API接口
 */
export default {
  queryTable,
  addData,
  updateData,
  deleteData,
  getFormData
}