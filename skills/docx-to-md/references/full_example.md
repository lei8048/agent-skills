# 完整转换示例

## Python实现

import docx
from docx.shared import Pt, RGBColor
import os
import re

def convert_docx_to_md(input_file, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.join(output_dir, 'images'), exist_ok=True)
    
    doc = docx.Document(input_file)
    md_lines = []
    headings = []
    
    for para in doc.paragraphs:
        style_name = para.style.name
        
        if style_name.startswith('Heading'):
            level = int(style_name[-1])
            text = para.text.strip()
            anchor = re.sub(r'[^\w\u4e00-\u9fa5]+', '-', text.lower())
            headings.append({'level': level, 'text': text, 'anchor': anchor})
            md_lines.append("#" * level + " " + text)
        elif para.text.strip():
            md_lines.append(process_text_runs(para))
    
    toc = generate_toc(headings)
    
    md_content = "# Document\n\n## Table of Contents\n" + toc + "\n\n"
    md_content += "\n\n".join(md_lines)
    
    output_path = os.path.join(output_dir, 'document.md')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(md_content)
    
    extract_images(doc, output_dir)
    
    return output_path

def process_text_runs(para):
    parts = []
    for run in para.runs:
        text = run.text
        if run.bold:
            text = "**" + text + "**"
        if run.italic:
            text = "*" + text + "*"
        if run.underline:
            text = "<u>" + text + "</u>"
        if run.font.color and run.font.color.rgb:
            color = rgb_to_hex(run.font.color.rgb)
            text = '<span style="color:' + color + '">' + text + '</span>'
        parts.append(text)
    return ''.join(parts)

def generate_toc(headings):
    lines = []
    for h in headings:
        indent = '  ' * (h['level'] - 1)
        lines.append(indent + "- [" + h['text'] + "](#" + h['anchor'] + ")")
    return '\n'.join(lines)

def extract_images(doc, output_dir):
    image_dir = os.path.join(output_dir, 'images')
    for i, rel in enumerate(doc.part.related_parts):
        if 'image' in rel.target_ref:
            image = doc.part.related_parts[rel.target_ref]
            ext = rel.target_ref.split('.')[-1]
            filename = 'image_' + str(i) + '.' + ext
            with open(os.path.join(image_dir, filename), 'wb') as f:
                f.write(image.blob)

def rgb_to_hex(rgb):
    return '#{:02X}{:02X}{:02X}'.format(rgb.red, rgb.green, rgb.blue)

if __name__ == '__main__':
    import sys
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'input.docx'
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'output'
    convert_docx_to_md(input_file, output_dir)

## Mermaid图识别

### 流程图模式
识别关键词：流程、步骤、阶段、流程图
识别模式：文本中包含"->"或"→"

### 思维导图模式
识别层级缩进或编号结构

### 转换示例

flowchart TD
    A[开始] --> B{判断}
    B -->|是| C[处理1]
    B -->|否| D[处理2]
    C --> E[结束]
    D --> E
