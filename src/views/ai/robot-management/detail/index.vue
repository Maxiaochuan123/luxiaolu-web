<template>
  <div class="robot-detail">
    <div class="layout-container">
      <!-- 左侧信息 -->
      <div class="left-side">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-button link @click="handleBack">
                  <el-icon><ArrowLeft /></el-icon>
                </el-button>
                <span>机器人信息</span>
              </div>
              <el-tag
                size="small"
                :type="robotInfo.type === 'sync' ? 'info' : 'warning'"
                class="type-tag"
                round
              >
                {{ robotInfo.type === 'sync' ? '同步账号' : '运营账号' }}
              </el-tag>
            </div>
          </template>
          <div class="robot-info">
            <div class="info-header">
              <div class="basic-info">
                <div class="avatar-wrapper">
                  <el-avatar :size="48">
                    <el-icon><User /></el-icon>
                  </el-avatar>
                  <el-tag
                    :type="robotInfo.status === 'online' ? 'success' : 'danger'"
                    size="small"
                    class="status-tag"
                  >
                    {{ robotInfo.status === 'online' ? '在线' : '掉线' }}
                  </el-tag>
                </div>
                <div class="right-info">
                  <div class="text-item">{{ robotInfo.name }}</div>
                  <div class="text-item">{{ robotInfo.account }}</div>
                  <div class="text-item">{{ robotInfo.ip }}</div>
                </div>
              </div>
              <div class="extra-info">
                <div class="text-item">好友: {{ robotInfo.friends }}</div>
                <div class="text-item">当前执行: {{ robotInfo.currentTask }}</div>
                <div class="text-item">最近执行: {{ robotInfo.lastExecuteTime }}</div>
              </div>
            </div>

            <!-- 功能列表 -->
            <el-menu
              v-model="activeKey"
              class="function-list"
              :default-active="activeKey"
              @select="handleMenuSelect"
            >
              <el-menu-item v-for="item in menuOptions" :key="item.key" :index="item.key">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </el-menu-item>
            </el-menu>

            <!-- 底部按钮 -->
            <div class="bottom-actions">
              <el-button 
                class="action-btn" 
                :loading="waking"
                @click="handleWakeup"
              >
                唤醒
              </el-button>
              <el-button 
                class="action-btn" 
                type="primary" 
                :loading="awakening"
                @click="handleConfirmWakeup"
              >
                确认唤醒
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 右侧表格 -->
      <div class="right-side">
        <component :is="currentTable" ref="tableRef" />
      </div>
    </div>
  </div>
</template>

<script>
import { User, UserFilled, List, ArrowLeft } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { wakeUpRobot, awakenRobot } from '@/api/ai/robot-management';
import FriendTable from './components/FriendTable.vue';
import GroupTable from './components/GroupTable.vue';
import TaskTable from './components/TaskTable.vue';

export default {
  name: 'RobotDetailPage',
  components: {
    FriendTable,
    GroupTable,
    TaskTable,
    User,
    UserFilled,
    List,
    ArrowLeft,
  },
  data() {
    return {
      robotInfo: {
        name: '',
        account: '',
        ip: '',
        friends: 0,
        status: 'online',
        currentTask: '',
        lastExecuteTime: '',
        type: 'sync',
      },
      activeKey: 'friend',
      menuOptions: [
        // {
        //   label: '好友列表',
        //   key: 'friend',
        //   icon: 'User',
        // },
        // {
        //   label: '群列表',
        //   key: 'group',
        //   icon: 'UserFilled',
        // },
        {
          label: '任务列表',
          key: 'task',
          icon: 'List',
        },
      ],
      waking: false,
      awakening: false,
    };
  },
  computed: {
    currentTable() {
      const tables = {
        friend: FriendTable,
        group: GroupTable,
        task: TaskTable,
      };
      return tables[this.activeKey] || FriendTable;
    },
  },
  created() {
    this.loadRobotInfo();
    if (this.$route.query.tab) {
      this.activeKey = this.$route.query.tab;
    }
  },
  methods: {
    loadRobotInfo() {
      const robotInfo = this.$route.query.robotInfo;
      if (robotInfo) {
        try {
          const info = JSON.parse(robotInfo);
          this.robotInfo = {
            name: info.name,
            account: info.account,
            ip: info.ip,
            friends: info.friends,
            status: info.status,
            currentTask: info.currentTask,
            lastExecuteTime: info.lastExecuteTime,
            type: info.type,
          };
          console.log('this.robotInfo', this.robotInfo);
        } catch (error) {
          console.error('解析机器人信息失败:', error);
        }
      }
    },
    handleMenuSelect(key) {
      this.activeKey = key;
    },
    async handleWakeup() {
      if (this.waking) return;
      
      this.waking = true;
      try {
        const res = await wakeUpRobot({ id: this.$route.params.id });
        if (res.data.success) {
          ElMessage.success('唤醒指令已发送');
        } else {
          ElMessage.error(res.data.msg || '唤醒失败');
        }
      } catch (error) {
        console.error('唤醒失败:', error);
        ElMessage.error('唤醒失败');
      } finally {
        this.waking = false;
      }
    },
    async handleConfirmWakeup() {
      if (this.awakening) return;
      
      this.awakening = true;
      try {
        const res = await awakenRobot({ id: this.$route.params.id });
        if (res.data.success) {
          ElMessage.success('确认唤醒成功');
        } else {
          ElMessage.error(res.data.msg || '确认唤醒失败');
        }
      } catch (error) {
        console.error('确认唤醒失败:', error);
        ElMessage.error('确认唤醒失败');
      } finally {
        this.awakening = false;
      }
    },
    handleBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss" scoped>
.robot-detail {
  padding: 4px 12px;
  height: calc(100vh - 122px);
  box-sizing: border-box;
  min-width: 900px;

  .layout-container {
    display: flex;
    gap: 16px;
    height: 100%;
    min-width: 100%;
  }

  .left-side {
    width: 320px;
    min-width: 320px;
    flex-shrink: 0;
    height: 100%;
  }

  .right-side {
    flex: 1;
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  }

  .info-card {
    height: 100%;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    :deep(.el-card__header) {
      padding: 12px 20px;
      border-bottom: 1px solid #f0f0f0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;
        gap: 4px;

        .el-button {
          padding: 0 4px;
          margin-right: 4px;
          font-size: 16px;
          height: 32px;
          
          .el-icon {
            font-size: 16px;
          }
        }
      }

      span {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }

      .type-tag {
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 12px;
        background: #fff7e6;
        color: #fa8c16;
        border-color: #ffd591;
      }
    }
  }

  .robot-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    // padding: 0 20px;

    .info-header {
      padding: 20px 0;
      border-bottom: 1px solid #f5f5f5;

      .basic-info {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        align-items: flex-start;

        .avatar-wrapper {
          position: relative;
          flex-shrink: 0;

          .el-avatar {
            background: #f0f2f5;
          }

          .status-tag {
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            padding: 0 6px;
            height: 18px;
            line-height: 16px;
            font-size: 12px;
            white-space: nowrap;
          }
        }

        .right-info {
          flex: 1;
          min-width: 0;
          padding-top: 4px;
          
          .text-item {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 8px;
            color: #666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:first-child {
              font-size: 16px;
              font-weight: 500;
              color: #333;
            }

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }

      .extra-info {
        .text-item {
          font-size: 14px;
          line-height: 2;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .function-list {
      flex: 1;
      margin: 0;
      padding: 12px 0;
      border: none;
      border-bottom: 1px solid #f5f5f5;

      :deep(.el-menu-item) {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin: 4px 0;

        &.is-active {
          background: #e6f7ff;
          color: #1890ff;
          font-weight: 500;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 16px;
            background: #1890ff;
            border-radius: 0 2px 2px 0;
          }
        }

        .el-icon {
          margin-right: 12px;
        }
      }
    }

    .bottom-actions {
      padding: 20px;
      display: flex;
      gap: 12px;

      .action-btn {
        flex: 1;
        min-width: 80px;
        height: 36px;
        font-size: 14px;
      }
    }
  }
}
</style>
