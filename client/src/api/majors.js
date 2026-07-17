import request from './request'

export const getMajors = (params) => {
  return request({
    url: '/majors',
    method: 'GET',
    params
  })
}

export const getMajorList = () => {
  return request({
    url: '/majors/list',
    method: 'GET'
  })
}

export const createMajor = (data) => {
  return request({
    url: '/majors',
    method: 'POST',
    data
  })
}

export const updateMajor = (id, data) => {
  return request({
    url: `/majors/${id}`,
    method: 'PUT',
    data
  })
}

export const deleteMajor = (id) => {
  return request({
    url: `/majors/${id}`,
    method: 'DELETE'
  })
}
