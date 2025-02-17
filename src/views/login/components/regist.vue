<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { updateRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { initRouter, getTopMenu } from "@/router/utils";
import { useRouter } from "vue-router";
import Lock from "@iconify-icons/ri/lock-fill";
import Iphone from "@iconify-icons/ep/iphone";
import User from "@iconify-icons/ri/user-3-fill";
// import getRegister from "@"


const emit = defineEmits(["backlogin"])
const router = useRouter();
const { t } = useI18n();
const checked = ref(false);
const loading = ref(false);
const ruleForm = reactive({
  username: "",
  phone: "",
  verifyCode: "",
  password: "",
  repeatPassword: ""
});
const ruleFormRef = ref<FormInstance>();
const { isDisabled, text } = useVerifyCode();
const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error(transformI18n($t("login.passwordSureReg"))));
      } else if (ruleForm.password !== value) {
        callback(new Error(transformI18n($t("login.passwordDifferentReg"))));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

const onUpdate = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (checked.value) {
        // 模拟请求，需根据实际开发进行修改
        console.log("SENDING")
        useUserStoreHook()
          .getRegister({
            username: ruleForm.username,
            password: ruleForm.password,
            phone: ruleForm.phone,
            role: "common",
          })
          .then(res => {
            console.log(ruleForm) 
            if (res.success) {
              // 获取后端路由
              console.log("SUCCESS")
              message("注册成功，请登录", {
                type: "success"
              });
              onBack()
              router.replace("/login")
              // initRouter().then(() => {
              //   router.push(getTopMenu(true).path);
              //   message("注册成功", { type: "success" });
              // });
            } else {
              if (res.data["message"] == "用户名重复，添加失败！") {
                message("用户名重复，注册失败", { type: "error" });
              } else {
                message("注册失败", { type: "error" });
              }
            }
          }).catch((e) => {
            message("注册失败", { type: "error" });
          }).finally(() => (loading.value = false));
        // setTimeout(() => {
        //   message(transformI18n($t("login.registerSuccess")), {
        //     type: "success"
        //   });
        //   loading.value = false;
        // }, 2000);
      } else {
        loading.value = false;
        message(transformI18n($t("login.tickPrivacy")), { type: "warning" });
      }
    } else {
      loading.value = false;
      return fields;
    }
  });
};


// const onLogin = async (formEl: FormInstance | undefined) => {
//   loading.value = true;
//   if (!formEl) return;
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       useUserStoreHook()
//         .loginByUsername({ username: ruleForm.username, password: "admin123" })
//         .then(res => {
//           if (res.success) {
//             // 获取后端路由
//             initRouter().then(() => {
//               router.push(getTopMenu(true).path);
//               message("登录成功", { type: "success" });
//             });
//           }
//         })
//         .finally(() => (loading.value = false));
//     } else {
//       loading.value = false;
//       return fields;
//     }
//   });
// };

function onBack() {
  useVerifyCode().end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="updateRules" size="large">
    <Motion>
      <el-form-item :rules="[
        {
          required: true,
          message: transformI18n($t('login.usernameReg')),
          trigger: 'blur'
        }
      ]" prop="username">
        <el-input clearable v-model="ruleForm.username" :placeholder="t('login.username')"
          :prefix-icon="useRenderIcon(User)" />
      </el-form-item>
    </Motion>

    <Motion :delay="100">
      <el-form-item prop="phone">
        <el-input clearable v-model="ruleForm.phone" :placeholder="t('login.phone')"
          :prefix-icon="useRenderIcon(Iphone)" />
      </el-form-item>
    </Motion>

    <Motion :delay="150">
      <!-- <el-form-item prop="verifyCode">
        <div class="w-full flex justify-between">
          <el-input
            clearable
            v-model="ruleForm.verifyCode"
            :placeholder="t('login.smsVerifyCode')"
            :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
          />
          <el-button
            :disabled="isDisabled"
            class="ml-2"
            @click="useVerifyCode().start(ruleFormRef, 'phone')"
          >
            {{
              text.length > 0
                ? text + t("login.info")
                : t("login.getVerifyCode")
            }}
          </el-button>
        </div>
      </el-form-item> -->
    </Motion>

    <Motion :delay="200">
      <el-form-item prop="password">
        <el-input clearable show-password v-model="ruleForm.password" :placeholder="t('login.password')"
          :prefix-icon="useRenderIcon(Lock)" />
      </el-form-item>
    </Motion>

    <Motion :delay="250">
      <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
        <el-input clearable show-password v-model="ruleForm.repeatPassword" :placeholder="t('login.sure')"
          :prefix-icon="useRenderIcon(Lock)" />
      </el-form-item>
    </Motion>

    <Motion :delay="300">
      <el-form-item>
        <el-checkbox v-model="checked">
          {{ t("login.readAccept") }}
        </el-checkbox>
        <el-button link type="primary">
          {{ t("login.privacyPolicy") }}
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="350">
      <el-form-item>
        <el-button class="w-full" size="default" type="primary" :loading="loading" @click="onUpdate(ruleFormRef)">
          {{ t("login.definite") }}
        </el-button>
      </el-form-item>
    </Motion>

    <Motion :delay="400">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          {{ t("login.back") }}
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
