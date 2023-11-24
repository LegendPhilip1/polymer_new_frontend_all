<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { addPolymerData, putPolymerData } from "@/api/polymerTable";
const polymerFormRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const emit = defineEmits(["ok"]);
//*表单数据源/
const polymerForm = reactive({
  //*窗口标题/
  title: "",
  //*材料名称/
  material: undefined,
  //*起始裂解温度/
  initial_temp: undefined,
  //*最大速率裂解温度/
  max_temp: undefined,
  //*最终裂解温度/
  end_temp: undefined,
  //*加热速率/
  rate: undefined,
  //*剩余质量/
  residual_mass: undefined,
  //*加热气氛/
  atmosphere: undefined
});

const handleClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const handleCancel = (formEl: FormInstance | undefined) => {
  dialogFormVisible.value = false;
  formEl.resetFields();
};

const handleConfirm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      const _data = { ...toRaw(polymerForm) };
      _data.atmosphere = _data.atmosphere[0];
      const _api = data => {
        if (data.id) {
          return putPolymerData(data.id, data);
        } else {
          return addPolymerData(data);
        }
      };
      _api(_data).then(res => {
        if (res.success) {
          ElMessage({
            message: "提交信息成功！",
            type: "success"
          });
          emit("ok");
        } else {
          ElMessage({
            message: "出错了,后端校验失败！",
            type: "error"
          });
        }
      });
      dialogFormVisible.value = false;
      formEl.resetFields();
    } else {
      ElMessage({
        message: "出错了,前端校验失败！",
        type: "error"
      });
      return false;
    }
  });
};
const add = () => {
  dialogFormVisible.value = true;
  polymerForm.title = "添加材料信息";
};
const edit = row => {
  dialogFormVisible.value = true;
  polymerForm.title = "编辑材料信息";
  Object.assign(polymerForm, row);
};

defineExpose({
  add,
  edit
});
</script>

<template>
  <div>
    <ElDialog
      v-model="dialogFormVisible"
      :title="polymerForm.title"
      @close="handleClose(polymerFormRef)"
    >
      <ElForm
        :model="polymerForm"
        ref="polymerFormRef"
        status-icon
        label-width="120px"
        label-position="right"
      >
        <ElFormItem
          label="材料名称"
          :rules="[{ required: true, message: '材料名称是必填项' }]"
          prop="material"
        >
          <ElInput v-model="polymerForm.material" clearable class="el-input" />
        </ElFormItem>
        <ElFormItem
          label="Ti(℃)"
          :rules="[{ required: true, message: '起始裂解温度是必填项' }]"
          prop="initial_temp"
        >
          <ElInput
            v-model="polymerForm.initial_temp"
            clearable
            class="el-input"
          />
        </ElFormItem>

        <ElFormItem label="Tmax (℃)" prop="max_temp">
          <ElInput
            v-model.number="polymerForm.max_temp"
            clearable
            class="el-input"
          />
        </ElFormItem>

        <ElFormItem
          label="T最终 (℃)"
          :rules="[{ required: true, message: '最终裂解温度是必填项' }]"
          prop="end_temp"
        >
          <ElInput
            v-model.number="polymerForm.end_temp"
            clearable
            class="el-input"
          />
        </ElFormItem>

        <ElFormItem label="剩余质量(%)" prop="residual_mass">
          <ElInput
            v-model="polymerForm.residual_mass"
            clearable
            class="el-input"
          />
        </ElFormItem>

        <ElFormItem
          label="加热气氛"
          :rules="[{ required: true, message: '加热气氛是必填项' }]"
          prop="atmosphere"
        >
          <!-- <ElInput
            v-model="polymerForm.atmosphere"
            clearable
            class="el-input"
          /> -->
          <div>
            <el-checkbox-group
              v-model="polymerForm.atmosphere"
              size="large"
              :max="1"
            >
              <el-checkbox-button label="氮气"> 氮气</el-checkbox-button>
              <el-checkbox-button label="空气"> 空气</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </ElFormItem>
      </ElForm>

      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="handleCancel(polymerFormRef)">取消</ElButton>
          <ElButton type="primary" @click="handleConfirm(polymerFormRef)">
            确认
          </ElButton>
        </span>
      </template>
    </ElDialog>
  </div>
</template>

<style scoped></style>