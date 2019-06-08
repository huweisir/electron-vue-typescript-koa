<template>
  <div id="holder" class="excel_drop" @drop="drop" @dragover="dragover">
    <span class="excel_btn_text">拖入(xls,xlsx)</span>
  </div>
</template>

<script>
var xlsx = require("node-xlsx");
import path from "path";

export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    // 添加
    fileChange(el) {
      let filePath = el.target.files[0].path;
      // 空表过滤
      if (xlsxData.Sheets.length == 0) {
        return;
      }
      // 传入文件列表处理
      this.fileList(el.target);
      // 释放内存
      el.target.value = "";
    },
    drop(e) {
      e.preventDefault();
      e.stopPropagation();
      for (let f of e.dataTransfer.files) {
        const filePath = path.resolve(__dirname, f.path);
        var xlsxData = xlsx.parse(filePath);
        console.log(xlsxData);
      }
    },
    dragover(e) {
      // console.log("dragover==>", e);
      e.preventDefault();
      e.stopPropagation();
    }
  },
  created() {}
};
</script>

<style scoped lang="scss">
#holder {
  width: 120px;
  height: 80px;
  border: 1px solid #a59d9d;
  border-radius: 4px;
}
.excel_drop {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.excel_btn_text {
  color: #8c8c8c;
  font-weight: bold;
}
</style>
