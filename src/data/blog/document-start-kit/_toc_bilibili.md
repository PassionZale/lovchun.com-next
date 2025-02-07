# Channel Name

Code Sugar

# Slidev Theme

> 每个幻灯片项目只能有一个主题。主题应专注于提供幻灯片的外观。

@whouu/slidev-theme-landscape
@whouu/slidev-theme-horizontal-screen

@whouu/slidev-theme-portrait
@whouu/slidev-theme-vertical-screen

- 全局样式
- 提供默认配置
- 提供自定义布局或覆盖现有布局
- 提供自定义组件
- 配置 UnoCSS、Shiki 等工具

Slidev 默认主题支持浅色模式和深色模式。在 package.json 中显式指定 `dark`，只展示深色模式。

```json
{
  "slidev": {
    "colorSchema": "dark"
  }
}
```

# Slidev Addon

> 如果功能与外观无关且可以单独使用，则应将其实现为插件。

@whouu/slidev-addon-components

- 提供自定义组件
- 提供新的布局
- 提供新的代码片段
- 提供新的代码运行器
- 配置 UnoCSS、Vite 等工具

```json
{
	"keywords": ["slidev-addon", "slidev"]
}
```