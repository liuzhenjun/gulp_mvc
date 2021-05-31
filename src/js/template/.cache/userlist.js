/*TMODJS:{"version":3,"md5":"bc484e0b40fda72c45009d3b5bad02b1"}*/
template('userlist',function($data,$filename
) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,data=$data.data,val=$data.val,index=$data.index,$escape=$utils.$escape,total=$data.total,$out='';$each(data,function(val,index){
$out+=' <p> ';
$out+=$escape(val.id);
$out+=' - ';
$out+=$escape(val.course_name);
$out+=' </p> ';
});
$out+=' <hr > <p> ';
$out+=$escape(total);
$out+=' </p> ';
return new String($out);
});