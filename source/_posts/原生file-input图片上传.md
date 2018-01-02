---
title: 原生file input图片上传
date: 2017-10-22 11:50:19
photo: /img/js.jpg
excerpts: '总结起点个人中心头像上传的实现，兼容ie8。'
tag: javascript
---

总结起点个人中心头像上传的实现，兼容ie8。

### 原理

利用form表单，监听input的change事件，促发表单提交，将表单提交到一个隐藏的iframe中，监听iframe的load事件，当图片上传成功后，通过load事件取到图片的地址，将此图片显示在裁剪框中，这样就实现了图片的预览，然后根据裁剪框中的选择框，得到裁剪图片的top，left以及width和height，通过这四个值以及上传的图片，后台就可以截取图片并将截取的图片返回给前端，从而实现图片的无刷新裁剪上传。

### html部分

这里只介绍一些必须的dom结构，业务需要的其他结构可以自行添加。

> 1.无刷新上传表单，即选择图片后上传供裁剪的表单，基本结构如下

```html
    <form method="post" enctype="multipart/form-data" action="" target="iframeAvatar">
        <input type="file" id="fileAvatar" name="image" class="clip" accept="image/png, image/jpeg, image/gif, image/jpg">
    </form>
```
这个表单结构比较简单，form里面嵌套一个 `type=file` 的input，其中设置 form 的 enctype 属性 `enctype="multipart/form-data"`,enctype 属性规定在发送到服务器之前应该如何对表单数据进行编码,文件类型需使用`multipart/form-data` 属性值。form元素新增target属性，其值指向页面内隐藏的一个 iframe 元素的id。 input 元素如上设置 accept 属性，不能直接设置成 `accept="image/*"`,这样在chrome下会有性能问题，选择图片时会非常慢。

> 2.隐藏的 iframe 元素

```html
<iframe src="javascript:;" id="iframeAvatar" name="iframeAvatar" class="clip dn"></iframe>
``` 
在 form 元素同级增加一个 iframe 元素，设置其隐藏`display:none;`，并且将其 id 设为和 form 元素的target 同值。

> 3.入库表单，即裁剪完成后上传头像的表单，基本结构如下：

```html
    <form id="setAvatarForm" action="" method="post">
        <!-- 上传成功后显示头像，以及更换头像入口 -->
        <div id="avatarXChoose" class="avatar-x-choose">
            <img class="avatar-show" src="<%= data.headUrl %>" alt="<%= data.user.nickName %>的头像">
            <div>
                <label class="ui-button" for="fileAvatar" id="elLabelforup" role="button" tabindex="-1" data-eid="qd_M141" >本地上传</label>
            </div>
        </div>
        <!-- 头像裁剪 -->
        <div id="avatarXCrop" class="avatar-x-crop pr dn">
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

入库表单也是无刷新上传表单的同级元素，其 action 指向头像提交的后台接口，表单内主要分为3个部分

    1. 头像设置首页，即显示目前头像即上传按钮
    2. 裁剪框
    3. 隐藏的提交input

其中头像设置首页的本地上传label 关联到无刷新上传表单的input，所以点击就会弹出图片选择框，同理，隐藏的提交input 的id `id="avatarSubmit"`需要和裁剪框内的 保存头像的label `for="avatarSubmit" ` 的for属性一致,这样点击保存头像就会促发入库表单的提交。
裁剪框内设置 4 个隐藏的input元素，同时设置name 分别为top， left， width， height， 后台在拿到上传的图片后，根据这4个值就可以正确的裁剪好图片并且返回给我们。

### css 部分
原生`<input type="file">` 按钮样式不好自定义，我们可以让`label`元素和`file`控件关联，即让`label`的`for`属性和`input`的`id`属性值相同，然后设置`input`的样式为`clip:rect(0 0 0 0);`,裁剪的top,right,bottom,left都为0，此时`input`就隐藏了，label元素的样式就比较好定义了，而且label元素可以在form表单的外面，同样可以促发表单的提交。




