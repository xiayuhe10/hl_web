import request from '@/utils/request'

// 查询搅拌站用户列表
export function listMixingUser(query) {
  return request({
    url: '/system/mixingUser/list',
    method: 'get',
    params: query
  })
}

// 查询搅拌站用户详细
export function getMixingUser(id) {
  return request({
    url: '/system/mixingUser/' + id,
    method: 'get'
  })
}

// 新增搅拌站用户
export function addMixingUser(data) {
  return request({
    url: '/system/mixingUser',
    method: 'post',
    data: data
  })
}

// 修改搅拌站用户
export function updateMixingUser(data) {
  return request({
    url: '/system/mixingUser',
    method: 'put',
    data: data
  })
}

// 删除搅拌站用户
export function delMixingUser(id) {
  return request({
    url: '/system/mixingUser/' + id,
    method: 'delete'
  })
}
