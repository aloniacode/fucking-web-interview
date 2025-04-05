// 使用现代API解析URL对象
function parseURL(url) {
  const urlObj = new URL(url);
  const params = {};

  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

// 手动解析
function parseURL(url) {
  const params = {};
  const queryString = url.split("?")[1];
  if (queryString) {
    const pairs = queryString.split("&");
    for (const pair of pairs) {
      const [key, value] = pair.split("=");
      // 处理特殊字符
      const decodedKey = decodeURIComponent(key);
      const decodedValue = decodeURIComponent(value);
      // 如果不需要支持重复键的话则可以在处理特殊字符后直接设置值
      if (params[decodedKey]) {
        if (Array.isArray(params[decodedKey])) {
          params[decodedKey].push(decodedValue);
        } else {
          params[decodedKey] = [params[decodedKey], decodedValue];
        }
      } else {
        params[decodedKey] = decodedValue;
      }
    }
  }
  return params;
}

const url = "https://example.com/path?name=John&age=30&city=New+York";
console.log(parseURL(url));
