<template>
  <div class="form-drawer-content">
    <div class="form-content">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="auto"
        :disabled="isViewMode"
      >
        <el-form-item label="机器人类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio label="sync">同步</el-radio>
            <el-radio label="operation">运营</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="机器人名称" prop="name">
          <el-input v-model="formData.name" placeholder="自动获取或手动填写" />
        </el-form-item>

        <el-form-item label="机器人IP地址" prop="ip">
          <el-input v-model="formData.ip" placeholder="自动获取或手动填写" />
        </el-form-item>

        <el-form-item label="机器人key" prop="key">
          <el-input v-model="formData.key" placeholder="自动获取或手动填写" />
        </el-form-item>

        <el-form-item label="任务执行时间隔最大时间(s)" prop="maxInterval">
          <el-input-number v-model="formData.maxInterval" :min="1" />
        </el-form-item>

        <el-form-item label="任务执行时间隔最小时间(s)" prop="minInterval">
          <el-input-number v-model="formData.minInterval" :min="1" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RobotForm',
  props: {
    editData: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: {
    formType: {
      default: 'add',
    },
  },
  data() {
    return {
      formRef: null,
      formData: {
        type: 'sync',
        name: '',
        ip: '',
        key: '',
        maxInterval: 10,
        minInterval: 5,
      },
      rules: {
        type: [{ required: true, message: '请选择机器人类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入机器人名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入机器人IP地址', trigger: 'blur' }],
        key: [{ required: true, message: '请输入机器人key', trigger: 'blur' }],
        maxInterval: [{ required: true, message: '请输入最大时间间隔', trigger: 'blur' }],
        minInterval: [{ required: true, message: '请输入最小时间间隔', trigger: 'blur' }],
      },
    };
  },
  computed: {
    isViewMode() {
      return this.formType === 'view';
    },
  },
  watch: {
    editData: {
      handler(val) {
        if (val) {
          this.formData = { ...this.formData, ...val };
        }
      },
      immediate: true,
    },
  },
  methods: {
    async validate() {
      try {
        await this.$refs.formRef.validate();
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.form-drawer-content {
  width: 100%;
  display: flex;
  gap: 24px;
  .form-content {
    flex: 1;
  }
}
</style>
