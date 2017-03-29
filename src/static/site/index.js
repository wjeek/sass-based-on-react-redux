$(function(){

    $('#saas-entry').fullpage({

        slidesNavigation : true ,
        slidesNavPosition : 'bottom' ,
        loopHorizontal : true ,
        css3 : true ,
        keyboardScrolling : true ,

        scrollingSpeed : 1000 ,
        easing: 'easeInOutCubic' ,
        easingcss3 : 'cubic-bezier(0.86,0,0.07,1)' ,
        //触发滚动,index是离开的页面值
        onLeave : function (index,nexIndex,direction) {

        },
        afterRender : function () {

        }


    }) ;

});