import request from '@/axios';

const serverBaseUrl = '/blade-supp/partner/user/wechat/moments';

// 获取同步客户列表
export const getWechatMomentsInfo = (pageIndex, pageSize, params) => {
  // 模拟数据（开发环境）
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve({
      data: {
        code: 200,
        data: {
          records: [
            {
              id: 'KH202211010001',
              headImage: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
              weChatName: '黑客7198',
              weChatCode: 'hacker7198',
              remark: '重要客户',
              nickName: '黑客7198',
              mobile: '17732211234',
              username: '周杰伦',
              syncCount: 128,
              syncStatus: 'Sync',
              syncStatusName: '已同步',
              customerServiceCode: 'CS001',
              createdAt: '2024-01-21 10:30:30',
              syncTime: '2024-01-21 15:30:30'
            },
            {
              id: 'KH202211010002',
              headImage: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
              weChatName: '小鹿同学',
              weChatCode: 'xiaolu666',
              remark: '普通客户',
              nickName: '小鹿',
              mobile: '13800138000',
              username: '张三',
              syncCount: 56,
              syncStatus: 'NotSync',
              syncStatusName: '未同步',
              customerServiceCode: 'CS002',
              createdAt: '2024-01-22 09:15:20',
              syncTime: null
            }
          ],
          total: 2
        }
      }
    });
  }

  return request({
    url: `${serverBaseUrl}/info/page`,
    method: 'get',
    params: {
      pageIndex,
      pageSize,
      ...params
    }
  });
};

// 切换同步状态
export const switchSyncStatus = (id, userId, syncSwitch) => {
  return request({
    url: `${serverBaseUrl}/switch`,
    method: 'post',
    data: {
      id,
      userId,
      syncSwitch
    }
  });
}; 