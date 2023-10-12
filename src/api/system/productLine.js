import request from '@/utils/request'

// 查询生产线列表
export function listLine(query) {
  return request({
    url: '/system/product/line/list',
    method: 'get',
    params: query
  })
}

// 查询生产线详细
export function getLine(id) {
  return request({
    url: '/system/product/line/' + id,
    method: 'get'
  })
}

// 新增生产线
export function addLine(data) {
  return request({
    url: '/system/product/line',
    method: 'post',
    data: data
  })
}

// 修改生产线
export function updateLine(data) {
  return request({
    url: '/system/product/line',
    method: 'put',
    data: data
  })
}

// 删除生产线
export function delLine(id) {
  return request({
    url: '/system/product/line/' + id,
    method: 'delete'
  })
}
