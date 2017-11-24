// 扩展替代
var Extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
}

//一段可以判断浏览器类型和版本的代码
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

//读COOKIE
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


//广告系统分级弹出提示
function poco_fresh_pop_frame(options)
{
	this.options = {
		url 		: 		"http://a-m-s.poco.cn/test/test.html",							// iframe url链接
		cookie		:		true,
		height      :       276,
		width		:		322
	};
	Extend(this.options, options || {});

	if(readCookie('poco_fresh_all_catalog_pop_frame')!=1 || !cookie)
	{
		document.write('<div id="poco_fresh_all_catalog_pop_frame" ><iframe scrolling="no" frameborder="0" width="'+this.options.width+'" height="'+this.options.height+'" id="poco_fresh_content_iframe" name="poco_fresh_content_iframe" src='+this.options.url+'></iframe></div>');

		if(MzBrowser.version != "6")
		{
			document.getElementById('poco_fresh_all_catalog_pop_frame').style.cssText = "height:"+this.options.height+"px;width:"+this.options.width+"px;overflow:hidden;position:fixed;right:0px;bottom:0px;display:none;z-index:999999;";
		}
		else
		{
			document.getElementById('poco_fresh_all_catalog_pop_frame').style.cssText = "height:"+this.options.height+"px;width:"+this.options.width+"px;overflow:hidden;position:absolute;right:0px;display:none;z-index:999999;top:expression(eval(document.compatMode &&document.compatMode=='CSS1Compat') ?documentElement.clientHeight+documentElement.scrollTop-document.getElementById('poco_fresh_all_catalog_pop_frame').offsetHeight: document.body.clientHeight+document.body.scrollTop-document.getElementById('poco_fresh_all_catalog_pop_frame').offsetHeight)";
		}
	}
}


//隐藏弹窗
function close_poco_fresh_pop_frame(not_write_cookie)
{
	if(document.getElementById('poco_fresh_all_catalog_pop_frame')) 
	{
		try{
			document.getElementById('poco_fresh_all_catalog_pop_frame').style.display = "none";
		}
		catch(e){}
	}

	if(not_write_cookie!=1)
	{
		writeCookie('poco_fresh_all_catalog_pop_frame',1,24);
	}
	
}

//显示弹窗
function show_poco_fresh_pop_frame()
{
	try{
		//有新鲜事内容才出，兼容翻疯狂落点触发
		if (poco_fresh_content_iframe.document.getElementById('J_poco_fresh_content').innerHTML!='')
		{
			document.getElementById('poco_fresh_all_catalog_pop_frame').style.display = "block";
		}
	}
	catch(e){}
}