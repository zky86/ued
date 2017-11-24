/*
 * 无限级JavaScript下拉菜单
 * 
 * Licensed under the terms of the GNU Lesser General Public License:
 * 		http://www.opensource.org/licenses/lgpl-license.php
 * 
 * File Name: linkage.js
 * 
 * Version:  1.1
 * Modified: 2006-7-20 15:31:48
 * 
 * File Authors:
 * 		张亚楠 (zhangyanan2008@gmail.com)
 *
 * Thanks To:
 *		HopeSoftStudio (http://www.10090.com)
 *
 * Online Demo & Download:
 *		http://www.wofeila.com/test/menu/menu.htm
 *		http://www.wofeila.com/test/menu/menu.rar
 * edit by hanson
 * 这个是需要 mootools 库支持
 * 介于 POCO 服务器 用 post 请求返回 HTTP Error 411 - Length required 错误，故改为 get 方法
 */


///var Linkage_v2 = Class.create();
//Linkage_v2.prototype = {

var global_arr_response_record = new Array();    //记录请求返回的数组

var Linkage_v2 = new Class({
	initialize : function(dataSrc, MenuInfoArr) {
		this.dataSrc = dataSrc;
		this.AllMenuArr[dataSrc] = new Array();
		this.MenuInfoArr = MenuInfoArr;
	},

	//是否用AJAX功能
	need_ajax : false ,

	//判断请求是否已经成功返回, 只要是为了 pupu_select_list 类，当数未返回就自动关闭弹出层
	ajax_effect : false ,

	//请求地址
	request_url : "request.php" ,

	//是否延迟执行处理
	//delay_handdle : false ,
	
	//创建的ajax对象
	myAjax : null ,

	dataSrc : "" ,

	debug : false ,
		
	//请求编码
	encoding : "GB2312" ,

	//记录下拉菜单的个数，用于减少最后一级不请求
	select_count : 0 ,

	//下拉菜单统一宽度限制
	select_width : "" ,

	//操作的下拉菜单对象记录
	ArraySelectObj : new Array() ,

	//初始化SELECT列表时的默认值
	BLANK_SELECT : "请选择" ,

	//三维数组 总的数据数组
	AllMenuArr : new Array() ,

	//二维数组 应用的表单(SELECT)元素数组
	MenuIdArr : new Array() ,

	//各分支数据级组
	MenuInfoArr : new Array() ,


	//初始化空的SELECT
	initBlank : function(element) {
		element.length = 0;
		element.options.add(new Option( this.BLANK_SELECT, "" ));
		element.selectedIndex = 0;
	} ,

	//初始化下级以下菜单
	updateAllList : function(dataSrc, nLevel) {
		for(i = nLevel+1; i < this.MenuIdArr[this.dataSrc].length; i++) {
			childNode = $(this.MenuIdArr[this.dataSrc][i]);
			this.initBlank(childNode);
			childNode.disabled = true;
		}
	} ,

	//重新生成下级列表的值，初始化下级以下菜单
	initLinkage : function(dataSrc, sValue, nLevel) {

		this.ajax_effect = false;  //重新初始化

		if(this.need_ajax)
		{
			var parent_id_str = "";

			if($type(sValue) == "array")
			{

				//过滤已经请求过的记录
				for(var i=0,len=sValue.length; i< len; i++)
				{
					if(global_arr_response_record[sValue] == "undefined" || global_arr_response_record[sValue] == null)
					{
						parent_id_str +=  sValue[i] + ",";
					}

				}
				parent_id_str = parent_id_str.replace(/^,+|,+$/g, '');
			}
			else
			{
				if(global_arr_response_record[sValue] == "undefined" || global_arr_response_record[sValue] == null)
				{
					parent_id_str = sValue;
				}
			}

			//减少最后一级无用的请求
			if(nLevel == this.select_count) parent_id_str = "";
			
			if(parent_id_str !== "")
			{
				var url = this.request_url + "?parent_id=" + parent_id_str + "&" + Math.random()*10;
				
				this.myAjax = new Request(
				{
					'url':url,
					'encoding' : this.encoding,					
					'method' : 'get',
					'data' : '',
					'evalScripts': true,
					'onComplete' : this.set_children_list_select_data.bind(this, [dataSrc, sValue, nLevel])
				}).send();
				
				if(this.debug)
				{
					$("debug_content").innerHTML += "请求地址：" + url + "<br  />";
				}

			}
			else
			{
				this.set_children_list_select_data(dataSrc, sValue, nLevel);
			}
		}
		else
		{
			this.set_children_list_select_data(dataSrc, sValue, nLevel);
		}
	} ,

	
	set_children_list_select_data : function(dataSrc, sValue, nLevel)
	{
		if($type(sValue) == "array")
		{
			for(var i=0,len=sValue.length; i< len; i++)
			{
				this.set_children_select_data(dataSrc, sValue[i], i+1);
			}
		}
		else
		{
			this.set_children_select_data(dataSrc, sValue, nLevel);
		}
	} ,

	set_children_select_data : function(dataSrc, sValue, nLevel)
	{
		if(this.need_ajax)
		{
			this.AllMenuArr[dataSrc][nLevel] = global_arr_response_record[sValue];
		}
		
		nLevel = Number(nLevel);

		if (nLevel > this.MenuIdArr[this.dataSrc].length || nLevel < 1) {
			return;
		}
		
		if (nLevel == 1) {
			if ( $(this.MenuIdArr[this.dataSrc][0]) == '') {
				return ;	
			}
		}

		currNode = $(this.MenuIdArr[this.dataSrc][nLevel-1]);
		childNode = $(this.MenuIdArr[this.dataSrc][nLevel]);

		if ( currNode.disabled ) {
			return;
		}

		for (i=0; i<currNode.options.length; i++) {
			if  (currNode.options[i].value  ==  sValue) {
				currNode.selectedIndex = i;
				break;
			}
		}

		

		if (childNode != null) {

			currArr = this.AllMenuArr[dataSrc][nLevel];

			if(! currArr)
			{
				currArr = new Array;
			}

			this.initBlank(childNode);
			for(i=0; i<currArr.length; i++) {
				if  (currArr[i].parentValue  ==  sValue) {
					childNode.options.add(new Option(currArr[i].Desc, currArr[i].Value));
				}
			}

			if ((sValue != '') && (childNode.options.length > 1)) {
				childNode.disabled = false;
				
			} else {
				childNode.disabled = true;
			}
		}

		this.ajax_effect = true;  //说明已经成功返回请求数据
		//this.delay_handdle = false ,

		this.updateAllList(dataSrc, nLevel);

		if(this.debug)
		{
			$("debug_content").innerHTML += "处理值：" + sValue + ", 级别：" + nLevel + ", 当前选项数："+ currArr.length +"<br  />";
		}
	} ,

	init_first_select : function()
	{
		if(this.need_ajax)
		{
			if(global_arr_response_record[0] == "undefined" || global_arr_response_record[0] == null)
			{
				var url = this.request_url + "?parent_id=0&" + Math.random()*10;
				
				this.myAjax = new Request(
				{
					'url':url,
					'encoding' : this.encoding,					
					'method' : 'get',
					'data' : '',
					'evalScripts': true,
					'onComplete' : this.set_first_select_data.bind(this)
				}).send();
				
				if(this.debug)
				{
					$("debug_content").innerHTML += "请求地址：" + url + "<br  />";
				}
			}
			else
			{
				this.set_first_select_data();
			}
		}
		else
		{
			this.set_first_select_data();
		}
	} ,
	
	set_first_select_data : function()
	{
		if(this.need_ajax)
		{
			this.AllMenuArr[this.dataSrc][0] = global_arr_response_record[0];
		}

		//alert(this.myAjax.response.text);
		//初始化第一个列表
		firstNode = $(this.MenuIdArr[this.dataSrc][0]);
		
		this.initBlank(firstNode);

		for (i=0, len=this.AllMenuArr[this.dataSrc][0].length; i<len; i++) {
			firstNode.options.add(new Option(this.AllMenuArr[this.dataSrc][0][i].Desc, this.AllMenuArr[this.dataSrc][0][i].Value));
		}

		//alert(this.AllMenuArr[this.dataSrc][0][0].Desc);
		//初始化其它列表
		this.updateAllList(this.dataSrc, 0);
	} ,

	changeLinkage : function(element) {		
		this.initLinkage($GA(element , "USEDATA"), element.value, $GA(element , "SUBCLASS"));
	} ,

	setDataSrc : function(dataSrc) {
		this.dataSrc = dataSrc;
	} ,

	//初始化，加载数据，生成第一组下拉列表，初始化其它下拉列表
	init : function() {

		//初始化总数据数组
		for (i=0; i<this.MenuInfoArr.length; i++) {
			if (this.AllMenuArr[this.dataSrc] == null) {
				this.AllMenuArr[this.dataSrc] = new Array();
			}
			this.AllMenuArr[this.dataSrc].push(this.MenuInfoArr[i]);
		}

		var select_index = 0;
		//初始化应用元素数组
		var selectNodes = document.getElementsByTagName("select");
		for (i=0; i<selectNodes.length; i++) {
			if ($GA(selectNodes[i] , "USEDATA") == this.dataSrc) {

				this.select_count++;

				if (this.MenuIdArr[this.dataSrc] == null) {
					this.MenuIdArr[this.dataSrc] = new Array();
				}
				var subClass = Number($GA(selectNodes[i] , "SUBCLASS")) - 1;
				this.MenuIdArr[this.dataSrc][subClass] = $GA(selectNodes[i] , "id");

				//selectNodes[i].onchange = this.changeLinkage.bind(this,selectNodes[i]);
				if(selectNodes[i].addEventListener)
					selectNodes[i].addEventListener("change", this.changeLinkage.bind(this,selectNodes[i]), false) ;
				else if(selectNodes[i].attachEvent)
					selectNodes[i].attachEvent("onchange", this.changeLinkage.bind(this,selectNodes[i])) ;


				//是否时行宽度限制
				if(this.select_width > 0)
				{
					selectNodes[i].style.width = this.select_width + "px";
				}

				//记录下拉菜单对象
				this.ArraySelectObj[select_index] = selectNodes[i];

				select_index++;
			}
		}

		if(this.debug)
		{
			var ce = document.createElement("div");
			ce.style.margin = "10px";
			ce.setAttribute("id", "debug_content");
			//document.body.insertBefore(ce);   //firefox 不支持
			//document.body.appendChild(ce);
			document.body.insertBefore(ce,document.body.childNodes[0]);
		}

		this.init_first_select();

	}
});

//得到当前Element的属性值
function $GA(ele, attr) {
	return ele.getAttribute(attr);
}

/**
 * 地区联动，初始化函数
 * param int    city_id		  第一个下拉菜单的默认初始值
 * param int    area_id		  第二个下拉菜单的默认初始值
 * param int    site_id		  第三个下拉菜单的默认初始值
 * param string dataSrc		  下拉菜单 USEDATA 属性值
 * param array  dataArr       数据数组
 * param string blank_select  初始化SELECT列表时的默认值
 **/
function show_locate_select_v2(arr_init_id, dataSrc, dataArr, blank_select, request_url, select_width, debug)
{
	locate_dataSrc = typeof(dataSrc) == "undefined" || dataSrc == "" ? "locate_dataSrc" : dataSrc;

	request_url    = typeof(request_url) == "undefined" || request_url == "" ? "request.php" : request_url;


	select_width    = typeof(select_width) == "undefined" || select_width == "" ? "" : select_width;

	
	if(typeof(dataArr) == "undefined" || dataArr == "")
	{
		dataArr = new Array;
		var need_ajax = true;
	}
	else
	{
		dataArr = dataArr;
		var need_ajax = false;
	}
	
	blank_select   = typeof(blank_select) == "undefined" || blank_select == ""  ? "请选择" : blank_select;

	debug          = typeof(debug) == "undefined" || debug == ""  ? false : debug;

	var linkage_locate = new Linkage_v2(locate_dataSrc, dataArr);
	linkage_locate.BLANK_SELECT = blank_select;
	linkage_locate.debug = debug;  //调试参数设置

	linkage_locate.need_ajax = need_ajax;

	linkage_locate.request_url = request_url;

	if(select_width > 0)
	{
		linkage_locate.select_width = select_width;
	}

	linkage_locate.init();
	//初始化数据
	if(arr_init_id !== 0)
	{
	linkage_locate.initLinkage(locate_dataSrc,arr_init_id);
	}

	return linkage_locate;
}