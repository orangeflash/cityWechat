const auxiliaryColorArray = [
  '#FFB230', '#2F8EE2', '#12C8D3', '#7594B6', '#FF3838',
  '#22D4D4', '#FFB131', '#F5431A', '#12BC26', '#31A5FF',
  '#2E9EF4', '#0AB9F5', '#FF9212', '#287AE0'
];

// 颜色值
export function getAuxiliaryConfigColor(name) {
  switch (name) {
    case '货找车':
      return auxiliaryColorArray[0];
      break;
    case '车找货':
      return auxiliaryColorArray[1];
      break;
    case '人找车':
      return auxiliaryColorArray[2];
      break;
    case '车找人':
      return auxiliaryColorArray[3];
    case '长期':
      return auxiliaryColorArray[4];
    case '房屋出租':
    case '二手房':
    case '二手房出售':
      return auxiliaryColorArray[5];
    case '整租':
    case '出售':
    case '停售':
      return auxiliaryColorArray[6];
    case '房屋求租':
      return auxiliaryColorArray[7];
    case '中介勿扰':
    case '单间':
      return auxiliaryColorArray[8];
    case '主卧':
    case '求购':
      return auxiliaryColorArray[9];
    case '次卧':
      return auxiliaryColorArray[10];
    case '新楼盘':
    case'新房出售':
      return auxiliaryColorArray[11];
      break;
    case '待售':
      return auxiliaryColorArray[12];
    case '在售':
      return auxiliaryColorArray[13];
    default :

      return getRandomColor();
  }
}

// 随机获取颜色值
export function getRandomColor() {
  const len = auxiliaryColorArray.length;
  return auxiliaryColorArray[Math.floor(Math.random() * len)];
}

export function getLabelColor(index, type) {
  let color;
  switch (index) {
    case 0:
      color = type ? '#618AFF' : '#FFB131';
      break
    case 1:
      color = type ? '#20D4D0' : '#FF7E3E';
      break
    case 2:
      color = type ? '#FF7E3E' : '#6371C9';
      break
    case 3:
      color = '#6FCE95';
      break
    case 4:
      color = '#C24DBE';
      break
    case 5:
      color = '#AD3EAA';
      break
    default:
      color = type ? '#618AFF' : '#FFB131';
  }
  return color
}
//vip插件需要将数字变成周几
export function changeWeek(e) {
  e=parseInt(e)
  let name
  switch (e) {
    case 1:
      name = "周一";
      break;
    case 2:
      name = "周二";
      break;
    case 3:
      name = "周三";
      break;
    case 4:
      name = "周四";
      break;
    case 5:
      name = "周五";
      break;
    case 6:
      name = "周六";
      break;
    case 7:
      name = "周日";
      break;
  }
  return name
}
