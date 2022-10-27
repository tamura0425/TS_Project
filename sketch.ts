// AキーとDキーで移動、QキーとEキーで回転、Sキーで落下。

// A,D keys ... Move the mino(piece)
// Q,E keys ... Rotate the mino
// S key ... Drop fast

class Block {
  x: number = 0;
  y: number = 0;
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    draw() {
      push();
      let s = width/12;
      rect(s*this.x, s*this.y, s, s);
      pop();
    }
  }

  class Mino {
    x: number = 0;
    y: number = 0;
    rot: number = 0;
    shape: number = 0;
    constructor(x, y, rot, shape) {
      this.x = x;
      this.y = y;
      this.rot = rot;
      this.shape = shape;
    }
  
    calcBlocks() {
      let blocks = [];
      // ※switchについて: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/switch
      switch(this.shape) {
        case 0: blocks = [new Block(-1,0), new Block(0,0), new Block(0,-1), new Block(1,0)];break; //T
        case 1: blocks = [new Block(-1,-1), new Block(0,-1), new Block(0,0), new Block(1,0)];break; //Z
        case 2: blocks = [new Block(-1,0), new Block(0,0), new Block(0,-1), new Block(1,-1)];break; //S
        case 3: blocks = [new Block(-1,-2), new Block(-1,-1), new Block(-1,0), new Block(0,0)];break; //L
        case 4: blocks = [new Block(0,-2), new Block(0,-1), new Block(-1,0), new Block(0,0)];break; //J
        case 5: blocks = [new Block(-1,-1), new Block(-1,0), new Block(0,0), new Block(0,-1)];break; //O
        case 6: blocks = [new Block(-2,0),new Block(-1,0),new Block(0,0),new Block(1,0)];break; //I
      }
  
      // this.rotの値だけ、90度右回転する。回数は剰余で0～3に丸めこむ。
      // this.rotがマイナスの場合剰余がバグるので、4の倍数を足して調整
  
      // Rotate the mino 90 degrees to the right this.rot times.
      // if this.rot is negative, it means a left rotation.
      // I use %(modulo) to convert a left rotation to a right rotation.
  
      // Modulo with negative values can go wrong.
      // (it behave differently in each programming languages)
      // so I add a random big value to make it positive.
      // (the value must be a multiples of 4 since it must not affect the modulo)
      let rot = (40000000 + this.rot) % 4;
      for(let r=0; r<rot; r++) {
        // ※mapについて: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map
        blocks = blocks.map(b => new Block(-b.y, b.x));
      }
  
      // ブロックのグローバル座標（Field上の座標）に変換する
      // ※forEachについて: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
      // Convert local coordinates to global coordinates.
      blocks = blocks.map(b => new Block(b.x+this.x, b.y+this.y));
      return blocks;
    }
  
    draw() {
      let blocks = this.calcBlocks();
      for(let b of blocks) {
        b.draw();
      }
    }
  
    copy() {
      return new Mino(this.x, this.y, this.rot, this.shape);
    }
  }
  
  class Field {
    constructor() {
      // ※2次元配列について:
      // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array
      // 「2次元配列を生成する」を見てください。
      this.tiles = [
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1],
      ];
    }
    tileAt(x, y) {
      if (x<0 || x>=12 || y<0 || y>=21) return 1; //画面外 out of bounds.
      return this.tiles[y][x];
    }
    putBlock(x, y) {
      this.tiles[y][x] = 1;
    }
    findLineFilled() {
      for(let y=0; y<20; y++) {
        // ※every関数について: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/every
        let isFilled = this.tiles[y].every(t => t===1);
        if (isFilled) return y;
      }
      return -1;
    }
    cutLine(y) {
      this.tiles.splice(y, 1);
      this.tiles.unshift([1,0,0,0,0,0,0,0,0,0,0,1]);
    }
    draw() {
      for(let y=0; y<21; y++) {
        for(let x=0; x<12; x++) {
          if (this.tileAt(x,y) === 0) continue;
          new Block(x,y).draw();
        }
      }
    }
  }
  
  class Game {
    constructor() {
      this.mino = Game.makeMino();
      this.minoVx = 0;
      this.minoDrop = false;
      this.minoVr = 0;
      this.field = new Field();
      this.fc = 0;
    }
    static makeMino() {
      return new Mino(5, 2, 0, floor(random(0,7)));
    }
    static isMinoMovable(mino, field) {
      let blocks = mino.calcBlocks();
      return blocks.every(b => field.tileAt(b.x, b.y) === 0);
    }
    proc() {
      // 落下 Drop the mino.
      if (this.minoDrop || (this.fc%20) === 19) {
        let futureMino = this.mino.copy();
        futureMino.y += 1;
        if (Game.isMinoMovable(futureMino, this.field)) {
          this.mino.y += 1;
        }else{
          // 接地 Harden the mino.
          for(let b of this.mino.calcBlocks()) {
            this.field.putBlock(b.x, b.y);
            this.mino = Game.makeMino();
          }
        }
        // 消去 Erase lines.
        let line;
        while((line = this.field.findLineFilled()) !== -1) {
          this.field.cutLine(line);
        }
        this.minoDrop = false;
      }
      // 左右移動 Move the mino horizontally.
      if (this.minoVx !== 0) {
        let futureMino = this.mino.copy();
        futureMino.x += this.minoVx;
        if (Game.isMinoMovable(futureMino, this.field)) {
          this.mino.x += this.minoVx;
        }
        this.minoVx = 0;
      }
      // 回転 Rotate the mino.
      if (this.minoVr !== 0) {
        let futureMino = this.mino.copy();
        futureMino.rot += this.minoVr;
        if (Game.isMinoMovable(futureMino, this.field)) {
          this.mino.rot += this.minoVr;
        }
        this.minoVr = 0;
      }
  
      // 描画
      background(64);
      this.mino.draw();
      this.field.draw();
  
      this.fc++;
    }
  }
  let game;
  
  function keyPressed() {
    if (keyCode === 65) game.minoVx = -1;
    if (keyCode === 68) game.minoVx = 1;
    if (keyCode === 81) game.minoVr = -1;
    if (keyCode === 69) game.minoVr = 1;
    if (keyCode === 83) game.minoDrop = true;
  }
  
  function setup() {
    createCanvas(360, 720);
    game = new Game();
  }
  
  function draw() {
    game.proc();
  }
  