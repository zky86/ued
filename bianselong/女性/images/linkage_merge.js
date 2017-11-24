/*
 * ���޼�JavaScript�����˵�
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
 * 		����� (zhangyanan2008@gmail.com)
 *
 * Thanks To:
 *		HopeSoftStudio (http://www.10090.com)
 *
 * Online Demo & Download:
 *		http://www.wofeila.com/test/menu/menu.htm
 *		http://www.wofeila.com/test/menu/menu.rar
 * edit by hanson
 * �������Ҫ mootools ��֧��
 * ���� POCO ������ �� post ���󷵻� HTTP Error 411 - Length required ���󣬹ʸ�Ϊ get ����
 */


///var Linkage_v2 = Class.create();
//Linkage_v2.prototype = {

var global_arr_response_record = new Array();    //��¼���󷵻ص�����

var Linkage_v2 = new Class({
	initialize : function(dataSrc, MenuInfoArr) {
		this.dataSrc = dataSrc;
		this.AllMenuArr[dataSrc] = new Array();
		this.MenuInfoArr = MenuInfoArr;
	},

	//�Ƿ���AJAX����
	need_ajax : false ,

	//�ж������Ƿ��Ѿ��ɹ�����, ֻҪ��Ϊ�� pupu_select_list �࣬����δ���ؾ��Զ��رյ�����
	ajax_effect : false ,

	//�����ַ
	request_url : "request.php" ,

	//�Ƿ��ӳ�ִ�д���
	//delay_handdle : false ,
	
	//������ajax����
	myAjax : null ,

	dataSrc : "" ,

	debug : false ,
		
	//�������
	encoding : "GB2312" ,

	//��¼�����˵��ĸ��������ڼ������һ��������
	select_count : 0 ,

	//�����˵�ͳһ�������
	select_width : "" ,

	//�����������˵������¼
	ArraySelectObj : new Array() ,

	//��ʼ��SELECT�б�ʱ��Ĭ��ֵ
	BLANK_SELECT : "��ѡ��" ,

	//��ά���� �ܵ���������
	AllMenuArr : new Array() ,

	//��ά���� Ӧ�õı�(SELECT)Ԫ������
	MenuIdArr : new Array() ,

	//����֧���ݼ���
	MenuInfoArr : new Array() ,


	//��ʼ���յ�SELECT
	initBlank : function(element) {
		element.length = 0;
		element.options.add(new Option( this.BLANK_SELECT, "" ));
		element.selectedIndex = 0;
	} ,

	//��ʼ���¼����²˵�
	updateAllList : function(dataSrc, nLevel) {
		for(i = nLevel+1; i < this.MenuIdArr[this.dataSrc].length; i++) {
			childNode = $(this.MenuIdArr[this.dataSrc][i]);
			this.initBlank(childNode);
			childNode.disabled = true;
		}
	} ,

	//���������¼��б��ֵ����ʼ���¼����²˵�
	initLinkage : function(dataSrc, sValue, nLevel) {

		this.ajax_effect = false;  //���³�ʼ��

		if(this.need_ajax)
		{
			var parent_id_str = "";

			if($type(sValue) == "array")
			{

				//�����Ѿ�������ļ�¼
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

			//�������һ�����õ�����
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
					$("debug_content").innerHTML += "�����ַ��" + url + "<br  />";
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

		this.ajax_effect = true;  //˵���Ѿ��ɹ�������������
		//this.delay_handdle = false ,

		this.updateAllList(dataSrc, nLevel);

		if(this.debug)
		{
			$("debug_content").innerHTML += "����ֵ��" + sValue + ", ����" + nLevel + ", ��ǰѡ������"+ currArr.length +"<br  />";
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
					$("debug_content").innerHTML += "�����ַ��" + url + "<br  />";
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
		//��ʼ����һ���б�
		firstNode = $(this.MenuIdArr[this.dataSrc][0]);
		
		this.initBlank(firstNode);

		for (i=0, len=this.AllMenuArr[this.dataSrc][0].length; i<len; i++) {
			firstNode.options.add(new Option(this.AllMenuArr[this.dataSrc][0][i].Desc, this.AllMenuArr[this.dataSrc][0][i].Value));
		}

		//alert(this.AllMenuArr[this.dataSrc][0][0].Desc);
		//��ʼ�������б�
		this.updateAllList(this.dataSrc, 0);
	} ,

	changeLinkage : function(element) {		
		this.initLinkage($GA(element , "USEDATA"), element.value, $GA(element , "SUBCLASS"));
	} ,

	setDataSrc : function(dataSrc) {
		this.dataSrc = dataSrc;
	} ,

	//��ʼ�����������ݣ����ɵ�һ�������б���ʼ�����������б�
	init : function() {

		//��ʼ������������
		for (i=0; i<this.MenuInfoArr.length; i++) {
			if (this.AllMenuArr[this.dataSrc] == null) {
				this.AllMenuArr[this.dataSrc] = new Array();
			}
			this.AllMenuArr[this.dataSrc].push(this.MenuInfoArr[i]);
		}

		var select_index = 0;
		//��ʼ��Ӧ��Ԫ������
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


				//�Ƿ�ʱ�п������
				if(this.select_width > 0)
				{
					selectNodes[i].style.width = this.select_width + "px";
				}

				//��¼�����˵�����
				this.ArraySelectObj[select_index] = selectNodes[i];

				select_index++;
			}
		}

		if(this.debug)
		{
			var ce = document.createElement("div");
			ce.style.margin = "10px";
			ce.setAttribute("id", "debug_content");
			//document.body.insertBefore(ce);   //firefox ��֧��
			//document.body.appendChild(ce);
			document.body.insertBefore(ce,document.body.childNodes[0]);
		}

		this.init_first_select();

	}
});

//�õ���ǰElement������ֵ
function $GA(ele, attr) {
	return ele.getAttribute(attr);
}

/**
 * ������������ʼ������
 * param int    city_id		  ��һ�������˵���Ĭ�ϳ�ʼֵ
 * param int    area_id		  �ڶ��������˵���Ĭ�ϳ�ʼֵ
 * param int    site_id		  �����������˵���Ĭ�ϳ�ʼֵ
 * param string dataSrc		  �����˵� USEDATA ����ֵ
 * param array  dataArr       ��������
 * param string blank_select  ��ʼ��SELECT�б�ʱ��Ĭ��ֵ
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
	
	blank_select   = typeof(blank_select) == "undefined" || blank_select == ""  ? "��ѡ��" : blank_select;

	debug          = typeof(debug) == "undefined" || debug == ""  ? false : debug;

	var linkage_locate = new Linkage_v2(locate_dataSrc, dataArr);
	linkage_locate.BLANK_SELECT = blank_select;
	linkage_locate.debug = debug;  //���Բ�������

	linkage_locate.need_ajax = need_ajax;

	linkage_locate.request_url = request_url;

	if(select_width > 0)
	{
		linkage_locate.select_width = select_width;
	}

	linkage_locate.init();
	//��ʼ������
	if(arr_init_id !== 0)
	{
	linkage_locate.initLinkage(locate_dataSrc,arr_init_id);
	}

	return linkage_locate;
}