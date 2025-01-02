<template>
  <div class="friend-table">
    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="好友信息">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入昵称/备注/微信号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="table-toolbar">
      <el-button type="primary" @click="handleSendMessage">发送消息</el-button>
      <el-button type="primary" @click="handleGetFriendCircle">获取好友圈</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" fixed="left" />
      <el-table-column label="好友" width="300" fixed="left">
        <template #default="{ row }">
          <div class="friend-info">
            <el-avatar :size="32" :src="row.avatar" />
            <div class="friend-details">
              <div class="nickname">{{ row.nickname }}</div>
              <div class="sub-text">{{ row.weixinId }}</div>
              <div class="sub-text">{{ row.remark }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="绑定客户" width="300">
        <template #default="{ row }">
          <template v-if="row.customer">
            <div class="customer-info">
              <el-avatar :size="32" :src="row.customerAvatar" />
              <div class="customer-details">
                <div>{{ row.customer }}</div>
                <div class="sub-text">{{ row.customerPhone }}</div>
              </div>
              <el-button link type="primary" size="small" @click="handleUnbindCustomer(row)">
                取消绑定
              </el-button>
            </div>
          </template>
          <el-button v-else link type="primary" size="small" @click="handleBindCustomer(row)">
            绑定客户
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="已同步朋友圈" width="120" align="center" prop="syncCount">
        <template #default="{ row }">
          <span class="sync-count">{{ row.syncCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleGetFriendDetail(row)">
            获取好友细节
          </el-button>
          <el-button link type="primary" @click="handleSendMessageToOne(row)"> 发送消息 </el-button>
          <div class="sync-status">{{ row.syncStatus }}</div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="page.currentPage"
        v-model:page-size="page.pageSize"
        :total="page.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'FriendTable',
  data() {
    return {
      loading: false,
      searchForm: {
        keyword: '',
      },
      tableData: [],
      selectedRows: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        // 模拟API调用
        const res = await this.mockFetchData();
        this.tableData = res.list;
        this.page.total = res.total;
      } finally {
        this.loading = false;
      }
    },
    mockFetchData() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            list: [
              {
                id: 1,
                avatar: 'https://example.com/avatar.jpg',
                nickname: '好友昵称',
                weixinId: 'weixinhao',
                remark: '小鹿车商-URA2X',
                customer: '张三丰',
                customerPhone: '13558552521',
                customerAvatar: 'https://example.com/avatar.jpg',
                syncCount: 30,
                syncStatus: '手动同步朋友圈',
              },
            ],
            total: 100,
          });
        }, 500);
      });
    },
    handleSearch() {
      this.page.currentPage = 1;
      this.loadData();
    },
    handleReset() {
      this.searchForm.keyword = '';
      this.handleSearch();
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection;
    },
    handleSendMessage() {
      if (this.selectedRows.length === 0) {
        ElMessage.warning('请选择要发送消息的好友');
        return;
      }
      ElMessage.success('发送消息');
    },
    handleGetFriendCircle() {
      if (this.selectedRows.length === 0) {
        ElMessage.warning('请选择要获取朋友圈的好友');
        return;
      }
      ElMessage.success('获取好友圈');
    },
    handleBindCustomer(row) {
      ElMessage.success(`绑定客户: ${row.nickname}`);
    },
    handleUnbindCustomer(row) {
      ElMessage.success(`取消绑定客户: ${row.nickname}`);
    },
    handleGetFriendDetail(row) {
      ElMessage.success(`获取好友细节: ${row.nickname}`);
    },
    handleSendMessageToOne(row) {
      ElMessage.success(`发送消息给: ${row.nickname}`);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.loadData();
    },
  },
};
</script>

<style lang="scss" scoped>
.friend-table {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .search-form {
    margin-bottom: 16px;
  }

  .table-toolbar {
    margin-bottom: 16px;
    display: flex;
    gap: 8px;
  }

  .friend-info,
  .customer-info {
    display: flex;
    align-items: flex-start;
    gap: 8px;

    .friend-details,
    .customer-details {
      .nickname {
        font-weight: 500;
        margin-bottom: 4px;
      }

      .sub-text {
        font-size: 12px;
        color: #666;
        line-height: 1.5;
      }
    }
  }

  .sync-count {
    color: #2080f0;
  }

  .sync-status {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
