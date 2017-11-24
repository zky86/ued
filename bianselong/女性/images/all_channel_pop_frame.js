// ��չ���
var Extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
}

function writeCookie(name, value, hours, domainname)
{
  var expire = "";
  if(hours != null)
  {
    expire = new Date((new Date()).getTime() + hours * 3600000);
    expire = "; expires=" + expire.toGMTString();
  }
  
  var domain = "";
  if(domainname != null)
  {
  	domain = "; domain=" + domainname;
  }
  document.cookie = name + "=" + escape(value) + expire + domain;
}

//��COOKIE
function readCookie(name)
{
  var cookieValue = "";
  var search = name + "=";
  if(document.cookie.length > 0)
  { 
    offset = document.cookie.indexOf(search);
    if (offset != -1)
    { 
      offset += search.length;
      end = document.cookie.indexOf(";", offset);
      if (end == -1) end = document.cookie.length;
      cookieValue = unescape(document.cookie.substring(offset, end))
    }
  }
  
  return cookieValue;
}

//һ�ο����ж���������ͺͰ汾�Ĵ���
window["MzBrowser"]={};(function()
{
  if(MzBrowser.platform) return;
  var ua = window.navigator.userAgent;
  MzBrowser.platform = window.navigator.platform;
  MzBrowser.ie = !MzBrowser.opera && ua.indexOf("MSIE")>0;
 
  if(MzBrowser.ie) var re = /MSIE( )(\d+(\.\d+)?)/;
 
  if("undefined"!=typeof(re)&&re.test(ua))
    MzBrowser.version = parseFloat(RegExp.$2);
})(); 

//���ϵͳ�ּ�������ʾ
function poco_all_channel_pop_frame(options)
{
	this.options = {
		url 		: 		"http://a-m-s.poco.cn/test/test.html",							// iframe url����
		height      :		200,	
		cookie		:		false
	};
	Extend(this.options, options || {});

	if((this.options.cookie && readCookie('all_channel_pop_frame')!=1) || !this.options.cookie)
	{
		//�Ƿ�������
		document.write('<div id="all_channel_pop_frame_div" style="height:'+this.options.height+';overflow:hidden;position:absolute;right:0px;display:none;z-index:9999;">');
	

		document.write('<img src="http://a-m-s.poco.cn/images/close_btn.png" style="position:absolute;top:5px;right:10px;z-index:9999;cursor:pointer;" onclick="close_poco_all_channel_pop_frame();"><table class="all_channel_pop_frame_tbl" border="0" cellspacing="0" cellpadding="0"><tr><td  class="all_channel_pop_frame_top"><div><img src="http://my.poco.cn/manage/images/blank.gif" /></div></td></tr><tr><td><div id="all_channel_pop_frame_height" class="all_channel_pop_frame_height"><div class="all_channel_pop_frame_info"><iframe src="'+this.options.url+'" height="'+this.options.height+'" frameborder="0" scrolling="no" onload="show_poco_all_channel_pop_frame();"></iframe></div><div class="all_channel_pop_frame_right"><img src="http://my.poco.cn/manage/images/blank.gif" /></div></div></td></tr><tr><td class="all_channel_pop_frame_bottom"><div><img src="http://my.poco.cn/manage/images/blank.gif" /></div></td></tr></table></div>');

		document.getElementById('all_channel_pop_frame_height').style.height = this.options.height + "px";

		if(this.options.cookie)
		{
			writeCookie('all_channel_pop_frame',1,this.options.cookie);
		}
	}
}

function position_fixed()
{
	document.getElementById('all_channel_pop_frame_div').style.top = document.documentElement.clientHeight + document.documentElement.scrollTop - document.getElementById('all_channel_pop_frame_div').offsetHeight +"px";
}

//���ص���
function close_poco_all_channel_pop_frame()
{
	if(document.getElementById('all_channel_pop_frame_div')) 
	{
		try{
			document.getElementById('all_channel_pop_frame_div').style.display = "none";
		}
		catch(e){}
	}
}

//��ʾ����
function show_poco_all_channel_pop_frame()
{
	setInterval('position_fixed()',50);
	document.getElementById('all_channel_pop_frame_div').style.display = "block";
}