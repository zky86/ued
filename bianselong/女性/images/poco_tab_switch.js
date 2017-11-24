/***********************
 * POCO TAB�л���
 * author : Panda 
************************/

var poco_tab_switch = new Class({
								 
	// �̳�MYPOCO����
	Implements: [Events, Options],
	
	options: {
		containerID : 'switch_tab_container',				// ����ID
		tabName : 'switch_tab_name',
		cacheSpace : 'switch_tab_space',					// page������
		cacheIDPre : 'tab_cache_',							// �������ݵ�DIV��IDǰ׺
		reLoad : false,										// ÿ�����¼���
		even : 'click',										// �������¼�
		selectClass : 'tab_selected',						// ��ѡ��ʱ�����ʽ
		normalClass : 'tab_normal',							// ����ʱ�����ʽ
		index : 0,											// ��ʼ��ʾ���ǵڼ���ѡ��
		dataType : [],										// �����ݵķ�ʽ display, ajax, local
		dataSource : [],									// ����['', '', '']display��ʾĳ��ģ�飬local���Ǵӱ���ĳ���ط������ݣ�ajax���������
		inputData : [],
		page : 'p',
		debug:false
	},
	
	initialize : function(options){
		var obj = this;
		
		this.setOptions(options);
		this.container = $(this.options.containerID);
		this.cacheSpace = $(this.options.cacheSpace);
		
		// ���Tab ����
		this.tabArr = this.container.getElements('[name='+this.options.tabName+']'); 
		// �󶨶���
		this.tabArr.each(function(tabObj, index){
			tabObj.addEvent(obj.options.even, function()
			{
				obj.getTabData(tabObj, index);
			});
		});

		// Ĭ����ʾ
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
		// ���һ�����ݵ�������û����Ӧ������
		if( ! this.tabArr[index] || ! this.options.dataSource[index] )
		{
			if(this.options.debug)
			{
				alert('��������Դ��������tab�Ķ��岻��ȷ�� ��֪ͨ����Ա���');
			}
			return false;
		}
		var lastIndex = this.lastIndex;
		this.tabArr[lastIndex].className = this.options.normalClass;
		this.tabArr[index].className = this.options.selectClass;
		this.lastIndex = index;
		
		// �ر��ϴδ򿪵��Ǹ�ѡ��
		if (this.options.dataType[lastIndex] != 'display')
		{
			try{$(this.options.cacheIDPre+lastIndex).style.display = 'none';}catch(e){};
		}
		else
		{
			try{$(this.options.dataSource[lastIndex]).style.display = 'none';}catch(e){};
		}
		
		
		// �����ǽ����´�ѡ��������
		// �����û�л���ģ�飬�ͽ���һ��
		if (this.options.dataType[index] != 'display')
		{
			if (! $(this.options.cacheIDPre+index) )
			{
				var new_cacher = new Element('div', { 
					'id' : this.options.cacheIDPre+index
				});
				
				// ��TA����
				new_cacher.injectInside(this.cacheSpace);
			}
			if($(this.options.cacheIDPre+index).innerHTML == '')
			{
				var no_data = 1;
			}
			
			$(this.options.cacheIDPre+index).style.display = '';
			
			// �Ѿ����������ǵ�ǰѡ���Ĳ����ٻ�ȡ����
			if(index == lastIndex && no_data != 1 && reload!==true) return true;
			// �������Ҳ��ôδζ�ȡ���ݵģ�����
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
				// �ӱ�ҳĳЩ�ط������ݹ���
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