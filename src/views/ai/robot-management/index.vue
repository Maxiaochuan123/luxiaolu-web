<template>
  <basic-container>
    <!-- 如果有子路由，显示子路由内容 -->
    <!-- <router-view v-if="$route.name === 'robot-detail'" /> -->

    <!-- 否则显示机器人列表 -->
    <div class="robot-management">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="全部账号" name="all">
          <div class="robot-list">
            <div v-for="robot in robots" :key="robot.id" class="robot-card">
              <el-card shadow="hover" @click="showDetail(robot)">
                <div class="robot-info">
                  <div class="avatar-container">
                    <el-avatar :size="48">
                      <el-icon><User /></el-icon>
                    </el-avatar>
                    <el-tag
                      :type="robot.status === 'online' ? 'success' : 'danger'"
                      size="small"
                      class="status-tag"
                    >
                      {{ robot.status === 'online' ? '在线' : '掉线' }}
                    </el-tag>
                  </div>
                  <div class="robot-details">
                    <div class="robot-name">
                      {{ robot.name }}
                      <el-tag
                        size="small"
                        :type="robot.type === 'sync' ? 'info' : 'warning'"
                        class="type-tag"
                      >
                        {{ robot.type === 'sync' ? '同步账号' : '运营账号' }}
                      </el-tag>
                    </div>
                    <div class="robot-account">{{ robot.account }}</div>
                    <div class="robot-ip">{{ robot.ip }}</div>
                  </div>
                </div>
                <div class="robot-stats">
                  <div class="stat-item">
                    <div class="stat-label">好友:</div>
                    <div class="stat-value">{{ robot.friends }}</div>
                  </div>
                </div>
                <div class="robot-status">
                  <div class="status-item">
                    <div class="status-label">当前执行:</div>
                    <div class="status-value">{{ robot.currentTask }}</div>
                  </div>
                  <el-button size="small" type="primary" @click.stop="showTaskList(robot)">
                    任务列表
                  </el-button>
                </div>
                <div class="robot-time">
                  <div class="time-label">最近执行:</div>
                  <div class="time-value">{{ robot.lastExecuteTime }}</div>
                </div>
              </el-card>
            </div>
            <div class="add-robot-card">
              <el-card shadow="hover" @click="handleAddRobot">
                <div class="add-robot-content">
                  <el-icon :size="48"><Plus /></el-icon>
                  <div class="add-text">新增机器人</div>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="同步账号" name="sync">
          <!-- 同步账号列表，结构同上 -->
        </el-tab-pane>
        <el-tab-pane label="运营账号" name="operation">
          <!-- 运营账号列表，结构同上 -->
        </el-tab-pane>
      </el-tabs>

      <el-dialog
        v-model="showQrCodeModal"
        title="新增机器人"
        width="400px"
        :close-on-click-modal="false"
      >
        <div class="qrcode-content">
          <div class="qrcode-box">
            <!-- 二维码内容 -->
          </div>
          <div class="qrcode-tip">请使用机器人扫码登录</div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeQrCodeModal">取消</el-button>
            <el-button type="primary" @click="handleQrCodeLogin">确认登录</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 机器人表单对话框 -->
      <el-dialog
        v-model="showRobotForm"
        title="机器人信息"
        width="500px"
        :close-on-click-modal="false"
      >
        <robot-form
          ref="robotFormRef"
          @success="handleFormSuccess"
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showRobotForm = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </basic-container>
</template>

<script>
import { User, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import RobotForm from './components/RobotForm.vue';

export default {
  name: 'RobotManagement',
  components: {
    RobotForm,
    User,
    Plus,
  },
  data() {
    return {
      activeTab: 'all',
      showQrCodeModal: false,
      showRobotForm: false,
      robots: [
        {
          id: '1',
          name: '小胡同步小助手1',
          account: 'chegetongbu',
          ip: '172.16.20.174',
          friends: 2800,
          currentTask: '同步好友中',
          lastExecuteTime: '2024.07.02 15:30:30',
          status: 'online',
          type: 'sync',
        },
        {
          id: '2',
          name: '小胡同步小助手2',
          account: 'chegetongbu2',
          ip: '172.16.20.174',
          friends: 2800,
          currentTask: '心跳',
          lastExecuteTime: '2024.07.02 15:30:30',
          status: 'offline',
          type: 'sync',
        },
        {
          id: '3',
          name: '运营客服-天天',
          account: 'kefu-tiantian',
          ip: '172.16.20.174',
          friends: 2800,
          currentTask: '发送消息',
          lastExecuteTime: '2024.07.02 15:30:30',
          status: 'online',
          type: 'operation',
        },
      ],
    };
  },
  methods: {
    showDetail(robot) {
      this.$router.push(`/ai/robot-management/${robot.id}`);
    },
    showTaskList(robot) {
      this.$router.push({
        path: `/ai/robot-management/${robot.id}`,
        query: { tab: 'task' },
      });
    },
    handleAddRobot() {
      this.showQrCodeModal = true;
    },
    closeQrCodeModal() {
      this.showQrCodeModal = false;
    },
    handleQrCodeLogin() {
      this.closeQrCodeModal();
      this.showRobotForm = true;
    },
    submitForm() {
      this.$refs.robotFormRef.submit().then(() => {
        this.showRobotForm = false;
        this.refreshList();
      });
    },
    handleFormSuccess() {
      ElMessage.success('添加成功');
      this.showRobotForm = false;
      // TODO: 刷新列表
    },
    refreshList() {
      ElMessage.success('添加成功');
      // TODO: 刷新列表
    },
  },
};
</script>

<style lang="scss" scoped>
.robot-management {
  .robot-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .robot-card,
  .add-robot-card {
    :deep(.el-card__body) {
      padding: 16px;
      height: 100%;
      box-sizing: border-box;
    }
  }

  .robot-card {
    cursor: pointer;

    .robot-info {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;

      .avatar-container {
        position: relative;
        flex-shrink: 0;

        .status-tag {
          position: absolute;
          bottom: -4px;
          right: -4px;
          transform: scale(0.8);
          transform-origin: right bottom;
        }
      }

      .robot-details {
        flex: 1;
        min-width: 0;

        .robot-name {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;

          .type-tag {
            font-weight: normal;
            transform: scale(0.9);
            transform-origin: left center;
          }
        }

        .robot-account,
        .robot-ip {
          font-size: 13px;
          color: #666;
          line-height: 1.5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .robot-stats {
      margin-bottom: 12px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;

        .stat-label {
          color: #666;
          font-size: 13px;
        }

        .stat-value {
          font-weight: 500;
          font-size: 13px;
        }
      }
    }

    .robot-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .status-item {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;

        .status-label {
          color: #666;
          font-size: 13px;
          flex-shrink: 0;
        }

        .status-value {
          font-weight: 500;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      :deep(.el-button--small) {
        padding: 6px 12px;
        flex-shrink: 0;
      }
    }

    .robot-time {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 13px;

      .time-label {
        flex-shrink: 0;
      }

      .time-value {
        font-weight: 500;
      }
    }
  }

  .add-robot-card {
    .add-robot-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 160px;
      color: #909399;
      cursor: pointer;

      :deep(.el-icon) {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .add-text {
        font-size: 14px;
      }
    }
  }
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;

  .qrcode-box {
    margin-bottom: 16px;
  }

  .qrcode-tip {
    color: #666;
    margin-bottom: 24px;
  }

  .qrcode-actions {
    display: flex;
    gap: 12px;
  }
}
</style>
