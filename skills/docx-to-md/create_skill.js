const fs = require('fs');
const path = require('path');

const content = `---
name: docx-to-md
description: "将Word文档(doc/docx)转换为Markdown格式的技能。自动解析文档格式（字号、字体、颜色、加粗、斜体等），识别业务流程图和思维导图并转换为Mermaid图，支持表格和图片处理，自动生成目录。使用场景包括：用户需要将现有的Word文档转换为Markdown格式；需要提取Word文档中的流程图/思维导图为Mermaid代码；需要保留Word文档的格式信息到Markdown；需要处理doc格式（旧版Word文档）。"
---

# Doc/Docx 转 Markdown 技能

## 概述

这个技能可以将Word文档(.docx)和旧版Word文档(.doc)转换为Markdown格式，同时：
- 智能保留文档格式信息（字号、字体、颜色、加粗、斜体、下划线等）
- 自动识别并转换流程图、思维导图为Mermaid图
- 处理表格和图片
- 自动生成目录（TOC）

## 工作流程

### 步骤1：检查文件并转换格式

如果文件是\` .doc\` 格式（旧版Word），需要先转换为\` .docx\` ：

\`\`\`bash
python -m scripts.office.soffice --headless --convert-to docx input.doc
\`\`\`

### 步骤2：读取文档内容

使用Python的python-docx库读取docx文件内容：

\`\`\`python
import docx
from docx.shared import RGBColor, Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = docx.Document('input.docx')
\`\`\`

### 步骤3：解析格式并转换为Markdown

遍历文档的每个段落和表格，解析格式并转换为Markdown。

## 格式转换规则

### 字号与标题级别映射

根据字号大小智能判断标题级别：

| 字号（pt） | Markdown格式 | 说明 |
|-----------|-------------|------|
| >= 36 | # 标题1 | 一级标题 |
| 28-35 | ## 标题2 | 二级标题 |
| 24-27 | ### 标题3 | 三级标题 |
| 18-23 | #### 标题4 | 四级标题 |
| <= 17 | ##### 标题5 | 五级标题 |

字号与Markdown对照表（使用ATX风格标题）：
- 36pt及以上 → # 一级标题
- 28-35pt → ## 二级标题  
- 24-27pt → ### 三级标题
- 18-23pt → #### 四级标题
- 14-17pt → ##### 五级标题
- ≤13pt → 普通段落文本

如果段落样式名为"Heading 1"、"Heading 2"等，优先使用样式名判断级别。

### 字体样式转换

| Word格式 | Markdown格式 |
|---------|--------------|
| 加粗 | **文本** |
| 斜体 | *文本* |
| 下划线 | <u>文本</u> |
| 删除线 | ~~文本~~ |
| 字体颜色 | HTML span标签保留颜色 |
| 高亮 | ==文本== |

### 字体属性

保留字体信息（如果不同于默认值）：
- 字体名称存储为HTML属性或注释

### 段落格式

| Word格式 | Markdown处理 |
|---------|--------------|
| 左对齐 | 默认 |
| 居中 | HTML center标签或CSS |
| 右对齐 | HTML style="text-align:right" |
| 两端对齐 | 默认 |
| 行距 | 转换为HTML br标签或多空行 |
| 首行缩进 | 使用HTML &nbsp;或CSS text-indent |

## 表格处理

Word表格直接转换为Markdown表格：

\`\`\`markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容 | 内容 | 内容 |
\`\`\`

注意处理：
- 单元格合并（跨行/跨列）
- 表格边框样式
- 表格内嵌格式（加粗、斜体等）

## 图片处理

提取文档中的图片：

\`\`\`python
for rel in doc.part.related_parts:
    if "image" in rel.target_ref:
        # 保存图片
        image = doc.part.related_parts[rel.target_ref]
\`\`\`

图片处理策略：
1. 将图片保存到输出目录的\` images/\` 子目录
2. 在Markdown中使用相对路径引用：\` ![图片说明](./images/image1.png)\`
3. 如果图片无法提取，记录占位符

## Mermaid图转换

### 自动识别流程图/思维导图

通过以下方式识别需要转换为Mermaid的内容：

1. **SmartArt检测**：检查文档中的形状（shapes）和绘图画布
2. **文本模式识别**：检测特定模式的文本（如"开始→步骤1→结束"）
3. **关键词检测**：包含"流程"、"步骤"、"阶段"、"流程图"等关键词的文本框
4. **组织结构图**：通过Word内置的组织和层级关系

### Mermaid图生成

#### 流程图 (flowchart)

\`\`\`mermaid
flowchart TD
    A[开始] --> B{判断条件}
    B -->|是| C[处理1]
    B -->|否| D[处理2]
    C --> E[结束]
    D --> E
\`\`\`

转换逻辑：
1. 识别图形节点和连接线
2. 根据形状类型确定节点形状：
   - 矩形 → \` [文本]\`
   - 菱形 → \` {文本}\`
   - 圆形 → \` ((文本))\`
   - 平行四边形 → \` [/文本/]\`
3. 根据连接线箭头确定流向
4. 添加决策分支标签

#### 思维导图 (mindmap)

\`\`\`mermaid
mindmap
  root((中心主题))
    子主题1
      细节A
      细节B
    子主题2
      细节C
\`\`\`

转换逻辑：
1. 识别根节点（中心主题）
2. 提取层级结构
3. 转换为Mermaid mindmap语法

#### 组织结构图 (flowchart LR)

用于表示层级关系的组织图：
\`\`\`mermaid
flowchart LR
    A[CEO] --> B[经理1]
    A --> C[经理2]
    B --> D[员工1]
    B --> E[员工2]
\`\`\`

#### 序列图 (sequenceDiagram)

如果文档包含时间顺序的交互描述：
\`\`\`mermaid
sequenceDiagram
    participant A as 用户
    participant B as 系统
    A->>B: 请求
    B-->>A: 响应
\`\`\`

### 转换提示

- 如果文档中有明显的流程图形状，尝试解析为Mermaid
- 如果文本描述了步骤流程，提取并格式化为Mermaid
- 保留原始图形作为参考，生成Mermaid后添加注释说明

## 目录生成

自动扫描文档中的标题，生成TOC：

\`\`\`markdown
## 目录

- [一级标题1](#一级标题1)
  - [二级标题](#二级标题)
  - [二级标题](#二级标题-1)
    - [三级标题](#三级标题)
- [一级标题2](#一级标题2)
\`\`\`

生成规则：
1. 使用标题文本作为锚点
2. 转换为小写并用连字符替换空格和特殊字符
3. 缩进表示层级关系

## 输出文件结构

\`\`\`
输出目录/
├── document.md          # 主Markdown文件
├── images/              # 图片目录
│   ├── image1.png
│   └── image2.png
└── mermaid/             # Mermaid图目录（可选）
    ├── flowchart.mmd
    └── mindmap.mmd
\`\`\`

## 完整转换流程示例

\`\`\`python
import docx
import re
import os

def convert_docx_to_md(input_file, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.join(output_dir, 'images'), exist_ok=True)
    
    doc = docx.Document(input_file)
    md_content = []
    toc = []
    heading_counter = {}
    
    for para in doc.paragraphs:
        if para.style.name.startswith('Heading'):
            level = int(para.style.name[-1])
            text = para.text.strip()
            anchor = generate_anchor(text, heading_counter)
            toc.append((level, text, anchor))
            md_content.append('#' * level + ' ' + text)
        else:
            md_content.append(process_paragraph(para))
    
    toc_md = generate_toc(toc)
    tables_md = []
    for table in doc.tables:
        tables_md.append(process_table(table))
    
    images = process_images(doc, output_dir)
    
    final_md = "# 文档标题\\n\\n"
    final_md += "## 目录\\n" + toc_md + "\\n\\n"
    final_md += "\\n\\n".join(md_content) + "\\n\\n"
    final_md += "\\n\\n".join(tables_md)
    
    with open(os.path.join(output_dir, 'document.md'), 'w', encoding='utf-8') as f:
        f.write(final_md)
    
    return final_md
\`\`\`

## 高级功能

### 保留精确格式

对于需要精确保留格式的文档，使用HTML混排：

\`\`\`markdown
<h1 style="font-size: 36pt; color: #FF0000;">红色36pt标题</h1>

<p style="font-size: 14pt; text-indent: 2em;">首行缩进的段落...</p>
\`\`\`

### 处理脚注和尾注

转换为Markdown脚注：

\`\`\`markdown
正文内容[^1]

[^1]: 这是脚注内容
\`\`\`

### 处理超链接

保留链接信息：

\`\`\`markdown
[链接文本](URL)
\`\`\`

### 处理页眉页脚

页眉页脚内容可以作为文档元信息保存，或在需要时包含在文档中。

## 常见问题处理

### Q: 文档中有乱码怎么办？
A: 检查文档编码，尝试使用不同的编码方式读取（如'gbk'、'utf-8'）

### Q: 图片太大导致Markdown难以阅读？
A: 使用HTML img标签添加宽度限制：\` ![图片](./img.png){: width="500"}\`

### Q: 如何处理doc格式文件？
A: 先用LibreOffice转换为docx：
\`\`\`bash
soffice --headless --convert-to docx document.doc
\`\`\`

### Q: 复杂表格如何处理？
A: 对于复杂表格（合并单元格多），考虑导出为HTML表格格式而非Markdown表格

## 依赖工具

- \` python-docx\`: 读取docx文件
- \` pandoc\`: 辅助转换工具
- \` LibreOffice\`: 转换doc文件到docx

安装依赖：
\`\`\`bash
pip install python-docx
\`\`\`
`;

const skillPath = 'C:/Users/EDY/.trae-cn/skills/docx-to-md/SKILL.md';

fs.writeFileSync(skillPath, content, 'utf8');
console.log('SKILL.md created successfully at:', skillPath);
