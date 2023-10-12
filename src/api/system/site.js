import request from '@/utils/request'

// 查询施工工地列表
export function listSite(query) {
  return request({
    url: '/system/site/list',
    method: 'get',
    params: query
  })
}

// 查询施工工地详细
export function getSite(id) {
  return request({
    url: '/system/site/' + id,
    method: 'get'
  })
}

// 新增施工工地
export function addSite(data) {
  return request({
    url: '/system/site',
    method: 'post',
    data: data
  })
}

// 修改施工工地
export function updateSite(data) {
  return request({
    url: '/system/site',
    method: 'put',
    data: data
  })
}

// 删除施工工地
export function delSite(id) {
  return request({
    url: '/system/site/' + id,
    method: 'delete'
  })
}
