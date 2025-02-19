<template>
  <basic-container>
    <div class="app-container">
      <!-- 搜索区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="客户信息">
            <el-input v-model="queryParams.keyword" placeholder="请输入客户信息" clearable style="width: 200px;" />
          </el-form-item>
          <el-form-item label="公众号">
            <el-select v-model="queryParams.hasFollowedOfficial" placeholder="请选择公众号状态" clearable style="width: 200px;">
              <el-option label="已关注" value="0" />
              <el-option label="取消关注" value="1" />
              <el-option label="未关注" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="朋友圈">
            <el-select v-model="queryParams.hasSyncedToMoments" placeholder="请选择朋友圈同步状态" clearable style="width: 200px;">
              <el-option label="已同步" value="0" />
              <el-option label="未同步" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道">
            <el-select v-model="queryParams.channel" placeholder="请选择渠道" clearable style="width: 200px;">
              <el-option label="快手" value="0" />
              <el-option label="小鹿微店" value="1" />
              <el-option label="抖音" value="2" />
              <el-option label="豆秒好车" value="3" />
              <el-option label="小鹿小程序" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 200px;">
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
        >
          <el-table-column prop="id" label="客户编号" width="140">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleDetail(row)">{{ row.id }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="头像" width="70">
            <template #default="{ row }">
              <el-avatar :size="40" :src="row.headImage" />
            </template>
          </el-table-column>
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column prop="mobile" label="手机号码" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="hasFollowedOfficial" label="公众号">
            <template #default="{ row }">
              <el-tag :type="row.hasFollowedOfficial === '0' ? 'success' : row.hasFollowedOfficial === '1' ? 'danger' : 'info'">
                {{ row.hasFollowedOfficial === '0' ? '已关注' : row.hasFollowedOfficial === '1' ? '取消关注' : '未关注' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="hasSyncedToMoments" label="朋友圈同步">
            <template #default="{ row }">
              <el-tag :type="row.hasSyncedToMoments === '0' ? 'success' : 'info'">
                {{ row.hasSyncedToMoments === '0' ? '已同步' : '未同步' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="channel" label="渠道">
            <template #default="{ row }">
                {{ 
                  row.channel === '0' ? '快手' : 
                  row.channel === '1' ? '小鹿微店' : 
                  row.channel === '2' ? '抖音' :
                  row.channel === '3' ? '豆秒好车' : '小鹿小程序'
                }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === '1' ? 'success' : 'danger'">
                {{ row.status === '1' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column prop="updatedAt" label="更新时间" />
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button
                link
                :type="row.status === '0' ? 'success' : 'danger'"
                @click="handleStatus(row)"
              >
                {{ row.status === '0' ? '启用' : '禁用' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="pageParams.pageIndex"
            v-model:page-size="pageParams.pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <!-- 详情抽屉 -->
      <el-drawer
        v-model="drawerVisible"
        title="客户详情"
        size="800px"
        :destroy-on-close="true"
      >
        <div class="drawer-content">
          <div class="base-info">
            <div class="user-header">
              <div class="avatar-wrap">
                <el-avatar :size="60" :src="currentRow.headImage" />
              </div>
              <div class="user-id">
                <div class="label">客户编号</div>
                <div class="value">{{ currentRow.id }}</div>
              </div>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="label">昵称：</span>
                <span class="value">{{ currentRow.nickName }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机号码：</span>
                <span class="value">{{ currentRow.mobile }}</span>
              </div>
              <div class="info-item">
                <span class="label">关注：</span>
                <span class="value">
                  <el-tag :type="currentRow.hasFollowedOfficial === '0' ? 'success' : currentRow.hasFollowedOfficial === '1' ? 'danger' : 'info'">
                    {{ currentRow.hasFollowedOfficial === '0' ? '已关注' : currentRow.hasFollowedOfficial === '1' ? '取消关注' : '未关注' }}
                  </el-tag>
                </span>
              </div>
              <div class="info-item">
                <span class="label">创建时间：</span>
                <span class="value">{{ currentRow.createdAt }}</span>
              </div>
            </div>
          </div>

          <div class="detail-info">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="基本信息" name="basic">
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">昵称</span>
                    <span class="value">{{ currentRow.nickName }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">手机号码</span>
                    <span class="value">{{ currentRow.mobile }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">微信昵称</span>
                    <span class="value">{{ currentRow.weChatName || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">微信号</span>
                    <span class="value">{{ currentRow.weChatCode || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">姓名</span>
                    <span class="value">{{ currentRow.username || '-' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">身份证号</span>
                    <span class="value">{{ currentRow.idCardNo || '-' }}</span>
                  </div>
                  <div class="id-card-images">
                    <div class="image-item">
                      <div class="label">身份证正面</div>
                      <div class="image-container">
                        <el-image 
                          v-if="currentRow.idCardPortraitImage" 
                          :src="currentRow.idCardPortraitImage" 
                          fit="cover"
                          :preview-src-list="[currentRow.idCardPortraitImage]"
                        />
                        <div v-else class="no-image">暂无图片</div>
                      </div>
                    </div>
                    <div class="image-item">
                      <div class="label">身份证反面</div>
                      <div class="image-container">
                        <el-image 
                          v-if="currentRow.idCardNationalImage" 
                          :src="currentRow.idCardNationalImage" 
                          fit="cover"
                          :preview-src-list="[currentRow.idCardNationalImage]"
                        />
                        <div v-else class="no-image">暂无图片</div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="账号列表" name="accounts">
                <div class="empty-block">
                  <el-empty description="暂无数据" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="相关记录" name="records">
                <div class="empty-block">
                  <el-empty description="暂无数据" />
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-drawer>
    </div>
  </basic-container>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getList, updateUserStatus } from '@/api/customer/list';

export default {
  name: 'CustomerList',
  setup() {
    // 查询参数
    const queryParams = reactive({
      keyword: '',
      hasFollowedOfficial: '',
      hasSyncedToMoments: '',
      channel: '',
      status: ''
    });

    // 表格数据
    const loading = ref(false);
    const tableData = ref([]);

    // 分页参数
    const pageParams = reactive({
      pageIndex: 1,
      pageSize: 10
    });
    const total = ref(0);

    // 详情抽屉相关
    const drawerVisible = ref(false);
    const currentRow = ref({});
    const activeTab = ref('basic');

    // 获取列表数据
    const getTableData = async () => {
      loading.value = true;
      try {
        const res = await getList(pageParams.pageIndex, pageParams.pageSize, queryParams);
        if (res.data.code === 200) {
          tableData.value = res.data.data.records || [];
          total.value = res.data.data.total || 0;
        } else {
          ElMessage.error(res.data.msg || '获取列表失败');
        }
      } catch (error) {
        console.error('获取列表失败:', error);
        ElMessage.error('获取列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 查询操作
    const handleQuery = () => {
      pageParams.pageIndex = 1;
      getTableData();
    };

    // 重置查询
    const resetQuery = () => {
      queryParams.keyword = '';
      queryParams.hasFollowedOfficial = '';
      queryParams.hasSyncedToMoments = '';
      queryParams.channel = '';
      queryParams.status = '';
      handleQuery();
    };

    // 状态更新
    const handleStatus = async (row) => {
      const newStatus = row.status === '0' ? '1' : '0';
      const actionText = newStatus === '1' ? '启用' : '禁用';
      
      ElMessageBox.confirm(`是否${actionText}该客户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await updateUserStatus(row.id, newStatus);
          if (res.data.code === 200) {
            ElMessage.success(`${actionText}成功`);
            getTableData();
          } else {
            ElMessage.error(res.data.msg || `${actionText}失败`);
          }
        } catch (error) {
          console.error(`${actionText}失败:`, error);
          ElMessage.error(`${actionText}失败`);
        }
      });
    };

    // 分页操作
    const handleSizeChange = (val) => {
      pageParams.pageSize = val;
      getTableData();
    };

    const handleCurrentChange = (val) => {
      pageParams.pageIndex = val;
      getTableData();
    };

    // 查看详情
    const handleDetail = (row) => {
      currentRow.value = row;
      drawerVisible.value = true;
    };

    onMounted(() => {
      getTableData();
    });

    return {
      // 数据
      queryParams,
      loading,
      tableData,
      pageParams,
      total,
      drawerVisible,
      currentRow,
      activeTab,

      // 方法
      handleQuery,
      resetQuery,
      handleStatus,
      handleSizeChange,
      handleCurrentChange,
      handleDetail
    };
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    margin-bottom: 20px;
    background-color: #fff;
    padding: 20px;
  }

  .table-container {
    background-color: #fff;
    padding: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .drawer-content {
    padding: 0 20px;

    .base-info {
      margin-bottom: 20px;

      .user-header {
        display: flex;
        align-items: flex-start;
        margin-bottom: 24px;

        .avatar-wrap {
          margin-right: 20px;
        }

        .user-id {
          .label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }
          .value {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }

      .info-list {
        display: flex;
        flex-wrap: wrap;

        .info-item {
          margin-right: 32px;
          margin-bottom: 16px;
          width: calc((100% - 96px) / 4);
          min-width: 160px;
          display: flex;
          flex-direction: column;

          &:nth-child(4n) {
            margin-right: 0;
          }

          .label {
            color: #909399;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .value {
            color: #303133;
            font-size: 14px;
          }
        }
      }
    }

    .detail-info {
      .empty-block {
        padding: 60px 0;
      }

      .info-list {
        display: flex;
        flex-wrap: wrap;
        margin-top: 20px;

        .info-item {
          margin-right: 32px;
          margin-bottom: 16px;
          width: calc((100% - 96px) / 4);
          min-width: 160px;
          display: flex;
          flex-direction: column;

          &:nth-child(4n) {
            margin-right: 0;
          }

          .label {
            color: #909399;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .value {
            color: #303133;
            font-size: 14px;
          }
        }
      }
    }

    .id-card-images {
      margin-top: 24px;
      display: flex;
      gap: 24px;

      .image-item {
        .label {
          color: #909399;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .image-container {
          width: 240px;
          height: 151px;
          border: 1px dashed #d9d9d9;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;

          :deep(.el-image) {
            width: 100%;
            height: 100%;
          }

          .no-image {
            color: #909399;
            font-size: 14px;
          }
        }
      }
    }
  }
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style> 