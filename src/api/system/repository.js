import request from '@/utils/request'

// 查询仓库列表
export function listRepository(query) {
  return request({
    url: '/system/repository/list',
    method: 'get',
    params: query
  })
}

export function myListRepository(query) {
  return request({
    url: '/system/repository/myList',
    method: 'get',
    params: query
  })
}

// 查询仓库详细
export function getRepository(id) {
  return request({
    url: '/system/repository/' + id,
    method: 'get'
  })
}

// 新增仓库
export function addRepository(data) {
  return request({
    url: '/system/repository',
    method: 'post',
    data: data
  })
}

// 修改仓库
export function updateRepository(data) {
  return request({
    url: '/system/repository',
    method: 'put',
    data: data
  })
}

// 删除仓库
export function delRepository(id) {
  return request({
    url: '/system/repository/' + id,
    method: 'delete'
  })
}
