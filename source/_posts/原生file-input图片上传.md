---
title: 原生file input图片上传
date: 2017-10-22 11:50:19
photo: /img/js.jpg
excerpts: '总结起点个人中心头像上传的实现，兼容ie8。'
tag: js
---

# 原生file input头像上传

------

起点个人中心的头像上传可以实现无刷新上传，预览裁剪，并且兼容ie8，下面对头像上传的具体实现做一些总结。

### 原理

利用form表单，监听上传input的change事件，促发表单提交，将表单提交到一个隐藏的iframe中，监听iframe的load事件，当图片上传成功后，通过load事件取到返回的图片地址，将此图片显示在裁剪框中，就可以利用js实现图片的预览，然后根据裁剪框中的选择框，得到裁剪图片的top，left以及width和height，通过这四个值以及上传的图片，后台就可以截取图片并将截取的图片返回给前端，从而实现图片的无刷新裁剪上传。

### html部分

这里只介绍一些必须的dom结构，业务需要的其他结构可以自行添加，主要分为3大部分，1是无刷新提交表单，此表单的作用是将本地图片提交到后台然后后台返回供我们裁剪预览，2是隐藏的iframe，配合实现无刷新上传，3是入库表单，作用是将裁剪的图片上传给服务器，预览裁剪的工作在入库表单中实现。

>1.无刷新上传表单，即选择图片后上传供裁剪的表单，基本结构如下

```html
<form method="post" enctype="multipart/form-data" action="" target="iframeAvatar">
    <input type="file" id="fileAvatar" name="image" class="clip" accept="image/png, image/jpeg, image/gif, image/jpg">
</form>
```
这个表单结构比较简单，form里面嵌套一个 `type=file` 的input，其中设置 form 的 enctype 属性为 `enctype="multipart/form-data"`,enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码,文件类型需使用`multipart/form-data` 属性值。form元素的target属性，其值指向页面内隐藏的一个 iframe 元素的id。 input 元素如上设置 accept 属性，不能直接设置成 `accept="image/*"`,这样在chrome下会有性能问题，选择图片时会非常慢,另外form的action属性，指向后台接口，此接口会返回一段包含上传图片地址的html。

>2.隐藏的 iframe 元素

```html
<iframe src="javascript:;" id="iframeAvatar" name="iframeAvatar"></iframe>
```
在 form 元素同级增加一个 iframe 元素，设置其隐藏`display:none;`，并且将其 id 设为和 form 元素的target 同值, 目的是将无刷新头像上传表单提交到此 iframe，后续可监听此iframe的load事件。

>3.入库表单，即裁剪完成后上传头像的表单，基本结构如下：

```html
<form id="setAvatarForm" action="" method="post">
    <!-- 上传成功后显示头像，以及更换头像的入口 -->
    <div id="avatarXChoose" class="avatar-x-choose">
        <img class="avatar-show" src="<%= data.headUrl %>" alt="<%= data.user.nickName %>的头像">
        <div>
            <label class="ui-button" for="fileAvatar" id="elLabelforup" role="button" tabindex="-1" data-eid="qd_M141" >本地上传</label>
        </div>
    </div>
    <!-- 头像裁剪 -->
    <div id="avatarXCrop" class="avatar-x-crop pr dn">
        <!-- 裁剪大小的 4 个值 -->
        <input type="hidden" id="iptCropLeft" name="left" value="0">
        <input type="hidden" id="iptCropTop" name="top" value="0">
        <input type="hidden" id="iptCropWidth" name="width" value="120">
        <input type="hidden" id="iptCropHeight" name="height" value="120">
        <div id="avatarCrop" class="avatar-crop"></div>
        <div class="avatar-preview">
            <h3>预览头像</h3>
            <div class="avatar-big">
                <div id="avatarCropL" class="avatar-big-img"><img></div>
                <div class="avatar-preview-size">
                    <div>大尺寸</div>
                    <div>120x120</div>
                </div>
            </div>
            <div class="avatar-middle">
                <div id="avatarCropM" class="avatar-middle-img"><img></div>
                <div class="avatar-preview-size">
                    <div>中尺寸</div>
                    <div>60x60</div>
                </div>
            </div>
            <div class="avatar-small">
                <div id="avatarCropS" class="avatar-small-img"><img></div>
                <div class="avatar-preview-size">
                    <div>小尺寸</div>
                    <div>30x30</div>
                </div>
            </div>
        </div>
        <div>
            <label for="avatarSubmit" class="ui-button" id="elUserAvatar">保存头像</label>
            <a href="javascript:;" id="btnUploadCancel" class="ui-button ui-button-default">取消</a>
        </div>
    </div>
    <input type="submit" id="avatarSubmit" class="clip">
</form>
```

入库表单也是无刷新上传表单的同级元素，其 action 指向头像提交的后台接口，当无刷新表单提交完成获取到图片后，在这里显示供裁剪的图片，表单内主要分为3个部分

> 头像设置首页，即显示目前头像和上传按钮
> 裁剪框
> 隐藏的提交input

其中头像设置首页的 `<label>本地上传</label>` 关联到无刷新上传表单的`input`按钮，所以点击就会弹出图片选择框，同理，隐藏的入库表单提交按钮的id `id="avatarSubmit"`需要和裁剪框内的保存头像的label `for="avatarSubmit" ` 的for属性一致,这样点击保存头像就会促发入库表单的提交。
裁剪框内设置 4 个隐藏的input元素，同时设置name 分别为top， left， width， height， 后台在拿到上传的图片后，根据这4个值就可以正确的裁剪好图片并且返回给我们。

### css 部分
原生`<input type="file">` 按钮样式不好自定义，我们可以让`label`元素和`file`控件关联，即让`label`的`for`属性和`input`的`id`属性值相同，然后设置`input`的样式为`clip:rect(0 0 0 0);`,裁剪的top,right,bottom,left都为0，此时`input`就隐藏了，label元素的样式就比较好定义了，而且label元素可以在form表单的外面，同样可以促发表单的提交。

### js 部分
具体代码可以参考个人中心头像设置页面的代码，大致分为以下几个主要部分。
1. 监听上传头像按钮的change事件，在change事件的回调里提交无刷新表单，此时表单被提交到当前页面中的iframe中，且此iframe被隐藏了，所以页面不会刷新；
2. 同时监听iframe的load事件，通过load事件回调取得后台返回的图片地址，然后将地址作为参数传给裁剪方法；获取的主要代码为`var doc = iframe.contentDocument ? iframe.contentDocument : frames[iframe.id].document;`,contentDocument 属性能够以 HTML 对象来返回 iframe 中的文档,事先和后台约定好返回的格式，所以获取到iframe中的文档就可以获取到图片链接了。
3. 裁剪方法获取到图片地址后，将图片显示出来，通过js可实现拖动裁剪框和控制裁剪框的大小，获取裁剪框的top,left,width,height，点击保存头像按钮时促发入库表单提交，并将图片和裁剪的四个参数传给后台，后台根据这些参数就可以正确裁剪图片并将结果返回给前端，此时头像就设置成功了。

### php 部分
无刷新上传图片时，php返回一段html到iframe中，此时iframe内部和外部文档处于跨域状态，需在head内设置`document.domain`和当前domain一致，避免从ifame内读取图片数据时出现跨域问题。





