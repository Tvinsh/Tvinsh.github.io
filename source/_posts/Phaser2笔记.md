---
title: Phaser 2 笔记
photo: /img/phaser.jpg
date: 2019-01-15 15:30:29
excerpts: Phaser 2 笔记
tags: '游戏'
---

![图片内容](/img/phaser.jpg)

# Phaser 2 笔记

------

参考[嬉戏实验室](http://blog.xiiigame.com/phaserguan-wang-shi-li-xue-xi-bi-ji.html)

### 基础

#### 载入图像到缓存

```
//事后通过key值einstein来使用它。如果不是在preload场景中载入文件，还需要判断载入完成才能使用
function preload() {
    game.load.image('einstein', 'assets/pics/ra_einstein.png');
}
```

#### 用图像生成sprite，并添加点击事件监听器

```
var image = game.add.sprite(game.world.centerX, game.world.centerY, 'einstein');  //einstein是载入图像时指定的key
image.inputEnabled = true;
image.events.onInputDown.add(listener, this);
function listener () {
    //do something
}
```

#### 给sprite添加运动/速度

```
game.physics.enable(sprite, Phaser.Physics.ARCADE);  //赋予sprite物理性质
sprite.body.velocity.x=150;  //x轴每秒150点
```

#### 使sprite跟随输入热点（鼠标/触点）移动

```
function update () {
    //  判断sprite到点的距离
    if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8)
    {
        //  使sprite向输入热点移动
        game.physics.arcade.moveToPointer(sprite, 300);
    }
    else
    {
        //  停止
        sprite.body.velocity.set(0);
    }
}
//在render场景中实时显示输入信息
function render () {
    game.debug.inputInfo(32, 32);
}
```

#### 载入JSON Hash格式的图集(可用Texture Packer或Shoebox等工具生成)，生成动画

```
function preload() {
    game.load.atlasJSONHash('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');
}
function create() {
    //  生成sprite
    var bot = game.add.sprite(200, 200, 'bot');
    //  生成动画run（使用图集中的所有帧）
    bot.animations.add('run');
    //  循环播放动画run
    bot.animations.play('run', 15, true);
}
```

#### 渲染文本

```
var text = "- phaser -\n with a sprinkle of \n pixi dust.";
var style = { font: "65px Arial", fill: "#ff0044", align: "center" }; //文本样式
var t = game.add.text(game.world.centerX-300, 0, text, style);  //添加文本控件
```

#### 给图像添加tween动画

```
var tween = game.add.tween(sprite);
//  设置参与动画的属性、时长、类型等
tween.to({ x: 800 }, 5000, 'Linear', true, 0);
```

### 精灵

#### 通过载入的图像生成、添加image

```
function preload() {
    game.load.image('pic', 'assets/pics/acryl_bladerunner.png');
}
function create() {
    //与sprite相比，image没有动画和物理属性
    var image = game.add.image(100, 100, 'pic');
}
```

#### 通过载入的图像生成、添加sprite

```
function preload() {
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
}
function create() {
    var test = game.add.sprite(200, 200, 'mushroom');
}
```

#### 更改锚点

```
sprite.anchor.x += 0.1;
sprite.anchor.y += 0.1;
```

#### 移动sprite

```
sprite.x -= 4;
sprite.y -= 4;
```

#### 调整尺寸

```
sprite.scale.setTo(rand, rand);
//  或者如下：
//  sprite.scale.x = value;
//  sprite.scale.y = value;
```

#### sprite/group遮罩

```
sprite = game.add.sprite(0, 0, 'chaos');
// 遮罩要是Graphics对象（图像遮罩可用BitmapData.alphaMask()）
let mask:Graphics = game.add.graphics(0, 0);
mask.beginFill(0xffffff);
mask.drawCircle(100, 100, 100);
sprite.mask = mask;
```

### ARCADE物理引擎

#### 关闭body属性即取消运动和碰撞检测

```
sprite.body.enable = false;
```

#### 重力

```
sprite3.body.gravity.y = 50;
sprite4.body.allowGravity = false;
```

#### 反弹

```
image = game.add.sprite(0, 0, 'flyer');
game.physics.enable(image, Phaser.Physics.ARCADE);
image.body.velocity.setTo(200,200);
//  与世界边界碰撞
image.body.collideWorldBounds = true;
//  反弹能量（ "1"即100%）
image.body.bounce.set(1, 1);
```

#### 重力与拖拽

```
sprite.inputEnabled = true;
sprite.input.enableDrag();
sprite.events.onDragStart.add(startDrag, this);
sprite.events.onDragStop.add(stopDrag, this);
function startDrag() {
    //  拖拽时应禁止物理运动
    sprite.body.moves = false;
}
function stopDrag() {
    //  停止拖拽时再打开物理运动
    sprite.body.moves = true;
}
```

#### 与游戏世界碰撞的事件

```
face.body.collideWorldBounds = true;
//  缺省情况下这个信号是空的
face.body.onWorldBounds = new Phaser.Signal();
//  然后监听事件
face.body.onWorldBounds.add(hitWorldBounds, this);
```

### 输入

#### 限制在精灵范围内

```
bounds = game.add.sprite(game.world.centerX, game.world.centerY, 'pic');
sprite.input.enableDrag();
sprite.input.boundsSprite = bounds;
```

#### 按键时长

```
game.input.onUp.add(getTime, this);
function getTime(pointer) {
// lastDuration = pointer.timeUp - pointer.timeDown;
lastDuration = pointer.duration;
}
```

#### 锁定为横向拖拽（禁用纵向拖拽）

```
sprite.input.allowVerticalDrag = false;
//  禁用横向拖拽，见### Motion Lock Vertical
sprite.input.allowHorizontalDrag = false;
```

#### 点击事件

```
game.input.onTap.add(onTap, this);
function onTap(pointer, doubleTap) {
    if (doubleTap)    {    }
}
```

### 时间

#### 定时事件

```
game.time.events.add(Phaser.Timer.SECOND * 4, fadePicture, this);
```

#### 循环事件

```
game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
```

#### 自定定时器

```
timer = game.time.create(false);
timer.loop(2000, updateCounter, this);
timer.start();
```

#### 移除事件/定时器

```
//  从上倒下移除
game.time.events.remove(timerEvents[i]);
```

### 文本

#### 文本渐变

```
var grd = text.context.createLinearGradient(0, 0, 0, text.height);
grd.addColorStop(0, '#8ED6FF');   
grd.addColorStop(1, '#004CB3');
text.fill = grd;
```

#### 文本在边框中居中

```
var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
text = game.add.text(0, 0, "phaser 2.4 text bounds", style);
text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
//设定文本边框为x0, y100，800x100
text.setTextBounds(0, 100, 800, 100);
```

#### 文本在精灵中居中

```
sprite = game.add.sprite(200, 200, 'pic');
var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#ffff00" };
text = game.add.text(0, 0, "- text on a sprite -\ndrag me", style);
text.anchor.set(0.5);
function update() {
text.x = Math.floor(sprite.x + sprite.width / 2);
text.y = Math.floor(sprite.y + sprite.height / 2);
}
```

#### 文本样式

```
// 单词折行
var style = { font: 'bold 60pt Arial', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 450 };
var text = game.add.text(game.world.centerX, game.world.centerY, "phaser with a sprinkle of pixi dust", style);

// 文本行距
text2.lineSpacing = 40;

// 文本内边距
text.padding.set(10, 16);

// 文本阴影
var text = createText(100, 'shadow 5');
// Phaser.Text.setShadow(x, y, color, blur, shadowStroke, shadowFill) : Phaser.Text;
text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

// 字符上色/着色
//  给16-24上'#ffff00'色
text.addColor('#ffff00', 16);
text.addColor('#ffffff', 25);
text.addColor('#ff00ff', 28);
text.addColor('#ffffff', 32);
//见### Text Tint
// text.tint = (item.tint === 0xffffff) ? 0xff0000 : 0xffffff;
```

#### Bitmap字体

```
game.load.bitmapFont('desyrel', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml');
bmpText = game.add.bitmapText(200, 100, 'desyrel', 'Phaser & Pixi\nrocking!', 64);
```