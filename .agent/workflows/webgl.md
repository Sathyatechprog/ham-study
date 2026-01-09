---
description: 制作天线3D渲染图
---

根据我提供的markdown文档，制作3D渲染图，需要包含天线、方向图、电场，电场强弱（若有），功能需要参考八木天线 @yagi-antenna.tsx ， @yagi-antenna-scene.tsx 。@electric-field-instanced.tsx 这也需要加上对应的电场代码，是需要单独，不与其他类似的天线放在一起。开发的页面需要在 @home.tsx 中添加，也需要在 @route.ts 里配置好。