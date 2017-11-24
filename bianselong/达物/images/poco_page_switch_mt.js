/***********************
 * POCO 页面切换类
 * author : Panda 
************************/

if(! Fx.Scroll)
{
	Fx.Scroll = new Class({
	
		Extends: Fx,
	
		options: {
			offset: {x: 0, y: 0},
			wheelStops: true
		},
	
		initialize: function(element, options){
			this.element = this.subject = document.id(element);
			this.parent(options);
			var cancel = this.cancel.bind(this, false);
	
			if ($type(this.element) != 'element') this.element = document.id(this.element.getDocument().body);
	
			var stopper = this.element;
	
			if (this.options.wheelStops){
				this.addEvent('start', function(){
					stopper.addEvent('mousewheel', cancel);
				}, true);
				this.addEvent('complete', function(){
					stopper.removeEvent('mousewheel', cancel);
				}, true);
			}
		},
	
		set: function(){
			var now = Array.flatten(arguments);
			if (Browser.Engine.gecko) now = [Math.round(now[0]), Math.round(now[1])];
			this.element.scrollTo(now[0], now[1]);
		},
	
		compute: function(from, to, delta){
			return [0, 1].map(function(i){
				return Fx.compute(from[i], to[i], delta);
			});
		},
	
		start: function(x, y){
			if (!this.check(x, y)) return this;
			var scrollSize = this.element.getScrollSize(),
				scroll = this.element.getScroll(), 
				values = {x: x, y: y};
			for (var z in values){
				var max = scrollSize[z];
				if ($chk(values[z])) values[z] = ($type(values[z]) == 'number') ? values[z] : max;
				else values[z] = scroll[z];
				values[z] += this.options.offset[z];
			}
			return this.parent([scroll.x, scroll.y], [values.x, values.y]);
		},
	
		toTop: function(){
			return this.start(false, 0);
		},
	
		toLeft: function(){
			return this.start(0, false);
		},
	
		toRight: function(){
			return this.start('right', false);
		},
	
		toBottom: function(){
			return this.start(false, 'bottom');
		},
	
		toElement: function(el){
			var position = document.id(el).getPosition(this.element);
			return this.start(position.x, position.y);
		},
	
		scrollIntoView: function(el, axes, offset){
			axes = axes ? $splat(axes) : ['x','y'];
			var to = {};
			el = document.id(el);
			var pos = el.getPosition(this.element);
			var size = el.getSize();
			var scroll = this.element.getScroll();
			var containerSize = this.element.getSize();
			var edge = {
				x: pos.x + size.x,
				y: pos.y + size.y
			};
			['x','y'].each(function(axis) {
				if (axes.contains(axis)) {
					if (edge[axis] > scroll[axis] + containerSize[axis]) to[axis] = edge[axis] - containerSize[axis];
					if (pos[axis] < scroll[axis]) to[axis] = pos[axis];
				}
				if (to[axis] == null) to[axis] = scroll[axis];
				if (offset && offset[axis]) to[axis] = to[axis] + offset[axis];
			}, this);
			if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
			return this;
		},
	
		scrollToCenter: function(el, axes, offset){
			axes = axes ? $splat(axes) : ['x', 'y'];
			el = $(el);
			var to = {},
				pos = el.getPosition(this.element),
				size = el.getSize(),
				scroll = this.element.getScroll(),
				containerSize = this.element.getSize(),
				edge = {
					x: pos.x + size.x,
					y: pos.y + size.y
				};
	
			['x','y'].each(function(axis){
				if(axes.contains(axis)){
					to[axis] = pos[axis] - (containerSize[axis] - size[axis])/2;
				}
				if(to[axis] == null) to[axis] = scroll[axis];
				if(offset && offset[axis]) to[axis] = to[axis] + offset[axis];
			}, this);
			if (to.x != scroll.x || to.y != scroll.y) this.start(to.x, to.y);
			return this;
		}
	
	});
}


var poco_page_switch = new Class({
	
	// 继承MYPOCO基类
	Implements: [Events, Options],
	
	options: {
		dataUrl : null,										// 获得页面数据的地址
		pars : null,										// 获取数据时候的参数
		containerID : 'switch_page_container',				// 容器ID
		cacheSpace : 'switch_page_space',					// page的载体
		pageType : 'div',									// 页面的tagName，一般是div,li
		pageIDPre : 'switch_page_',							// 每页ID命名前缀 pageID + index 形成完整的ID
		pageClass : null,									// 页面的CLASS
		pageCount : null,									// 页面总数
		pageShift : 1,										// 每次翻页返几多个PAGE
		index : 1,											// 开始显示的是第几个页面
		showCount : 1,										// 默认显示多少个page
		loadingContent : '<div style="text-align:center;"><img src="http://img1.poco.cn/js/common/loading.gif"></div>',
		wait : false,										// 是否延时
		duration : 300,										// 切换时间
		autoFillContent : true,								// 读取页面内容成功后自动填充内容
		preload : false	,									// 是否预加载一些
		preloadCount : 1,									// 预加载多少个
		shiftNum : 0,										// 位移，这里是container的大小可以同时显示几个的page，当前的page排在那个位置
		onInitComplete : null,
		keyboard : false,									// 是否能用上下左右键控制
		autoReset : false,									// 播放完自动跳到第一屏
		moveDirection : 'left',
		debug:false
	},
	
	initialize: function(options)
	{
		//this.options = $merge(this.options, options);
		this.setOptions(options);
		this.container = $(this.options.containerID);
		this.container.setStyle('position', 'relative'); 	// 要设为相对
		this.cacheSpace = $(this.options.cacheSpace);
		
		if(this.options.moveDirection == 'left')
		{
			$(this.options.cacheSpace).style.width = '100000000px';
		}
		else
		{
			$(this.options.cacheSpace).style.width = $(this.options.containerID).style.width;
		}
		
		// 建立滑动
		this.scroll = new Fx.Scroll(this.options.containerID, {
			wait: this.options.wait,
			duration: this.options.duration,
			offset: {'x': 0, 'y': 0},
			transition: Fx.Transitions.Quad.easeInOut
		});
		
		// 初始化开始的页面
		this.nowIndex = this.options.index;
		this.switchPage(this.options.index);
		
		if(this.options.keyboard)
		{
			document.onkeydown = this.onkey_action.bind(this);
		}
		this.fireEvent('onInitComplete', [this.options.index]);	// 烧一个在初始化成功的事件
	},
	
	// 翻页
	switchPage: function(index)
	{
		this.scroll.options.duration = this.options.duration;
		if(this.options.pageCount<index) 
		{
			if(this.options.autoReset)
			{
				this.scroll.options.duration = 0;
				index = 1;
			}
			else
			{
				return false;
			}
		}
		
		
		if(1>index) 
		{
			/*if(this.options.autoReset)
			{
				this.scroll.options.duration = 0;
				index = this.options.pageCount;
			}
			else
			{
				return false;
			}*/
			return false;
		}
		
		var first_index = index - this.options.shiftNum;
		if(first_index < 1) first_index = 1;
		
		var start_index = first_index;
		var end_index = first_index + this.options.showCount;
		
		if(this.options.preload==true && this.options.preloadCount>0)
		{
			//start_index = first_index - this.options.preloadCount;
			var start_index = first_index;
			end_index = first_index + this.options.showCount + this.options.preloadCount;
		}
		if(end_index > this.options.pageCount) end_index=this.options.pageCount;
		
		if(start_index>(this.options.pageCount-this.options.showCount))
		{
			start_index = this.options.pageCount-this.options.showCount;
		}
		
		this.nowIndex = index;
		for(l=start_index; l<=end_index; l++)
		{
			if(l>0) this.getPageContent(l);
		}
		
		if(first_index>(this.options.pageCount - this.options.showCount + 1)) first_index = this.options.pageCount - this.options.showCount + 1;
		
		if(first_index>0) this.toElement(first_index);
		this.fireEvent('onSelectedPage', [this.nowIndex, $(this.options.pageIDPre + index)]);
	},
	
	// 上一页
	prePage: function(index)
	{
		index = $pick(index, this.nowIndex);
		var preIndex = index - this.options.pageShift;
		this.switchPage(preIndex);
	},
	
	// 下一页
	nextPage: function(index)
	{
		index = $pick(index, this.nowIndex);
		var nextIndex = index + this.options.pageShift;
		this.switchPage(nextIndex);
	},
	
	// 创建页面
	createPage: function(index)
	{
		index = $pick(index, this.options.index);
		
		this.indexPageID = this.options.pageIDPre + index;		// 获得页的ID
		
		// 如果有就不再处理了
		if(! $(this.indexPageID))
		{
			var new_page = new Element(this.options.pageType, { 
				'class' : this.options.pageClass,
				'id' : this.indexPageID
			}); 
			
			
			if(this.options.moveDirection=='left')
			{
				new_page.setStyle('float', 'left'); 
			}
			
			var is_inserted = false;
			
			new_page.innerHTML = this.options.loadingContent;
			// 插在最贴近的少于自己的page后面
			for(i=index; i>0; i--)
			{	
				if($(this.options.pageIDPre+i))
				{
					new_page.injectAfter(this.options.pageIDPre+i);		
					is_inserted = true;
					break;
				}
			}
			
			// 如果都找不到了就插到最前面
			if(! is_inserted) new_page.injectTop(this.cacheSpace);	
			this.fireEvent('onLoadPage', [index, new_page]);	// 烧一个在读取页面的时候事件
			
			return new_page;
		}
		else
		{
			return $(this.indexPageID);
		}
		
	},
	
	// 获得页面内容
	getPageContent: function(index)
	{
		index = $pick(index, this.options.index);
		if(this.options.pageCount<index) return false;
		if(($(this.options.pageIDPre + index))) return;

		// 获得对应的page
		var thisPage = this.createPage(index);
		var pars;
		if(this.options.pars==null)
		{
			pars = 'page=' + index;
		}
		else
		{
			pars = this.options.pars + '&page=' + index;
		}
		var obj = this;
		new Request(
		{
			'url':this.options.dataUrl,
			'data' : pars,					
			'method' : 'get',
			'onComplete' : function(res) {	
				if(obj.options.autoFillContent)
				{
					$(obj.options.pageIDPre + index).innerHTML = res;
				}
				obj.fireEvent('onCompletePage', [index, obj.nowIndex, res]);	// 烧一个在读取页面的成功后的事件，用于设定JS之类的
			}		
		}).send();
	},
	
	// 滚动到某个page
	toElement: function(index)
	{	
		index = $pick(index, this.options.index);
		var thisPage = ($(this.options.pageIDPre + index))?$(this.options.pageIDPre + index):this.createPage(index);
		if(this.options.debug)
		{
			alert(this.options.pageIDPre + index);	
		}
		this.scroll.toElement(this.options.pageIDPre + index);
		this.fireEvent('onCompleteScroll', [index]);
	},
	
	onkey_action: function(event)
	{
		event = event ? event : (window.event ? window.event : null);
		switch (event.keyCode) 
		{
			case 37:
			case 38:
				this.prePage();
				return false;
				break;
			case 40:
			case 39:
				this.nextPage();
				return false;
				break;
			default:
				break;
		}
	}
});