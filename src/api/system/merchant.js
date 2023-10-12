import request from '@/utils/request'

// 查询客户列表
export function listMerchant(query) {
  return request({
    url: '/system/merchant/list',
    method: 'get',
    params: query
  })
}

// 查询客户详细
export function getMerchant(id) {
  return request({
    url: '/system/merchant/' + id,
    method: 'get'
  })
}

// 新增客户
export function addMerchant(data) {
  return request({
    url: '/system/merchant',
    method: 'post',
    data: data
  })
}

// 修改客户
export function updateMerchant(data) {
  return request({
    url: '/system/merchant',
    method: 'put',
    data: data
  })
}

// 删除客户
export function delMerchant(id) {
  return request({
    url: '/system/merchant/' + id,
    method: 'delete'
  })
}
