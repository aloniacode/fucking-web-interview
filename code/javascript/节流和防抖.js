// 防抖函数
function debounce(callback, wait, immediate = false) {
  let timeout;
  return function (...args) {
    const context = this;
    const shouldCallNow = immediate && !timeout;
    // 有定时器则重新计时
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (!immediate) {
        callback.apply(context, args);
      }
      timeout = null;
    }, wait);
    // 第一次触发，立即执行
    if (shouldCallNow) {
      callback.apply(context, args);
    }
  };
}

// 节流函数
function throttle(callback, wait, immediate = false) {
  let timeout = null,
    lastTime = 0;
  return function (...args) {
    const context = this;
    const nowTime = Date.now();
    const remaining = wait - (nowTime - lastTime);

    // 清理定时器
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    // 如果需要立即执行并且第一次触发，立即执行
    if (immediate && lastTime === 0) {
      callback.apply(context, args);
      lastTime = nowTime;
    } else if (remaining <= 0) {
      // 剩余时间小于0则立即执行
      callback.apply(context, args);
      lastTime = nowTime;
    } else {
      timeout = setTimeout(() => {
        callback.apply(context, args);
        lastTime = Date.now();
        timeout = null;
      }, remaining);
    }
  };
}
