import request from '@/utils/request'

// 查询搅拌站项目列表
export function listMixingPlant(query) {
  return request({
    url: '/system/mixingPlant/list',
    method: 'get',
    params: query
  })
}

// 查询搅拌站项目详细
export function getMixingPlant(id) {
  return request({
    url: '/system/mixingPlant/' + id,
    method: 'get'
  })
}

// 新增搅拌站项目
export function addMixingPlant(data) {
  return request({
    url: '/system/mixingPlant',
    method: 'post',
    data: data
  })
}

// 修改搅拌站项目
export function updateMixingPlant(data) {
  return request({
    url: '/system/mixingPlant',
    method: 'put',
    data: data
  })
}

// 删除搅拌站项目
export function delMixingPlant(id) {
  return request({
    url: '/system/mixingPlant/' + id,
    method: 'delete'
  })
}
