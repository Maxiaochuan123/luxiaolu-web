import request from '@/axios';

const serverBaseUrl = '/blade-supp'

/**
 * 获取机器人列表
 * @param {object} params - 查询参数
 * @param {number} params.pageIndex - 当前页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.keyword - 搜索关键字
 * @returns {Promise<{
 *   records: Array<{
 *     id: string,
 *     actuatorName: string, // 执行器名称
 *     actuatorIp: string,   // 执行器ip地址
 *     actuatorKey: string,  // 执行器key(机器人微信号)
 *     intervalMin: number,  // 执行间隔时间最小
 *     intervalMax: number,  // 执行间隔时间最大
 *     createdBy: string,   // 创建人
 *     createdAt: string,   // 创建时间
 *     updatedBy: string,   // 更新人
 *     updatedAt: string    // 更新时间
 *   }>,
 *   total: number,         // 总记录数
 *   size: number,          // 每页条数
 *   current: number        // 当前页
 * }>}
 */
export const getPageList = (params) => {
  return request({
    url: `${serverBaseUrl}/robot/pageList`,
    method: 'get',
    params
  })
}

/**
 * 获取机器人任务列表
 * @param {object} params - 查询参数
 * @param {string} params.actuatorId - 执行器id
 * @param {string} params.keyword - 搜索关键字
 * @param {number} params.pageIndex - 当前页码
 * @param {number} params.pageSize - 每页条数
 * @returns {Promise<{
 *   records: Array<{
 *     id: string,           // 自动编号
 *     actuatorId: string,   // 执行器id
 *     taskType: string,     // 任务类型(Unknown,PullFriendList,PushMoments,Heartbeat,PushDesignatedFriendMoments)
 *     taskTypeName: string, // 任务类型名称
 *     taskName: string,     // 任务名称
 *     taskStatus: string,   // 任务状态(Unknown,NotStart,InProgress,Ended)
 *     createdBy: string,    // 创建人
 *     createdAt: string,    // 创建时间
 *     updatedBy: string,    // 更新人
 *     updatedAt: string     // 更新时间
 *   }>,
 *   total: number,          // 总记录数
 *   size: number,           // 每页条数
 *   current: number         // 当前页
 * }>}
 */
export const getTaskList = (params) => {
  return request({
    url: `${serverBaseUrl}/robot/task/pageList`,
    method: 'get',
    params
  })
}

/**
 * 获取登录二维码
 * @returns {Promise<string>} 返回二维码图片数据
 */
export const getLoginQrCode = () => {
  return request({
    url: `${serverBaseUrl}/robot/getLoginQrCodeNew`,
    method: 'get'
  })
}

/**
 * 新增机器人
 * @param {object} data - 机器人信息
 * @param {string} data.actuatorName - 执行器名称
 * @param {string} data.actuatorIp - 执行器ip地址
 * @param {string} data.actuatorKey - 执行器key(机器人微信号)
 * @param {string} data.actuatorUuid - 执行器Uuid(机器人QrUuid)
 * @param {number} data.intervalMin - 执行间隔时间最小
 * @param {number} data.intervalMax - 执行间隔时间最大
 */
export const createRobot = (data) => {
  return request({
    url: `${serverBaseUrl}/robot/create`,
    method: 'post',
    data
  })
}

/**
 * 获取任务类型列表
 * @returns {Promise<Array<{
 *   name: string,  // 任务类型名称
 *   value: string  // 任务类型值
 * }>>}
 */
export const getTaskTypes = () => {
  return request({
    url: `${serverBaseUrl}/robot/task/getTaskTypes`,
    method: 'get'
  })
}

/**
 * 创建任务
 * @param {object} data - 任务信息
 * @param {string} data.actuatorId - 执行器id
 * @param {string} data.taskType - 任务类型
 * @returns {Promise<any>}
 */
export const createTask = (data) => {
  return request({
    url: `${serverBaseUrl}/robot/task/create`,
    method: 'post',
    data
  })
}

/**
 * 删除任务
 * @param {object} data - 请求参数
 * @param {number} data.id - 任务ID
 * @returns {Promise<any>}
 */
export const removeTask = (data) => {
  return request({
    url: `${serverBaseUrl}/robot/task/remove`,
    method: 'post',
    data
  })
}

/**
 * 唤醒机器人
 * @param {object} data - 请求参数
 * @param {number} data.id - 机器人ID
 * @returns {Promise<any>}
 */
export const wakeUpRobot = (data) => {
  return request({
    url: `${serverBaseUrl}/robot/wakeUp`,
    method: 'post',
    data
  })
}

/**
 * 确认唤醒机器人
 * @param {object} data - 请求参数
 * @param {number} data.id - 机器人ID
 * @returns {Promise<any>}
 */
export const awakenRobot = (data) => {
  return request({
    url: `${serverBaseUrl}/robot/awaken`,
    method: 'post',
    data
  })
}

// TODO: 其他机器人管理相关的接口
// export const updateRobot = (data) => { ... }
// export const deleteRobot = (id) => { ... }
// export const getRobotDetail = (id) => { ... } 