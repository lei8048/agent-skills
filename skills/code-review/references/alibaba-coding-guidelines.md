# 阿里巴巴Java开发规约参考

## 一、命名规约

### 1.1 通用命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 包名 | 全小写，单数形式 | com.alibaba.project.module.service |
| 类名 | 大驼峰，名词 | UserService, OrderController |
| 接口名 | 大驼峰，名词/形容词 | UserService, Comparable |
| 方法名 | 小驼峰，动词/动宾 | getUser(), saveOrder() |
| 变量名 | 小驼峰 | userName, orderList |
| 常量名 | 全大写，下划线分隔 | MAX_RETRY_COUNT |

### 1.2 特定前缀/后缀

- 接口实现类：`XxxServiceImpl`
- 抽象类：`AbstractXxx` 或 `BaseXxx`
- 工厂类：`XxxFactory`
- 异常类：`XxxException`
- 测试类：`XxxTest`

## 二、代码格式

### 2.1 缩进与空格

- **缩进**: 4个空格（禁止Tab）
- **大括号**: 左开右合

```java
if (condition) {
    // code
}
```

- **运算符空格**: `a = b + c` 而非 `a=b+c`
- **括号空格**: `method(arg)` 而非 `method (arg)`

### 2.2 行长度

- 单行限制：**120个字符**
- 换行缩进：**8个空格**（2倍缩进）

```java
List<User> users = userService.queryUsers()
    .stream()
    .filter(u -> u.isActive())
    .collect(Collectors.toList());
```

## 三、注释规范

### 3.1 必需注释位置

| 位置 | 注释类型 | 必需 |
|------|----------|------|
| 类文件头部 | Javadoc | 是 |
| 公共方法 | Javadoc | 是 |
| 关键业务逻辑 | 行注释 | 是 |
| 复杂算法 | 行注释 | 是 |
| 工具方法 | 行注释 | 建议 |

### 3.2 TODO格式

```
// TODO(username): yyyy-MM-dd 任务描述
// TODO(issue-id): 任务描述
```

## 四、控制语句

### 4.1 if规范

- 必须使用大括号
- 避免3层以上嵌套
- 优先处理异常/边界情况

### 4.2 循环规范

- 不在循环内声明大对象
- 避免死循环
- 使用增强for循环替代传统for

## 五、异常处理

### 5.1 异常分类

| 异常类型 | 说明 | 使用场景 |
|----------|------|----------|
| IllegalArgumentException | 参数非法 | 参数校验失败 |
| IllegalStateException | 状态非法 | 业务状态不满足 |
| NullPointerException | 空指针 | 不应为空的对象为null |
| IndexOutOfBoundsException | 越界 | 数组/集合越界 |
| BusinessException | 业务异常 | 业务规则不满足 |

### 5.2 异常处理原则

1. 捕获具体异常，不捕获Exception/Throwable
2. 不吞掉异常，至少记录日志
3. 不捕获后不做处理（空catch块禁止）
4. 使用异常链保留原始信息

## 六、并发安全

### 6.1 线程安全集合

| 线程不安全 | 线程安全 |
|------------|----------|
| ArrayList | CopyOnWriteArrayList |
| HashMap | ConcurrentHashMap |
| HashSet | CopyOnWriteArraySet |
| StringBuilder | StringBuffer |

### 6.2 同步原则

1. 尽量使用不可变对象
2. 优先使用局部变量
3. 减少共享对象
4. 使用线程安全工具类

## 七、日志规范

### 7.1 日志级别

| 级别 | 使用场景 | 生产环境 |
|------|----------|----------|
| DEBUG | 调试信息 | 关闭 |
| INFO | 业务流程 | 开启 |
| WARN | 警告信息 | 开启 |
| ERROR | 错误信息 | 开启 |

### 7.2 日志格式

```
[时间] [级别] [类名] [方法名] [行号] - 消息内容
```

### 7.3 占位符使用

```java
// 推荐
logger.info("user: {}, order: {}", userId, orderId);

// 不推荐
logger.info("user: " + userId + ", order: " + orderId);
```

## 八、数据库规范

### 8.1 SQL编写

- 使用参数化查询
- 避免SELECT *
- 字段使用别名
- 避免复杂嵌套子查询

### 8.2 索引原则

- 区分度高的字段在前
- 避免过多索引
- 遵循最左前缀原则

## 九、安全规范

### 9.1 敏感信息

**禁止**在代码中硬编码：
- 数据库密码
- API密钥
- 第三方密钥
- 用户密码
- 身份证号
- 银行卡号

### 9.2 SQL注入

```java
// 安全 - 参数化查询
PreparedStatement ps = conn.prepareStatement("SELECT * FROM user WHERE id = ?");
ps.setLong(1, userId);

// 不安全 - 字符串拼接
Statement stmt = conn.createStatement();
stmt.executeQuery("SELECT * FROM user WHERE id = " + userId);
```

### 9.3 XSS防护

- 输出编码
- 输入验证
- 使用安全框架

## 十、单元测试

### 10.1 测试类命名

- `XxxServiceTest`
- `XxxControllerTest`
- `XxxServiceImplTest`

### 10.2 测试方法命名

```java
@Test
public void testGetUserById_Success() {}

@Test
public void testGetUserById_UserNotFound() {}

@Test(expected = IllegalArgumentException.class)
public void testGetUserById_NullId() {}
```

## 十一、版本历史

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| 1.0 | 2024-01-01 | 初始版本 |
| 1.1 | 2024-06-01 | 新增并发安全规范 |
