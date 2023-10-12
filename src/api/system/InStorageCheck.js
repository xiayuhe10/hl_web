import request from '@/utils/request'

// 查询入库审核列表
export function listCheck(query) {
  return request({
    url: '/system/check/list',
    method: 'get',
    params: query
  })
}

// 查询入库审核详细
export function getCheck(id) {
  return request({
    url: '/system/check/' + id,
    method: 'get'
  })
}

// 审核操作
export function operateCheck(data) {
  return request({
    url: '/system/check/operate',
    method: 'post',
    data: data
  })
}

// 新增入库审核
export function addCheck(data) {
  return request({
    url: '/system/check',
    method: 'post',
    data: data
  })
}

// 修改入库审核
export function updateCheck(data) {
  return request({
    url: '/system/check',
    method: 'put',
    data: data
  })
}

// 删除入库审核
export function delCheck(id) {
  return request({
    url: '/system/check/' + id,
    method: 'delete'
  })
}
