<script setup lang="ts">
import { ref, defineComponent, onMounted, defineExpose } from "vue";
import { addPolymerColumn } from "@/api/polymerTable";
import type { ElTable, UploadInstance, UploadProps } from "element-plus";
/*import { http } from "@/utils/http";*/
import { baseUrlApi } from "@/api/utils";
import { ElMessage } from "element-plus";
import {
  getPolymerData,
  deletePolymerData,
  uploadPdf,
  uploadGif,
  downloadPdfById
} from "@/api/polymerTable";

import ActionDialog from "./actionDialog.vue";
import VuePdfEmbed from "vue-pdf-embed";
import { utils, writeFile } from "xlsx";
import { state } from "../share";

const addColumnModalVisible = ref(false);
const zIndex = ref(1000);
const newColumn = ref({
  name: '',
});



const openAddColumnModal = () => {
  addColumnModalVisible.value = true;
};



const addColumn = async () => {
  try {
 
    let response = await addPolymerColumn({ data: newColumn.value.name });

  
    
    addColumnModalVisible.value = false;
    console.log(response.code)
    console.log(response.msg)
    if (response.code === 1){
       existingColumns.push({ prop: newColumn.value.name, label: newColumn.value.name });
    }
    newColumn.value.name = '';
    
  } catch (error) {
    console.error('添加列失败', error);

  }
};

const validateAndAddColumn = () => {
  // 定义正则表达式，只允许由26个字母、下划线或数字组成
  const validColumnNameRegex = /^[a-zA-Z0-9_]+$/;

  // 检查用户输入是否符合要求
  if (!validColumnNameRegex.test(newColumn.value.name)) {
    // 如果不符合要求，显示错误信息
    alert('字符不合理，请重新输入,所用输入字符必须为26个英文字母或者是"_"或是阿拉伯数字');
    // 刷新已储存的newColumn.name的值为空字符
    newColumn.value.name = '';
  } else {
    // 如果符合要求，执行添加列的操作
    state.RecordingnewColumn.name = newColumn.value.name;
    addColumn();
    addColumnModalVisible.value = false;
  }
};



const existingColumns = [
  { prop: 'residual_mass', label: 'M剩余(%)' },

];
/*export const textRequest = (data?: object) => {
  return http.request<any>("post", baseUrlApi(""), { data:multipleSelection.value });
};*/

// 在页面加载时，从本地存储中获取用户选择的数据
/*onMounted(() => {
  const savedSelection = JSON.parse(localStorage.getItem('userSelection')) || [];
  multipleSelection.value = savedSelection;
});*/
/* 使用defineProps方法接收父组件传来的searchStr */
const props = defineProps({
  searchStr: {
    type: String,
    default: ""
  }
});

defineComponent({
  ActionDialog
});

const emit = defineEmits(["search"]);

//表格数据/方法
interface PolymerInfo {
  id: number;
  material: string;
  formula_url: string;
  initial_temp: GLfloat;
  max_temp: GLfloat;
  end_temp: GLfloat;
  rate: GLfloat;
  residual_mass: GLfloat;
  atmosphere: string;
  reference: string;
  pdf_url: string;
  time: Date;
}

const tableRef = ref<InstanceType<typeof ElTable>>();
const tableData = ref([]);
const pageSize = ref(15);
const currentPage = ref(1);
const tableCount = ref(100);
const actionDialogRef = ref();


const hanlePageSize = (val: number) => {
  pageSize.value = val;
  handleQuery(props.searchStr);
};

const hanleCurrentPage = (val: number) => {
  currentPage.value = val;
  handleQuery(props.searchStr);
};

const handleQuery = searchStr => {
  getPolymerData(currentPage.value, pageSize.value, searchStr).then(
    ({ data }) => {
      tableData.value = data.rows;
      tableCount.value = Number(data.count);
    }
  );
};

const handleAdd = () => {
  actionDialogRef.value.add();
};

const handleEdit = row => {
  actionDialogRef.value.edit(row);
};

const handleDelete = row => {
  deletePolymerData(row.id).then(res => {
    if (res.success) {
      ElMessage({
        message: "删除成功！",
        type: "success"
      });
      handleQuery(props.searchStr);
    } else {
      ElMessage({
        message: "删除失败！",
        type: "error"
      });
    }
  });
};

const handleEmitSearch = () => {
  emit("search");
};
/* 复选框相关属性和方法 */
const multipleSelection = ref<PolymerInfo[]>([]); // 保存用户选择的数据


const toggleSelection = (rows?: PolymerInfo[]) => {
  if (rows) {
    rows.forEach(row => {
      tableRef.value!.toggleRowSelection(row, undefined);
    });
  } else {
    tableRef.value.clearSelection();
  }
};

const handleSelectionChange = (val: PolymerInfo[]) => {
  multipleSelection.value = val;
};

/* 关于下载和上传的函数 */
const upload = ref<UploadInstance>();
const rowUpload = ref<{ id: string; fileName: string }>({
  id: null,
  fileName: null
});

const pdfRef = ref();
const pdfPreviewDialog = ref(false);
const source = ref<{ pdf_url: string; title: string }>({
  pdf_url: null,
  title: null
});

const getUploadInfo = row => {
  rowUpload.value.id = row.id;
  rowUpload.value.fileName = row.name;
};

const beforeUpload: UploadProps["beforeUpload"] = rawFile => {
  if (rawFile.type != "application/pdf" && rawFile.type != "image/gif") {
    ElMessage.error("上传文件必须为PDF/GIF格式");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 50) {
    ElMessage.error("文件大小不能超过50MB!");
    return false;
  }
  return true;
};

const handleUpload = file => {
  const formData = new FormData();
  formData.append("file", file.file);
  formData.append("id", rowUpload.value.id);
  formData.append("fileName", rowUpload.value.fileName);
  console.log(file.file);
  if (file.file.type == "image/gif") {
    return uploadGif(formData).then(res => {
      if (res.success) {
        ElMessage.success({
          message: "文件上传成功！"
        });
        handleQuery(props.searchStr);
      } else {
        ElMessage.error({
          message: "文件上传失败！"
        });
      }
    });
  }
  if (file.file.type == "application/pdf") {
    return uploadPdf(formData).then(res => {
      if (res.success) {
        ElMessage.success({
          message: "文件上传成功！"
        });
        handleQuery(props.searchStr);
      } else {
        ElMessage.error({
          message: "文件上传失败！"
        });
      }
    });
  }
};

const handleDownload = row => {
  const data = {
    id: row.id,
    fileName: row.name
  };
  downloadPdfById(data)
    .then(_res => {
      ElMessage.success({
        message: data.fileName + ".pdf下载成功！"
      });
    })
    .catch(err => {
      console.log(err);
      ElMessage.error({
        message: "Pdf下载失败！"
      });
    });
};
const handlePreviewer = row => {
  source.value.pdf_url = "/api/polymer-info/pdf/query?id=" + row.id;
  source.value.title = row.material + "详情预览";
  pdfPreviewDialog.value = true;
};

const exportExcel = () => {
  function arrangeData(souceData, header) {
    const newArr = [];
    souceData.forEach(item => {
      const arr = [];
      const keyArr = Object.keys(item);
      keyArr.forEach(key => {
        if (header.includes(key)) {
          arr.push(item[key]);
        }
      });
      newArr.push(arr);
    });
    return newArr;
  }
  const tableStruct = {
    id: "ID",
    material: "材料",
    initial_temp: "Ti(℃)",
    max_temp: "Tmax(℃)",
    end_temp: "T最终(℃)",
    atmosphere: "加热气氛",
    residual_mass: "M剩余(%)"
  };
  const header = Object.keys(tableStruct);
  const columnList = Object.values(tableStruct);
  const sourceData = tableData.value;
  const res = arrangeData(sourceData, header);
  res.unshift(columnList);
  const workSheet = utils.aoa_to_sheet(res);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, "材料信息");
  writeFile(workBook, "Ply_Exp.xlsx");
};

const filterTag = (value: string, row: PolymerInfo) => {
  return row.atmosphere === value;
};

/* 父组件可以通过ref访问到的函数 */
defineExpose({
  handleQuery,
  handleAdd,
  toggleSelection,
  exportExcel
});
</script>

<template>
  <div>
    <el-button type="primary" @click="openAddColumnModal">增加列</el-button>
    <el-table
      ref="tableRef"
      @selection-change="handleSelectionChange"
      @cell-dblclick="handlePreviewer"
      :stripe="true"
      :border="true"
      :data="tableData"
      width="100%"
      height="100%"
      style="margin-top: 20px"
      
      overflow-y="auto" 
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column type="index" label="序号" />
      <el-table-column prop="material" label="材料"  />
      <el-table-column prop="formula_url" label="结构式" >
        <template #default="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="`/api/polymer-info/gif/query?id=` + scope.row.id"
            fit="contain"
          >
            <template #error>
              <div class="image-slot">未上传结构式</div>
            </template>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="initial_temp" label="Ti(℃)"/>
      <el-table-column prop="max_temp" label="Tmax(℃)"  />
      <el-table-column prop="end_temp" label="T最终(℃)" />
      <!-- <el-table-column prop="residual_mass" label="M剩余(%)" width="180" /> -->
       <el-table-column
        v-for="column in existingColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
      ></el-table-column> 
      <!-- <el-table-column prop="rate" label="加热速率" width="180" /> -->
      <el-table-column
        v-if="newColumn.name"
        :key="newColumn.name"
        :prop="newColumn.name"
        :label="newColumn.name"
      ></el-table-column> 
      <el-table-column
        prop="atmosphere"
        label="加热气氛"
        width="100"
        :filters="[
          { text: '氮气', value: '氮气' },
          { text: '空气', value: '空气' }
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag
            :type="scope.row.atmosphere === '空气' ? '' : 'success'"
            disable-transitions
            >{{ scope.row.atmosphere }}</el-tag
          >
        </template>
      </el-table-column>
      
      <el-table-column prop="action" label="操作">
        <template #default="scope">
          <el-row>
            <el-space :size="5" spacer="|">
              <el-upload
                ref="upload"
                multiple
                :limit="1"
                class="pdf-uploader"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="handleUpload"
                accept=".pdf,.gif"
              >
                <el-button
                  type="primary"
                  size="small"
                  plain
                  @click="getUploadInfo(scope.row)"
                  >上传文献/结构式</el-button
                >
              </el-upload>

              <el-button
                type="primary"
                size="small"
                plain
                @click="handleDownload(scope.row)"
                ref="viewButtonRef"
                :disabled="!scope.row.pdf_url ? true : false"
              >
                下载文献
              </el-button>

              <!-- <el-button
                type="primary"
                plain
                @click="handlePreviewer(scope.row)"
                :disabled="!scope.row.pdf_url ? true : false"
              >
                详情预览
              </el-button> -->

              <el-button
                type="primary"
                size="small"
                plain
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-popconfirm
                width="220"
                confirm-button-text="确定"
                cancel-button-text="取消"
                title="你确定要删除这种材料嘛?"
                @confirm="handleDelete(scope.row)"
                ><template #reference
                  ><el-button type="danger" plain size="small"
                    >删除</el-button
                  ></template
                >
              </el-popconfirm>
            </el-space>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template #default="props">
          <div m="1">
            <p m="t-0 b-2">参考文献: {{ props.row.reference }}</p>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <el-dialog v-model="addColumnModalVisible" title="增加列" :style="{ 'z-index': zIndex }">
      <el-form :model="newColumn" label-width="80px">
        <el-form-item label="列名">
          <el-input v-model="newColumn.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addColumnModalVisible = false">取消</el-button>
        <el-button type="primary" @click="validateAndAddColumn">确认增加</el-button>
      </div>
    </el-dialog>
    

    <el-pagination
      class="pagination-block"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      v-model:total="tableCount"
      :page-sizes="[15, 20, 30, 50]"
      background
      layout="prev, pager, next, sizes"
      @size-change="hanlePageSize"
      @current-change="hanleCurrentPage"
    />

    <!-- actionDialog这里需要将信号穿透两层父组件
    1、ActionDialog-MachineTable，使用ok信号激活MachineTable中方法再次发送信号；
    2、MachineTable-Index，使用ok信号激活Index种handleResearch方法； -->
    <action-dialog ref="actionDialogRef" @ok="handleEmitSearch" />
    <el-dialog
      v-model="pdfPreviewDialog"
      class="pdf-perviewer-dialog"
      :title="source.title"
      width="70%"
    >
      <vue-pdf-embed
        class="pdf-viewer"
        ref="pdfRef"
        :source="source.pdf_url"
        type="application/pdf"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.pagination-block {
  float: right;
  padding-bottom: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
