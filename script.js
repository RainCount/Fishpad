function playSound(soundFile) {
    var audio = new Audio(soundFile);
    audio.play();
}

function adjustLayout() {
    var container = document.querySelector('.container');
    var width = window.innerWidth;
    var height = window.innerHeight;
    // var longSide = Math.max(width, height);
    // var shortSide = Math.min(width, height);
    var longSideSquares = 5;
    var shortSideSquares = 3;

    if (width < height) {
        longSideSquares = 3;
        shortSideSquares = 5;
    }

    container.style.gridTemplateColumns = `repeat(${longSideSquares}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${shortSideSquares}, 1fr)`;
}

const originalWords = ['FISH', '俩', 'ALL', '肥', '大', '炫', '超', '小', '圆', '马', '风', '爽', '刺', '偷摸零', '在这待着也太可爱了呀'];
const newWords = ['在', '这', '待', '着', '也', '太', '可', '爱', '了', '呀', '太', '可', '爱', '了', '呀'];

// 首先，我们需要一个函数来播放音频
function playSound(soundName, id) {
    loadSounds().then(sounds => {
        let audio = new Audio(sounds[soundName]);
        audio.play();
    });

    // 如果点击的是最后一个方块
    if (id === 'square15') {
        // 逐个替换文字
        for (let i = 1; i <= 15; i++) {
            setTimeout(function() {
                let square = document.getElementById('square' + i);
                let text = square.querySelector('span');  // 获取span元素
                text.textContent = newWords[i - 1];
            }, i * 200); 
        }

        // 几秒钟后换回原来的文字
        setTimeout(function() {
            for (let i = 1; i <= 15; i++) {
                setTimeout(function() {
                    let square = document.getElementById('square' + i);
                    let text = square.querySelector('span');  // 获取span元素
                    text.textContent = originalWords[i - 1];
                }, i * 10);
            }
        }, 1000 + 15 * 200);  // 在所有方块都替换完文字后再开始计时
    }
}

// document.getElementById('square3').addEventListener('mousedown', function() {
//     let squares = document.querySelectorAll('.square');
//     squares.forEach((square) => {
//         square.classList.remove('simulate-deactive');
//         square.classList.add('simulate-active');
//     });
// });

// document.getElementById('square3').addEventListener('mouseup', function() {
//     let squares = document.querySelectorAll('.square');
//     squares.forEach((square) => {
//         square.classList.remove('simulate-active');
//         square.classList.add('simulate-deactive');
//     });
// });

// 然后，我们需要一个函数来加载 JSON 文件
async function loadSounds() {
    let response = await fetch('data.json');
    let data = await response.json();
    return data;
}

window.addEventListener('resize', adjustLayout);
adjustLayout();

window.addEventListener('DOMContentLoaded', (event) => {
    const squares = document.querySelectorAll('.square');

    squares.forEach((square, index) => {
        if (index < originalWords.length) {
            // 创建单词数组的副本
            let words = [...originalWords];

            // 使用 Fisher-Yates 算法随机排列数组
            for (let i = words.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [words[i], words[j]] = [words[j], words[i]];
            }

            // 将目标文字放在数组的最后一位
            const targetIndex = words.indexOf(originalWords[index]);
            [words[targetIndex], words[words.length - 1]] = [words[words.length - 1], words[targetIndex]];

            // 创建一个新的 span 元素，并将它添加到方块中
            let span = document.createElement('span');
            square.appendChild(span);

            let wordIndex = 0;
            let intervalId = setInterval(() => {
                span.textContent = words[wordIndex];
                span.style.animation = 'none'; // 先移除动画
                setTimeout(() => span.style.animation = 'fade 40ms ease-in-out', 0); // 然后再添加动画

                if (wordIndex < words.length - 1) {
                    wordIndex++;
                } else {
                    clearInterval(intervalId);
                }
            }, 40); // 设置时间间隔为1秒
        } else {
            console.error(`No word for square ${index}`);
        }
    });
});

// 创建一个数组来存储颜色
// let colors = ['#ADD8E6', '#B0E0E6', '#87CEFA', '#87CEEB', '#4169E1', '#1E90FF', '#6495ED', '#7B68EE', '#6A5ACD', '#4682B4'];
let colors = ['#77BBDD', '#FF8899', '#77DD77', '#FFDD88', '#7777AA'];
// let colors = ['#77BBDD', '#FF8899', '#77DD77', '#FFDD88', '#7777AA', '#BB9854', '#799978', '#345566', '#AB4378', '#7899CC'];

function createFish(two, color1, color2) {
    // 创建渐变
    let gradient = new Two.LinearGradient(-50, 0, 50, 0, [
        new Two.Stop(0, color1),  // 顶部颜色
        new Two.Stop(1, color2)   // 底部颜色
    ]);

    // 创建鱼的身体
    let body = two.makeEllipse(0, 0, 100, 50);
    body.fill = color1;
    body.noStroke();

    // 创建鱼的尾巴
    let tail = two.makePolygon(0, 0, 50, 3);
    tail.fill = color1;
    tail.noStroke();
    tail.rotation = Math.PI / 2;
    tail.translation.set(-100, 0);

    // 创建鱼的眼睛
    let eye1 = two.makeCircle(85, -10, 6);
    eye1.fill = '#FFFFFF';
    eye1.noStroke();

    let eye2 = two.makeCircle(55, -10, 6);
    eye2.fill = '#FFFFFF';
    eye2.noStroke();

    // 创建鱼的嘴巴
    let mouth = two.makePolygon(70, 10, 7, 3);
    mouth.fill = '#FFFFFF';
    mouth.noStroke();
    mouth.rotation = Math.PI; 
    
    // 将所有的部分添加到一个组中
    let fish = two.makeGroup(body, tail, eye1, eye2, mouth);
    fish.translation.set(two.width / 2, two.height / 2);

    // 默认隐藏鱼图案
    fish.visible = false;

    return fish;
}

function createStickMen(two, color1, color2) {
    // 创建火柴人的函数
    function createStickMan(color) {
        let x = 0, y = 0;  // 固定火柴人的位置
        let head = two.makeCircle(x, y, 20);
        head.fill = color;
        head.stroke = color;  // 设置线条颜色为火柴人的颜色
        head.linewidth = 5;  // 设置线宽
        let body = two.makeLine(x, y + 20, x, y + 70);
        body.stroke = color;  // 设置线条颜色为火柴人的颜色
        body.linewidth = 5;  // 设置线宽
        let arm1 = two.makeLine(x, y + 30, x - 30, y + 50);  // 创建左手臂，调整端点位置使手臂向下斜
        arm1.stroke = color;  // 设置线条颜色为火柴人的颜色
        arm1.linewidth = 5;  // 设置线宽
        let arm2 = two.makeLine(x, y + 30, x + 30, y + 50);  // 创建右手臂，调整端点位置使手臂向下斜
        arm2.stroke = color;  // 设置线条颜色为火柴人的颜色
        arm2.linewidth = 5;  // 设置线宽
        let leg1 = two.makeLine(x, y + 70, x - 20, y + 100);
        leg1.stroke = color;  // 设置线条颜色为火柴人的颜色
        leg1.linewidth = 5;  // 设置线宽
        let leg2 = two.makeLine(x, y + 70, x + 20, y + 100);
        leg2.stroke = color;  // 设置线条颜色为火柴人的颜色
        leg2.linewidth = 5;  // 设置线宽

        // 在每个线条的端点添加一个小圆
        let joint1 = two.makeCircle(x - 30, y + 50, 2);
        joint1.fill = color;
        joint1.stroke = color;
        let joint2 = two.makeCircle(x + 30, y + 50, 2);
        joint2.fill = color;
        joint2.stroke = color;
        let joint3 = two.makeCircle(x - 20, y + 100, 2);
        joint3.fill = color;
        joint3.stroke = color;
        let joint4 = two.makeCircle(x + 20, y + 100, 2);
        joint4.fill = color;
        joint4.stroke = color;

        return two.makeGroup(head, body, arm1, arm2, leg1, leg2, joint1, joint2, joint3, joint4);
    }

    // 创建两个火柴人
    let stickMan1 = createStickMan(color1);
    let stickMan2 = createStickMan(color2);

    // 设定两个火柴人的位置
    stickMan1.translation.set(-30, 0);
    stickMan2.translation.set(30, 0);

    // 设定整个组的位置
    let stickMen = two.makeGroup(stickMan1, stickMan2);
    stickMen.translation.set(two.width / 2, two.height / 2);
    stickMen.scale = 1.5;

    return stickMen;
}

function createAllPattern(two, color) {
    // 创建文本
    let text = new Two.Text('ALL', 0, 0);
    text.fill = color;
    text.size = 70;  // 设置字体大小
    text.family = 'Arial';  // 设置字体
    text.weight = 'bold';  // 设置字体粗细

    // 设定文本的位置
    let ALL = two.makeGroup(text);
    ALL.translation.set(two.width / 2, two.height / 2);

    return ALL;
}

function createFeiPattern(two, color) {
    // 创建文本
    let text = new Two.Text('肥', 0, 0);
    text.fill = color;
    text.size = 80;  // 设置字体大小
    text.family = 'Arial';  // 设置字体
    text.weight = 'bold';  // 设置字体粗细

    // 设定文本的位置
    let Fei = two.makeGroup(text);
    Fei.translation.set(two.width / 2, two.height / 2);

    return Fei;
}

function createBIGPattern(two, color) {
    // 创建文本
    let text = new Two.Text('BIG', 0, 0);
    text.fill = color;
    text.size = 100;  // 设置字体大小
    text.family = 'Arial';  // 设置字体
    text.weight = 'bold';  // 设置字体粗细

    // 设定文本的位置
    let BIG = two.makeGroup(text);
    BIG.translation.set(two.width / 2, two.height / 2);

    return BIG;
}

function createWhirlwind(two, color) {
    let lines = [];
    for (let i = 0; i < 360; i += 120) {
        let curve = two.makeCurve([
            new Two.Anchor(-40, -40),
            new Two.Anchor(-10, -30),
            new Two.Anchor(0, 0),
            new Two.Anchor(10, 30),
            new Two.Anchor(40, 40)
        ], true);
        curve.noFill();
        curve.stroke = color;  // 设置线条颜色
        curve.linewidth = 10;  // 设置线宽
        curve.rotation = i * Math.PI / 180;  // 旋转线条

        lines.push(curve);
    }

    // 将所有的线条添加到一个组中
    let whirlwind = two.makeGroup(lines);
    whirlwind.translation.set(two.width / 2, two.height / 2);

    return whirlwind;
}

function createCAOPattern(two, color) {
    // 创建文本
    let text = new Two.Text('艹', 0, 0);
    text.fill = color;
    text.size = 100;  // 设置字体大小
    text.family = 'Arial';  // 设置字体
    text.weight = 'bold';  // 设置字体粗细

    // 设定文本的位置
    let CAO = two.makeGroup(text);
    CAO.translation.set(two.width / 2, two.height / 2);

    return CAO;
}

function createSMALLPattern(two, color) {
    // 创建文本
    let text = new Two.Text('SMALL', 0, 0);
    text.fill = color;
    text.size = 35;  // 设置字体大小
    text.family = 'Arial';  // 设置字体
    text.weight = 'bold';  // 设置字体粗细

    // 设定文本的位置
    let SMALL = two.makeGroup(text);
    SMALL.translation.set(two.width / 2, two.height / 2);

    return SMALL;
}

function createRingPattern(two, color) {
    // 创建圆环的顶点
    let points = [];
    for (let i = 0; i < 400; i += 10) {
        let rad = i * Math.PI / 180;
        let x = 70 * Math.cos(rad);
        let y = 70 * Math.sin(rad);
        points.push(new Two.Anchor(x, y));
    }

    // 创建圆环
    let ring = two.makeCurve(points, true);
    ring.noFill();
    ring.stroke = color;  // 设置圆环的颜色
    ring.linewidth = 10;  // 设置线宽

    // 设定圆环的位置
    ring.translation.set(two.width / 2, two.height / 2);

    return ring;
}

function createPonyPattern(two, bodyColor, maneColor, tailColor) {
    // 创建小马的身体
    let body = two.makeEllipse(0, 0, 70, 50);
    body.fill = bodyColor;
    body.noStroke();

    // 创建小马的鬃毛
    let mane1 = two.makeCurve([
        new Two.Anchor(40, -90),
        new Two.Anchor(30, -110)
    ], true);
    mane1.noFill();
    mane1.stroke = maneColor;
    mane1.linewidth = 10;

    let mane2 = two.makeCurve([
        new Two.Anchor(65, -90),
        new Two.Anchor(70, -110)
    ], true);
    mane2.noFill();
    mane2.stroke = maneColor;
    mane2.linewidth = 10;

    // 创建小马的头
    let head = two.makeCircle(50, -60, 40);
    head.fill = bodyColor;
    head.noStroke();

    // 创建小马的眼睛
    let eye1 = two.makeCircle(35, -70, 5);
    eye1.fill = 'white';
    eye1.noStroke();

    let eye2 = two.makeCircle(65, -70, 5);
    eye2.fill = 'white';
    eye2.noStroke();

    // 创建小马的嘴巴
    let mouth = two.makePolygon(50, -55, 7, 3);
    mouth.fill = '#FFFFFF';
    mouth.noStroke();
    mouth.rotation = Math.PI;  // 旋转180度，使其看起来像一个倒三角形

    // 创建小马的尾巴
    let mane3 = two.makeCurve([
        new Two.Anchor(-60, 0),
        new Two.Anchor(-70, -50),
        new Two.Anchor(-120, 20)
    ], true);
    mane3.noFill();
    mane3.stroke = maneColor;
    mane3.linewidth = 10;

    let mane4 = two.makeCurve([
        new Two.Anchor(-50, 5),
        new Two.Anchor(-60, -45),
        new Two.Anchor(-110, 25)
    ], true);
    mane4.noFill();
    mane4.stroke = maneColor;
    mane4.linewidth = 10;

    // 创建小马的四肢
    let limbs = [];
    let limb1 = two.makeRectangle(-40, 60, 10, 60);
    limb1.fill = bodyColor;
    limb1.noStroke();
    limbs.push(limb1);
    let limb2 = two.makeRectangle(-20, 60, 10, 60);
    limb2.fill = bodyColor;
    limb2.noStroke();
    limbs.push(limb2);
    let limb3 = two.makeRectangle(20, 60, 10, 60);
    limb3.fill = bodyColor;
    limb3.noStroke();
    limbs.push(limb3);
    let limb4 = two.makeRectangle(40, 60, 10, 60);
    limb4.fill = bodyColor;
    limb4.noStroke();
    limbs.push(limb4);


    // 将所有的部分添加到一个组中
    let pony = two.makeGroup(mane3, mane4, body, mane1, mane2, head, eye1, eye2, mouth, ...limbs);
    pony.translation.set(two.width / 2, two.height / 2);

    return pony;
}

function createFENGPattern(two, color) {
    // 创建文本
    let text = new Two.Text('疯！', 0, 0);
    text.fill = color;
    text.size = 80;  // 设置字体大小
    text.family = 'Arial';  // 设置字体
    text.weight = 'bold';  // 设置字体粗细

    // 设定文本的位置
    let FENG = two.makeGroup(text);
    FENG.translation.set(two.width / 2, two.height / 2);

    return FENG;
}

function createSOYOPattern(two, color) {
    // 创建文本
    let text = new Two.Text('SOYO', 0, 0);
    text.fill = color;
    text.size = 65;  // 设置字体大小
    text.family = 'Arial';  // 设置字体
    text.weight = 'bold';  // 设置字体粗细

    // 设定文本的位置
    let SOYO = two.makeGroup(text);
    SOYO.translation.set(two.width / 2, two.height / 2);

    return SOYO;
}

function createArrow(two, color) {
    // 创建箭头的主体
    let body = two.makeRectangle(0, 0, 100, 20);
    body.fill = color;
    body.noStroke();

    // 创建箭头的头部
    let head = two.makePolygon(60, 0, 30, 3);
    head.fill = color;
    head.noStroke();
    head.rotation = Math.PI / 2;

    // 将所有的部分添加到一个组中
    let arrow = two.makeGroup(body, head);
    arrow.translation.set(two.width / 2, two.height / 2);

    return arrow;
}

function createPenguin(two, color1, color2) {
    // 创建企鹅的身体
    let body = two.makeEllipse(0, 0, 50, 100);
    body.fill = "black";
    body.noStroke();

    let body1 = two.makeEllipse(0, 10, 60, 80);
    body1.fill = "black";
    body1.noStroke();

    let body2 = two.makeEllipse(0, 25, 53, 67);
    body2.fill = "white";
    body2.noStroke();

    // 创建企鹅的肚子
    let belly = two.makeEllipse(0, 20, 35, 60);
    belly.fill = "white";
    belly.noStroke();

    // 创建企鹅的眼睛
    let eye1 = two.makeCircle(-20, -75, 5);
    eye1.fill = "white";
    eye1.noStroke();

    let eye2 = two.makeCircle(20, -75, 5);
    eye2.fill = "white";
    eye2.noStroke();

    let eye11 = two.makeCircle(-18, -75, 2);
    eye11.fill = color1;
    eye11.noStroke();

    let eye22 = two.makeCircle(18, -75, 2);
    eye22.fill = color1;
    eye22.noStroke();

    // 创建企鹅的嘴巴
    let mouth = two.makePolygon(0, -55, 10, 3);
    mouth.fill = '#FFA500';
    mouth.noStroke();
    mouth.rotation = Math.PI;  // 旋转180度，使其看起来像一个倒三角形

    // 创建企鹅的脚
    let foot1 = two.makePolygon(-25, 90, 15, 3);
    foot1.fill = '#FFA500';
    foot1.noStroke();
    foot1.rotation = -Math.PI / 2;

    let foot2 = two.makePolygon(25, 90, 15, 3);
    foot2.fill = '#FFA500';
    foot2.noStroke();
    foot2.rotation = Math.PI / 2;

    // 将所有的部分添加到一个组中
    let penguin = two.makeGroup(body1, body2, body, belly, eye1, eye2, eye11, eye22, mouth, foot1, foot2);
    penguin.translation.set(two.width / 2, two.height / 2);

    return penguin;
}

// 创建一个 Two.js 实例
let two = new Two({
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

// 设置 SVG 元素的 pointer-events 属性为 none
two.renderer.domElement.style.pointerEvents = 'none';

// 将所有的图案的函数放在一个数组中
let patternCreators = [createFish, createStickMen, createAllPattern, createFeiPattern, createBIGPattern, 
    createWhirlwind, createCAOPattern, createSMALLPattern, createRingPattern, createPonyPattern,
    createFENGPattern, createSOYOPattern, createArrow, createPenguin, 
    /* ... */];

// 获取所有的方块
let squares = document.querySelectorAll('.square');

// 当方块被点击时，创建并显示一个新的图案
squares.forEach((square, index) => {
    square.addEventListener('click', () => {
        // 从数组中随机选择一个颜色
        let color1 = colors[Math.floor(Math.random() * colors.length)];
        let color2 = colors[Math.floor(Math.random() * colors.length)];

        if(color1 === color2) {
            color2 = colors[(colors.indexOf(color1) + 1) % colors.length];
        }

        // 创建一个新的图案
        if(index !== 14) {
            let pattern = patternCreators[index](two, color1, color2);
            pattern.visible = true;
    
            // 设置图案的位置、大小和角度
            pattern.translation.set(
                window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.7,  // 在中心点附近随机设置 x 坐标
                window.innerHeight / 2 + (Math.random() - 0.5) * window.innerHeight * 0.7  // 在中心点附近随机设置 y 坐标
            );
            pattern.scale = 0.05 + Math.random() * 0.05;  // 随机设置大小，范围为 0.05 到 0.1
            pattern.rotation = Math.random() * Math.PI * 2;  // 随机设置角度，范围为 0 到 2π
    
            // 创建一个动画，让图案从无到有放大弹出
            let popIn = new TWEEN.Tween(pattern)
                .to({ scale: pattern.scale * 20 }, 500)  // 放大到原来的20倍
                .easing(TWEEN.Easing.Elastic.Out);
    
            // 创建一个动画，让图案缩小消失
            let popOut = new TWEEN.Tween(pattern)
                .to({ scale: 0 }, 500)
                .easing(TWEEN.Easing.Elastic.In)
                .onComplete(() => {
                    pattern.visible = false;
                    two.remove(pattern);  // 动画完成后移除图案
                });
    
            // 将两个动画链接在一起，先放大弹出，然后缩小消失
            popIn.chain(popOut);
    
            // 开始动画
            popIn.start();
        }
    });
});

// 在每一帧更新 Tween.js
two.bind('update', function() {
    TWEEN.update();
});