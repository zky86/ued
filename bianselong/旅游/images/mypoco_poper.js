/**
 * POCO������
 *
 * @author Franky
 */

var poco_poper = new Class({

	//��ʼ����
	initialize : function(options)
	{
		options = $pick( options , {} );

		//����ע��
		this.options = $merge({
			url		:	$pick( options.url,'http://my.poco.cn/space/mypoco_show_text_box.php' ), //����Դ
			width	:	$pick( options.width ,'auto' ), //�����
			height	:	$pick( options.height ,'auto'),	//�����
			index	:	$pick( options.index,Math.pow( 10,8 ) ), //����Ĳ���
			float	:	$pick( options.float,'right' ), //������ʾ����[��,��]
			use_ajax:	$pick( options.use_ajax,false ), //�Ƿ�ʹ��ajaxȡ����Դ,Ĭ�Ϲ�
			id		:	$pick( options.id,'$'+$random(0,$time())+'$' ),	//�����id
			margin	:	$pick( options.margin,1 ), //����ı�Ե���
			closer	:	$pick( options.closer,false ), //���ùر�
			life	:	$pick( options.life,1 ), //cookie���������� 1��
			cookie  :   $pick( options.cookie,'__POCO_POPER__' ), //cookie������
			time	:	$pick( options.time,0 ), //�������ʾʱ��,0Ϊ������
			isCookie :	$pick( options.isCookie,1 ),
			content :	$pick( options.content,false ),
			b_closer : false,
			b_after_onload : true
		}, options);
		
		//���ݷ���������λ��
		this.options.width  = this.options.width == 'auto' ? 'auto' : this.options.width.toInt()+'px';
		this.options.height = this.options.width == 'auto' ? 'auto' : this.options.height.toInt()+'px';

		this.poper_job(this);
	},

	//���ɴ���
	make_poper : function()
	{
		var poper = document.createElement("div");
		poper.id = this.options.id;
		
		//��ȥbody����relative
		document.body.appendChild(poper);
		this.set_content(this.options.id);

		var pop_css_text;

		//CSS
		pop_css_text = 'padding:0px;margin:'+this.options.margin.toInt()+'px;overflow:hidden;'+(this.options.float=='left'?'left':'right')+':0;bottom:0';
		pop_css_text+= ';z-index:'+this.options.index.toInt();
		pop_css_text+= ';width:'+this.options.width+";height:"+this.options.height;

		//Ư��
		if (navigator.appVersion.test(/MSIE [0-6]\./))
		{
			pop_css_text+= ";position:absolute;margin-top:expression(document.documentElement.clientHeight-this.style.pixelHeight+document.documentElement.scrollTop);";
		}
		else
		{
			pop_css_text+= ";position:fixed;";
		}

		$(this.options.id).style.cssText = pop_css_text;
		
		//����
		if( this.options.time.toInt() > 0 )
		{
			var this_obj = this;
			this.options.poper_timer = setInterval(function(){

				if( this_obj.options.time < 1 )
				{
					$clear(this_obj.options.poper_timer);
					this_obj.remove_poper();
					return true;
				}
				this_obj.options.time--;

			},1000);
		}
	},
	
	//���ùر�
	set_closer : function(obj)
	{
		//��ť
		var closer = '';
		if(this.options.b_closer !== true)
		{
		  closer = '<div style="position:absolute;height:25px;line-height:25px;width:'+this.options.width+';font-size:12px;z-index:'+(this.options.index.toInt()+1)+';"><font style="cursor:pointer;float:right;margin-right:5px;" id='+this.options.id+'closer'+'><img src="http://www.poco.cn/images/exit.gif" border=0 align="absbottom" /></font></div>';
		}
		
		//�ڲ�
		var cover = '<iframe  style="position:absolute; visibility:inherit;width:'+this.options.width+'px;height:'+this.options.height+'px; z-index:-1;filter:Alpha(Opacity=0); opacity:0.0; MozOpacity:0.0; KhtmlOpacity:0.0;left:0px;top:0px;"></iframe>';

		$(obj).innerHTML= '<div style="position:relative;padding:0px;margin:0px;">'+closer+cover+$(obj).innerHTML+'</div>';
		var poper_id = this.options.id;
		if(this.options.b_closer !== true)
		{
		  //�¼�
		  $(this.options.id+'closer').addEvents({
				  'click' : function(){
					  $(poper_id).setStyle('display','none');
				  }
			  });
		}
		//�϶�
		//new Drag.Move($(this.options.id),{ handle:$(this.options.id+'closer') });
	},
	
	//��������
	set_content : function(obj)
	{
		if( this.options.content )
		{
			$(obj).innerHTML = this.options.content;
		}
		else
		{
			if( this.options.use_ajax )
			{
				//async:false �첽 �������XMLHTTP����ಢ��ʱ����������ignore�����
				this.ajax_request(this.options.url, { method:'get',evalScripts:false,evalResponse:false,data:$time(),update:obj,async:false });
			}
			else

			{
				$(obj).innerHTML = "<iframe src='"+this.options.url+"' scrolling=no frameborder=0 width="+this.options.width+" height="+this.options.height+"  allowTransparency=true marginHeight=0 marginWidth=0 hspace=0 vspace=0></iframe>";
			}	
		}
		this.set_closer(obj);

	},
	
	//�������
	remove_poper : function()
	{
		$(this.options.id).setStyle('display','none');
		//$(this.options.id).remove();
		return true;
	},
	
	//ִ�п���
	poper_job : function(obj)
	{
		//�ж���cookie
		if( ! Cookie.read( this.options.cookie ) || this.options.isCookie!=1 )
		{
			if(this.options.b_after_onload)
			{
				window.addEvent('load',function(){
					obj.make_poper();
				});
			}
			else
			{
				obj.make_poper();
			}

			//�ǵ�cookie
			Cookie.write( this.options.cookie , 1 , { duration: this.options.life.toInt() } ); 
		}
	}
});