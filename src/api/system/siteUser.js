import request from '@/utils/request'

// 查询施工队人员列表
export function listSiteUser(query) {
  return request({
    url: '/system/site/user/list',
    method: 'get',
    params: query
  })
}

// 查询施工队人员详细
export function getSiteUser(id) {
  return request({
    url: '/system/site/user/' + id,
    method: 'get'
  })
}

// 新增施工队人员
export function addSiteUser(data) {
  return request({
    url: '/system/site/user',
    method: 'post',
    data: data
  })
}

// 修改施工队人员
export function updateSiteUser(data) {
  return request({
    url: '/system/site/user',
    method: 'put',
    data: data
  })
}

// 删除施工队人员
export function delSiteUser(id) {
  return request({
    url: '/system/site/user/' + id,
    method: 'delete'
  })
}
