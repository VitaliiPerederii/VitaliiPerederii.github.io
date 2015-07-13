//============================ Game entities declarations ==============================

//-----------------------------Clonable-------------------------
function Clonable() {
};

Clonable.prototype.clone = function () {
    if (null == this || "object" != typeof this) return this;
    var copy = new this.constructor();
    for (var attr in this) {
        if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
    }
    return copy;
}

//-----------------------------Point-------------------------
function Point(x, y, z) {
    this.x = x == undefined ? -1 : x;
    this.y = y == undefined ? -1 : y;
    this.z = z == undefined ? -1 : z;
};

Point.prototype = Object.create(Clonable.prototype);
Point.prototype.constructor = Point;

//-----------------------------Size-------------------------
function Size(cx, cy) {
    this.cx = cx == undefined ? 0 : cx;
    this.cy = cy == undefined ? 0 : cy;
};

Size.prototype = Object.create(Clonable.prototype);
Size.prototype.constructor = Size;

//-----------------------------Entity-------------------------
function Entity() {
    this._pos = new Point();
    this._size = new Size();
};
Entity.prototype.constructor = Entity;

Entity.prototype.setPos = function (pos) {
    this._pos = pos;
}

Entity.prototype.getPos = function () {
    return this._pos.clone();
}

Entity.prototype.setSize = function (size) {
    this._size = size;
}

Entity.prototype.getSize = function () {
    return this._size.clone();
}

//-----------------------------Duck-------------------------
function Duck() {
    Entity.prototype.constructor.call(this);
    
    this._step = 0;
    this._time = 0;

    if (!Duck.sprite) {
        Duck.sprite = new Image(1200, 342);
        Duck.sprite.src = 'duck.png';
    }

    this._size.cx = Duck.sprite.width / Duck.prototype.STEP_COUNT;
    this._size.cy = Duck.sprite.height / (Duck.prototype.DIR_LAST + 1);

    this._direction = Duck.prototype.DIR_FORWARD;

    this._dead = false;
}

Duck.prototype = Object.create(Entity.prototype);
Duck.prototype.constructor = Duck;

Duck.prototype.STEP_COUNT = 8;
Duck.prototype.STEP_SIZE = 15;

Duck.prototype.DIR_BACK = 0;
Duck.prototype.DIR_FORWARD = 1;
Duck.prototype.DIR_LAST = 1;

Duck.sprite = null;

Duck.prototype.makeStep = function () {

    if ((Date.now() - this._time) > 40)
    {
        var stepLenght = (Duck.prototype.STEP_SIZE / Math.max(1, this._pos.z)) * (this._direction == Duck.prototype.DIR_FORWARD ? 1 : -1);
        if (this._dead) {
            this._pos.y += Math.abs(stepLenght) * 2;
        } else {
            this._step = ++this._step % Duck.prototype.STEP_COUNT;
            this._pos.x += stepLenght;
        }
        
        this._time = Date.now();
    }
}


Duck.prototype.kill = function () {
    this._dead = true;
    this._step = 7;
}

Duck.prototype.isDead = function () {
    return this._dead;
}

Duck.prototype.setDirection = function (direction) {
    this._direction = direction;
}

Duck.prototype.getSize = function () {
    var size = {};
    if (this._pos.z <= 0) {
        size = this._size.clone();
        return size;
    }

    size = new Size();
    size.cx = this._size.cx / this._pos.z;
    size.cy = this._size.cy / this._pos.z;

    return size;
}

Duck.prototype.render = function (context) {
    var duckWidth = Duck.sprite.width / Duck.prototype.STEP_COUNT;
    var duckHeight = Duck.sprite.height / 2;

    var size = this.getSize();
    context.save();

    if (this._dead) {
        context.translate(this._pos.x + duckWidth * 0.5, this._pos.y + duckHeight * 0.5);

        var angle = (this._direction == Duck.prototype.DIR_BACK) ? -90 : 90;
        context.rotate((Math.PI / 180) * angle);
        context.translate(-(this._pos.x + duckWidth * 0.5), -(this._pos.y + duckHeight * 0.5));
    }
    context.drawImage(Duck.sprite, this._step * duckWidth, this._direction * duckHeight, duckWidth, duckHeight, this._pos.x, this._pos.y, size.cx, size.cy);
    context.restore();
}


//-----------------------------ScoreIndicator-------------------------

function ScoreIndicator(indicateValue, context) {
    Entity.prototype.constructor.call(this);

    this._indicateValue = '+' + indicateValue;

    context.font = this._getFont();
    var tm = context.measureText(this._indicateValue);
    this._size.cx = tm.width;
    this._size.cy = this._getFontSize();

    this._stepCounter = 0;
}

ScoreIndicator.prototype = Object.create(Entity.prototype);
ScoreIndicator.prototype.constructor = ScoreIndicator;

ScoreIndicator.prototype.render = function (context) {

    context.font = this._getFont();
    context.fillStyle = "rgb(255, 255, 255)";
    context.fillText(this._indicateValue, this._pos.x, this._pos.y);
    context.strokeText(this._indicateValue, this._pos.x, this._pos.y);
}

ScoreIndicator.prototype._getFont = function () {
    var fontSize = this._getFontSize();

    return fontSize + 'px serif';
}

ScoreIndicator.prototype._getFontSize = function () {
    return 36;
}

ScoreIndicator.prototype.makeStep = function () {
    this._pos.y -= Math.pow(1.2, this._stepCounter);

    this._stepCounter++;
}

//============================ end Game entities declarations ==============================

function getRandomArbitary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}