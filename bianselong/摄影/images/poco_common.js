/********************************************
 * MYPOCO ͨ��JS
 * Author Panda
 *******************************************/

/**
 * �ж������
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

// �������
function escapeRegExp(str){
	return str.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
}

// ��չ���
var Extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
}


/**
 * $����
 * �����ID
 **/
if(window.$ == null)
{
	$ = function(el) {return document.getElementById(el);}
}

/**
 * ΪString���һ��trim����
 */
String.prototype.trim = function(mask)
{
	mask = mask?mask:'\\s';
	var re = eval('\/'+'(^'+mask+'*)\|'+mask+'*$'+'\/g');
	return this.replace(re,"");
}

String.prototype.ltrim = function(mask) 
{ 
	mask = mask?mask:'\\s';
	var re = eval('\/(^'+mask+'*)\/g');
	return this.replace(re, ""); 
} 

String.prototype.rtrim = function(mask) 
{ 
	mask = mask?mask:'\\s';
	var re = eval('\/('+mask+'*$)\/g');
	return this.replace(re, ""); 
} 

// ��Ӣ��ϵĳ���
String.prototype.clen = function()
{
	var len = this.match(/[^ -~]/g) == null ? this.length : this.length + this.match(/[^ -~]/g).length; 
	return len;
}

/*���ajax UTF-8��������*/
String.prototype.ajaxDataEncode = function()
{
	var data_arr = new_data_string = [];
	data_arr = this.split('&');

	for (var i=0; i<data_arr.length; i++)
	{
		temp_arr = data_arr[i].split('=');
		if ( typeof(temp_arr[1]) != 'undefined' ) new_data_string.push( '_ajaxencode_' + temp_arr[0] + '=' + escape(temp_arr[1]) );
	}
	return new_data_string.join('&');
}

// ����ʱ��
function timestamp(){
    var timestamp = new Date();
	var time_str = timestamp.getTime();
	time_str = time_str.toString();
	time_str = time_str.substr(0,10);
    return time_str;
}


/**
 * Cookieд��
 * ������ֵ������ʱ�䣨��λСʱ����������·��
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
 * Cookie��ȡ
 * ����
 */
function readCookie(key)
{
	var value = document.cookie.match('(?:^|;)\\s*' + escapeRegExp(key) + '=([^;]*)');
	return (value) ? decodeURIComponent(value[1]) : null;
}


/**
 * Cookieע��
 */
function delCookie(key,domain, path)
{
	writeCookie(key, '', -1, domain, path);
}

/**
 * �û���Ϣ
 */
var login_id = readCookie('member_id');
var login_nickname = readCookie('login_nickname');


/**
 * ���ݼ�����
 */
function copyToClipboard(txt) {   
  	if (window.clipboardData) {
     	window.clipboardData.setData("Text", txt);
	  	show_msg_box({title:'��Ϣ', content:'���Ƴɹ��������Ƶ������ǣ�<br>'+txt});
  	} 
	else {
 		// ��IE��������ʾ�����û��Լ�COPY
		show_msg_box({title:'�븴����������ݣ�', content:txt});
 	}
}

/**
 * �Ƿ���������
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
 * ��������
 */
var cover_screen_id = 'poco_cover_screen';		// �����Ĳ��ID
var cover_screen_iframe_id = 'poco_cover_screen_iframe';
var msg_box_id = 'poco_msg_box';
var selectArr = document.getElementsByTagName('select');
var msg_box_timer;		// ��ʱ��
var msg_box_time;		// ʣ��ʱ��
var iconArr = new Array();
iconArr['succ'] = 'http://my.poco.cn/images/ico_infoSucc.gif';
iconArr['failed'] = 'http://my.poco.cn/images/ico_infoFailed.gif';
iconArr['question'] = 'http://my.poco.cn/images/ico_infoQues.gif';
iconArr['alert'] = 'http://my.poco.cn/images/ico_infoAlert.gif';
iconArr['smile'] = 'http://my.poco.cn/images/icon_smile.gif';
function show_msg_box(options)
{
	this.options = {
		title 		: 		"��Ϣ",								// ����
		content 	: 		"�����ɹ���",						// ������
		remark		:		false,								// �������ݣ����ڰ�ť����
		cover		:		true,								// ����
		zindex		:		999999,								// �öԻ����z-index,������z-indexΪ��ֵ��1
		alpha		:		0.5,								// ���ø�����͸����
		color		:		'#666',								// ���ø�������ɫ
		top			:		150	,								// �Ի����붥���ľ���
		icon		:		false,								// ͼ�� succ,failed,question,alert��falseΪ����ʾ
		width		:		300,								// ��ʾ���
		time		:		false,								// ��ʱ����ʱ�䵥λ����
		timeout		:		function(){close_msg_box();}, 	// ʱ�������Ĳ���
		button		:		{ '�� ��':'close_msg_box();' },		// ��ť�� falseΪû��
		b_title		:		true,								// ��û�б���
		b_title_line:		false,								// ��������ݵķָ���
		b_close_bnt	:		true,								// ��û�����ϽǵĹرհ�ť
		b_scroll 	:		true,								// ������Ļ����	
		b_drag		:		false,								// �Ƿ����϶�, ��δ��������ҪMT֧�ֻ������drag��
		b_ajax		:		false,								// �Ƿ�AJAX�����ݣ� ��ҪMT֧�֣�δ����
		ajax_url	:		false,
		ajax_pars	:		false,
		evalScripts	:		false,
		b_blank_div	:		false,
		onShowComplete :	function(){},
		onGetDataComplete :	function(){}
	};
	Extend(this.options, options || {});
	
	var msg_box_obj = this;
	// �رվ���Ϣ��
	close_msg_box();
	// ����
	if(this.options.cover) create_cover_screen(this.options.alpha,this.options.color,this.options.zindex-1);
	
	var html='', bnt_html='',icon_html='',time_html='';
	
	// ������Ϣ��
	var msg_box = document.createElement("div");
	msg_box.id = msg_box_id;
	
	// ����icon
	if(iconArr['alert'] && this.options.icon ) icon_html = '<img src="'+iconArr['alert']+'">';
	
	// ���ɰ�ť
	if(this.options.button!==false)
	{
		for( var bnt in this.options.button )
		{
			var cmd = this.options.button[bnt];
			bnt_html += '<input type="button" class="button" value="'+bnt+'" onclick="'+cmd+'" /> ';
		}
	}
	
	// ��ʱ�¼�
	if(this.options.time)
	{
		msg_box_time = this.options.time;
		msg_box_timer = setInterval(function()
		{
			if(msg_box_time <= 0)
			{
				window.clearInterval(msg_box_timer);
				this.options.timeout();		// ִ��ֹͣ��ĺ���
			}
			if($('msg_box_time_num')) $('msg_box_time_num').innerHTML = msg_box_time;
			msg_box_time--;
		},1000);
		time_html = '<a id="msg_box_time_num" class="time fr">' + msg_box_time + '</a>';
	}
	
	// ��ʽ
	msg_box.style.width = this.options.width + 'px';
	msg_box.style.left = (document.documentElement.scrollWidth-this.options.width)/2 + 'px';
	msg_box.style.zIndex = this.options.zindex;
	msg_box.style.backgroundColor = '#FFFFFF';
	msg_box.style.position = 'relative';
	msg_box.style.overflow = 'hidden';
	
	// html
	if(this.options.b_blank_div)
	{
		msg_box.style.backgroundColor = '';
		html = '<div id="poco_pop_content" style="padding:0px; margin:0px;">'+this.options.content+'</div>';
	}
	else
	{
		html = '<div class="poco_pop">';
		if (this.options.b_title)
		{
			html += '<div class="clearfix title_main"><h3 class="title fl">'+this.options.title+'</h3>'+time_html;
			if(this.options.b_close_bnt)
			{
				html += '<a href="javascript:void(0);" title="�ر�" class="fr f12" onclick="close_msg_box();return false;">�ر�</a>'
			}
			html += '</div>';
			if(this.options.b_title_line)
			{
				html += '<div class="d_line"></div>';
			}
		}
		html += '<div class="text" id="poco_pop_content" style="width:'+ (this.options.width - 36) +'">';
		html += this.options.content;
		html += '</div>';
	}
	
	if(bnt_html.trim() != '')
	{
  		html += '<div class="pop_btu">';
  		html += bnt_html;
  		html += '</div>';
	}
	html += '</div>';
	html += '<iframe class="poco_pop_iframe" scrolling="no"  frameBorder="0"></iframe>';
	
	
	msg_box.innerHTML = html;
	
	if (this.options.b_scroll==true)
	{
		if (Sys.ie6)																//���ÿ��嶥������
		{
			msg_box_css_text = ";position:absolute;top:expression(this.style.pixelHeight+document.documentElement.scrollTop+"+this.options.top+");";
		}
		else
		{
			msg_box_css_text = ";position:fixed;top:"+this.options.top+"px;";
		}
	}
	else
	{
		msg_box_css_text = ";position:absolute;top:"+(this.options.top + document.documentElement.scrollTop + document.body.scrollTop)+"px;";
	}

	msg_box.style.cssText += msg_box_css_text;
	
	document.body.appendChild(msg_box);
	
	if(this.options.ajax_url)
	{
		new Request(
		{
			'url':this.options.ajax_url,
			'data' : this.options.ajax_pars,					
			'method' : 'post',
			'evalScripts' : this.options.evalScripts,
			'onComplete' : function(res) {	
				$('poco_pop_content').innerHTML = res;
				msg_box_obj.options.onGetDataComplete();
			}		
		}).send();
	}
	
	this.options.onShowComplete();
}

/**
 * ɾ����Ϣ��
 */
function close_msg_box()
{
	try {window.clearInterval(msg_box_timer);}
	catch(e){}
	try{
		$(msg_box_id).innerHTML='';
	}catch(e){}
	if($(msg_box_id)) document.body.removeChild($(msg_box_id));
	clear_cover_screen(true);
}


/**
 * ����
 */
function create_cover_screen(alpha,color,zindex)
{
	if($(cover_screen_id)) 
	{
		$(cover_screen_id).style.display = '';
		if($(cover_screen_iframe_id)) $(cover_screen_iframe_id).style.display = '';
		return $(cover_screen_id);		// ����Ѿ����ڣ��ͷ��ظ����Ķ���
	}
	
	var cover_screen = document.createElement("div");	// �½�һ��DIV
	cover_screen.id = cover_screen_id;
	
	var cover_screen_iframe = document.createElement("iframe");	// �½�һ��iframe
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
	
	document.body.appendChild(cover_screen_iframe);
	cover_screen_iframe.style.opacity = 0;
	cover_screen_iframe.style.width = coordinates.width;
	cover_screen_iframe.style.height = coordinates.height;
	cover_screen_iframe.style.position = 'absolute';
	cover_screen_iframe.style.zIndex = zindex-1;
	cover_screen_iframe.style.left = '0px';
	cover_screen_iframe.style.top = '0px';
	cover_screen_iframe.style.filter = 'alpha(opacity=0)';
	cover_screen_iframe.style.border = '0px';
	
	document.body.appendChild(cover_screen);
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
	
	for(i=0;i<selectArr.length;i++)
	{
		selectArr[i].style.display = 'none';
	}
	
	return cover_screen;
}


/**
 * ���ظ���
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
	// �ָ�select
	for(i=0;i<selectArr.length;i++)
	{
		selectArr[i].style.display = '';
	}
}


// ��ѡ��ť���ֵ
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

// ��class='CancleBubble'�Ķ���ȡ��ð�ݿ���
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
 * �����˵�
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
	//��������
	ddm_target.onmouseover = function(){
		clearTimeout(ddm_timer);	
	}
	//�Ƴ�
	ddm_target.onmouseout = obj.onmouseout = function(){
		ddm_timer = setTimeout(function(){
			ddm_target.style.display = "none";
			try{
				mypoco_drop_down_out(obj,hash);
			}
			catch(e){}
			
		}, 300);	
	};
	
}


// �ж��Ƿ���ַ
function isWebUrl(urlString)
{
     regExp = /(http[s]?|ftp):\/\/[^\/\.]+?\..+[\w\/\=]$/i;
     if (urlString.match(regExp))return true;
     else return false; 
}

// ��ʾ���ݶ�ȡ�еĲ�
function show_loading_div(str)
{
	if(! str) str = '���ڶ�ȡ';
	
	close_loading_div();
	var id = 'manage_loading_div';
	
	var loadingDiv = new Element('div', { 
		'id' : id,
		'class' : 'loading_div_class'
	}); 
	
	if (navigator.appVersion.match(/MSIE [0-6]\./))																//���ÿ��嶥������
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

// ɾ�����ݶ�ȡ�еĲ�
function close_loading_div()
{
	try{
		$('manage_loading_div').dispose();
	}
	catch(e){}
}

// ����onmouseover onmouseout ð������
// ʹ�÷���onmouseover='if(isMouseLeaveOrEnter(event, this)) show_extend_banner(1)' onmouseout='if(isMouseLeaveOrEnter(event, this)) show_extend_banner(2)'
function isMouseLeaveOrEnter(e, handler)
{     
    if (e.type != 'mouseout' && e.type != 'mouseover') return false;     
    var reltg = e.relatedTarget ? e.relatedTarget : e.type == 'mouseout' ? e.toElement : e.fromElement;     
    while (reltg && reltg != handler)     
        reltg = reltg.parentNode;     
    return (reltg != handler);     
}

// ��ȡ��ǰ�����url
function get_browser_url()
{
	var url = top.window.location.href;
    var reg = /#(.*)/gi;
    url = url.replace(reg,"");

	var reg = /[\?&]_t_=([0-9]*)/gi;
	 url = url.replace(reg,"");

	var dt = new Date(); 
	var t = dt.getTime(); 

	if(url.indexOf("?") > 0 )
	{
		url += "&_t_="+t;
	}
	else
	{
		url += "?_t_="+t;
	}

	return url;
}

// ��ȡurl��ֵ����
function _GET(val)
{
	var uri = window.location.search;
	var re = new RegExp("" +val+ "\=([^\&\?]*)", "ig");
	return ( (uri.match(re)) ? (uri.match(re)[0].substr(val.length+1)) : null );
}

/**
 * ���ύ (����MT)
 */
function request_form(options)
{
	this.options = {
		formid 				:	false,			// ��ID
		method				:	'',			// �ύ��ʽ
		append_data 		:	'',				// ׷�Ӵ��Ͳ���
		data_type			:	'html',			// �ύ��ʽ
		ajaxEncode			:	true,			// �Ƿ������ʽ�ύ,���ֱ��벻��
		evalScripts			:	true,			// �Ƿ����б�Ŀ����ҳ����JS
		onRequestComplete 	:	false
	};
	Extend(this.options, options || {});

	var rf_obj = this;
		
	rf_obj.form_obj = $(rf_obj.options.formid);
	rf_obj.form_url = rf_obj.form_obj.getAttribute('action');
	rf_obj.form_method = rf_obj.form_obj.getAttribute('method').toLowerCase();
	if ( rf_obj.form_url=='' ) rf_obj.form_url = window.top.location.href;
	
	if ( rf_obj.form_method!='get' || rf_obj.form_method!='post' )
	{
		rf_obj.options.method = 'post';
	}
	
	if (rf_obj.options.ajaxEncode==true)// ��ȡ��������Ԫ��(��input, select��)��ֵ
	{
		rf_obj.pars = rf_obj.form_obj.formDataEncode();
	}
	else
	{
		rf_obj.pars = rf_obj.form_obj.toQueryString();
	}
	
	if (rf_obj.options.append_data!='')
	{
		rf_obj.pars += '&' + rf_obj.options.append_data;
	}
	
	rf_obj.headers_type = { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'text/javascript, text/html, application/xml, text/xml, */*' };
	if (rf_obj.options.data_type=='json')
	{
		rf_obj.headers_type = { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json', 'X-Request': 'JSON' };
	}
	
	rf_obj.ajaxRequest = new Request({
		url:rf_obj.form_url,
		method:rf_obj.options.method,
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

// �л��������ʾ���
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
		//������IE�����µ�����
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

// �ո�png��IE6���治͸���ķ���
function fixPng(img) {
	
	if(Sys.ie6 !== false)
	{
		//���ﻹҪ�ж�һ���Ƿ�IE6
		img.onload="";
		img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src.replace('%23', '%2523').replace("'", "%27") + ")";
		img.src = "http://my.poco.cn/manage/images/blank.gif";
	}
}


// ���Ͷ���Ϣ
function mypoco_send_pm(user_id)
{
	
}

// ��Ϊ����
function mypoco_add_friend(user_id)
{
	
}

// ��ӹ�ע
function mypoco_add_follow(user_id)
{
	
}