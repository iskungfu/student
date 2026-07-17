import request from './request'

export const getClasses = (params) => {
  return request({
    url: '/classes',
    method: 'GET',
    params
  })
}

export const getClassList = () => {
  return request({
    url: '/classes/list',
    method: 'GET'
  })
}

export const createClass = (data) => {
  return request({
    url: '/classes',
    method: 'POST',
    data
  })
}

export const updateClass = (id, data) => {
  return request({
    url: `/classes/${id}`,
    method: 'PUT',
    data
  })
}

export const deleteClass = (id) => {
  return request({
    url: `/classes/${id}`,
    method: 'DELETE'
  })
}
