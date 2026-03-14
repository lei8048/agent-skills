---
name: code-review
description: 代码审核与规范检查技能。严格遵守阿里巴巴Java开发规约，进行代码规范审查、代码质量评估、代码安全检查。当用户提到代码审查、code review、代码规范检查、代码质量、代码审核、规约检查时请使用此技能。
---

# 代码审核与规范检查

## 概述

本技能提供全面的代码审核服务，严格遵循阿里巴巴Java开发规约。审核范围包括代码规范性、安全性、可维护性、性能优化等多个维度。

## 审核流程

### 第一步：理解代码上下文

1. **阅读代码文件** - 读取待审核的所有源文件
2. **确定语言和框架** - 识别代码使用的编程语言、框架和依赖
3. **理解业务逻辑** - 快速把握代码的核心功能和业务意图

### 第二步：执行多维度审核

按照以下优先级和维度进行审核：

## 审核维度与规范

### 1. 命名规范 (优先级：高)

#### 1.1 变量命名
- **POJO类属性**必须使用驼峰命名法
- 避免使用特殊字符如 `$`, `-` 等
- 禁止使用中文命名
- 布尔变量禁止使用 `is` 前缀（与框架冲突时除外）

```java
// 不规范示例
String userName;  // 正确
String username; // 推荐
String name;     // 更简洁的推荐
int a;           // 禁止使用单字母
boolean isDelete; // 正确，但需注意框架兼容性
boolean deleted;  // 推荐
```

#### 1.2 方法命名
- 使用驼峰命名法，首字母小写
- 动宾结构，如 `getUser()`, `saveOrder()`
- 避免过长方法名（控制在20个字符以内）

```java
// 推荐
public User getUserById(Long id)
public void saveUser(User user)
public List<Order> queryOrdersByStatus(String status)

// 不推荐
public User getUserInformationByIdFromDatabase(Long id) // 过长
```

#### 1.3 类命名
- 使用大驼峰命名法（PascalCase）
- 使用具体名词，避免使用抽象名词
- 接口类以 `I` 开头或使用 `-able` 后缀

```java
// 推荐
public class UserService
public class OrderController
public interface IUserService  // 或者
public interface UserServiceable
```

#### 1.4 常量命名
- 使用全大写字母，以下划线分隔
- 必须使用有意义的词汇

```java
// 推荐
public static final int MAX_RETRY_COUNT = 3;
public static final String ORDER_STATUS_PENDING = "PENDING";

// 不推荐
public static final int MAX = 3;
public static final String STATUS = "PENDING";
```

#### 1.5 包命名
- 全小写字母
- 使用有意义的单词，复数形式表示类别

```java
// 推荐
com.alibaba.project.module.service
com.alibaba.project.module.dao

// 不推荐
com.alibaba.project.module.Service
com.alibaba.project.module.DAO
```

### 2. 代码格式 (优先级：高)

#### 2.1 缩进与空格
- 使用4个空格缩进，禁止使用Tab
- 运算符前后各保留一个空格
- 关键字与括号之间保留一个空格

```java
// 推荐
if (condition) {
    doSomething();
}

for (int i = 0; i < 10; i++) {
    process(i);
}

// 不推荐
if(condition){
    doSomething();
}

for(int i=0;i<10;i++){
    process(i);
}
```

#### 2.2 行长度限制
- 单行代码长度不超过120个字符
- 超长换行时注意缩进和美观性

#### 2.3 空行使用
- 方法之间保留一个空行
- 逻辑相关代码块之间可保留空行
- 不要使用连续空行

### 3. 注释规范 (优先级：中)

#### 3.1 类注释
- 每个类必须添加Javadoc注释
- 包含类功能说明、作者、创建时间

```java
/**
 * 用户管理服务类
 * 提供用户的增删改查等基础功能
 *
 * @author zhangsan
 * @since 2024-01-01
 */
public class UserService {
}
```

#### 3.2 方法注释
- 公共方法必须添加Javadoc注释
- 包含方法功能、参数说明、返回值说明、异常说明

```java
/**
 * 根据用户ID获取用户信息
 *
 * @param userId 用户ID
 * @return 用户信息，不存在返回null
 * @throws IllegalArgumentException userId为空时抛出
 */
public User getUserById(Long userId) {
    // implementation
}
```

#### 3.3 关键逻辑注释
- 复杂业务逻辑必须添加注释
- 注释说明"为什么"而不是"做什么"
- 使用中文注释

```java
// 当订单状态为已取消时，不允许修改（业务规则）
if (OrderStatus.CANCELLED.equals(order.getStatus())) {
    throw new BusinessException("已取消的订单不允许修改");
}
```

#### 3.4 TODO注释
- 必须包含负责人和计划完成时间

```java
// TODO(zhangsan): 2024-12-31 实现缓存逻辑
// TODO(issue-123): 优化查询性能
```

### 4. 控制结构 (优先级：高)

#### 4.1 if语句
- 必须使用大括号，即使只有一行代码
- 避免多层嵌套，嵌套层数不超过3层

```java
// 推荐
if (condition) {
    return result;
}

// 不推荐
if (condition)
    return result;

if (condition1) {
    if (condition2) {
        if (condition3) {
            // 嵌套过深
        }
    }
}
```

#### 4.2 循环控制
- 不在循环体内进行复杂的计算或调用
- 提前判断条件，减少不必要的循环

```java
// 推荐
List<User> activeUsers = new ArrayList<>();
for (User user : users) {
    if (user.isActive()) {
        activeUsers.add(user);
    }
}

// 不推荐
for (int i = 0; i < users.size(); i++) {
    User user = users.get(i);
    if (user.isActive()) {
        // 复杂逻辑...
    }
}
```

#### 4.3 switch语句
- 使用switch时必须包含default分支
- 考虑使用策略模式替代多分支

```java
switch (status) {
    case PENDING:
        handlePending();
        break;
    case PROCESSING:
        handleProcessing();
        break;
    default:
        logger.warn("未知状态: {}", status);
        break;
}
```

### 5. 异常处理 (优先级：高)

#### 5.1 异常捕获
- 不要捕获 Throwable 或 Exception（除非顶层处理）
- 捕获具体异常类型
- 不允许空的catch块

```java
// 推荐
try {
    service.save(user);
} catch (DataIntegrityViolationException e) {
    throw new BusinessException("用户名已存在", e);
}

// 不推荐
try {
    service.save(user);
} catch (Exception e) {
    // 什么都不做
}

try {
    service.save(user);
} catch (Exception e) {
    throw new RuntimeException(e);
}
```

#### 5.2 异常抛出
- 抛出具体异常类型
- 异常信息使用有意义的描述

```java
// 推荐
if (userId == null) {
    throw new IllegalArgumentException("用户ID不能为空");
}

// 不推荐
if (userId == null) {
    throw new Exception("error");
}
```

#### 5.3 异常链
- 保留原始异常信息，使用cause参数

```java
throw new BusinessException("业务处理失败", e);
```

### 6. 并发与线程安全 (优先级：高)

#### 6.1 共享资源访问
- 多个线程共享的资源必须加锁
- 使用线程安全的集合类

```java
// 推荐
private final ConcurrentHashMap<String, Object> cache = new ConcurrentHashMap<>();

// 不推荐
private final HashMap<String, Object> cache = new HashMap<>();
```

#### 6.2 资源释放
- 使用finally或try-with-resources确保资源释放

```java
// 推荐 - try-with-resources
try (FileInputStream fis = new FileInputStream(file)) {
    // 使用资源
}

// 推荐 - finally
FileInputStream fis = null;
try {
    fis = new FileInputStream(file);
    // 使用资源
} finally {
    if (fis != null) {
        try {
            fis.close();
        } catch (IOException e) {
            // 记录日志
        }
    }
}
```

### 7. 日志规范 (优先级：中)

#### 7.1 日志级别使用
- DEBUG: 调试信息，生产环境关闭
- INFO: 正常业务日志
- WARN: 警告信息，不影响业务
- ERROR: 错误信息，影响业务

```java
logger.debug("查询参数: {}", params);
logger.info("用户 {} 登录成功", username);
logger.warn("库存不足，当前库存: {}", stock);
logger.error("处理失败", e);
```

#### 7.2 日志内容规范
- 不记录敏感信息（密码、身份证、银行卡等）
- 使用占位符而非字符串拼接

```java
// 推荐
logger.info("用户登录, username: {}", username);

// 不推荐
logger.info("用户登录, username: " + username);
```

### 8. 数据库规范 (优先级：中)

#### 8.1 SQL编写
- 使用参数化查询，防止SQL注入
- 避免使用 `SELECT *`，明确指定需要的字段
- 索引字段禁止使用函数

```java
// 推荐
SELECT id, username, email FROM user WHERE id = ?;

// 不推荐
SELECT * FROM user WHERE id = ?;
SELECT * FROM user WHERE LOWER(username) = ?;
```

#### 8.2 索引使用
- 合理创建索引，避免过多索引
- 区分度高的字段放在索引前面

### 9. 安全规范 (优先级：高)

#### 9.1 敏感信息处理
- 禁止在代码中硬编码密码、密钥
- 敏感信息使用配置中心或加密存储
- 日志中禁止记录敏感信息

#### 9.2 权限校验
- 接口必须进行权限校验
- 敏感操作需要多重验证

```java
// 推荐
@PreAuthorize("@securityService.hasPermission('user:delete')")
public void deleteUser(Long userId) {
    // 删除逻辑
}
```

## 输出格式

完成代码审核后，必须按以下格式输出审核报告：

```markdown
# 代码审核报告

## 审核概要
- 审核文件数量: X
- 发现问题总数: X
- 严重问题: X
- 警告问题: X
- 建议问题: X

## 问题详情

### 严重问题

#### [文件名:行号] 问题标题
- **问题类型**: 命名规范/代码格式/异常处理/并发安全/日志规范/数据库规范/安全规范
- **严重程度**: 严重/警告/建议
- **问题描述**: 
- **不符合规约**: 《阿里巴巴Java开发规约》相关条款
- **修复建议**:

### 警告问题
...

### 建议问题
...

## 总结
对整体代码质量的评估和建议
```

## 审核原则

1. **以规约为准** - 严格按照阿里巴巴Java开发规约进行审核
2. **就事论事** - 每个问题都要给出具体的规约条款和修复建议
3. **分级处理** - 严重问题优先，依次处理警告和建议
4. **实用优先** - 在保证规范的前提下，考虑实际业务场景
5. **持续改进** - 建议建立代码规范长效机制
