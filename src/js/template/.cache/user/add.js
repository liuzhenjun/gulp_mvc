/*TMODJS:{"version":2,"md5":"122bd127e202c4ca04429189b3dae82f"}*/
template('user/add',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,xname=$data.xname,$out='';$out+='<p> ';
$out+=$escape(xname);
$out+=' </p>';
return new String($out);
});