// JavaScript Document
(function($) {
    var isAction = true;
    var width = 0;
    var thewidth = 0;
    var CurrTime = 0;
    var t;
    var addHour = 0,
        addMinute = 0,
        addSecond = 0,
        TheHour = 0,
        TheMinute = 0,
        TheSecond = 0;
    var flag = 0;
    var alltime = 0;
    var addwidth = 0;
    var offsetW = 0;
    var times = 0;
    var rwidth = 0;
    jQuery.playBar = {
        addBar: function(DOM, allTime) {
            CleanAll();
            alltime = allTime;
            DOM.empty();
            DOM.append("<div class='bar-control'><div class='bar-begin-time'>00:00</div></div>");
            $(".bar-control").append('<div class="the-bar"><div class="time-ball"></div><div class="the-color-bar"></div></div><div class="bar-finish-time">10:35</div>');
            width = $('.the-bar').width();
            times = allTime / 1000;
            rwidth = width - 8;
            addwidth = (width - 10) / times;
            var t = TransitionTime(allTime);
            $('.bar-finish-time').html(t.StringTime);
        },
        restTime: function(allTime) {
            CleanAll();
            StopBar();
            alltime = allTime;
            width = $('.the-bar').width();
            times = allTime / 1000;
            rwidth = width - 8;
            addwidth = (width - 10) / times;
            var t = TransitionTime(allTime);
            $('.bar-finish-time').html(t.StringTime);
            $('.the-color-bar').css("width", 0);
            $('.time-ball').css("left", 0);
        },
        Stop: function() {
            StopBar()
        },
        Begin: function() {
            isAction = true;
            return this;
        },
        Run: function () {
          changeBar();
        },
        changeBarColor: function(COLOR) {
            var color = typeof(COLOR) != "undefined" ? COLOR : '#4989fc';
            $('.the-color-bar').css("background", color);
            $('.time-ball').css("background", color)
        },
        changeFontColor: function(COLOR) {
            var color = typeof(COLOR) != "undefined" ? COLOR : '#4989fc';
            $('.bar-begin-time,.bar-finish-time').css("color", color)
        },
        getTheTime: function() {
            return CurrTime
        },
        mouseDownBall: function () {
            lastX = event.clientX;
            event.preventDefault();
            down = true;
            BarMove = true;
            if (isAction) {
                StopBar()
            }
        },
        mouseMoveBall: function (event) {
            event.preventDefault();
            NewX = event.clientX;
            if (BarMove) {
                var mcs = NewX - lastX;
                lastX = NewX;
                if (mcs < 0) {
                    if (thewidth - (-mcs) > 0) {
                        thewidth = thewidth - (-mcs)
                    }
                } else {
                    if (thewidth + mcs < rwidth) {
                        thewidth = thewidth + mcs
                    } else {
                        thewidth = rwidth
                    }
                }
                timechange();
                $('.the-color-bar').css("width", thewidth + 1);
                $('.time-ball').css("left", thewidth)
            }
            return CurrTime;
        },
        mouseUpBall: function () {
            if (BarMove) {
                BarMove = false;
                down = false;
                NewX = 0;
                var xo = parseInt(CurrTime / 1000);
                offsetW = thewidth - xo * addwidth;
                if (isAction) {
                    OpenBar()
                }
            }
        }
    };

    function CleanAll() {
        isAction = true;
        thewidth = 0;
        CurrTime = 0;
        addHour = 0;
        addMinute = 0;
        addSecond = 0;
        TheHour = 0;
        TheMinute = 0;
        TheSecond = 0;
        offsetW = 0;
        thewidth = 0;
        flag = 0
    }
    var down = false;
    var BarMove = false;
    var lastX = 0,
        NewX = 0;




    function timechange() {
        CurrTime = parseInt(thewidth / rwidth * alltime);
        var ltx = TransitionTime(CurrTime);
        if (TheHour > 0) {
            if (ltx.hHour) {
                $('.bar-begin-time').html(ltx.StringTime)
            } else {
                $('.bar-begin-time').html("00:" + ltx.StringTime)
            }
        } else {
            $('.bar-begin-time').html(ltx.StringTime)
        }
        addSecond = ltx.Tsec;
        addMinute = ltx.Tmin;
        addHour = ltx.Thour
    }

    function changeBar() {
        var second, minute, hour;
        thewidth = thewidth * 1 + addwidth - offsetW;
        if (offsetW > 0) {
            offsetW = 0
        }
        if (thewidth < rwidth && CurrTime < alltime) {
            CurrTime = CurrTime + 1 * 1000;
            addSecond = addSecond + 1;
            if (addSecond > 59) {
                addSecond = 0;
                addMinute = addMinute + 1;
                if (addMinute > 59) {
                    addMinute = 0;
                    addHour = addHour + 1
                }
            }
            if (addSecond > 9) {
                second = "" + addSecond
            } else {
                second = "0" + addSecond
            } if (addMinute > 9) {
                minute = "" + addMinute
            } else {
                minute = "0" + addMinute
            } if (addHour > 9) {
                hour = "" + addHour
            } else {
                hour = "0" + addHour
            } if (addHour > 0) {
                flag = 1
            }
            if (flag == 0) {
                $('.bar-begin-time').html(minute + ":" + second)
            } else {
                $('.bar-begin-time').html(hour + ":" + minute + ":" + second)
            }
        } else {
            thewidth = rwidth;
            //StopBar()
        }
        $('.the-color-bar').css("width", thewidth + 1);
        $('.time-ball').css("left", thewidth)
    }

    function TransitionTime(str) {
        var m = parseFloat(str) / 1000;
        var time = "";
        var second, minute, hour;
        var haveHour = false;
        var ch = 0,
            csx = 0,
            cm = 0;
        if (m >= 60 && m < 60 * 60) {
            if (parseInt(m / 60.0) < 10) {
                minute = "0" + parseInt(m / 60.0)
            } else {
                minute = parseInt(m / 60.0)
            }
            var cs = parseInt(m - parseInt(m / 60.0) * 60);
            if (cs < 10) {
                second = "0" + cs
            } else {
                second = "" + cs
            }
            TheMinute = parseInt(m / 60.0);
            TheSecond = cs;
            cm = TheMinute;
            TheHour = 0;
            csx = cs;
            time = minute + ":" + second;
            $('.bar-begin-time').html("00:00")
        } else if (m >= 60 * 60) {
            flag = 1;
            haveHour = true;
            ch = parseInt(m / 3600.0);
            cm = parseInt((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60);
            csx = parseInt((parseFloat((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60) - parseInt((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60)) * 60);
            if (ch < 10) {
                hour = "0" + ch
            } else {
                hour = "" + ch
            } if (cm < 10) {
                minute = "0" + cm
            } else {
                minute = "" + cm
            } if (csx < 10) {
                second = "0" + csx
            } else {
                second = "" + csx
            }
            TheHour = ch;
            TheMinute = cm;
            TheSecond = csx;
            time = hour + ":" + minute + ":" + second;
            $('.bar-begin-time').html("00:00:00")
        } else {
            $('.bar-begin-time').html("00:00");
            csx = parseInt(m);
            if (parseInt(m) > 9) {
                second = "" + parseInt(m)
            } else {
                second = "0" + parseInt(m)
            }
            TheMinute = 0;
            TheSecond = parseInt(m);
            TheHour = 0;
            time = "00:" + second
        }
        var tt = {
            hHour: haveHour,
            Thour: ch,
            Tmin: cm,
            Tsec: csx,
            StringTime: time
        };
        return tt
    }

    function StopBar() {
        if (!down) {
            isAction = false
        }
        //clearInterval(t)
    }

    function OpenBar() {
        isAction = true;
        //t = setInterval(changeBar, 100 / Math.pow(2,step))
    }

})(jQuery);