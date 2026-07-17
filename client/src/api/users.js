import request from './request'

export const getUsers = (params) => {
  return request({
    url: 'http://localhost:3000/api/users',
    method: 'GET',
    params
  })
}

export const createUser = (data) => {
  return request({
    url: '/users',
    method: 'POST',
    data
  })
}

export const updateUser = (id, data) => {
  return request({
    url: `/users/${id}`,
    method: 'PUT',
    data
  })
}

export const deleteUser = (id) => {
  return request({
    url: `/users/${id}`,
    method: 'DELETE'
  })
}
