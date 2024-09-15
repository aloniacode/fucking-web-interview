class OnionMiddleware {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
  }

  // 执行中间件
  async run(context) {
    // 递归内层中间件
    const dispatch = (index) => {
      // 如果索引超出范围，返回 promise
      if (index === this.middlewares.length) {
        return Promise.resolve();
      }

      const middleware = this.middlewares[index];
      return Promise.resolve(middleware(context, () => dispatch(index + 1)));
    };

    // 开始执行
    await dispatch(0);
  }
}

// 示例中间件函数
const loggerMiddleware = async (context, next) => {
  console.log("Logger: 请求进入");
  await next(); // 调用下一个中间件
  console.log("Logger: 响应返回");
};

const authMiddleware = async (context, next) => {
  console.log("Auth: 验证中...");
  // 假设验证通过
  await next(); // 调用下一个中间件
  console.log("Auth: 验证完毕");
};

// 最终处理请求的中间件
const finalMiddleware = async (context, next) => {
  console.log("Final: 处理请求");
  context.response = "Hello, World!"; // 模拟响应
  await next();
  console.log("Final: 请求处理完毕");
};

// 创建洋葱模型并使用中间件
const onion = new OnionMiddleware();
onion.use(loggerMiddleware);
onion.use(authMiddleware);
onion.use(finalMiddleware);

// 模拟请求上下文
const context = { response: null };

// 执行中间件
onion
  .run(context)
  .then(() => {
    console.log("最终响应:", context.response);
  })
  .catch((err) => {
    console.error("发生错误:", err);
  });

  // 输出结果：
  // Logger: 请求进入
  // Auth: 验证中...
  // Final: 处理请求
  // Final: 请求处理完毕
  // Auth: 验证完毕
  // Logger: 响应返回
  // 最终响应: Hello, World!