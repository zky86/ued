function e(p,ele) {return p.getElementsByTagName(ele)};
function el(id) {return document.getElementById(id)};
function t(o,e,f) {o.addEventListener?o.addEventListener(e,f,false):o.attachEvent('on'+e,f)};
var ss = {};
ss.slider = function() {
    var arg, move = function() {};
    move.prototype.init = function(opt) {
        arg = this.set(opt);
        var wrap = el(opt.gallery), 
            ctl = el(opt.control), 
            obj = this.obj = e(wrap,'ul')[0], 
            $this = this;
        this.u = e(obj,'li');
        this.cu = e(ctl,'li');
        this.uW = this.u[0].offsetWidth;
        this.uH = this.u[0].offsetHeight; 
        this.len = this.u.length;
        this.old = this.cur = arg.index;
        wrap.style.cssText = 'width:' + this.uW + 'px;' + 'height:' + this.uH + 'px;' + 'overflow: hidden;'; 
        obj.style.cssText = 'height:' + this.uH + 'px;' + 'width:' + (arg.dir ? this.uW + 'px;' : this.len * this.uW + 'px;') + (arg.dir ? 'top:' + -1 * this.cur * this.uH + 'px;' : 'left:' + -1 * this.cur * this.uW + 'px;'); 
        this.cu[this.cur].className = 'current';
        this.event(arg.type);
        setTimeout(function() {$this.auto()},arg.interval);
    };
    move.prototype.set = function(opt) {
        org = {
            gallery: 'gal-wrap',
            control: "gal-panel",
            dir: false,
            index: 0,
            speed: 16,
            interval: 3000,
            type: 'click'
        };
        for(var p in opt) {
            org[p] = opt[p]
        }
        return org;
    };
    move.prototype.timeMgr = function() {
        var $this = this;
        this.m = setTimeout(function() {$this.auto(); $this.indexMgr()},arg.interval);
    };
    move.prototype.auto = function() {
        var $this = this;
        if(this.a != undefined) clearInterval(this.a);
        this.a = setInterval(function() {$this.pos()},arg.speed);
    };
    move.prototype.pos = function() {
        var dir = arg.dir ? parseInt(this.obj.style.top) : parseInt(this.obj.style.left), 
            area = arg.dir ? this.uH : this.uW,
            dis = (area * this.cur + dir) * .1, 
            step = dis >= 0 ? Math.ceil(dis) : Math.floor(dis);
        arg.dir ? this.obj.style.top = dir - step + 'px' : this.obj.style.left = dir - step + 'px';
        this.stop(dir,area);
    };
    move.prototype.stop = function(dir,area) {
        if(Math.abs(dir) == area * this.cur) {
            clearInterval(this.a);
            this.cur == this.len - 1 ? this.cur = 0 : this.cur++;
            this.timeMgr();
        }
    };
    move.prototype.indexMgr = function() {
        this.cu[this.cur].className = 'current';
        if(this.old != this.cur) {
            this.cu[this.old].className = '';
            this.old = this.cur;
        }
    };
    move.prototype.event = function(e) {
        for(var i = 0; i < this.cu.length; i++) {
            var $this = this;
            t(this.cu[i],e,num(i,$this));
        }
        function num(n,$this) {
            return function() {
                clearInterval($this.a);
                clearTimeout($this.m);
                $this.cu[n].className = 'current';
                if($this.old != n) { // 只有 $this.old 是记录的之前的元素, $this.cur 是会变的, 当 stop 后, $this.cur 已经 +1 了, 而此时其实并没有开始 pos.
                    $this.cu[$this.old].className = '';
                    $this.old = $this.cur = n;
                }
                $this.c = 0;
                $this.auto();
            }
        }
    };
    return move;
}();
