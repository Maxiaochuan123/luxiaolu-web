<template>
  <div class="robot-form">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="执行器名称" prop="actuatorName">
        <el-input v-model="form.actuatorName" placeholder="请输入执行器名称" />
      </el-form-item>
      <el-form-item label="执行器IP" prop="actuatorIp">
        <el-input v-model="form.actuatorIp" placeholder="请输入执行器IP" />
      </el-form-item>
      <el-form-item label="执行器Key" prop="actuatorKey">
        <el-input v-model="form.actuatorKey" placeholder="请输入执行器Key(机器人微信号)" :disabled="!!qrData.key" />
      </el-form-item>
      <el-form-item label="执行器UUID" prop="actuatorUuid">
        <el-input v-model="form.actuatorUuid" placeholder="请输入执行器UUID(机器人QrUuid)" :disabled="!!qrData.uuid" />
      </el-form-item>
      <el-form-item label="执行间隔时间" required>
        <el-col :span="11">
          <el-form-item prop="intervalMin">
            <el-input-number
              v-model="form.intervalMin"
              :min="0"
              placeholder="最小间隔"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2" class="text-center">
          <span class="text-gray-500">-</span>
        </el-col>
        <el-col :span="11">
          <el-form-item prop="intervalMax">
            <el-input-number
              v-model="form.intervalMax"
              :min="0"
              placeholder="最大间隔"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus';
import { createRobot } from '@/api/ai/robot-management';

export default {
  name: 'RobotForm',
  props: {
    qrData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {
        type: 1, // 1:同步 2:运营  默认同步
        actuatorName: '',
        actuatorIp: '',
        actuatorKey: '',
        actuatorUuid: '',
        intervalMin: 0,
        intervalMax: 0,
      },
      rules: {
        actuatorName: [
          { required: true, message: '请输入执行器名称', trigger: 'blur' },
        ],
        actuatorIp: [
          { required: true, message: '请输入执行器IP', trigger: 'blur' },
        ],
        actuatorKey: [
          { required: true, message: '请输入执行器Key', trigger: 'blur' },
        ],
        actuatorUuid: [
          { required: true, message: '请输入执行器UUID', trigger: 'blur' },
        ],
        intervalMin: [
          { required: true, message: '请输入最小间隔时间', trigger: 'blur' },
          { type: 'number', message: '间隔时间必须为数字' },
        ],
        intervalMax: [
          { required: true, message: '请输入最大间隔时间', trigger: 'blur' },
          { type: 'number', message: '间隔时间必须为数字' },
        ],
      },
    };
  },
  watch: {
    qrData: {
      handler(val) {
        console.log('val', val);
        if (val.key) {
          this.form.actuatorKey = val.key;
        }
        if (val.uuid) {
          this.form.actuatorUuid = val.uuid;
        }
      },
      immediate: true
    }
  },
  methods: {
    async submit() {
      try {
        await this.$refs.formRef.validate();
        await createRobot(this.form);
        ElMessage.success('添加成功');
        this.$emit('success');
        this.resetForm();
      } catch (error) {
        if (error) {
          console.error('添加机器人失败:', error);
          ElMessage.error('添加机器人失败');
        }
      }
    },
    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.robot-form {
  padding: 20px;

  .text-center {
    text-align: center;
    line-height: 32px;
  }

  :deep(.el-form-item__content) {
    flex-wrap: nowrap;
  }
}
</style>
