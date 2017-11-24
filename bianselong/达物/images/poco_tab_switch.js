/***********************
 * POCO TAB切换类
 * author : Panda 
************************/

var poco_tab_switch = new Class({
								 
	// 继承MYPOCO基类
	Implements: [Events, Options],
	
	options: {
		containerID : 'switch_tab_container',				// 容器ID
		tabName : 'switch_tab_name',
		cacheSpace : 'switch_tab_space',					// page的载体
		cacheIDPre : 'tab_cache_',							// 缓存数据的DIV的ID前缀
		reLoad : false,										// 每次重新加载
		even : 'click',										// 触发的事件
		selectClass : 'tab_selected',						// 被选中时候的样式
		normalClass : 'tab_normal',							// 正常时候的样式
		index : 0,											// 开始显示的是第几个选卡
		dataType : [],										// 拿数据的方式 display, ajax, local
		dataSource : [],									// 数组['', '', '']display显示某个模块，local的是从本地某个地方拿数据，ajax填的是链接
		inputData : [],
		page : 'p',
		debug:false
	},
	
	initialize : function(options){
		var obj = this;
		
		this.setOptions(options);
		this.container = $(this.options.containerID);
		this.cacheSpace = $(this.options.cacheSpace);
		
		// 获得Tab 数组
		this.tabArr = this.container.getElements('[name='+this.options.tabName+']'); 
		// 绑定动作
		this.tabArr.each(function(tabObj, index){
			tabObj.addEvent(obj.options.even, function()
			{
				obj.getTabData(tabObj, index);
			});
		});

		// 默认显示
		this.lastIndex = this.options.index;
		this.getTabData(this.tabArr[this.options.index], this.options.index);
		
		this.fireEvent('onInitComplete', [this.options.index]);
	},
	
	getPageData : function(page, pars)
	{
		this.fireEvent('onPageDate', [page, this.pars]);
		var pageTabObj = this.tabArr[this.lastIndex];
		this.getTabData(pageTabObj, this.lastIndex, "&"+this.options.page+"="+page+"&"+pars, true);
		
		//$(this.options.cacheIDPre + this.lastIndex).innerHTML = '';
	},

	getTabData : function(tabObj, index, pars, reload)
	{	
		if(pars==null) pars='';
		var inputPars = this.getInputPars(index);
		pars += inputPars;
		var obj = this;
		// 检查一下数据的数组有没有相应的内容
		if( ! this.tabArr[index] || ! this.options.dataSource[index] )
		{
			if(this.options.debug)
			{
				alert('设置数据源参数或是tab的定义不正确， 请通知管理员检查');
			}
			return false;
		}
		var lastIndex = this.lastIndex;
		this.tabArr[lastIndex].className = this.options.normalClass;
		this.tabArr[index].className = this.options.selectClass;
		this.lastIndex = index;
		
		// 关闭上次打开的那个选卡
		if (this.options.dataType[lastIndex] != 'display')
		{
			try{$(this.options.cacheIDPre+lastIndex).style.display = 'none';}catch(e){};
		}
		else
		{
			try{$(this.options.dataSource[lastIndex]).style.display = 'none';}catch(e){};
		}
		
		
		// 下面是建立新打开选卡的数据
		// 如果是没有缓存模块，就建立一个
		if (this.options.dataType[index] != 'display')
		{
			if (! $(this.options.cacheIDPre+index) )
			{
				var new_cacher = new Element('div', { 
					'id' : this.options.cacheIDPre+index
				});
				
				// 把TA塞进
				new_cacher.injectInside(this.cacheSpace);
			}
			if($(this.options.cacheIDPre+index).innerHTML == '')
			{
				var no_data = 1;
			}
			
			$(this.options.cacheIDPre+index).style.display = '';
			
			// 已经有数据且是当前选卡的不用再获取数据
			if(index == lastIndex && no_data != 1 && reload!==true) return true;
			// 有数据且不用次次读取数据的，返回
			if(no_data != 1 && ! obj.options.reLoad && reload!==true)	return true;
		}
		switch(obj.options.dataType[index])
		{
			case 'display':
				$(this.options.dataSource[index]).style.display = '';
				break;
			case 'ajax':
				this.fireEvent('onLoadData',[this, index]);
				new Request(
				{
					'url':this.options.dataSource[index],
					'data' : '',					
					'method' : 'get',
					'data' : pars,
					'evalScripts': true,
					'onComplete' : function(res) {	
						$(obj.options.cacheIDPre+index).innerHTML = res;
						obj.fireEvent('onCompleteDate', [index, $(obj.options.cacheIDPre+index), $(obj.options.cacheIDPre+lastIndex), res]);
					}		
				}).send();
				break;
			case 'local':
				// 从本页某些地方拿数据过来
				$(this.options.cacheIDPre+index).innerHTML = $(obj.options.dataSource[index]).innerHTML;
				break;
		}
		this.fireEvent('onGetDataComplete', [index]);
	},
	
	getInputPars : function(index)
	{
		var inputPars='';
		if(this.options.inputData[index])
		{
			var inputObjs = this.options.inputData[index];
			if(inputObjs.length>0)
			{
				for(l=0;l<this.options.inputData[index].length;l++)
				{
					if($(inputObjs[l]))
					{
						inputPars += '&'+ $(inputObjs[l]).name + '=' + $(inputObjs[l]).value;
					}
				}
			}
		}
		return inputPars;
	}
});