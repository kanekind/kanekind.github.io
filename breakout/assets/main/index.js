System.register("chunks:///_virtual/Breakout.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _inheritsLoose, _createForOfIteratorHelperLoose, cclegacy, _decorator, view, UITransform, Graphics, Color, Label, input, Input, KeyCode, Node, Layers, Component;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      view = module.view;
      UITransform = module.UITransform;
      Graphics = module.Graphics;
      Color = module.Color;
      Label = module.Label;
      input = module.input;
      Input = module.Input;
      KeyCode = module.KeyCode;
      Node = module.Node;
      Layers = module.Layers;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "a4c93DUCmFEXrgLZGaqNKcO", "Breakout", undefined);
      var ccclass = _decorator.ccclass;
      var Breakout = exports('Breakout', (_dec = ccclass('Breakout'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(Breakout, _Component);
        function Breakout() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          /* ---------- 可调参数 ---------- */
          _this.BALL_R = 14;
          // 球半径
          _this.PADDLE_H = 22;
          // 挡板高
          _this.PADDLE_W0 = 130;
          // 挡板初始宽
          _this.PADDLE_MARGIN = 90;
          // 挡板距底部
          _this.SPEED0 = 540;
          // 初速度 px/s
          _this.SPEED_UP = 5;
          // 每块砖加速
          _this.SPEED_MAX = 950;
          // 速度上限
          _this.MAX_BOUNCE = 62;
          // 挡板反弹最大角度（度）
          _this.ROWS = 6;
          // 砖块行数
          _this.COLS = 7;
          // 砖块列数
          _this.BRICK_TOP = 150;
          // 砖区块距顶部
          _this.BRICK_MARGIN = 24;
          // 砖区块左右留白
          _this.BRICK_GAP = 8;
          // 砖块间隙
          _this.LIVES0 = 3;
          // 初始生命
          /* 每行砖块颜色（暖→冷）与分值 */
          _this.ROW_COLORS = ['#ff5f6d', '#ff9f43', '#ffd93d', '#6bcb77', '#4d96ff', '#9b5de5'];
          /* ---------- 运行时状态 ---------- */
          _this.vw = 0;
          _this.vh = 0;
          // 可视区域宽高
          _this.paddle = void 0;
          _this.paddleG = void 0;
          _this.paddleW = _this.PADDLE_W0;
          _this.px = 0;
          _this.py = 0;
          // 挡板中心
          _this.ball = void 0;
          _this.ballG = void 0;
          _this.bx = 0;
          _this.by = 0;
          // 球心
          _this.bvx = 0;
          _this.bvy = 0;
          // 球速度
          _this.speed = _this.SPEED0;
          _this.bricks = [];
          _this.state = 'ready';
          _this.score = 0;
          _this.lives = _this.LIVES0;
          _this.scoreLabel = void 0;
          _this.livesLabel = void 0;
          _this.centerLabel = void 0;
          _this.keys = {};
          return _this;
        }
        var _proto = Breakout.prototype;
        /* ================= 生命周期 ================= */
        _proto.onLoad = function onLoad() {
          var vs = view.getVisibleSize();
          this.vw = vs.width;
          this.vh = vs.height;
          this.node.addComponent(UITransform).setContentSize(this.vw, this.vh);
          this.paddle = this.makeNode('Paddle');
          this.paddleG = this.paddle.getComponent(Graphics);
          this.ball = this.makeNode('Ball');
          this.ballG = this.ball.getComponent(Graphics);
          this.scoreLabel = this.makeLabel('Score', -this.vw / 2 + 24, this.vh / 2 - 40, 34, new Color(255, 255, 255, 255));
          this.scoreLabel.horizontalAlign = Label.HorizontalAlign.LEFT;
          this.livesLabel = this.makeLabel('Lives', this.vw / 2 - 24, this.vh / 2 - 40, 34, new Color(255, 255, 255, 255));
          this.livesLabel.horizontalAlign = Label.HorizontalAlign.RIGHT;
          this.centerLabel = this.makeLabel('Center', 0, -this.vh / 2 + 260, 44, new Color(255, 255, 255, 255));

          // 输入：触摸 / 鼠标 / 键盘
          input.on(Input.EventType.TOUCH_START, this.onTap, this);
          input.on(Input.EventType.TOUCH_MOVE, this.onPointer, this);
          input.on(Input.EventType.MOUSE_MOVE, this.onMouse, this);
          input.on(Input.EventType.MOUSE_DOWN, this.onTapMouse, this);
          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
          this.resetGame();
        };
        _proto.onDestroy = function onDestroy() {
          input.off(Input.EventType.TOUCH_START, this.onTap, this);
          input.off(Input.EventType.TOUCH_MOVE, this.onPointer, this);
          input.off(Input.EventType.MOUSE_MOVE, this.onMouse, this);
          input.off(Input.EventType.MOUSE_DOWN, this.onTapMouse, this);
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        };
        _proto.update = function update(dt) {
          // 键盘持续移动
          var KS = 640;
          var kx = 0;
          if (this.keys[KeyCode.ARROW_LEFT] || this.keys[KeyCode.KEY_A]) kx -= 1;
          if (this.keys[KeyCode.ARROW_RIGHT] || this.keys[KeyCode.KEY_D]) kx += 1;
          if (kx !== 0) {
            this.px += kx * KS * dt;
            this.clampPaddle();
          }
          if (this.state === 'ready') {
            // 球贴在挡板上
            this.bx = this.px;
            this.by = this.py + this.PADDLE_H / 2 + this.BALL_R + 2;
          } else if (this.state === 'play') {
            this.stepBall(dt);
          }
          this.drawPaddle();
          this.drawBall();
          this.drawBricks();
        }

        /** 每帧重绘所有存活砖块（数量少，开销可忽略；规避首帧 Graphics 不生效问题） */;
        _proto.drawBricks = function drawBricks() {
          for (var _iterator = _createForOfIteratorHelperLoose(this.bricks), _step; !(_step = _iterator()).done;) {
            var b = _step.value;
            if (!b.alive) continue;
            var g = b.node.getComponent(Graphics);
            g.clear();
            g.fillColor = b.color;
            g.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 6);
            g.fill();
          }
        }

        /* ================= 游戏流程 ================= */;
        _proto.resetGame = function resetGame() {
          // 清掉旧砖块
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.bricks), _step2; !(_step2 = _iterator2()).done;) {
            var b = _step2.value;
            if (b.node.isValid) b.node.destroy();
          }
          this.bricks = [];
          this.score = 0;
          this.lives = this.LIVES0;
          this.paddleW = this.PADDLE_W0;
          this.speed = this.SPEED0;
          this.px = 0;
          this.py = -this.vh / 2 + this.PADDLE_MARGIN;
          this.buildBricks();
          this.state = 'ready';
          this.refreshHud();
          this.centerLabel.string = '点击屏幕发球\n拖动左右移动挡板';
        };
        _proto.buildBricks = function buildBricks() {
          var usable = this.vw - this.BRICK_MARGIN * 2;
          var bw = (usable - this.BRICK_GAP * (this.COLS - 1)) / this.COLS;
          var bh = 34;
          var topY = this.vh / 2 - this.BRICK_TOP;
          for (var r = 0; r < this.ROWS; r++) {
            for (var c = 0; c < this.COLS; c++) {
              var x = -this.vw / 2 + this.BRICK_MARGIN + bw / 2 + c * (bw + this.BRICK_GAP);
              var y = topY - bh / 2 - r * (bh + this.BRICK_GAP);
              var node = this.makeNode("Brick" + r + "_" + c);
              node.setPosition(x, y);
              var g = node.addComponent(Graphics);
              var color = new Color();
              color.fromHEX(this.ROW_COLORS[r % this.ROW_COLORS.length]);
              g.fillColor = color;
              this.bricks.push({
                node: node,
                alive: true,
                x: x,
                y: y,
                w: bw,
                h: bh,
                score: (this.ROWS - r) * 10,
                color: color
              });
            }
          }
        };
        _proto.launch = function launch() {
          this.state = 'play';
          var a = (Math.random() * 40 - 20) * Math.PI / 180; // -20°~20°
          this.bvx = Math.sin(a) * this.speed;
          this.bvy = Math.cos(a) * this.speed;
          this.centerLabel.string = '';
        };
        _proto.loseLife = function loseLife() {
          this.lives -= 1;
          this.refreshHud();
          if (this.lives <= 0) {
            this.state = 'over';
            this.centerLabel.string = "\u6E38\u620F\u7ED3\u675F\n\u5F97\u5206 " + this.score + "\n\u70B9\u51FB\u91CD\u65B0\u5F00\u59CB";
          } else {
            this.state = 'ready';
            this.speed = Math.max(this.SPEED0, this.speed - 60);
            this.centerLabel.string = "\u8FD8\u5269 " + this.lives + " \u6761\u547D\n\u70B9\u51FB\u5C4F\u5E55\u53D1\u7403";
          }
        };
        _proto.winGame = function winGame() {
          this.state = 'win';
          this.centerLabel.string = "\u901A\u5173\uFF01\u5F97\u5206 " + this.score + "\n\u70B9\u51FB\u518D\u6765\u4E00\u5C40";
        };
        _proto.refreshHud = function refreshHud() {
          this.scoreLabel.string = "\u5206\u6570 " + this.score;
          this.livesLabel.string = "\u751F\u547D " + this.lives;
        }

        /* ================= 球运动与碰撞 ================= */;
        _proto.stepBall = function stepBall(dt) {
          var len = this.speed * dt;
          var steps = Math.max(1, Math.ceil(len / 6)); // 子步进防穿透
          var sdt = dt / steps;
          for (var i = 0; i < steps; i++) {
            this.bx += this.bvx * sdt;
            this.by += this.bvy * sdt;

            // 墙壁（左右上）
            var hw = this.vw / 2,
              hh = this.vh / 2;
            if (this.bx - this.BALL_R < -hw) {
              this.bx = -hw + this.BALL_R;
              this.bvx = Math.abs(this.bvx);
            }
            if (this.bx + this.BALL_R > hw) {
              this.bx = hw - this.BALL_R;
              this.bvx = -Math.abs(this.bvx);
            }
            if (this.by + this.BALL_R > hh) {
              this.by = hh - this.BALL_R;
              this.bvy = -Math.abs(this.bvy);
            }

            // 掉底
            if (this.by + this.BALL_R < -hh) {
              this.loseLife();
              return;
            }

            // 挡板（仅下落时）
            if (this.bvy < 0) {
              var pw = this.paddleW,
                ph = this.PADDLE_H;
              if (this.bx > this.px - pw / 2 - this.BALL_R && this.bx < this.px + pw / 2 + this.BALL_R && this.by - this.BALL_R < this.py + ph / 2 && this.by > this.py - ph / 2) {
                this.by = this.py + ph / 2 + this.BALL_R;
                var rel = Math.max(-1, Math.min(1, (this.bx - this.px) / (pw / 2)));
                var ang = rel * this.MAX_BOUNCE * Math.PI / 180;
                this.bvx = Math.sin(ang) * this.speed;
                this.bvy = Math.cos(ang) * this.speed;
              }
            }

            // 砖块（圆-矩形）
            for (var _iterator3 = _createForOfIteratorHelperLoose(this.bricks), _step3; !(_step3 = _iterator3()).done;) {
              var b = _step3.value;
              if (!b.alive) continue;
              var cx = Math.max(b.x - b.w / 2, Math.min(this.bx, b.x + b.w / 2));
              var cy = Math.max(b.y - b.h / 2, Math.min(this.by, b.y + b.h / 2));
              var dx = this.bx - cx,
                dy = this.by - cy;
              if (dx * dx + dy * dy <= this.BALL_R * this.BALL_R) {
                b.alive = false;
                b.node.destroy();
                this.score += b.score;
                this.speed = Math.min(this.SPEED_MAX, this.speed + this.SPEED_UP);
                // 反射轴：比较穿透深度
                var ox = this.BALL_R - Math.abs(dx);
                var oy = this.BALL_R - Math.abs(dy);
                if (ox < oy) {
                  this.bvx = dx > 0 ? Math.abs(this.bvx) : -Math.abs(this.bvx);
                } else {
                  this.bvy = dy > 0 ? Math.abs(this.bvy) : -Math.abs(this.bvy);
                }
                this.refreshHud();
                if (this.bricks.every(function (x) {
                  return !x.alive;
                })) {
                  this.winGame();
                  return;
                }
                break; // 一子步只吃一块砖
              }
            }
          }
        }

        /* ================= 输入 ================= */;
        _proto.onTap = function onTap(e) {
          var p = e.getUILocation();
          this.handleTapAndDrag(p.x);
        };
        _proto.onTapMouse = function onTapMouse(e) {
          var p = e.getUILocation();
          this.handleTapAndDrag(p.x);
        };
        _proto.onPointer = function onPointer(e) {
          var p = e.getUILocation();
          this.px = p.x - this.vw / 2;
          this.clampPaddle();
        };
        _proto.onMouse = function onMouse(e) {
          var p = e.getUILocation();
          this.px = p.x - this.vw / 2;
          this.clampPaddle();
        };
        _proto.handleTapAndDrag = function handleTapAndDrag(uiX) {
          if (this.state === 'ready') {
            this.px = uiX - this.vw / 2;
            this.clampPaddle();
            this.launch();
          } else if (this.state === 'over' || this.state === 'win') {
            this.resetGame();
          }
        };
        _proto.onKeyDown = function onKeyDown(e) {
          this.keys[e.keyCode] = true;
          if (this.state === 'ready' && e.keyCode === KeyCode.SPACE) this.launch();
        };
        _proto.onKeyUp = function onKeyUp(e) {
          this.keys[e.keyCode] = false;
        };
        _proto.clampPaddle = function clampPaddle() {
          var lim = this.vw / 2 - this.paddleW / 2 - 6;
          this.px = Math.max(-lim, Math.min(lim, this.px));
        }

        /* ================= 绘制与工具 ================= */;
        _proto.drawPaddle = function drawPaddle() {
          var g = this.paddleG;
          g.clear();
          this.paddle.setPosition(this.px, this.py);
          var w = this.paddleW,
            h = this.PADDLE_H;
          g.fillColor = new Color().fromHEX('#e8f4ff');
          g.roundRect(-w / 2, -h / 2, w, h, h / 2);
          g.fill();
          g.fillColor = new Color().fromHEX('#4d96ff');
          g.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h / 6, 3);
          g.fill();
        };
        _proto.drawBall = function drawBall() {
          var g = this.ballG;
          g.clear();
          this.ball.setPosition(this.bx, this.by);
          g.fillColor = new Color().fromHEX('#fff8e7');
          g.circle(0, 0, this.BALL_R);
          g.fill();
          g.fillColor = new Color().fromHEX('#ff9f43');
          g.circle(0, 0, this.BALL_R * 0.55);
          g.fill();
        };
        _proto.makeNode = function makeNode(name) {
          var n = new Node(name);
          n.layer = Layers.Enum.UI_2D;
          n.addComponent(UITransform);
          n.addComponent(Graphics);
          this.node.addChild(n);
          return n;
        };
        _proto.makeLabel = function makeLabel(name, x, y, size, color) {
          var n = new Node(name);
          n.layer = Layers.Enum.UI_2D;
          n.addComponent(UITransform);
          var lb = n.addComponent(Label);
          lb.fontSize = size;
          lb.color = color;
          lb.string = '';
          n.setPosition(x, y);
          this.node.addChild(n);
          return lb;
        };
        return Breakout;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./Breakout.ts', './PlayerController.ts'], function () {
  return {
    setters: [null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/PlayerController.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _applyDecoratedDescriptor, _inheritsLoose, _initializerDefineProperty, _assertThisInitialized, cclegacy, _decorator, Label, input, Input, Collider2D, Contact2DType, KeyCode, Component;
  return {
    setters: [function (module) {
      _applyDecoratedDescriptor = module.applyDecoratedDescriptor;
      _inheritsLoose = module.inheritsLoose;
      _initializerDefineProperty = module.initializerDefineProperty;
      _assertThisInitialized = module.assertThisInitialized;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      Label = module.Label;
      input = module.input;
      Input = module.Input;
      Collider2D = module.Collider2D;
      Contact2DType = module.Contact2DType;
      KeyCode = module.KeyCode;
      Component = module.Component;
    }],
    execute: function () {
      var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3;
      cclegacy._RF.push({}, "6f1a5d1FzREeJT67KiCOuKI", "PlayerController", undefined);
      var ccclass = _decorator.ccclass,
        property = _decorator.property;
      var PlayerMover = exports('PlayerMover', (_dec = ccclass('PlayerMover'), _dec2 = property({
        type: Label,
        tooltip: '顶部分数 Label，拖拽绑定'
      }), _dec3 = property({
        tooltip: '每次碰撞加分'
      }), _dec4 = property({
        tooltip: '移动速度（像素/秒）'
      }), _dec(_class = (_class2 = /*#__PURE__*/function (_Component) {
        _inheritsLoose(PlayerMover, _Component);
        function PlayerMover() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _initializerDefineProperty(_this, "scoreLabel", _descriptor, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "scorePerHit", _descriptor2, _assertThisInitialized(_this));
          _initializerDefineProperty(_this, "moveSpeed", _descriptor3, _assertThisInitialized(_this));
          _this.score = 0;
          _this.keys = {};
          return _this;
        }
        var _proto = PlayerMover.prototype;
        _proto.onLoad = function onLoad() {
          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
          var collider = this.getComponent(Collider2D);
          if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          } else {
            console.warn('[PlayerMover] 找不到 Collider2D！请给玩家节点添加 BoxCollider2D 组件');
          }
        };
        _proto.onDestroy = function onDestroy() {
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
          input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
          var collider = this.getComponent(Collider2D);
          if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
          }
        };
        _proto.onKeyDown = function onKeyDown(event) {
          this.keys[event.keyCode] = true;
        };
        _proto.onKeyUp = function onKeyUp(event) {
          this.keys[event.keyCode] = false;
        };
        _proto.update = function update(dt) {
          var dirX = 0;
          var dirY = 0;
          if (this.isPressed(KeyCode.KEY_W) || this.isPressed(KeyCode.ARROW_UP)) dirY += 1;
          if (this.isPressed(KeyCode.KEY_S) || this.isPressed(KeyCode.ARROW_DOWN)) dirY -= 1;
          if (this.isPressed(KeyCode.KEY_A) || this.isPressed(KeyCode.ARROW_LEFT)) dirX -= 1;
          if (this.isPressed(KeyCode.KEY_D) || this.isPressed(KeyCode.ARROW_RIGHT)) dirX += 1;
          if (dirX !== 0 && dirY !== 0) {
            var inv = 1 / Math.SQRT2;
            dirX *= inv;
            dirY *= inv;
          }
          var pos = this.node.position;
          this.node.setPosition(pos.x + dirX * this.moveSpeed * dt, pos.y + dirY * this.moveSpeed * dt, pos.z);
        };
        _proto.isPressed = function isPressed(code) {
          return !!this.keys[code];
        };
        _proto.onBeginContact = function onBeginContact(selfCollider, otherCollider, contact) {
          if (otherCollider.tag !== 1) return;
          this.score += this.scorePerHit;
          if (this.scoreLabel) {
            this.scoreLabel.string = "Score: " + this.score;
            console.log("[PlayerMover] \u649E\u5230\u969C\u788D\u7269\uFF01\u5F53\u524D\u5206\u6570\uFF1A" + this.score);
          } else {
            console.warn('[PlayerMover] scoreLabel 未绑定！');
          }
        };
        return PlayerMover;
      }(Component), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scorePerHit", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "moveSpeed", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 200;
        }
      })), _class2)) || _class));
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});