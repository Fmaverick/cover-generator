# cover-generator

**AI-assisted cover generation for Xiaohongshu creators.**  
**面向小红书创作者的 AI 辅助封面生成工具。**

cover-generator is a workflow product for creators who need covers that are fast to make, visually consistent, and easy to iterate.  
`cover-generator` 不是单纯的出图工具，而是一个把内容封面制作做得更快、更稳、更成体系的工作流产品。

Instead of optimizing for raw image generation, this project focuses on operationalizing visual taste:
这个项目关注的不是“生成一张图”本身，而是把视觉判断力产品化：

- generate polished cover layouts from long-form content  
  把长内容快速转成适合发布的封面版式
- paginate text automatically for multi-image posts  
  自动分页，适配图文内容的多页发布场景
- switch between reusable visual templates  
  在不同视觉模板之间快速切换
- export a full set of images in one pass  
  一次性导出整套图片素材

## Why this exists / 为什么做它

Creator tools are crowded. What is still rare is software that packages speed, consistency, and taste into one repeatable publishing workflow.  
内容工具很多，但真正稀缺的，是能把速度、一致性和审美一起封装进工作流的软件。

That is the bet behind `cover-generator`.  
这就是 `cover-generator` 想解决的问题。

## Highlights / 核心能力

- multiple cover styles for different publishing moods  
  多种封面风格，适配不同内容气质
- automatic text pagination based on layout space  
  基于版面空间的自动文本分页
- live tuning of background, text, and highlight colors  
  实时调整背景、文字与高亮色
- bulk export for faster publishing  
  批量导出，减少重复操作
- local-first rendering for privacy and speed  
  本地优先渲染，兼顾隐私与速度

## Tech Stack / 技术栈

- React
- TypeScript
- Tailwind CSS
- Canvas API
- JSZip

## Run locally / 本地运行

```bash
npm install
npm run dev
```

## Demo / 在线体验

[Live demo](https://fmaverick.github.io/cover-generator/)

## License

MIT
