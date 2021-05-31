/*TMODJS:{"version":3,"md5":"a3ef4dd6e2ef88ac0c0ced9676e14003"}*/
template('product/info',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,val=$data.val,index=$data.index,$out='';$out+='<h3>';
$out+=$escape(title);
$out+='</h3> ';
$each(list,function(val,index){
$out+=' <p>';
$out+=$escape(val);
$out+=' - ';
$out+=$escape(index);
$out+='</p> ';
});
$out+=' ';
return new String($out);
});