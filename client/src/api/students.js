import request from './request'

export const getStudents = (params) => {
  return request({
    url: '/students',
    method: 'GET',
    params
  })
}

export const getStudentById = (id) => {
  return request({
    url: `/students/${id}`,
    method: 'GET'
  })
}

export const createStudent = (data) => {
  return request({
    url: '/students',
    method: 'POST',
    data
  })
}

export const updateStudent = (id, data) => {
  return request({
    url: `/students/${id}`,
    method: 'PUT',
    data
  })
}

export const deleteStudent = (id) => {
  return request({
    url: `/students/${id}`,
    method: 'DELETE'
  })
}
