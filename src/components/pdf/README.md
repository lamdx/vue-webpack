## 使用

```vue
<template>
  <pdfPreview ref="pdf"></pdfPreview>
</template>
<script>
import pdfPreview from "@/components/pdf";
export default {
  components: { pdfPreview },
  methods: {
    showPDF() {
      this.$refs.pdf.show(this.src);
    }
  }
};
</script>
```
