<script setup lang="ts">
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "Matlab"
});
import { ref } from 'vue';

// 定义一个 ref，用于管理背景板的显示状态
const showBackground = ref(true);  
//使用按钮打开新的MATLAB页面
//const jump = () => {
//	window.open("http://localhost:9988/webapps/home/", "_blank");
</script>

<template>
  <div>
    <!-- 空白背景板 -->
    <div v-if="showBackground" class="background-panel"></div>
    <!-- <div><ElButton @click="jump">Matlab</ElButton></div> -->
    <!--<div id="iframe-container">
      <iframe
        src="http://localhost:9988/webapps/home/session.html?app=RCpredict_v3" #也可以用下面花生壳内网穿透到公网上，但有安全风险
        scrolling="auto"
        frameborder="0"
        class="iframe-matlab"
      />
    </div>-->
  </div>
</template>

<style scoped>
/*.iframe-matlab {
  margin: 20px 20px;
  min-width: 80vw;
  min-height: 80vh;
}*/
.background-panel {
  position: fixed;
  top:15%;
  left:23%;
  width: 70.66%;
  height: 80%;
  background-color: rgba(255, 255, 255); /* 半透明黑色背景 */
  box-shadow: 0 0 10px rgba(121, 120, 120, 0.5);
}
</style>