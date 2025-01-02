<template>
  <basic-container>
    <div class="robot-detail">
      <div class="layout-container">
        <!-- 左侧信息 -->
        <div class="left-side">
          <el-card class="info-card">
            <template #header>
              <div class="card-header">
                <span>机器人信息</span>
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
                <el-button class="action-btn" @click="handleWakeup">唤醒</el-button>
                <el-button class="action-btn" type="primary" @click="handleConfirmWakeup">
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
  </basic-container>
</template>

<script>
import { User, UserFilled, List } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
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
        {
          label: '好友列表',
          key: 'friend',
          icon: 'User',
        },
        {
          label: '群列表',
          key: 'group',
          icon: 'UserFilled',
        },
        {
          label: '任务列表',
          key: 'task',
          icon: 'List',
        },
      ],
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
      const robotId = this.$route.params.id;
      // 模拟加载数据
      this.robotInfo = {
        name: `小胡同步小助手${robotId}`,
        account: 'chegetongbu',
        ip: '172.16.20.174',
        friends: 2800,
        status: 'online',
        currentTask: '同步好友中',
        lastExecuteTime: '2024.07.02 15:30:30',
        type: 'sync',
      };
    },
    handleMenuSelect(key) {
      this.activeKey = key;
    },
    handleWakeup() {
      ElMessage.info('唤醒机器人');
    },
    handleConfirmWakeup() {
      ElMessage.success('确认唤醒');
    },
  },
};
</script>

<style lang="scss" scoped>
.robot-detail {
  padding: 6px;
  height: calc(100vh - 122px);
  box-sizing: border-box;
  min-width: 900px;

  .layout-container {
    display: flex;
    gap: 8px;
    height: 100%;
    min-width: 100%;
  }

  .left-side, .right-info {
    border: 1px solid #eee;
  }

  .left-side {
    width: 300px;
    min-width: 300px;
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
  }

  .info-card {
    height: 100%;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .robot-info {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .info-header {
      .basic-info {
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
        align-items: center;

        .avatar-wrapper {
          position: relative;

          .status-tag {
            position: absolute;
            bottom: 14px;
            right: 4px;
          }
        }

        .right-info {
          padding: 4px 0;
          .text-item {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 4px;
            color: #666;

            &:first-child {
              font-size: 16px;
              font-weight: 500;
              color: #333;
              margin-bottom: 6px;
            }
          }
        }
      }

      .extra-info {
        .text-item {
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 4px;
          color: #666;
        }
      }
    }

    .function-list {
      flex: 1;
      margin: 24px 0;
      border-right: none;
    }

    .bottom-actions {
      padding: 0 12px;
      display: flex;
      gap: 12px;

      .action-btn {
        flex: 1;
        min-width: 80px;
      }
    }
  }
}
</style>
