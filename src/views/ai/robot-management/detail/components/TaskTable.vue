<template>
  <div class="task-table">
    <!-- 搜索表单 -->
    <div class="search-form">
      <el-form :model="searchForm" inline>
        <el-form-item label="任务名称">
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
      <el-button type="primary" @click="handleAddTask">添加任务</el-button>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="tableRef" v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column label="编号" prop="id" width="80" align="center" />
        <el-table-column label="任务名称" prop="name" width="200" />
        <el-table-column label="任务状态" prop="status" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" prop="type" width="150" />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="更新时间" prop="updateTime" width="180" />
        <el-table-column label="创建人" prop="creator" width="150" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="danger" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <!-- 添加任务弹窗 -->
    <el-dialog v-model="showAddModal" title="添加任务" width="500px">
      <el-form :model="taskForm">
        <el-form-item label="选择任务">
          <el-select v-model="taskForm.type" placeholder="请选择任务">
            <el-option
              v-for="item in taskOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddModal = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';

export default {
  name: 'TaskTable',
  data() {
    return {
      loading: false,
      searchForm: {
        keyword: '',
      },
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      showAddModal: false,
      taskForm: {
        type: '',
      },
      taskOptions: [
        { label: '获取好友列表', value: 'getFriendList' },
        { label: '获取好友圈信息', value: 'getFriendCircle' },
        { label: '心跳', value: 'heartbeat' },
        { label: '获取指定好友朋友圈', value: 'getSpecificFriendCircle' },
      ],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    getStatusType(status) {
      const types = {
        未开始: 'info',
        进行中: 'warning',
        已完成: 'success',
      };
      return types[status] || 'info';
    },
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
                id: 4,
                name: '获取好友列表',
                status: '未开始',
                type: '获取好友列表',
                createTime: '2024-12-12 10:30:30',
                updateTime: '2024-12-12 10:30:30',
                creator: '张三\n17761234567',
              },
              {
                id: 5,
                name: '获取朋友圈信息',
                status: '进行中',
                type: '获取朋友圈信息',
                createTime: '2024-12-12 10:30:30',
                updateTime: '2024-12-12 10:30:30',
                creator: '张三\n17761234567',
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
    handleAddTask() {
      this.showAddModal = true;
    },
    handleConfirmAdd() {
      if (!this.taskForm.type) {
        ElMessage.warning('请选择任务类型');
        return;
      }
      ElMessage.success('添加任务：' + this.taskForm.type);
      this.showAddModal = false;
      this.taskForm.type = '';
      this.loadData();
    },
    handleDelete(row) {
      ElMessage.success('删除任务：' + row.id);
      this.loadData();
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
.task-table {
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

  .table-container {
    flex: 1;
    overflow: auto;
  }

  .pagination-container {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
