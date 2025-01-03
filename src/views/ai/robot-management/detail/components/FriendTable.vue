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
          <template v-if="row.isBound">
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
          <el-button link type="primary" @click="handleSyncFriendCircle(row)">
            手动同步朋友圈
          </el-button>
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

    <!-- 添加绑定客户对话框 -->
    <el-dialog
      v-model="showBindDialog"
      title="绑定客户"
      width="900px"
      :close-on-click-modal="false"
    >
      <div class="bind-form">
        <el-form :model="bindForm" inline>
          <el-form-item label="用户">
            <el-input v-model="bindForm.keyword" placeholder="昵称/手机号" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="bindForm.status" placeholder="状态" style="width: 120px">
              <el-option label="已绑定" value="已绑定" />
              <el-option label="未绑定" value="未绑定" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleBindSearch">搜索</el-button>
            <el-button @click="handleBindReset">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 绑定客户表格 -->
        <el-table :data="customerTableData" style="width: 100%">
          <el-table-column label="客户编号" prop="id" />
          <el-table-column label="昵称" prop="nickname" />
          <el-table-column label="手机号码" prop="phone" />
          <el-table-column label="姓名" prop="name" />
          <el-table-column label="绑定状态" prop="bindStatus">
            <template #default="{ row }">
              <el-tag :type="row.bindStatus === '已绑定' ? 'success' : ''">
                {{ row.bindStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleConfirmBind(row)">绑定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 取消绑定确认对话框 -->
    <el-dialog
      v-model="showUnbindConfirm"
      title="提示"
      width="300px"
      :close-on-click-modal="false"
    >
      <span>是否确认取消绑定该客户？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUnbindConfirm = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmUnbind">确定</el-button>
        </span>
      </template>
    </el-dialog>
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
      showBindDialog: false,
      showUnbindConfirm: false,
      bindForm: {
        keyword: '',
        status: '',
      },
      customerTableData: [
        {
          id: 'KH20221110100001',
          nickname: '鹿客7198',
          phone: '17762345678',
          name: '张三',
          bindStatus: '已绑定',
        },
        {
          id: 'KH20221110100001',
          nickname: '鹿客7198',
          phone: '17762345678',
          name: '-',
          bindStatus: '未绑定',
        },
        {
          id: 'KH20221110100001',
          nickname: 'JAY',
          phone: '17762345678',
          name: '王五',
          bindStatus: '已绑定',
        },
      ],
      currentUnbindRow: null,
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
                isBound: true, // 已绑定
              },
              {
                id: 2,
                avatar: 'https://example.com/avatar2.jpg',
                nickname: '好友2',
                weixinId: 'weixin2',
                remark: '小鹿车商-URA2Y',
                customer: null,
                customerPhone: null,
                customerAvatar: null,
                syncCount: 20,
                isBound: false, // 未绑定
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
      this.showBindDialog = true;
    },
    handleUnbindCustomer(row) {
      this.currentUnbindRow = row;
      this.showUnbindConfirm = true;
    },
    handleGetFriendDetail(row) {
      ElMessage.success(`获取好友细节: ${row.nickname}`);
    },
    handleSyncFriendCircle(row) {
      ElMessage.success(`手动同步朋友圈: ${row.nickname}`);
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.loadData();
    },
    handleBindSearch() {
      // TODO: 实现搜索逻辑
    },
    handleBindReset() {
      this.bindForm.keyword = '';
      this.bindForm.status = '';
    },
    handleConfirmBind(customer) {
      ElMessage.success(`绑定客户：${customer.name}`);
      this.showBindDialog = false;
      this.loadData(); // 刷新列表
    },
    handleConfirmUnbind() {
      if (this.currentUnbindRow) {
        ElMessage.success(`取消绑定客户：${this.currentUnbindRow.customer}`);
        this.showUnbindConfirm = false;
        this.currentUnbindRow = null;
        this.loadData(); // 刷新列表
      }
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

  .bind-form {
    .el-form {
      margin-bottom: 16px;
    }
  }
}
</style>
