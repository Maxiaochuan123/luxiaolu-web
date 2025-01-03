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
        <el-table-column label="编号" type="index" width="80" align="center">
          <template #default="scope">
            {{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="任务名称" prop="taskName" width="200" />
        <el-table-column label="任务状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.taskStatus)">{{ getStatusText(row.taskStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="任务类型" prop="taskTypeName" width="150" />
        <el-table-column label="创建时间" prop="createdAt" width="180" />
        <el-table-column label="更新时间" prop="updatedAt" width="180" />
        <el-table-column label="创建人" prop="createdBy" width="150" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button 
              link 
              type="danger" 
              :loading="deleting" 
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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
          <el-button @click="showAddModal = false" :disabled="submitting">取消</el-button>
          <el-button type="primary" @click="handleConfirmAdd" :loading="submitting">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTaskList, getTaskTypes, createTask, removeTask } from '@/api/ai/robot-management';

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
      taskOptions: [],
      submitting: false,
      deleting: false,
    };
  },
  computed: {
    actuatorId() {
      return this.$route.params.id;
    }
  },
  created() {
    this.loadData();
    this.loadTaskTypes();
  },
  methods: {
    getStatusType(status) {
      const types = {
        NotStart: 'info',
        InProgress: 'warning',
        Ended: 'success',
        Unknown: 'info'
      };
      return types[status] || 'info';
    },
    getStatusText(status) {
      const texts = {
        NotStart: '未开始',
        InProgress: '进行中',
        Ended: '已完成',
        Unknown: '未知'
      };
      return texts[status] || status;
    },
    async loadData() {
      this.loading = true;
      try {
        const res = await getTaskList({
          actuatorId: this.actuatorId,
          keyword: this.searchForm.keyword,
          pageIndex: this.page.currentPage,
          pageSize: this.page.pageSize
        });
        
        if (res.data.success) {
          const { records, total } = res.data.data;
          this.tableData = records;
          this.page.total = total;
        } else {
          ElMessage.error(res.data.msg || '获取任务列表失败');
        }
      } catch (error) {
        console.error('获取任务列表失败:', error);
        ElMessage.error('获取任务列表失败');
      } finally {
        this.loading = false;
      }
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
    async handleConfirmAdd() {
      if (!this.taskForm.type) {
        ElMessage.warning('请选择任务类型');
        return;
      }

      this.submitting = true;
      try {
        const res = await createTask({
          actuatorId: this.actuatorId,
          taskType: this.taskForm.type
        });

        if (res.data.success) {
          ElMessage.success('添加任务成功');
          this.showAddModal = false;
          this.taskForm.type = '';
          this.loadData(); // 刷新列表
        } else {
          ElMessage.error(res.data.msg || '添加任务失败');
        }
      } catch (error) {
        console.error('添加任务失败:', error);
        ElMessage.error('添加任务失败');
      } finally {
        this.submitting = false;
      }
    },
    async handleDelete(row) {
      try {
        await ElMessageBox.confirm('确认要删除该任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });

        this.deleting = true;
        const res = await removeTask({ id: row.id });

        if (res.data.success) {
          ElMessage.success('删除任务成功');
          this.loadData(); // 刷新列表
        } else {
          ElMessage.error(res.data.msg || '删除任务失败');
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除任务失败:', error);
          ElMessage.error('删除任务失败');
        }
      } finally {
        this.deleting = false;
      }
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.loadData();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.loadData();
    },
    // 获取任务类型列表
    async loadTaskTypes() {
      try {
        const res = await getTaskTypes();
        if (res.data.success) {
          this.taskOptions = res.data.data.map(item => ({
            label: item.name,
            value: item.value
          }));
        } else {
          ElMessage.error(res.data.msg || '获取任务类型列表失败');
        }
      } catch (error) {
        console.error('获取任务类型列表失败:', error);
        ElMessage.error('获取任务类型列表失败');
      }
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
