import request from '@/utils/request'

// 查询入库头列表
export function listHeader(query) {
  return request({
    url: '/system/header/list',
    method: 'get',
    params: query
  })
}

// 入库头审核列表
export function checkListHeader(query) {
  return request({
    url: '/system/header/checkList',
    method: 'get',
    params: query
  })
}

// 审核详情
export function checkInfo(id) {
  return request({
    url: '/system/header/checkInfo/'+id,
    method: 'get'
  })
}

// 查询入库头详细
export function getHeader(id) {
  return request({
    url: '/system/header/' + id,
    method: 'get'
  })
}
// 查询入库头详细
export function selectByHeaderId(query) {
  return request({
    url: '/system/header/selectByHeaderId',
    method: 'get',
    params: query
  })
}
// 查询仓库下的物料信息
export function selectByStorageId(query) {
  return request({
    url: '/system/header/selectByStorageId',
    method: 'get',
    params: query
  })
}


//  获取入库单明细列表
export function selectInStorageLineDetail(query) {
  return request({
    url: '/system/header/selectInStorageLineDetail',
    method: 'get',
    params: query
  })
}

// 新增入库头
export function addHeader(data) {
  return request({
    url: '/system/header',
    method: 'post',
    data: data
  })
}

// 修改入库头
export function updateHeader(data) {
  return request({
    url: '/system/header',
    method: 'put',
    data: data
  })
}

// 删除入库头
export function delHeader(id) {
  return request({
    url: '/system/header/' + id,
    method: 'delete'
  })
}
