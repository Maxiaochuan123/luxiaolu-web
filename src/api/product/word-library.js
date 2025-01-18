import request from '@/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/word-library/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  });
};

export const add = (row) => {
  return request({
    url: '/api/word-library/add',
    method: 'post',
    data: row
  });
};

export const update = (row) => {
  return request({
    url: '/api/word-library/update',
    method: 'post',
    data: row
  });
};

export const remove = (ids) => {
  return request({
    url: '/api/word-library/remove',
    method: 'post',
    params: {
      ids,
    }
  });
};

export const updateStatus = (id, status) => {
  return request({
    url: '/api/word-library/status',
    method: 'post',
    params: {
      id,
      status
    }
  });
}; 