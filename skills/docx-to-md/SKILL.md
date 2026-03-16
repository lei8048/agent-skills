---
name: docx-to-md
description: "将Word文档(doc/docx)转换为Markdown格式的技能。自动解析文档格式（字号、字体、颜色、加粗、斜体等），识别业务流程图和思维导图并转换为Mermaid图，支持表格和图片处理，自动生成目录。使用场景包括：用户需要将现有的Word文档转换为Markdown格式；需要提取Word文档中的流程图/思维导图为Mermaid代码；需要保留Word文档的格式信息到Markdown；需要处理doc格式（旧版Word文档）。请务必使用此skill处理任何Word转Markdown的任务，无论用户是否明确提到'skill'。"
---

# Doc/Docx 转 Markdown 技能

使用此skill将Word文档转换为Markdown时，优先使用scripts/convert.js脚本完成转换。

## 快速开始

1. 如果是.doc文件，先转换为.docx:
   python -m scripts.office.soffice --headless --convert-to docx input.doc

2. 运行转换脚本:
   node scripts/convert.js input.docx output_dir

## 核心转换逻辑

### 1. 字号→标题级别映射

| 字号(pt) | Markdown |
|---------|----------|
| >=36 | # 一级标题 |
| 28-35 | ## 二级标题 |
| 24-27 | ### 三级标题 |
| 18-23 | #### 四级标题 |
| <=17 | ##### 五级标题 |

段落样式名为"Heading 1"等时，优先使用样式名判断。

### 2. 格式转换

| Word | Markdown |
|------|----------|
| 加粗 | **text** |
| 斜体 | *text* |
| 下划线 | <u>text</u> |
| 删除线 | ~~text~~ |
| 字体颜色 | <span style="color:#FF0000">text</span> |

### 3. 表格处理

Word表格转Markdown表格，处理合并单元格。

### 4. 图片处理

提取图片到images/目录，Markdown中使用相对路径引用。

### 5. Mermaid图识别

识别文档中的流程图/思维导图，转换为Mermaid代码：
- 流程图：矩形->[文本]，菱形->{文本}
- 思维导图：层级结构->mindmap语法
- 组织图：层级关系->flowchart LR

### 6. 目录生成

自动扫描标题生成TOC，锚点使用小写连字符格式。

## 输出结构

输出目录/
├── document.md    # 主文件
├── images/        # 图片目录
└── mermaid/       # Mermaid图（可选）

## 详细指南

如需手动处理复杂文档，参考references/full_example.md。

## 依赖

- python-docx: pip install python-docx
- pandoc: 辅助转换
- LibreOffice: doc->docx转换

## 常见问题

- 乱码: 尝试不同编码(gbk/utf-8)
- 复杂表格: 考虑导出为HTML表格
- 大图片: 使用HTML img标签添加宽度限制
