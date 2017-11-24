/**
* 统计代码js
* @author Tony
*/



var __poco_site_stat_obj = {};


try
{
	__poco_site_stat_obj.referer = document.referrer;
}
catch (__err)
{
	__poco_site_stat_obj.referer = '';
}


try
{
	__poco_site_stat_obj.opener = typeof(window.opener)!='undefined' ? 1 : 0;
}
catch (__err)
{
	__poco_site_stat_obj.opener = 0;
}

__poco_site_stat_obj.writeCookie=function(name,value,hours,domainname)
{
	var expire="";
	if(hours!=null)
	{
		expire=new Date((new Date()).getTime()+hours*3600000);
		expire="; expires="+expire.toGMTString();
	}

	var domain="";
	if(domainname!=null)
	{
		domain="; domain="+domainname;
	}

	var path="";
	path="; path=/";

	document.cookie=name+"="+escape(value)+expire+domain+path;
}

__poco_site_stat_obj.readCookie=function(name)
{
	var cookieValue="";
	var search=name+"=";
	if(document.cookie.length>0)
	{
		offset=document.cookie.indexOf(search);
		if(offset!=-1)
		{
			offset+=search.length;
			end=document.cookie.indexOf(";",offset);
			if(end==-1)end=document.cookie.length;
			cookieValue=unescape(document.cookie.substring(offset,end))
		}
	}
	return cookieValue;
}


__poco_site_stat_obj.add_obj_event=function(_obj,_event,_callback)
{
	if ( _obj.addEventListener )
	{
		_obj.addEventListener( _event,_callback, false );
	}
	else
	{
		_obj.attachEvent( 'on'+_event, _callback);
	}
}

__poco_site_stat_obj.remove_obj_event=function(_obj,_event,_callback)
{
	if ( _obj.addEventListener )
	{
		_obj.removeEventListener( _event,_callback, false );
	}
	else
	{
		_obj.detachEvent( 'on'+_event, _callback);
	}
}

__poco_site_stat_obj.auto_mark_visit=function()
{
	if (this.readCookie('visitor_flag')!='')
	{

	}
	else
	{


		try
		{
			this.writeCookie('visitor_flag',Math.round(new Date().getTime()/1000),24*365,'poco.cn');
			this.writeCookie('visitor_p', __poco_site_stat_request_filename.substr(0,__poco_site_stat_request_filename.indexOf('.css')) + '.css', 24*1, 'poco.cn');
			this.writeCookie('visitor_r',document.referrer,24*365,'poco.cn');
		}
		catch (err)
		{
		}
	}

	this.writeCookie('visitor_b',this.readCookie('visitor_l'), null, 'poco.cn');

	this.writeCookie('visitor_l',__poco_site_stat_request_filename.substr(0,__poco_site_stat_request_filename.indexOf('.css')) + '.css', null, 'poco.cn');


	//补充会话session_id
	if (this.readCookie('session_id')=='')
	{
		this.writeCookie('session_id',Math.round(new Date().getTime()/1000), null, 'poco.cn');
	}

}


__poco_site_stat_obj.mark_window_load=function()
{
	__poco_site_stat_obj.window_loaded=true;
}

/**
* 窗口关闭时记录一下动作
*/
__poco_site_stat_obj.mark_window_unload=function()
{
	__poco_site_stat_obj.write_code('window_unload.css','http://imgtj2.poco.cn/');
	__poco_site_stat_obj.remove_obj_event(window, "unload", __poco_site_stat_obj.mark_window_unload);
}

/**
* 输出函数
*/
__poco_site_stat_obj.write_code = function(request_filename,tj_server)
{
	if (typeof(tj_server)=='undefined')
	{
		tj_server = 'http://imgtj.poco.cn/';
	}


	var _ran_str = request_filename.indexOf('?')<0 ? '?' : '&';
	if (typeof(window.click_id)!='undefined')
	{
		var tmp_o_r =  0 ;		//直接在地址栏打开页面
		if (this.opener > 0 && this.referer!='') tmp_o_r=3;	//链接点击从新窗口打开的
		else if (this.opener > 0 && this.referer=='') tmp_o_r=2;	//程序脚本跳转的
		else if (this.opener == 0 && this.referer!='') tmp_o_r=1;　　//链接点击从当前窗口打开的

		//_ran_str = _ran_str + 'wid=' + window.click_id + '|' + tmp_o_r + '&tmp=' + Math.random()*1000000;
		_ran_str = _ran_str + 'wid=' +  tmp_o_r + '&tmp=' + Math.random()*1000000;
	}
	else
	{
		_ran_str = _ran_str + 'tmp=' + Math.random()*1000000;
	}


	if (__poco_site_stat_obj.referer!='')
	{
		var _referer_str = '&referer_outside=' + encodeURIComponent(__poco_site_stat_obj.referer);
	}
	else
	{
		var _referer_str = '';
	}

	if (typeof(__act_id)!='undefined')
	{
		var _act_id_str = '&act_id=' + __act_id + '&act_type_id=' + __act_type_id;
		if(typeof(__poco_pcrs_keyword)!='undefined')
		{
			_act_id_str = _act_id_str + '&Ofuser_id=' + __user_id + '&poco_pcrs_keyword=' + encodeURIComponent(__poco_pcrs_keyword[0]);
		}
	}
	else
	{
		var _act_id_str = '';
	}

	if (this.window_loaded==true)
	{
		var _tmp_img = new Image();
		_tmp_img.src = tj_server + request_filename + _ran_str + _referer_str +_act_id_str;
	}
	else
	{
		document.write('<img src="' + tj_server + request_filename + _ran_str + _referer_str +_act_id_str + '" style="position:absolute; top:-999px;" />');
	}
}



__poco_site_stat_obj.init = function()
{
	if (typeof(window.click_id)=='undefined')
	{
		if (this.readCookie('member_id')>0)
		{
			window.click_id = Math.round(Math.random()*1000000) % 65535;

			this.add_obj_event(window, "load", __poco_site_stat_obj.mark_window_load);
			//this.add_obj_event(window, "unload", __poco_site_stat_obj.mark_window_unload);
		}
	}

	//mark visitor
	__poco_site_stat_obj.auto_mark_visit();
}


/**
* run
*/
__poco_site_stat_obj.init();


if (typeof(__poco_site_stat_request_filename)!='undefined')
{
	try
	{
		//modify by Page add "__poco_site_stat_request_filename == 'yule.css'"
		if(__poco_site_stat_request_filename == 'yule.css')
		{
			urid = Math.floor(Math.random()*5)+1;
			if(urid == 1){
				__poco_site_stat_obj.write_code(__poco_site_stat_request_filename);
			}
		}
		//modify by Page add "__poco_site_stat_request_filename == 'yule_index.css'"
		if(__poco_site_stat_request_filename == 'yule_index.css')
		{
			urid = Math.floor(Math.random()*5)+1;
			if(urid == 1){
				__poco_site_stat_obj.write_code(__poco_site_stat_request_filename);
			}
		}
		//modify by Page add "__poco_site_stat_request_filename == 'bbs.css'"
		if(__poco_site_stat_request_filename == 'bbs.css')
		{
			__poco_site_stat_obj.write_code(__poco_site_stat_request_filename);
		}

              //modify by rui add "__poco_site_stat_request_filename == 'poco_album.css'"
		if(__poco_site_stat_request_filename == 'poco_album.css')
		{
			__poco_site_stat_obj.write_code(__poco_site_stat_request_filename);
		}

		if (window.top.location==window.location)
		{
			__poco_site_stat_obj.write_code(__poco_site_stat_request_filename);
		}

	}
	catch(err)
	{

	}
}


