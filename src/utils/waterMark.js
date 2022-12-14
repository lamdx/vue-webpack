'use strict';
let watermark = {};
let setWatermark = str => {
  let id = '1.23452384164.123412415';
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }
  let canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 360;
  let cans = canvas.getContext('2d');
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = '18px Vedana';
  cans.fillStyle = 'rgba(200,200,200,0.50)';
  cans.textAlign = 'left';
  cans.textBaseline = 'Middle';
  cans.fillText(str, canvas.width / 3, canvas.height / 2);
  let div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '70px';
  div.style.left = '0px';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = document.documentElement.clientWidth - 100 + 'px';
  div.style.height = document.documentElement.clientHeight - 100 + 'px';
  div.style.background =
    'url(' + canvas.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
};
// 该方法只允许调用一次
watermark.set = str => {
  let id = setWatermark(str);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str);
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str);
  };
};
export default watermark;
