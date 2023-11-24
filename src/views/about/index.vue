<script setup lang="ts">
import TypeIt from "@/components/ReTypeit";
defineOptions({
  // name 作为一种规范最好必须写上并且和路由的name保持一致
  name: "About"
});
</script>

<template>
  <div class="root">
    <el-card class="box-card" id="profile">
      <h1 class="title">关于</h1>
      <p class="text">
        <TypeIt
          :className="'type-it1'"
          :values="[
            '该平台是基于开源数据库信息源构建的，我们开发了一套界面友好、通用性强的材料数据管理系统。这个系统不仅具备强大的数据处理能力，还能够实现数据的高效存储、查询和挖掘。该平台汇集了海量材料数据，通过有效存储和管理这些数据，我们致力于建立材料结构-工艺-性能之间的映射关系，提出更为准确的材料计算模型和预测方法。'
          ]"
          :cursor="false"
          :speed="15"
        />
      </p>
      <p class="text">
        <TypeIt
          :className="'type-it2'"
          :values="[
            '通过本平台的Web用户界面，用户可以调用机器学习模型，对特定材料的各项参数进行预测。这一平台不仅可以提高材料的研发效率，还可以为设计和优化材料结构和工艺参数提供理论指导。我们相信，通过这一材料数据库平台，将会推动新型高性能材料的快速发展和应用。'
          ]"
          :cursor="false"
          :speed="15"
        />
      </p>
    </el-card>

    <el-card class="box-card" id="config-info">
      <template #header>
        <div class="card-header">
          <span>项目信息</span>
        </div>
      </template>
      <el-descriptions class="margin-top" :column="3" :border="true">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">版本</div>
          </template>
          <el-tag size="small">2.9.0</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">最后编译时间</div>
          </template>
          <el-tag size="small">2022-10-07 22:43:09</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">文档地址</div>
          </template>
          文档地址
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">预览地址</div>
          </template>
          <el-tag size="small"> http://10.180.168.210:8848 </el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">Gitee仓库地址</div>
          </template>
          <el-tag size="small">
            https://gitee.com/songtyxjtu/pure-admin-frontend.git
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card" id="config-info">
      <template #header>
        <div class="card-header">
          <span>生产环境依赖</span>
        </div>
      </template>
    </el-card>

    <el-card class="box-card" id="config-info">
      <template #header>
        <div class="card-header">
          <span>开发环境依赖</span>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.box-card {
  margin-top: 25px;
}

h1.title {
  font-weight: 700;
  font-size: large;
}

p.text {
  font-size: small;
  text-indent: 2em;
}
</style>
