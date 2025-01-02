<template>
  <div class="group-table">
    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="群名">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入"
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
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" fixed="left" />
      <el-table-column label="ID" prop="id" width="100" align="center" />
      <el-table-column label="群名" prop="name" width="300" />
      <el-table-column label="人数" prop="memberCount" width="100" align="center" />
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
  name: 'GroupTable',
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
                name: '资源群1',
                memberCount: 20,
              },
              {
                id: 2,
                name: '资源群2',
                memberCount: 100,
              },
            ],
            total: 2,
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
        ElMessage.warning('请选择要发送消息的群');
        return;
      }
      const selectedIds = this.selectedRows.map(row => row.id);
      ElMessage.success('发送消息给选中的群：' + selectedIds.join(','));
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
.group-table {
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

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
