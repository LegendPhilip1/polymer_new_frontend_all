<script setup lang="ts">
import Bar from "./components/Bar.vue";
import CandleStick from "./components/CandleStick.vue";
import TypeIt from "@/components/ReTypeit";
import { ref, computed, defineComponent, onMounted } from "vue";
import { getPolymerStaticData } from "@/api/polymerTable";
/*
import { addSearchPerformance } from "@/api/polymerTable";
import { deleteSearchPerformance } from "@/api/polymerTable";*/

defineOptions({
  name: "Welcome"
});
defineComponent({
  Bar,
  CandleStick,
});
const loading = ref<boolean>(true);
const titleClass = computed(() => {
  return ["text-base", "font-medium"];
});

/*
import ActionDialog from "./actionDialog.vue";
const zIndex = ref(1000);
const dialogVisible = ref(false);
const searchPerformance = ref({
  name: '',
});

const showModal = () => {
  dialogVisible.value = true;
};



const confirmSelection = async () => {
  try {

    let response = await addSearchPerformance({ data: searchPerformance.value.name });


    searchPerformance.value.name = '';
    dialogVisible.value = false;
    console.log(response)
    console.log(response.data)
    if (response.data) {
      console.error('添加性能成功');

    }
  } catch (error) {
    console.error('添加性能失败', error);

  }
};*/
/*
const confirmDelete = async () => {
  try {
 
    let response = await deleteSearchPerformance({ data: searchPerformance.value.name });

  
    searchPerformance.value.name = '';
    dialogVisible.value = false;
    console.log(response.code)
    console.log(response.msg)
    if (response.code === 1){


    }
  } catch (error) {
    console.error('添加列失败', error);

  }
};

*/

let staticData = [];
const barData = {
  materialNameArray: [],
  tempInitialArray: [],
  tempEndArray: [],
  max_tempArray: [],
  residual_massArray: []
};
const candleStickData = {
  tempInitialArray: [],
  tempEndArray: []
};
const handleQuery = () => {
  getPolymerStaticData().then(({ data }) => {
    staticData = data.rows;
    for (const item of staticData) {
      barData.materialNameArray.push(item["material"]);
      barData.tempInitialArray.push(item["initial_temp"]);
      barData.tempEndArray.push(item["end_temp"]);
      barData.max_tempArray.push(item["max_temp"]);
      barData.residual_massArray.push(item["residual_mass"]);
      candleStickData.tempInitialArray.push(item["initial_temp"]);
      candleStickData.tempEndArray.push(item["end_temp"]);
    }
  });
};
setTimeout(() => {
  loading.value = !loading.value;
}, 800);
onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="root">
    <el-row :gutter="24" class="el-row">
      <el-col :span="12">
        <el-card shadow="never" class="el-card">
          <template #header>
            <a :class="titleClass" target="_black">
              <TypeIt :className="'type-it1'" :values="['高分子温度性能统计']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <Bar :materialNameArray="barData.materialNameArray" :tempInitialArray="barData.tempInitialArray"
                :tempEndArray="barData.tempEndArray" :max_tempArray="barData.max_tempArray"
                :residual_massArray="barData.residual_massArray" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
    <!--<el-row :span="12">
      <el-button @click="showModal" type="primary">材料性能选择</el-button>

    </el-row>-->
  <!--</div>
  <div class="bottom-box">-->
    <el-row :gutter="24" class="el-bottom-row">
      <el-col :span="12">
        <el-card shadow="never" class="el-bottom-card">
          <template #header>
            <a :class="titleClass" target="_black">
              <TypeIt :className="'type-it2'" :values="['高分子K线图统计']" :cursor="false" :speed="120" />
            </a>
          </template>
          <el-skeleton animated :rows="7" :loading="loading">
            <template #default>
              <CandleStick :tempInitialArray="candleStickData.tempInitialArray"
                :tempEndArray="candleStickData.tempEndArray" />
            </template>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
    <!--<el-dialog v-model="dialogVisible" title="选择材料性能" :style="{ 'z-index': zIndex }">
      <el-form :model="searchPerformance" label-width="80px">
        <el-form-item label="列名">
          <el-input v-model="searchPerformance.name" placeholder="请输入搜索内容"></el-input>
        </el-form-item>
      </el-form>-->
      <!-- 其他模态框内容 -->
      <!--<div slot="footer" class="dialog-footer">
        <el-button @click="confirmSelection" type="primary">添加</el-button>
        <el-button @click="confirmDelete" type="primary">删除</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<style lang="scss" scoped>
.el-col {
  margin-bottom: 18px;
}

.root {
  width: 200%;
  text-align: center;
}

.bottom-box {
  text-align: center;
  align-content: center;
}
</style>