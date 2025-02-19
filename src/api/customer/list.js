import request from '@/axios';

const serverBaseUrl = '/blade-supp/partner/user'

// 获取客户列表
export const getList = (pageIndex, pageSize, params) => {
  // 模拟一条假数据
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      data: {
        code: 200,
        data: {
          records: [{
            id: 'KH202211010001',
            headImage: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            nickName: '黑客7198',
            mobile: '17732211234',
            username: '周杰伦',
            hasFollowedOfficial: '0',
            hasSyncedToMoments: '1',
            channel: '0',
            status: '1',
            createdAt: '2024-01-21 10:30:30',
            updatedAt: '2024-01-21 10:30:30',
            // 详情额外信息
            weChatName: '黑客7198',
            weChatCode: 'hacker7198',
            idCardNo: '510921198608233131',
            idCardPortraitImage: 'https://example.com/front.jpg',
            idCardNationalImage: 'https://example.com/back.jpg'
          }],
          total: 1
        }
      }
    });
  }
  
  return request({
    url: `${serverBaseUrl}/pagingByPartnerType`,
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      ...params
    }
  });
};

// 更新客户状态
export const updateUserStatus = (id, status) => {
  return request({
    url: `${serverBaseUrl}/updateUserStatus`,
    method: 'post',
    data: {
      id,
      status
    }
  });
}; 