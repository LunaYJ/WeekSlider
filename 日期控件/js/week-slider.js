var curDate, curDay, curYear, curMonth, curFullDate, calendarAry,clickTimes;
var dayArrya = new Array('日','一','二','三','四','五','六');
$(function(){
    $( "#openCalendarBtn" ).datepicker(
        {
            showOn: "button",
            buttonImage: "images/icon-date.png",
            buttonImageOnly: true
        }
    );
    $(".weekList a").live('click', function(){
        $(".weekList a").removeClass('selected');
        $(this).addClass('selected');
    });
    $(".dateSelectIcon .ui-datepicker-trigger").hover(function(){
        $(this).attr('src','images/icon-date-hover.png');
    }, function(){
        $(this).attr('src','images/icon-date.png');
    });
    $('#openCalendarBtn').change(function(){
        var d = $(this).val();
        calendarAry = d.split('-');
        init(calendarAry)
    });
    clickTimes = 0;
    init();
})
function init(ca){
    curFullDate = new Date();
    if(ca){
        curFullDate.setFullYear(ca[0]);
        curFullDate.setMonth(ca[1]-1);
        curFullDate.setDate(ca[2]);
    }else {
        document.getElementById('hiddenYear').value = curFullDate.getFullYear();
        document.getElementById('hiddenMonth').value = curFullDate.getMonth();
        document.getElementById('hiddenDate').value = curFullDate.getDate();
    };
    curDay = curFullDate.getDay();
    curMonth = curFullDate.getMonth();
    curYear = curFullDate.getFullYear();
    curDate = curFullDate.getDate();
    createDate('',ca);
}
function appendFirstDate(curFullDate,num){
    var reDate = curFullDate;
    var ope = '+';
    if(num < 0){
        ope = '-';
    };
    for (var i=0;i<Math.abs(num);i++){
        reDate = getDt(reDate,ope);
    };
    return reDate;
}
function getDt(dt,ope){
    var num = 0;
    if(ope == '+'){
        num = 1;
    }else if (ope == '-'){
        num = -1;
    };
    var y = dt.getFullYear();
    var m = dt.getMonth();
    var D = dt.getDate();
    var d = dt.getDay();
    D += num;
    if(D < 1){
        m--;
        if(m<0){
            y--;
            m = 11;
        }
        D = getLastDay(y,m);
    }else if(D > getLastDay(y,m)){
        m++;
        if(m>11){
            y++;
            m = 0;
        }
        D = 1;
    };
    var reDate = new Date();
    reDate.setYear(y);
    reDate.setMonth(m);
    reDate.setDate(D);
    return reDate;
}
function createDate (num,ca) {
    var firstDay;
    if(curDay == 0){
        firstDay = appendFirstDate(curFullDate, -6);
    }else{
        firstDay = appendFirstDate(curFullDate,(1 - curDay));
    };
    var html = '<ul id="newul">';
    for(var i=0;i<7;i++) {
        var numDay = firstDay.getDay();
        html += "<li><a href='javascript:;'><span class='dateArea'>" + (firstDay.getMonth() + 1) + "月" + firstDay.getDate() + "日</span><br /><span class='dayArea'>星期" + dayArrya[numDay] + "</span></a></li>";
        firstDay = appendFirstDate(firstDay,1);  //下一天
    };
    html += '</ul>';
    if($('#dateSelect ul').length !== 0) {
        $('.weekList ul').removeAttr('id').addClass('toRemove');
    }else{
        $('.weekList').append(html);
    };
    showDate(num,ca,html);
}
function showDate (num,ca,html){
    var T;
    clearTimeout(T);
    if (ca) {
        var hiddenYear = parseInt(document.getElementById('hiddenYear').value);
        var hiddenMonth = parseInt(document.getElementById('hiddenMonth').value) + 1;
        var hiddenDate = parseInt(document.getElementById('hiddenDate').value);
        if (ca[0] < hiddenYear || ca[0] == hiddenYear && ca[1] < hiddenMonth || ca[0] == hiddenYear && ca[1] == hiddenMonth && ca[2] < hiddenDate) {
            $("#dateSelect ul").before(html);
            var w = $('#newul').width();
            if($.browser.safari && navigator.userAgent.toLowerCase().match(/chrome/) == null){
                var wt = 'translate3d('+ -w +'px, 0px, 0px)';
                $('.weekList').css({'webkit-transform':wt,'-webkit-transition': '0s', 'transition': '0s'});
                T = setTimeout(function(){
                    $('.weekList').css({'-webkit-transition': '1s', 'transition': '1s','-webkit-transform': 'translate3d(0,0,0)'});
                    setTimeout(function(){
                        $('.weekList ul:first-child').siblings().remove();
                        $('.weekList ul').addClass('ul');
                    },1000)
                },50);
            }else {
                $('.weekList').css({left: -w});
                $('.weekList').animate({left: '0'}, 1000, function () {
                    $('ul:first-child', this).siblings().remove();
                    $('ul', this).addClass('ul');
                });
            };
        } else if (ca[0] > hiddenYear || ca[0] == hiddenYear && ca[1] > hiddenMonth || ca[0] == hiddenYear && ca[1] == hiddenMonth && ca[2] > hiddenDate) {
            $("#dateSelect ul").after(html);
            if($.browser.safari && navigator.userAgent.toLowerCase().match(/chrome/) == null){
                var w = $('#newul').width();
                var wt = 'translate3d('+ -w +'px, 0px, 0px)';
                $('.weekList').css({'-webkit-transition': '1s', 'transition': '1s','-webkit-transform':wt});
                T = setTimeout(function(){
                    $('.weekList').css({'-webkit-transition': '0s', 'transition': '0s','-webkit-transform':'translate3d(0,0,0)'});
                    $('.weekList ul:last-child').siblings().remove();
                    $('.weekList ul').addClass('ul');
                },1000);
            }else {
                $(".weekList").animate({left: '-812px'}, 1000, function () {
                    $('ul:last-child', this).siblings().remove();
                    $('.weekList').css('left', 0);
                    $('ul', this).addClass('ul');
                });
            };
        };
    };
    if (num) {
        clickTimes++;
        if (num < 0) {
            $(".weekList").prepend(html);
            if($.browser.safari && navigator.userAgent.toLowerCase().match(/chrome/) == null){
                var w = 812;
                var wt = 'translate('+ -w +'px, 0px)';
                $('.weekList').stop();
                $('.weekList').css({'webkit-transform':wt,'-webkit-transition': '0s', 'transition': '0s'});
                T = setTimeout(function(){
                    $('.weekList').css({'-webkit-transition': '1s', 'transition': '1s','-webkit-transform': 'translate(0,0)'});
                    setTimeout(function(){
                        $('.weekList ul:first-child').siblings().remove();
                        $('.weekList ul').addClass('ul');
                        clickTimes = 0;
                    },1000);
                },50);
            }else {
                var leftLength = -(812 * clickTimes)+'px';
                var w = $('#newul').width();
                $('.weekList').stop();
                $('.weekList').css({left: leftLength});
                $('.weekList').animate({left: '0'}, 1000, function () {
                    $('ul:first-child', this).siblings().remove();
                    $('ul', this).addClass('ul');
                    clickTimes = 0;
                });
            };
        } else {
            $(".weekList").append(html);
            if($.browser.safari && navigator.userAgent.toLowerCase().match(/chrome/) == null){
                var w = 812 * clickTimes;
                var wt = 'translate('+ -w +'px, 0px)';
                $('.weekList').css({'-webkit-transition': '1s', 'transition': '1s','-webkit-transform':wt});
                T = setTimeout(function(){
                    $('.weekList').css({'-webkit-transition': '0s', 'transition': '0s','-webkit-transform':'translate(0,0)'});
                    $('.weekList ul:last-child').siblings().remove();
                    $('.weekList ul').addClass('ul');
                    clickTimes = 0;
                },1000);
            }else {
                var leftLength = -(812 * clickTimes)+'px';
                $('.weekList').stop();
                $(".weekList").animate({left: leftLength},1000,function(){
                    $('.weekList ul:last-child').siblings().remove();
                    $('.weekList').css('left', 0);
                    $('.weekList ul').addClass('ul');
                    clickTimes = 0;
                });
            };
        };
    };
    document.getElementById('hiddenYear').value = curFullDate.getFullYear();
    document.getElementById('hiddenMonth').value = curFullDate.getMonth();
    document.getElementById('hiddenDate').value = curFullDate.getDate();

}
function addWeek(ope) {
    var num = 0;
    if(ope=="-") {
        num = -7;
    }else if(ope=="+") {
        num = 7;
    }
    curFullDate = appendFirstDate(curFullDate,num);
    createDate(num);
}

//是否为闰年
function isLeapYear(y) {
    var isLeap = false;
    if(y%4==0 && y%100!=0 || y%400==0) {
        isLeap = true;
    }
    return isLeap;
}
//每月最后一天
function getLastDay(y,m) {
    var lastDay = 28;
    m++;
    if(m==1 || m==3 || m==5 || m==7 || m==8 || m==10 || m==12) {
        lastDay = 31;
    }else if(m==4 || m==6 || m==9 || m==11) {
        lastDay = 30;
    }else if(isLeapYear(y)==true) {
        lastDay = 29;
    }
    return lastDay;
}