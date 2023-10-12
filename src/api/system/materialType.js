import request from '@/utils/request'

// 查询物料类型列表
export function listType(query) {
  return request({
    url: '/system/material/type/list',
    method: 'get',
    params: query
  })
}

// 查询物料类型详细
export function getType(id) {
  return request({
    url: '/system/material/type/' + id,
    method: 'get'
  })
}

// 新增物料类型
export function addType(data) {
  return request({
    url: '/system/material/type',
    method: 'post',
    data: data
  })
}

// 修改物料类型
export function updateType(data) {
  return request({
    url: '/system/material/type',
    method: 'put',
    data: data
  })
}

// 删除物料类型
export function delType(id) {
  return request({
    url: '/system/material/type/' + id,
    method: 'delete'
  })
}
