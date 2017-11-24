function show_fresh_info(site, is_index, page)
{
	if ( !page ) page = 0;
	
	$('fresh_loding').style.visibility='visible';
	var data_pars = 'site=' + site + '&is_index=' + is_index + '&p=' + page + '&_t_=' + timestamp();
	new Request.JSON({
		url:'http://' + document.domain + '/module_common/fresh/poco_fresh.js.php',
		method:'post',
		data:data_pars,
		onComplete:function(data){
			try{
				if ( $('J_poco_fresh_content') && data.content && data.no_new==0 )
				{
					$('J_poco_fresh_content').innerHTML = data.content;
					$('fresh_loding').style.visibility='hidden';
					if ( typeof(parent.ads_crazy_ad_obj)!='object' && typeof(parent.pop_media_obj)!='object' )
					{
						parent.show_poco_fresh_pop_frame();
					}
				}
			}catch(e){}
		}
	}).send();
}

function close_fresh_box()
{
	try{
		writeCookie('cok_poco_fresh_box', '1', 24, '.poco.cn', '/');
		parent.close_poco_fresh_pop_frame(1);
	}catch(e){}
}