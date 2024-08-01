function checkHTMLString(str) {
  const startTagRegex = /<([a-zA-Z0-9]+)>/;
  const endTagRegex = /<\/([a-zA-Z0-9]+)>/;

  const startTags = [];

  let match;

  while (str.length > 0) {
    console.log(startTags);
    match = str.match(startTagRegex);
    if (match) {
      // 如果是开始标签就压入栈，再裁剪字符串
      startTags.push(match[1]);
      str = str.slice(match.index + match[0].length);
    } else {
        // 没有开始标签，匹配结束标签
      match = str.match(endTagRegex);
      if (match) {
        // 没有开始标签但是有结束标签或者开始标签和结束标签不匹配
        if (startTags.length === 0 || startTags.pop() !== match[1]) {
          return false;
        }
        str = str.slice(match.index + match[0].length);
      } else {
        // 没有标签，不合法
        return false;
      }
    }
  }

  return startTags.length === 0;
}

const res = checkHTMLString("<a>dsadasdas<t></a></a>");

console.log(res);
