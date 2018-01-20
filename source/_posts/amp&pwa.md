---
title: 让自己的博客支持amp & pwa
photo: /img/amppwa.png
date: 2018-01-14 17:52:00
excerpts: 几个步骤，轻松让自己的博客支持amp & pwa
tags: 'js'
---

![pwa](/img/amppwa.png)

# 让自己的博客支持 amp & pwa

------

### 简介

最近看了下 amp 和 pwa 的一些介绍，于是查了些资料，给自己的博客加上了 amp 和 pwa 功能，给静态博客加上这些还是比较简单的，社区已经有了很多插件支持了，具体步骤如下

### 1. 将 http 升级为 https

可以借助 [cloudflare](https://www.cloudflare.com/)的cdn，大概步骤是将你的域名注册商的 dns server 更改成 cloudflare 所提供的，然后在cloudflare 上配置一些dns信息，具体做法可 google， 有很多

值得一提的是，可以让博客强行跳转到 https， 在 html 模板中加上 
```html
<link rel="canonical" href="<%- page.permalink %>">
<script type="text/javascript">
    var host = "2fz1.me";
    if ((host == window.location.host) && (window.location.protocol != "https:"))
        window.location.protocol = "https";
</script>
```
然后在```_config.yml```中加上
```yml
rl: https://2fz1.me
enforce_ssl: 2fz1.me
```

### 2. 迁移博客到 amp

网上也有很多做法，由于我地博客是用 hexo 的，于是自然地用了 hexo 插件 [hexo-generator-amp](https://github.com/tea3/hexo-generator-amp),具体方法可参考插件的文档

> TIPs:
> 1. 一定要修改文章页的模板，添加link[rel=amphtml]链接，要不然搜索无法找到 AMP 页面
> 2. AMP 页面会自动在head中添加canonical链接回原有的文章页

完成后地效果如下

搜索结果页： 

![amp](/img/blogamp.png)

amp详情页：

![amp](/img/blogamp2.png)

### 3. 添加 pwa 功能

搜了下也能发现很多做法，既然有插件，就选了 hexo-offline， 这个插件可以自动生成 pwa 核心 ServiceWorker 代码，然后参考文档在```_config.yml``` 中添加大概如下代码：

```yml
{
    # Offline
    ## Config passed to sw-precache
    ## https://github.com/JLHwung/hexo-offline
    offline:
    maximumFileSizeToCacheInBytes: 10485760
    staticFileGlobs:
        - public/**/*.{js,html,css,png,jpg,jpeg,gif,svg,json,xml}
    stripPrefix: public
    verbose: true
    runtimeCaching:
        # CDNs - should be cacheFirst, since they should be used specific versions so should not change
        - urlPattern: /*
        handler: cacheFirst
        options:
        origin: cdn.bootcss.com
}
```

然后添加 manifest.json 文件，可以参照文档自己写一份，也可以用 [app-manifest](https://app-manifest.firebaseapp.com/)自动生成一份，记得要将 manifest.json 引入你的 html 中

可以用 chrome 插件 Lighthouse 检测网站对于 pwa 支持的检测报表

pwa 离线页： 

![pwa](/img/blogpwa.png)
