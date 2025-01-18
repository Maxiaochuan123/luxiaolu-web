<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-card class="filter-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="模式">
          <el-select v-model="queryParams.mode" placeholder="请选择模式" clearable style="width: 200px;">
            <el-option label="全部" value="" />
            <el-option label="常量" value="constant" />
            <el-option label="正则" value="regex" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮区域 -->
    <el-card class="table-container">
      <template #header>
        <div class="card-header">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="白名单" name="white" />
            <el-tab-pane label="黑名单" name="black" />
            <el-tab-pane label="模糊" name="fuzzy" />
          </el-tabs>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </div>
      </template>

      <!-- 表格区域 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="keyword" label="关键词" />
        <el-table-column prop="mode" label="模式">
          <template #default="{ row }">
            <el-tag :type="row.mode === 'constant' ? '' : 'success'">
              {{ row.mode === 'constant' ? '常量' : '正则' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="handleEdit(row)"
              v-if="row.status !== 1"
            >编辑</el-button>
            <el-button
              link
              :type="row.status === 0 ? 'danger' : 'success'"
              @click="handleStatus(row)"
            >
              {{ row.status === 0 ? '禁用' : '启用' }}
            </el-button>
            <el-button
              link
              type="danger"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pageParams.currentPage"
          v-model:page-size="pageParams.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="关键词" prop="keyword">
          <el-input
            v-model="form.keyword"
            placeholder="请输入关键词"
            maxlength="50"
            show-word-limit
            type="text"
            clearable
          />
        </el-form-item>
        <el-form-item label="模式" prop="mode">
          <el-select v-model="form.mode" placeholder="请选择模式" style="width: 100%">
            <el-option label="常量" value="constant" />
            <el-option label="正则" value="regex" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getList, add, update, remove, updateStatus } from '@/api/product/word-library';

export default {
  name: 'WordLibrary',
  setup() {
    // 查询参数
    const queryParams = reactive({
      keyword: '',
      mode: ''
    });

    // 表格数据
    const loading = ref(false);
    const tableData = ref([]);
    const activeTab = ref('white');

    // 分页参数
    const pageParams = reactive({
      currentPage: 1,
      pageSize: 10
    });
    const total = ref(0);

    // 表单参数
    const dialogVisible = ref(false);
    const dialogTitle = ref('');
    const formRef = ref(null);
    const form = reactive({
      id: undefined,
      keyword: '',
      mode: ''
    });
    const rules = {
      keyword: [
        { required: true, message: '请输入关键词', trigger: 'blur' }
      ],
      mode: [
        { required: true, message: '请选择模式', trigger: 'change' }
      ]
    };

    // 获取列表数据
    const getTableData = async () => {
      loading.value = true;
      try {
        const params = {
          ...queryParams,
          type: activeTab.value
        };
        const res = await getList(pageParams.currentPage, pageParams.pageSize, params);
        tableData.value = res.data.data.records;
        total.value = res.data.data.total;
      } catch (error) {
        console.error('获取列表失败:', error);
        ElMessage.error('获取列表失败');
      } finally {
        loading.value = false;
      }
    };

    // 查询操作
    const handleQuery = () => {
      pageParams.currentPage = 1;
      getTableData();
    };

    // 重置查询
    const resetQuery = () => {
      queryParams.keyword = '';
      queryParams.mode = '';
      handleQuery();
    };

    // 标签页切换
    const handleTabClick = () => {
      handleQuery();
    };

    // 新增操作
    const handleAdd = () => {
      dialogTitle.value = '新增单词';
      form.id = undefined;
      form.keyword = '';
      form.mode = '';
      dialogVisible.value = true;
    };

    // 编辑操作
    const handleEdit = (row) => {
      dialogTitle.value = '编辑单词';
      form.id = row.id;
      form.keyword = row.keyword;
      form.mode = row.mode;
      dialogVisible.value = true;
    };

    // 提交表单
    const submitForm = async () => {
      if (!formRef.value) return;
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            if (form.id) {
              await update(form);
              ElMessage.success('更新成功');
            } else {
              await add(form);
              ElMessage.success('添加成功');
            }
            dialogVisible.value = false;
            getTableData();
          } catch (error) {
            console.error('操作失败:', error);
            ElMessage.error('操作失败');
          }
        }
      });
    };

    // 删除操作
    const handleDelete = (row) => {
      ElMessageBox.confirm('确定要删除该记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await remove(row.id);
          ElMessage.success('删除成功');
          getTableData();
        } catch (error) {
          console.error('删除失败:', error);
          ElMessage.error('删除失败');
        }
      });
    };

    // 状态更新
    const handleStatus = async (row) => {
      try {
        await updateStatus(row.id, row.status === 0 ? 1 : 0);
        ElMessage.success('状态更新成功');
        getTableData();
      } catch (error) {
        console.error('状态更新失败:', error);
        ElMessage.error('状态更新失败');
      }
    };

    // 分页操作
    const handleSizeChange = (val) => {
      pageParams.pageSize = val;
      getTableData();
    };

    const handleCurrentChange = (val) => {
      pageParams.currentPage = val;
      getTableData();
    };

    // 弹窗关闭
    const handleDialogClose = () => {
      if (formRef.value) {
        formRef.value.resetFields();
      }
    };

    onMounted(() => {
      getTableData();
    });

    return {
      // 数据
      queryParams,
      loading,
      tableData,
      activeTab,
      pageParams,
      total,
      dialogVisible,
      dialogTitle,
      formRef,
      form,
      rules,

      // 方法
      handleQuery,
      resetQuery,
      handleTabClick,
      handleAdd,
      handleEdit,
      handleDelete,
      handleStatus,
      handleSizeChange,
      handleCurrentChange,
      submitForm,
      handleDialogClose
    };
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  
  .filter-container {
    margin-bottom: 20px;
  }

  .table-container {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.el-card__header) {
  padding: 10px 20px;
}

:deep(.el-tabs__header) {
  margin: 0;
}
</style> 