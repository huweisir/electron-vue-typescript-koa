<template>
  <div id="holder" @drop="drop" @dragover="dragover">
    <span>Drag your file here</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    // 添加
    fileChange(el) {
      let filePath = el.target.files[0].path;
      let xlsxData = XLSX.readFile(filePath);
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
        console.log("File(s) you dragged here: ", f.path);
      }
    },
    dragover(e) {
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
  height: 130px;
  border: 1px solid red;
  border-radius: 2px;
}
</style>
