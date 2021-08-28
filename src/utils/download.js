import { LoadingBar } from 'iview';
import request from './http';
export function downloadBlob(blob, fileName) {
  // IE
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    let linkEl = document.createElement('a');
    linkEl.download = fileName;
    linkEl.style.display = 'none';
    linkEl.href = window.URL.createObjectURL(blob);
    document.body.appendChild(linkEl); // mount
    linkEl.click(); // trigger click
    window.URL.revokeObjectURL(linkEl.href); // 释放 URL 对象
    document.body.removeChild(linkEl);
  }
}

export function handleDownload(config) {
  LoadingBar.start();
  request({
    url: '',
    method: 'get',
    responseType: 'blob'
  })
    .then(res => {
      downloadBlob(
        new Blob([res]),
        `${config.srcFlieName}.${config.fileFormat}`
      );
      LoadingBar.finish();
    })
    .catch(err => {
      console.error(err);
      LoadingBar.error();
    });
}
