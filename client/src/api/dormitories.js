import request from './request'

export const getDormitories = (params) => {
  return request({
    url: '/dormitories',
    method: 'GET',
    params
  })
}

export const getDormitoryList = () => {
  return request({
    url: '/dormitories/list',
    method: 'GET'
  })
}

export const createDormitory = (data) => {
  return request({
    url: '/dormitories',
    method: 'POST',
    data
  })
}

export const updateDormitory = (id, data) => {
  return request({
    url: `/dormitories/${id}`,
    method: 'PUT',
    data
  })
}

export const deleteDormitory = (id) => {
  return request({
    url: `/dormitories/${id}`,
    method: 'DELETE'
  })
}
