

/**  获取数据类型 */
export function getType(obj) {
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    return 'array';
  } else if (obj === true || obj === false) {
    return 'boolean';
  } else if (typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length) {
    return 'json'
  } else {
    return typeof (obj)
  }
}


/** 获取正确的数据格式，
 * 如果传进来的数据格式是正确的就返回自身，
 * 如果不是就进行返回一个需要的数据格式 */
export function getSuccessData(obj, type) {
  let itemType = getType(obj);
  if (getType(type) != 'string') type = getType(type);
  if (itemType == type) return obj;
  switch (type) {
    case 'array':
      return [];
    case 'json':
      return {};
    case 'string':
      return "";
    case 'number':
      return 0;
    case 'function':
      return () => {
      }
  }
}

//对字符串进行加密
export function compileStr(code){
  var c=String.fromCharCode(code.charCodeAt(0)+code.length);
  for(var i=1;i<code.length;i++){
    c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
  }
  return escape(c);
}
//字符串进行解密
export function uncompileStr(code){
  code = unescape(code);
  var c=String.fromCharCode(code.charCodeAt(0)-code.length);
  for(var i=1;i<code.length;i++){
    c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
  }
  return c;
}

export function cubicBezier({}){

}
