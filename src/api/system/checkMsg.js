import request from '@/utils/request'

// 查询审核信息列表
export function listCheckMsg(query) {
  return request({
    url: '/system/checkMsg/list',
    method: 'get',
    params: query
  })
}

// 查询我的审核信息列表
export function listMyCheckMsg(query) {
  return request({
    url: '/system/checkMsg/myList',
    method: 'get',
    params: query
  })
}

// 查询审核信息详细
export function getCheckMsg(id) {
  return request({
    url: '/system/checkMsg/' + id,
    method: 'get'
  })
}

// 新增审核信息
export function addCheckMsg(data) {
  return request({
    url: '/system/checkMsg',
    method: 'post',
    data: data
  })
}

// 修改审核信息
export function updateCheckMsg(data) {
  return request({
    url: '/system/checkMsg',
    method: 'put',
    data: data
  })
}

// 删除审核信息
export function delCheckMsg(id) {
  return request({
    url: '/system/checkMsg/' + id,
    method: 'delete'
  })
}
