import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/sysArea',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/sysArea/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/sysArea',
    method: 'put',
    data
  })
}

export function querySysAreaByAreaCode(data) {
  return request({
    url: 'api/sysArea/querySysAreaByAreaCode',
    method: 'post',
    data
  })
}
export function addPrizeConfig(data) {
  return request({
    url: 'api/activityPrizeConfig',
    method: 'post',
    data
  })
}

export function getActivityQRCode(url) {
  return request({
    url: url,
    method: 'get'
  })
}

export function releaseActivity(url) {
  return request({
    url: url,
    method: 'get'
  })
}

export default { add, edit, del, querySysAreaByAreaCode, addPrizeConfig, getActivityQRCode, releaseActivity }
