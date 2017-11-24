/********************************************
 * MYPOCO 通用JS
 * Author Panda
 *******************************************/

/**
 * 判断浏览器
 */
var Sys = {};
var ua = navigator.userAgent.toLowerCase();
var s;
Sys.ie = (s = ua.match(/msie ([\d.]+)/)) ? s[1] : false;
Sys.ie6 = (s = ua.match(/msie ([0-6]\.+)/)) ? s[1] : false;
Sys.firefox = (s = ua.match(/firefox\/([\d.]+)/)) ? s[1] : false;
Sys.chrome = (s = ua.match(/chrome\/([\d.]+)/)) ? s[1] : false;
Sys.opera = (s = ua.match(/opera.([\d.]+)/)) ? s[1] : false;
Sys.safari = (s = ua.match(/version\/([\d.]+).*safari/)) ? s[1] : false;

// 正则过滤
function escapeRegExp(str){
	return str.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
}

// 扩展替代
var Extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
};

/**
 * $函数
 * 对象的ID
 **/
if(window.$ == null)
{
	$ = function(el) {return document.getElementById(el);}
}

/**
 * 为String多加一个trim函数
 */
String.prototype.trim = function(mask)
{
	mask = mask?mask:'\\s';
	var re = eval('\/'+'(^'+mask+'*)\|'+mask+'*$'+'\/g');
	return this.replace(re,"");
};

String.prototype.ltrim = function(mask) 
{ 
	mask = mask?mask:'\\s';
	var re = eval('\/(^'+mask+'*)\/g');
	return this.replace(re, ""); 
};

String.prototype.rtrim = function(mask) 
{ 
	mask = mask?mask:'\\s';
	var re = eval('\/('+mask+'*$)\/g');
	return this.replace(re, ""); 
}; 

// 中英混合的长度
String.prototype.clen = function()
{
	var len = this.match(/[^ -~]/g) == null ? this.length : this.length + this.match(/[^ -~]/g).length; 
	return len;
};

/*解决ajax UTF-8编码问题*/
String.prototype.ajaxDataEncode = function()
{
	var data_arr = new_data_string = [];
	data_arr = this.split('&');
	var txt;
	for (var i=0; i<data_arr.length; i++)
	{
		temp_arr = data_arr[i].split('=');
		txt = temp_arr[1].replace(/\r/gm,"").replace(/\n/gm,"\r\n");//fix ie与ff换行不兼容(ie:\r\n  ff:\n)
		if ( typeof(temp_arr[1]) != 'undefined' ) new_data_string.push( '_ajaxencode_' + temp_arr[0] + '=' + escape(txt) );
	}
	return new_data_string.join('&');
};

// 返回时间
function timestamp(){
    var timestamp_obj = new Date();
	var time_str = timestamp_obj.getTime();
	time_str = time_str.toString();
	time_str = time_str.substr(0,10);
    return time_str;
}


/**
 * Cookie写入
 * 键名，值，持续时间（单位小时），域名，路径
 */
function writeCookie(key, value, duration, domain, path)
{
	value = encodeURIComponent(value);
	if (domain) value += '; domain=' + domain;
	if (path) value += '; path=' + path;
	if(duration)
	{
		var date = new Date();
		date.setTime(date.getTime() + duration * 60 * 60 * 1000);
		value += '; expires=' + date.toGMTString();
	}
	document.cookie = key + "=" + value;
}

/**
 * Cookie读取
 * 键名
 */
function readCookie(key)
{
	var value = document.cookie.match('(?:^|;)\\s*' + escapeRegExp(key) + '=([^;]*)');
	return (value) ? decodeURIComponent(value[1]) : null;
}

/**
 * Cookie注销
 */
function delCookie(key,domain, path)
{
	writeCookie(key, '', -1, domain, path);
}

/**
 * 用户信息
 */
var login_id = readCookie('member_id');
var login_nickname = readCookie('login_nickname');

/**
 * 兼容剪贴板
 */
function copyToClipboard(txt) {   
  	if (window.clipboardData) {
     	window.clipboardData.setData("Text", txt);
	  	show_msg_box({title:'信息', content:'复制成功！您复制的内容是：<br>'+txt});
  	} 
	else {
		show_msg_box({title:'请复制下面的内容：', content:txt});// 非IE，弹出提示层让用户自己COPY
 	}
}

function copyToClipBoard(txt){
copyToClipboard(txt);
}

/**
 * 是否在数组内
 */
function in_array(searcher, sArray)
{
	for(i=0; i<sArray.length; i++)
	{
		if(searcher === sArray[i])
		{
			return true;
		}
	}
	return false;
}

/**
 * 弹出窗口
 */
var cover_screen_id = 'poco_cover_screen';		// 覆屏的层的ID
var cover_screen_iframe_id = 'poco_cover_screen_iframe';
var msg_box_id_logs = new Array();
var msg_box_id = 'poco_msg_box';
var selectArr = document.getElementsByTagName('select');
var msg_box_timer;		// 计时器
var msg_box_time;		// 剩余时间
var iconArr = new Array();
iconArr['succ'] = 'http://my.poco.cn/images/ico_infoSucc.gif';
iconArr['failed'] = 'http://my.poco.cn/images/ico_infoFailed.gif';
iconArr['question'] = 'http://my.poco.cn/images/ico_infoQues.gif';
iconArr['alert'] = 'http://my.poco.cn/images/ico_infoAlert.gif';
iconArr['smile'] = 'http://my.poco.cn/images/icon_smile.gif';
function show_msg_box(options)
{
	this.options = {
		box_id		:		msg_box_id,							// 弹窗的ID
		b_closeother:		true,								// 是否关闭其他的弹窗
		b_cache		:		false,								// 窗口关闭的时候是直接remove还是隐藏 
		title 		: 		"信息",								// 标题
		b_title_icon: 		true,								// 标题图标
		content 	: 		"操作成功！",						// 主内容
		remark		:		false,								// 补充内容，放在按钮后面
		cover		:		true,								// 覆屏
		zindex		:		99999,								// 置对话框的z-index,覆屏的z-index为该值减1
		alpha		:		0.15,								// 设置覆屏的透明度
		color		:		'#000',								// 设置覆屏的颜色
		top			:		150	,								// 对话框离顶部的距离
		top_center	:		false,
		height		:		300,
		icon		:		false,								// 图标 succ,failed,question,alert，false为不显示
		width		:		300,								// 提示宽度
		time		:		false,								// 计时器，时间单位：秒
		timeout		:		function(){close_msg_box();}, 	// 时间结束后的操作
		button		:		{ '关 闭':'close_msg_box();' },		// 按钮组 false为没有
		b_title		:		true,								// 有没有标题
		b_title_line:		false,								// 标题和内容的分割线
		b_close_btn	:		true,								// 有没有右上角的关闭按钮
		b_scroll 	:		true,								// 跟随屏幕滚动	
		b_drag		:		false,								// 是否能拖动, 暂未开发，需要MT支持或另外的drag类
		b_ajax		:		false,								// 是否AJAX拿数据， 需要MT支持，未开发
		ajax_url	:		false,
		ajax_pars	:		false,
		evalScripts	:		false,
		b_blank_div	:		false,
		relativer_id : 		false,								// 相对的对象的ID
		b_shadow	:		'auto',
		left :				0,
		onShowComplete :	function(){},
		onGetDataComplete :	function(){}
	};
	Extend(this.options, options || {});
	
	var msg_box_obj = this;
	
	
	if(this.options.b_closeother || $(this.options.box_id) )
	{
		// 关闭旧消息框
		close_msg_box();
	}
	
	// 覆屏
	if(this.options.cover) create_cover_screen(this.options.alpha,this.options.color,this.options.zindex-1);
	
	// 如果该弹窗已经存在，就不用在生成，直接显示就可以了
	if($(this.options.box_id)) {
		if(this.options.b_cache==true)
		{
			$(this.options.box_id).style.display = '';
			return this;
		}
		else
		{
			try{
				document.body.removeChild($(this.options.box_id));
			}
			catch(e)
			{
				var parent_obj = $(this.options.box_id).parentNode;
				parent_obj.removeChild($(this.options.box_id));
			}
		}
	}
	var poco_pop_content = 'poco_pop_content';
	if(msg_box_id != this.options.box_id) 
	{
		poco_pop_content = this.options.box_id + '_pop_content';
	}
	
	var html='', bnt_html='',icon_html='',time_html='';
	
	// 生成消息框
	var msg_box = document.createElement("div");
	msg_box.id = this.options.box_id;
	
	var box_id_exist = 0;
	for(l=0;l<msg_box_id_logs.length;l++)
	{
		if (msg_box_id_logs[l]['box_id'] == msg_box.id )
		{
			box_id_exist = 1;
			msg_box_id_logs[l]['b_cache'] = this.options.b_cache;
		}
	}
	// 如果之前的不存在，就添加一条记录
	if(box_id_exist == 0)
	{
		var num = msg_box_id_logs.length;
		msg_box_id_logs[num] = new Array();
		msg_box_id_logs[num]['box_id'] = msg_box.id;
		msg_box_id_logs[num]['b_cache'] = this.options.b_cache;
	}
	
	msg_box.className = 'poco_layer_box';
	
	// 生成icon
	if(iconArr['alert'] && this.options.icon ) icon_html = '<img src="'+iconArr['alert']+'">';
	
	// 生成按钮
	if(this.options.button!==false)
	{
		for( var bnt in this.options.button )
		{
			var cmd = this.options.button[bnt];
			bnt_html += '<input type="button" class="button" value="'+bnt+'" onclick="'+cmd+'" /> ';
		}
	}
	
	// 定时事件
	if(this.options.time)
	{
		msg_box_time = this.options.time;
		msg_box_timer = setInterval(function()
		{
			if(msg_box_time <= 0)
			{
				window.clearInterval(msg_box_timer);
				this.options.timeout();		// 执行停止后的函数
			}
			if($('msg_box_time_num')) $('msg_box_time_num').innerHTML = msg_box_time;
			msg_box_time--;
		},1000);
		time_html = '<a id="msg_box_time_num" class="time fr">' + msg_box_time + '</a>';
	}
	
	// 样式
	var is_height_fix = 0;
	if(this.options.top_center && this.options.height>0 )
	{
		is_height_fix = 1;
		if(this.options.b_blank_div) 
		{
			msg_box.style.height = parseInt(this.options.height) + 'px';
			this.options.top = ( document.documentElement.scrollHeight - parseInt(this.options.height) )/2;
		}
		else 
		{
			msg_box.style.height = ( parseInt(this.options.height) + 34 ) + 'px';
			this.options.top = ( document.documentElement.scrollHeight - parseInt(this.options.height) - 34 )/2;
		}
	}
	
	if(this.options.b_blank_div) 
	{
		msg_box.style.width = parseInt(this.options.width) + 'px';
		msg_box.style.left = ( document.documentElement.scrollWidth - parseInt(this.options.width) )/2 + 'px';
	}
	else 
	{
		msg_box.style.width = ( parseInt(this.options.width) + 34 ) + 'px';
		msg_box.style.left = ( document.documentElement.scrollWidth - parseInt(this.options.width) - 34 )/2 + 'px';
	}
	
	msg_box.style.zIndex = this.options.zindex;
	msg_box.style.position = 'relative';
	msg_box.style.overflow = 'hidden';
	
	var t_html = b_html = '';
	
	// html
	if(this.options.b_blank_div)
	{
		msg_box.style.backgroundColor = '';
		html = '<div id="'+poco_pop_content+'" style="padding:0px;margin:0px;">'+this.options.content+'</div>';
		if(this.options.b_shadow == 'auto') this.options.b_shadow = false;
	}
	else
	{
		html = '<div class="layer_box_content">';
		if (this.options.b_title)
		{
			html += '<div class="clearfix title_main"><h4 class="title fl';
			if (this.options.b_title_icon) html += ' title_icon';
			html += '">'+this.options.title+'</h3>'+time_html;
			if(this.options.b_close_btn)
			{
				html += '<a href="javascript:void(0);" title="关闭" class="fr f12 close_icon" onclick="close_msg_box();return false;"></a>'
			}
			html += '</div>';
			if(this.options.b_title_line)
			{
				html += '<div class="d_line"></div>';
			}
		}
		html += '<div class="text" id="'+poco_pop_content+'">';
		html += this.options.content;
		html += '</div>';
		
		if(bnt_html.trim() != '')
		{
			html += '<div class="pop_btu">';
			html += bnt_html;
			html += '</div>';
		}
		html += '</div>';
		if(this.options.b_shadow == 'auto') this.options.b_shadow = true;
	}
	
	if(this.options.b_shadow)
	{
		// 半透的框
		var t_html = '<table border="0" cellpadding="0" cellspacing="0"';
		if(is_height_fix==1) t_html+=' style="height:100%" ';
		t_html += '><tr><td class="tl"></td><td class="box_c"></td><td class="tr"></td></tr><tr><td class="box_c"></td><td class="box_cc" valign="top">';
		var b_html = '</td><td class="box_c"></td></tr><tr><td class="bl"></td><td class="box_c"></td><td class="br"></td></tr></table>';
	}
	
	

	if(this.options.cover==false)
	{
		b_html += '<iframe class="poco_layer_box_iframe" scrolling="no" frameBorder="0" style="width:'+ ( parseInt(this.options.width) + 28 ) + 'px"></iframe>';
	}
	msg_box.innerHTML = t_html + html + b_html;
	
	if(this.options.relativer_id == false)
	{
		if (this.options.b_scroll==true)
		{
			if (Sys.ie6)//设置框体顶部距离
			{
				msg_box_css_text = ';position:absolute;top:expression(this.style.pixelHeight+document.documentElement.scrollTop+' + this.options.top + ');';
			}
			else
			{
				msg_box_css_text = ';position:fixed;top:'+this.options.top+'px;';
			}
		}
		else
		{
			msg_box_css_text = ';position:absolute;top:'+(this.options.top + document.documentElement.scrollTop + document.body.scrollTop)+'px;';
		}
		msg_box.style.cssText += msg_box_css_text;
		//document.body.appendChild(msg_box);
		document.body.insertBefore(msg_box, document.body.firstChild);
	}
	else
	{
		msg_box_css_text = ';position:absolute;top:'+this.options.top+'px;left:'+this.options.left+'px;';
		msg_box.style.cssText += msg_box_css_text;
		$(this.options.relativer_id).style.position = 'relative';
		$(this.options.relativer_id).appendChild(msg_box);
	}

	if(this.options.ajax_url)
	{
		new Request({
			url:msg_box_obj.options.ajax_url,
			data : msg_box_obj.options.ajax_pars,					
			method : 'post',
			evalScripts : msg_box_obj.options.evalScripts,
			onComplete : function(res) {
				$(poco_pop_content).innerHTML = res;
				msg_box_obj.options.onGetDataComplete();
			}
		}).send();
	}
	this.options.onShowComplete();

	return this;
}

/**
 * 删除消息框
 */
function close_msg_box()
{	
	try {window.clearInterval(msg_box_timer);}
	catch(e){}

	var box_id;
	for(l=0;l<msg_box_id_logs.length;l++)
	{
		box_id = msg_box_id_logs[l]['box_id'];
		if($(box_id)) 
		{
			if(msg_box_id_logs[l]['b_cache']==true)
			{
				$(box_id).style.display = 'none';
			}
			else
			{
				try{$(box_id).innerHTML='';}
				catch(e){}
				
				try{
					document.body.removeChild($(box_id));
				}
				catch(e)
				{
					var parent_obj = $(box_id).parentNode;
					parent_obj.removeChild($(box_id));
				}
			}
		}
	}
	clear_cover_screen(true);
}

/**
 * 覆屏
 */
function create_cover_screen(alpha,color,zindex)
{
	if(Sys.ie6)
	{
		for(i=0;i<selectArr.length;i++)
		{
			selectArr[i].style.display = 'none';
		}
	}
	
	
	if($(cover_screen_id)) 
	{
		$(cover_screen_id).style.display = '';
		if($(cover_screen_iframe_id)) $(cover_screen_iframe_id).style.display = '';
		return $(cover_screen_id);		// 如果已经存在，就返回覆屏的对象
	}
	
	var cover_screen = document.createElement("div");	// 新建一个DIV
	cover_screen.id = cover_screen_id;
	
	var cover_screen_iframe = document.createElement("iframe");	// 新建一个iframe
	cover_screen_iframe.id = cover_screen_iframe_id;
	
	if(Sys.ie)
	{
		var coordinates = { width : document.documentElement.scrollWidth, height : document.documentElement.scrollHeight };
	}
	else
	{
		if (document.body.clientHeight){ var wh = document.body.clientHeight + "px"; }
		else if (window.innerHeight){ var wh = window.innerHeight + "px"; }
		else{ var wh = "100%"; }
		var coordinates = { width : '100%', height : wh };
	}
	
	//document.body.appendChild(cover_screen_iframe);
	document.body.insertBefore(cover_screen_iframe, document.body.firstChild);
	cover_screen_iframe.style.opacity = 0;
	cover_screen_iframe.style.width = coordinates.width;
	cover_screen_iframe.style.height = coordinates.height;
	cover_screen_iframe.style.position = 'absolute';
	cover_screen_iframe.style.zIndex = zindex-1;
	cover_screen_iframe.style.left = '0px';
	cover_screen_iframe.style.top = '0px';
	cover_screen_iframe.style.filter = 'alpha(opacity=0)';
	cover_screen_iframe.style.opacity = '0';
	cover_screen_iframe.style.border = '0px';
	
	//document.body.appendChild(cover_screen);
	document.body.insertBefore(cover_screen, document.body.firstChild);
	cover_screen.style.opacity = alpha;
	cover_screen.style.width = coordinates.width;
	cover_screen.style.height = coordinates.height;
	cover_screen.style.position = 'absolute';
	cover_screen.style.backgroundColor = color;
	cover_screen.style.zIndex = zindex;
	cover_screen.style.overflow = 'hidden';
	cover_screen.style.left = '0px';
	cover_screen.style.top = '0px';
	cover_screen.style.filter = 'alpha(opacity='+alpha*100+')';
	cover_screen.style.opacity = alpha;
	
	return cover_screen;
}


/**
 * 隐藏覆屏
 */
function clear_cover_screen(b_remove)
{
	if($(cover_screen_id))
	{
		$(cover_screen_id).style.display = 'none';
		if(b_remove)
		{
			document.body.removeChild($(cover_screen_id));
		}
	}
	if($(cover_screen_iframe_id))
	{
		$(cover_screen_iframe_id).style.display = 'none';
		if(b_remove)
		{
			document.body.removeChild($(cover_screen_iframe_id));
		}
	}
	// 恢复select
	if(Sys.ie6)
	{
		for(i=0;i<selectArr.length;i++)
		{
			selectArr[i].style.display = '';
		}
	}
}


// 单选按钮组的值
function get_radio_value(radio_name)
{
	var radios=document.getElementsByName(radio_name);
	for(var i=0;i<radios.length;i++)
	{
		if(radios[i].checked==true)
		{
			return radios[i].value;
		}
	}
}

// 对class='CancleBubble'的对象取消冒泡控制
function manage_nobubble()
{
	var noBubble_arrs = $$('.CancleBubble');
	noBubble_arrs.each(function(bubble_obj)
	{
		bubble_obj.addEvent('click', function(event)
		{
			event = new Event(event);
			event.stopPropagation();
		});
	});
}


/**
 * 联动开始
 */
function select_linked(obj,data)
{
	var option_No=0;
	while($(obj).getChildren()[option_No].value!=obj.value)
	{
		option_No++;
	}
	
	var current_option=$(obj).getChildren()[option_No];
	try{eval($(obj).getParent().getParent().id+"_select_onchange_down_out(current_option.getAttribute('data'))")}catch(err){}
	if(eval($(obj).getParent().getParent().id+'_show'))
	{
		for(i=0; i<$(obj).getParent().getAllNext().length; i++)
		{
			$(obj).getParent().getAllNext()[i].innerHTML='<select disabled="disabled"><option value="">--请选择--</option></select>';
		}
	}
	else
	{
		while($(obj).getParent().getAllNext().length!=0)
		{
			$(obj).getParent().getParent().removeChild($(obj).getParent().getNext());
		}
	}
	if($(obj).getParent().getAllPrevious().length+1<eval($(obj).getParent().getParent().id+'_amount'))
	{
		if(eval($(obj).getParent().getParent().id+'_show')==false)
		{
			add_new_select($(obj).getParent().getParent().id);
		}
		select_add($(obj).getParent().getNext(),obj.value,data);
	}
}

function select_add(obj,val,data)
{
	var pars = 'is_data=1&option_id='+val;
	if(data!='undefined'){
		pars+='&data='+data;
	}
	var url = $(obj).getParent().getAttribute('url');
	new Request(
	{
		'url':url,
		'data' : pars,
		'method' : 'post',
		'evalScripts' : false,
		'onComplete' : function(res)
		{	
			eval(res);
			var select_html='<select onchange="select_linked(this,\''+data+'\')"><option value="">--请选择--</option>';
			for(i=0; i<selectlistArr.length; i++)
			{
				select_html+='<option next="'+selectlistArr[i].next+'" data="'+selectlistArr[i].data+'" value="'+selectlistArr[i].option_id+'">'+selectlistArr[i].option_value+'</option>'
			}
			select_html+='</select>';
			obj.innerHTML=select_html;	
		}
	}).send();	
}



function relating_select(options)
{
	this.options = {
		relating_id 		: 		"relating_id",				// 联动的id
		relating_max        : 		2,							// 联动显示select数量
		relating_show       :       true,                      // 是否显示select
		relating_data       :	    '',                         // 获取数据
		relating_ajax_url   :       ''                          // 异步地址
	};
	Extend(this.options, options || {});
	var id=this.options.relating_id;
	var amountmun=this.options.relating_max;
	var show=this.options.relating_show;
	var data=this.options.relating_data;
	eval(id+'_amount='+amountmun);
	eval('var amount='+id+'_amount');
	eval(id+'_show='+show);
	$(this.options.relating_id).setAttribute('url',this.options.relating_ajax_url);
	//eval(id+'_relating_ajax_url='+this.options.relating_ajax_url)
	if(show==false)
	{
		amount=1;
	}
	for(i=0;i<amount;i++){
		add_new_select(id);
	}	
	select_add($(id).getChildren()[0],0,data);
}

function add_new_select(id)
{
	select_html='<select disabled="disabled"><option>请选择</option></select>';
	var newDiv=document.createElement("div");
	newDiv.innerHTML=select_html;
	$(id).appendChild(newDiv);
}
/**
 * 联动结束
 */

/**
 * 下拉菜单
 */
var ddm_lastTarget = null;
var ddm_target = null;
var ddm_timer = 0;
function drop_down_menu(id, obj, hash){
	clearTimeout(ddm_timer);
	if (ddm_lastTarget) ddm_lastTarget.style.display = "none";
	ddm_target = document.getElementById(id);
	ddm_lastTarget = ddm_target;
	ddm_target.style.display = "block";
	//下拉触发
	ddm_target.onmouseover = function(){
		clearTimeout(ddm_timer);	
	};
	//移除
	ddm_target.onmouseout = obj.onmouseout = function(){
		ddm_timer = setTimeout(function(){
			ddm_target.style.display = "none";
			try{
				eval(hash+'_drop_down_out(obj,hash);');
			}
			catch(e){}
			
		}, 300);	
	};
	
}


// 判断是否网址
function isWebUrl(urlString)
{
     regExp = /(http[s]?|ftp):\/\/[^\/\.]+?\..+[\w\/\=]$/i;
     if (urlString.match(regExp))return true;
     else return false; 
}

// 显示内容读取中的层
function show_loading_div(str)
{
	if(! str) str = '正在读取';
	
	close_loading_div();
	var id = 'manage_loading_div';
	
	var loadingDiv = new Element('div', { 
		'id' : id,
		'class' : 'loading_div_class'
	}); 
	
	if (navigator.appVersion.match(/MSIE [0-6]\./))																//设置框体顶部距离
	{
		box_css_text = ";position:absolute;top:expression(35+document.documentElement.scrollTop);";
	}
	else
	{
		box_css_text = ";position:fixed;top:5px;";
	}
	
	loadingDiv.style.cssText +=	box_css_text;
	loadingDiv.setStyles({"left":(document.documentElement.scrollWidth - 120)/2+"px"});
	
	loadingDiv.innerHTML = '<div class="text_div">' + str + ' <img src="http://my.poco.cn/manage/images/loading.gif" align="absmiddle"  /></div>\
	<iframe style="width:120px; height:50px; position:absolute;left:0px;top:0px; z-index:-1;"  scrolling="no"  frameBorder="0"></iframe>';
	document.body.insertBefore(loadingDiv,document.body.childNodes[0] ? document.body.childNodes[0] : document.body); 
}

// 删除内容读取中的层
function close_loading_div()
{
	try{
		$('manage_loading_div').dispose();
	}
	catch(e){}
}

// 处理onmouseover onmouseout 冒泡问题
// 使用方法onmouseover='if(isMouseLeaveOrEnter(event, this)) show_extend_banner(1)' onmouseout='if(isMouseLeaveOrEnter(event, this)) show_extend_banner(2)'
function isMouseLeaveOrEnter(e, handler)
{     
    if (e.type != 'mouseout' && e.type != 'mouseover') return false;     
    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;     
    while (reltg && reltg != handler)     
        reltg = reltg.parentNode;     
    return (reltg != handler);     
}

// 获取当前浏览器url
function get_browser_url(no_t)
{
	var url = top.window.location.href;
    var reg = /#(.*)/gi;
    url = url.replace(reg,"");

	var reg = /[\?&]_t_=([0-9]*)/gi;
	 url = url.replace(reg,"");

	var dt = new Date(); 
	var t = dt.getTime(); 

	if(! no_t)
	{
		if(url.indexOf("?") > 0 )
		{
			url += "&_t_="+t;
		}
		else
		{
			url += "?_t_="+t;
		}
	}
	return url;
}

// 获取url传值参数
function _GET(val)
{
	var uri = window.location.search;
	var re = new RegExp("" +val+ "\=([^\&\?]*)", "ig");
	return ( (uri.match(re)) ? (uri.match(re)[0].substr(val.length+1)) : null );
}

/**
 * 表单提交 (基于MT)
 */
function request_form(options)
{
	this.options = {
		formid 				:	false,			// 表单ID
		append_data 		:	'',				// 追加传送参数
		data_type			:	'html',			// 提交方式
		ajaxEncode			:	true,			// 是否加密形式提交,保持编码不变
		evalScripts			:	true,			// 是否运行表单目标内页面内JS
		onRequestComplete 	:	false
	};
	Extend(this.options, options || {});

	var rf_obj = this;
	var form_obj = $(rf_obj.options.formid);
	rf_obj.form_url = form_obj.getAttribute('action');
	if ( rf_obj.form_url=='' ) rf_obj.form_url = window.top.location.href;
	
	//表单提交方式处理
	rf_obj.form_method = 'post';//默认
	if ( form_obj.getAttribute('method')!=null && in_array(form_obj.getAttribute('method'), ['get', 'post', 'GET', 'POST']) )
	{
		rf_obj.form_method = form_obj.getAttribute('method').toLowerCase();
	}
	
	//表单数据获取方式   获取数据输入元素(如input, select等)的值
	if (rf_obj.options.ajaxEncode==true) rf_obj.pars = form_obj.formDataEncode();
	else rf_obj.pars = form_obj.toQueryString();
	
	//提交前追加数据
	if (rf_obj.options.append_data!='')
	{
		rf_obj.pars += '&' + rf_obj.options.append_data;
	}
	
	//提交header
	rf_obj.headers_type = { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'text/javascript, text/html, application/xml, text/xml, */*' };
	if (rf_obj.options.data_type=='json')
	{
		rf_obj.headers_type = { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json', 'X-Request': 'JSON' };
	}
	rf_obj.ajaxRequest = new Request({
		url:rf_obj.form_url,
		method:rf_obj.form_method,
		data:rf_obj.pars,
		headers:rf_obj.headers_type,
		ajaxEncode:rf_obj.options.ajaxEncode,
		evalScripts:rf_obj.options.evalScripts,
		onComplete:function(data){
			if (rf_obj.options.onRequestComplete!=false)
			{
				if (rf_obj.options.data_type=='json')
				{
					var data_arr = JSON.decode(data, true);
					rf_obj.options.onRequestComplete(data_arr);
				}
				else
				{
					rf_obj.options.onRequestComplete(data);
				}
			}
		}
	}).send();
}

// 切换对象的显示情况
function switch_element_display_status(el_id, status)
{
	if(typeof(status) != 'undefined')
	{
		$(el_id).style.display = status;
	}
	else
	{
		if($(el_id).style.display == 'none')
		{
			$(el_id).style.display = '';
		}
		else
		{
			$(el_id).style.display = 'none';
		}
	}
}

function mypoco_resize_img(imgObj, rectWidth, rectHeight, fixIeBug)
{
	try
	{
		if(!fixIeBug) fixIeBug = true;
		//修正在IE运行下的问题
		if( (imgObj.width==0 || imgObj.height==0) && fixIeBug ) {
			var timer = setInterval(function(){
			act_resize_img(imgObj, rectWidth, rectHeight, false);
			clearInterval(timer);
			}, 1000); 
		return;
		}
		var x = imgObj.width>rectWidth ? rectWidth : imgObj.width;
		var y = imgObj.height>rectHeight ? rectHeight : imgObj.height;
		var scale = imgObj.width/imgObj.height;
	
		if( x>y*scale ) {
			imgObj.width = Math.floor(y*scale);
			imgObj.height = y;
		}
		else {
			imgObj.width = x;
			imgObj.height = Math.floor(x/scale);
		}
		imgObj.style.width = imgObj.width+"px";
		imgObj.style.height = imgObj.height+"px";
	
		if (typeof(imgObj.onload)!='undefined')
		{
			imgObj.onload=null;
		}
	}
	catch(err)
	{
	
	}
}

//v1.0
//Copyright 2006 Adobe Systems, Inc. All rights reserved.
function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
	var b_show_object = true;
	if (typeof(___ac_runcontent_dont_output_object)!='undefined')
	{
		if (___ac_runcontent_dont_output_object==true)
		{
			b_show_object=false;
		}
	}

	if (b_show_object==false)
	{
		  str = '<embed ';
			  for (var i in embedAttrs)
				str += i + '="' + embedAttrs[i] + '" ';
			  str += ' ></embed>';
	}
	else
	{
			var str = '<object ';
			  for (var i in objAttrs)
				str += i + '="' + objAttrs[i] + '" ';
			  str += '>';
			  for (var i in params)
				str += '<param name="' + i + '" value="' + params[i] + '" /> ';
			  str += '<embed ';
			  for (var i in embedAttrs)
				str += i + '="' + embedAttrs[i] + '" ';
			  str += ' ></embed></object>';
	}

  document.write(str);
}


function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_SW_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "id":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}




//滚动条移动
var old_scrolltop = 0;
function mypoco_scroll_move(obj_id, time)
{
	var dom_scrolltop = parseInt(document.documentElement.scrollTop + document.body.scrollTop);
	if (old_scrolltop==0)
	{
		old_scrolltop = dom_scrolltop;
	}
	var obj = $(obj_id);

	if ( dom_scrolltop>obj.getTop() && old_scrolltop>=dom_scrolltop )
	{
		old_scrolltop = dom_scrolltop;
		var temp_scrolltop = dom_scrolltop - ( dom_scrolltop - obj.getTop() ) / 10;	
		document.documentElement.scrollTop = document.body.scrollTop = parseInt(temp_scrolltop);

		setTimeout('mypoco_scroll_move("'+obj_id+'")', time);
	}
	else
	{
		old_scrolltop = 0;
	}
}

//异步
function poco_ajax(options)
{
	var xmlhttp = ""; 
	this.options=options;
	var onComplete=this.options.onComplete;
	
	this.ajaxget=function () //状态改变时调用的函数
	{
		if (xmlhttp.readyState==1) {}/*读取中*/
		else if(xmlhttp.readyState==4)
		{
			res=xmlhttp.responseText;
			onComplete();
		}
	};
	// Mozilla,   Safari,...
	if(window.XMLHttpRequest){   
		xmlhttp =new XMLHttpRequest();               
	}   
	//   IE   
	else if(window.ActiveXObject){   
		xmlhttp =new ActiveXObject("Msxml2.XMLHTTP");    
	}
	if(this.options.method==undefined || this.options.method==''|| this.options.method=='post')
	{ 
		var method='post';
		var url=this.options.url;
	}
	else{
		 var method=this.options.method;
		 if(this.options.pars==undefined || this.options.pars=='') var url=this.options.url;
		 else  var url=this.options.url+'?'+this.options.pars;
	}
	xmlhttp.open(method,url,true);
	xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded'); 
	xmlhttp.onreadystatechange=this.ajaxget;
	if(this.options.pars==undefined || this.options.pars=='')method=null;
	else var pars=this.options.pars;
	xmlhttp.send(pars); 
}




//div做select
function select_open(id,obj,hash){
	$(obj).addClass('select_top');
	drop_down_menu(id,obj,hash);
}

// 收复png在IE6下面不透明的方法
function fixPng(img) {
	
	if(Sys.ie6 !== false)
	{
		var title = img.title;
		var alt = img.alt;
		img.onload= '';
		img.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + img.src.replace('%23', '%2523').replace('\'', '%27') + ')';
		img.src = 'http://my.poco.cn/manage/images/blank.gif';
		img.title = title;
		img.alt = alt;
	}
}

//ie6 110压图
function mypoco_img_size(img,size)
{
	if(Sys.ie6 !== false)
	{
		img.style.display='inline';
		if($(img).getWidth()>=$(img).getHeight() && $(img).getWidth()>size)
		{
			img.style.width=size+"px";
		}
		else if($(img).getWidth()<=$(img).getHeight() && $(img).getHeight()>size)
		{
			img.style.height=size+"px";
		}
	}
}

//隐藏img.src
function mypoco_hidden_img_url(img)
{

	img.onload="";
	$(img).style.backgroundImage='url('+img.src+')';
	$(img).style.width='auto';
	$(img).style.height='auto';
	$(img).style.width=img.clientWidth+'px';
	$(img).style.height=img.clientHeight+'px';
	$(img).src='http://my.poco.cn/manage/images/blank.gif';
}


/**
 * 弹出全屏可见的图片
 * 整理 Panda
 */
 
function show_full_screen_img(options)
{
	this.options = {
		show_img_url		:		'',
		b_cover				:		true,
		b_rotate			:		true,													// 是否可以旋转
		b_org_img			:		true,
		zindex				:		99999,
		alpha				:		0.15,
		color				:		'#000'
	};
	
	Extend(this.options, options || {});
	
	// 关闭旧消息框
	close_msg_box();
	
	if(this.options.show_img_url.trim() == '') 
	{
		show_msg_box({'title':'出错啦！','content':'图片已经被删除，请联系管理员！'});
		return false;
	}
	
	// 覆屏
	if(this.options.cover) create_cover_screen(this.options.alpha,this.options.color,this.options.zindex-1);
	
	var html = '<div class="show_full_screen_img_container clearfix">\
				  <p style="line-height:30px; text-align:center; display:none;" class="clearfix" id="J_show_img_menu">\
					<span class="show_full_screen_img_close" onclick="close_msg_box();" ></span>\
					<span>';
					
	if(this.options.b_org_img)
	{
		html += '<a class="show_full_screen_img_artwork" target="_blank" href="'+this.options.show_img_url.replace('_640','')+'">查看原图</a> ';
	}
	
	if(this.options.b_rotate)
	{
		html += '<a class="show_full_screen_img_turn_left" href="javascript:void(0);" onclick="show_full_screen_img_rotate(-90);return false;" >向左转</a> <a href="javascript:void(0);" onclick="show_full_screen_img_rotate(90);return false;" class="show_full_screen_img_turn_right" >向右转</a>';
	}
						
	html +=	'</span></p><div id="J_show_full_screen_img_loading"><p><img src="http://my.poco.cn/t/images/mini_loading.gif" align="absmiddle" /> 正在加载图片，请稍候...</p><p><a href="#this" onclick="close_msg_box();">[关闭]</a></p></div><table border="0" cellpadding="0" cellspacing="0" style="display:none;" id="J_show_full_screen_img_tbl"><tr><td width="300" height="300" align="center" valign="middle"><span id="J_show_full_screen_img_container" angle="0"><img onload="show_full_screen_img_onload();" src="'+this.options.show_img_url+'" style="display:none;"/></span></td></tr></table></div>';
	show_msg_box_obj = show_msg_box({ 'b_blank_div':true, 'cover':this.options.b_cover, 'content':html, 'alpha':this.options.alpha, 'top':(document.documentElement.clientHeight-45)/2, 'b_scroll':true, 'width':300,  'button':{} });
}

// 图片读取后的处理
function show_full_screen_img_onload()
{
	$('J_show_full_screen_img_loading').style.display = 'none';		// 隐藏loading
	$('J_show_img_menu').style.display = 'block';
	$('J_show_full_screen_img_tbl').style.display = 'block';
	var full_img = $('J_show_full_screen_img_container').firstChild;
	full_img.style.display = '';		// 显示图片
	var tmp_angle = $('J_show_full_screen_img_container').getAttribute('angle');
	var tmp_angle = parseInt(tmp_angle);
	//tmp_angle = Math.abs(tmp_angle);
	
	// 额外高宽
	var extra_width = 16;
	var extra_height = 30;
	
	var orgWidth, orgHeight;
	// 获得图片的高和宽
	if($('J_show_full_screen_img_container').orgWidth)
	{
		orgWidth = $('J_show_full_screen_img_container').orgWidth;
		orgHeight = $('J_show_full_screen_img_container').orgHeight;
	}
	else
	{
		orgWidth = full_img.clientWidth;
		orgHeight = full_img.clientHeight;
		$('J_show_full_screen_img_container').orgWidth = orgWidth;
		$('J_show_full_screen_img_container').orgHeight = orgHeight;
	}
	
	if(in_array(tmp_angle,[0,180,360,-180,-360]))
	{
		var img_width = orgWidth;
		var img_height = orgHeight;
	}
	else
	{
		var img_width = orgHeight;
		var img_height = orgWidth;
	}

	// 屏幕的高宽
	var client_width = document.documentElement.clientWidth;
	var client_height = document.documentElement.clientHeight;
	
	// 宽高的比例
	var img_scale = img_width/img_height;
	
	// 只有宽高有大于屏幕尺寸的时候，要做重置
	if(img_width > (client_width-extra_width) || img_height > (client_height-extra_height))
	{	
		// 屏幕的比例比图片的比例大，宽度等于屏幕宽度
		var width_scale = (client_width-extra_width)/img_width;
		var height_scale = (client_height-extra_height)/img_height;
		if(width_scale > height_scale)
		{
			img_height = (client_height-extra_height);
			img_width = img_height*img_scale;
		}
		else
		{
			img_width = (client_width-extra_width);
			img_height = img_width/img_scale;
		}
	}
	
	if(! in_array(tmp_angle,[0,180,360,-180,-360]) && Sys.ie)
	{
		full_img.style.width = img_height + 'px';
		full_img.style.height = img_width + 'px';
	}
	else
	{
		full_img.style.width = img_width + 'px';
		full_img.style.height = img_height + 'px';	
	}
	$('poco_msg_box').style.width=(img_width<300)?300:img_width + 'px';
	$('poco_msg_box').style.height=(img_height + extra_height)<300?300:(img_height + extra_height) + 'px';
	if(Sys.ie6)
	{
		$('poco_msg_box').style.left = (client_width - $('poco_msg_box').clientWidth)/2 + 'px';
		
		var _top = (client_height - $('poco_msg_box').clientHeight)/2 - $('poco_msg_box').style.pixelHeight;
		var msg_box_css_text = ';top:expression(this.style.pixelHeight+document.documentElement.scrollTop+' + _top + ');';
		$('poco_msg_box').style.cssText += msg_box_css_text;
	}
	else
	{
		$('poco_msg_box').style.left = (client_width - $('poco_msg_box').clientWidth)/2 + 'px';
		$('poco_msg_box').style.top = (client_height - $('poco_msg_box').clientHeight)/2 + 'px';
	}
}

function show_full_screen_img_rotate(angle)
{	
	// 屏幕的高宽
	var client_width = document.documentElement.clientWidth;
	var client_height = document.documentElement.clientHeight;
	
	// 额外高宽
	var extra_width = 16;
	var extra_height = 34;
	show_full_screen_img_rotate_core($('J_show_full_screen_img_container').firstChild,angle,'null',(client_width-extra_width),(client_height-extra_height));
	var tmp_angle = $('J_show_full_screen_img_container').getAttribute('angle');
	tmp_angle = parseInt(tmp_angle);
	$('J_show_full_screen_img_container').setAttribute('angle', (tmp_angle+angle)%360);
	show_full_screen_img_onload();
}



/***** 图片旋转 start *****/
function show_full_screen_img_rotate_core(oImg, angle, callback, maxWidth, maxHeight)
{
	oImg.angle = ((oImg.angle==undefined ? 0: oImg.angle)+angle)%360;
	if(oImg.angle>=0) var rotation = Math.PI*oImg.angle/180;
	else var rotation = Math.PI*(360+oImg.angle)/180;

	var costheta = Math.cos(rotation);
	var sintheta = Math.sin(rotation);
	
	if (Sys.ie)//for ie
	{
		var canvas = document.createElement('img');
		canvas.src = oImg.src;
		
		canvas._w1 = oImg.width;
		canvas._h1 = oImg.height;
		
		if (oImg.width>=maxHeight || oImg.height>=maxWidth)
		{
			if (canvas._w1>canvas._h1)
			{
				canvas.width = maxHeight;
				canvas.height = (canvas._h1*canvas.width)/canvas._w1;
			}
			else
			{
				canvas.height = maxWidth;
				canvas.width = (canvas._w1*canvas.height)/canvas._h1;
			}
		}
		canvas.style.filter = 'progid:DXImageTransform.Microsoft.Matrix(M11='+costheta+',M12='+(-sintheta)+',M21='+sintheta+',M22='+costheta+',SizingMethod=\'auto expand\');';
		canvas.angle = oImg.angle;
	}
	else//非ie
	{
		var canvas = document.createElement('canvas');
		canvas.oImage = oImg;
		canvas.style.width = canvas.width = Math.abs(costheta*canvas.oImage.width)+Math.abs(sintheta*canvas.oImage.height);
		canvas.style.height = canvas.height = Math.abs(costheta*canvas.oImage.height)+Math.abs(sintheta*canvas.oImage.width);
		if(canvas.width>maxWidth){ canvas.style.width = maxWidth+'px'; }
		var context = canvas.getContext('2d');
		context.save();
		if(rotation<=Math.PI/2)
		{
			context.translate(sintheta*canvas.oImage.height, 0);
		}
		else
		{
			if(rotation<=Math.PI)
			{
				context.translate(canvas.width, -costheta*canvas.oImage.height);
			}
			else
			{
				if(rotation<=1.5*Math.PI) context.translate(-costheta*canvas.oImage.width, canvas.height);
				else context.translate(0, -sintheta*canvas.oImage.width);
			}
		}
		context.rotate(rotation);
		try
		{
			context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
		}catch(e){}
		context.restore();
	}
	oImg.parentNode.replaceChild(canvas, oImg);
}