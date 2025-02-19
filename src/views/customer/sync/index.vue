<template>
  <basic-container>
    <div class="app-container">
      <!-- 搜索区域 -->
      <div class="filter-container">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="客户信息">
            <el-input v-model="queryParams.keyword" placeholder="请输入客户信息" clearable style="width: 200px;" />
          </el-form-item>
          <el-form-item label="同步号">
            <el-input v-model="queryParams.mobile" placeholder="请输入同步号" clearable style="width: 200px;" />
          </el-form-item>
          <el-form-item label="同步状态">
            <el-select v-model="queryParams.syncStatus" placeholder="请选择同步状态" clearable style="width: 200px;">
              <el-option label="未同步" value="NotSync" />
              <el-option label="已暂停" value="Pause" />
              <el-option label="已同步" value="Sync" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px;"
              value-format="YYYY-MM-DD"
            />
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
          <el-table-column prop="id" label="客户编号" width="140" />
          <el-table-column label="头像" width="70">
            <template #default="{ row }">
              <el-avatar :size="40" :src="row.headImage" />
            </template>
          </el-table-column>
          <el-table-column prop="weChatName" label="微信昵称" />
          <el-table-column prop="weChatCode" label="微信号" />
          <el-table-column prop="remark" label="客户备注" />
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column prop="mobile" label="手机号码" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="syncCount" label="朋友圈数量" />
          <el-table-column label="同步状态" width="120">
            <template #default="{ row }">
              <el-switch
                v-model="row.syncStatus"
                :active-value="'Sync'"
                :inactive-value="'NotSync'"
                :active-text="row.syncStatus === 'Sync' ? '已同步' : '已暂停'"
                @change="(val) => handleSyncStatusChange(row, val === 'Sync')"
              />
            </template>
          </el-table-column>
          <el-table-column prop="customerServiceCode" label="同步号" />
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column prop="syncTime" label="最近同步时间" />
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
    </div>
  </basic-container>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getWechatMomentsInfo, switchSyncStatus } from '@/api/customer/sync';

export default {
  name: 'CustomerSync',
  setup() {
    // 查询参数
    const queryParams = reactive({
      keyword: '',
      mobile: '',
      syncStatus: '',
    });

    // 日期范围
    const dateRange = ref([]);

    // 表格数据
    const loading = ref(false);
    const tableData = ref([]);

    // 分页参数
    const pageParams = reactive({
      pageIndex: 1,
      pageSize: 10
    });
    const total = ref(0);

    // 获取列表数据
    const getTableData = async () => {
      loading.value = true;
      try {
        const params = {
          ...queryParams,
          startDate: dateRange.value?.[0],
          endDate: dateRange.value?.[1],
        };
        const res = await getWechatMomentsInfo(pageParams.pageIndex, pageParams.pageSize, params);
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
      queryParams.mobile = '';
      queryParams.syncStatus = '';
      dateRange.value = [];
      handleQuery();
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

    // 切换同步状态
    const handleSyncStatusChange = async (row, val) => {
      try {
        const res = await switchSyncStatus(row.id, row.userId, val);
        if (res.data.code === 200) {
          ElMessage.success(`${val ? '开启' : '暂停'}同步成功`);
          getTableData();
        } else {
          ElMessage.error(res.data.msg || `${val ? '开启' : '暂停'}同步失败`);
        }
      } catch (error) {
        console.error('切换同步状态失败:', error);
        ElMessage.error(`${val ? '开启' : '暂停'}同步失败`);
      }
    };

    // 在组件挂载时获取数据
    onMounted(() => {
      getTableData();
    });

    return {
      // 数据
      queryParams,
      dateRange,
      loading,
      tableData,
      pageParams,
      total,

      // 方法
      handleQuery,
      resetQuery,
      handleSizeChange,
      handleCurrentChange,
      handleSyncStatusChange
    };
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
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
}
</style> 