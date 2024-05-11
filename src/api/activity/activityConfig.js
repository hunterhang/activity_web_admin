import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/activityConfig',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/activityConfig/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/activityConfig',
    method: 'put',
    data
  })
}

export function list(data) {
  return request({
    url: 'api/activityConfig',
    method: 'get',
    data
  })
}

export default { add, edit, del, list }
