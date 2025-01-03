import request from '@/axios';

export const getPageList = (pageIndex, pageSize, params) => {
  return request({
    url: '/robot/pageList',
    method: 'get',
    params: {
      ...params,
      pageIndex,
      pageSize,
    }
  })
} 