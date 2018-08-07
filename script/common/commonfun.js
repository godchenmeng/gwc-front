/**
 * @file 存放公共方法
 * @author CM 2017.07.23
 */

var commonfun = {
    /**
     * 根据系统要求变更时间格式
     *
     * @param {string} time UNIX时间戳
     * @return {string} 时间 格式：2016-08-19 19:18:15
     */
    getLocalTime: function (time) {
        time = time || Math.round(new Date().getTime()/1000);
        var d = new Date(parseInt(time) * 1000);
        var month = d.getMonth() + 1;
        var day =  d.getDate();
        var hour = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;
        return d.getFullYear() + '-' + month + '-' +  day + ' ' + hour + ':' + minute + ':' + second; 
    },
    /**
     * 获取当前日期
     *
     * @param {string} time UNIX时间戳 可选
     * @return {string} 时间 格式：2016-08-19
     */
    getCurrentDate: function (e) {
        e = e || new Date();
        var d = e;
        var month = d.getMonth() + 1;
        var day =  d.getDate();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        return d.getFullYear() + '-' + month + '-' +  day; 
    },
    /**
     * 获取当前日期，相应的时间点
     * 包括当前日期，当前日期的昨天，
     * 当前日期的当周（本周），当前日期的上周，
     * 当前日期的当月（本月），当前日期的上月
     * @param {string} type 获取类型
     * @param {string} time UNIX时间戳 可选
     * @return {string} 时间 格式：2016-08-19
     * or
     * @return {object} 时间段 格式：2016-08-19
     * 以周为例：{start_date:'2016-08-19',end_date:'2016-08-25'}
     */
    getCurrentTime: function (type,e) {
        e = e || new Date();
        var now = e; //当前日期
        var nowDayOfWeek = now.getDay(); //当周的第几天
        var nowDay = now.getDate(); //当前日
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var lastMonthDate = e; //上月日期
        lastMonthDate.setDate(1);
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        var lastYear = lastMonthDate.getYear();
        var lastMonth = lastMonthDate.getMonth();

        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return (year + "-" + month + "-" + day);
        }
        //获得某月的天数
        function getMonthDays(month) {
            var monthStartDate = new Date(nowYear, month, 1);
            var monthEndDate = new Date(nowYear, month + 1, 1);
            var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
            return days;
        }

        //获取昨天的日期
        function getYesterdayDate(){
            var yesterdayDate = new Date(nowYear, nowMonth, nowDay - 1);
            return formatDate(yesterdayDate);
        }
        //获得本周的开始日期
        function getWeekStartDate() {
            var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
            return formatDate(weekStartDate);
        }
        //获得本周的结束日期
        function getWeekEndDate() {
            var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek) + 1);
            return formatDate(weekEndDate);
        }
        //获得上周的开始日期
        function getLastWeekStartDate() {
            var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6);
            return formatDate(weekStartDate);
        }
        //获得上周的结束日期
        function getLastWeekEndDate() {
            var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
            return formatDate(weekEndDate);
        }
        //获得本月的开始日期
        function getMonthStartDate() {
            var monthStartDate = new Date(nowYear, nowMonth, 1);
            return formatDate(monthStartDate);
        }
        //获得本月的结束日期
        function getMonthEndDate() {
            var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
            return formatDate(monthEndDate);
        }
        //获得上月开始时间
        function getLastMonthStartDate() {
            var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
            return formatDate(lastMonthStartDate);
        }
        //获得上月结束时间
        function getLastMonthEndDate() {
            var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
            return formatDate(lastMonthEndDate);
        }

        switch(type){
            case "today":
                return formatDate(new Date());
            case "yesterday":
                return getYesterdayDate();
            case "thisWeek":
                var thisWeek = {};
                thisWeek.start_date = getWeekStartDate();
                thisWeek.end_date = getWeekEndDate();
                return thisWeek;
            case "lastWeek":
                var lastWeek = {};
                lastWeek.start_date = getLastWeekStartDate();
                lastWeek.end_date = getLastWeekEndDate();
                return lastWeek;
            case "thisMonth":
                var thisMonth = {};
                thisMonth.start_date = getMonthStartDate();
                thisMonth.end_date = getMonthEndDate();
                return thisMonth;
            case "lastMonth":
                var lastMonthTime = {};
                lastMonthTime.start_date = getLastMonthStartDate();
                lastMonthTime.end_date = getLastMonthEndDate();
                return lastMonthTime;
        }
    },
    /**
     * 获取日期的时间段数组
     *
     * 包括当前日期到一周前（listWeek,7天的数据），当前日期到当前月1号（listMonth）,日期段，
     *     开始日期到结束日期（listDate）
     *
     * @param {string} type 获取类型，类型为listDate
     * @param {string} e UNIX时间戳 可选
     * @param {string} s UNIX时间戳 可选
     * @return {Array} 时间段 格式：2016-08-19
     * 以周为例：["2017-06-24", "2017-06-25", "2017-06-26", "2017-06-27", "2017-06-28", "2017-06-29", "2017-06-30"]
     */
    getDateArray:function (type, e, s) {
        e = e || new Date();
        s = s || e;
        //格式化日期：yyyy-MM-dd
        function formatDate(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            return (year + "-" + month + "-" + day);
        }

        //获得一周的时间数组
        function getListWeek() {
            var listWeek = [];
            for(var i = 7; i>0 ;i--){
                var dayTemp = new Date(e.getTime() - (i-1)*24*60*60*1000);
                listWeek.push(formatDate(dayTemp));
            }
            return listWeek;
        }

        //获得当月1号到当前日期的月数组
        function getListMonth() {
            var listMonth = [];
            for(var i = e.getDate(); i>0 ;i--){
                var dayTemp = new Date(e.getTime() - (i-1)*24*3600*1000);
                listMonth.push(formatDate(dayTemp));
            }
            return listMonth;
        }

        function getListDate() {
            var listDate = [];
            var day = Math.floor((e.getTime()-s.getTime())/(24*3600*1000)) + 1;
            if(day == 0){
                listDate.push(formatDate(e));
                return listDate;
            }
            for(var i = day; i>0 ;i--){
                var dayTemp = new Date(e.getTime() - (i-1)*24*3600*1000);
                listDate.push(formatDate(dayTemp));
            }
            return listDate;
        }

        switch(type){
            case "listWeek":
                var listWeek = getListWeek();
                return listWeek;
            case "listMonth":
                var listMonth = getListMonth();
                return listMonth;
            case "listDate":
                var listDate = getListDate();
                return listDate;
            default:
                var listDate = getListDate();
                return listDate;
        }
    },
    /**
     * 从数组中移除指定项
     *
     * @param {array} 源数组
     * @param {string} 要移除的值
     * @return {array} 处理后的数组
     */
    removeFromArray: function (arr, val) {
        var index = $.inArray(val, arr);
        if (index >= 0) {
            arr.splice(index, 1);
        }
        return arr;
    },
    // 系统中常量
    constVar: {

    },
    /**
     * 从当前url取参数
     *
     * @param {string} 参数名
     * @return {string} 参数值
     */
    getQueryString: function(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) {
            return unescape(r[2]); 
        }
        return null; 
    },
    /**
     * 深度分解url参数?params={key1}:{val1},{key2}:{val2},{key3}:{val3}
     * @param params url参数
     * @param key 需要获取的键
     */
    getSplitParam:function (params,key) {
        let tmpRoot = params.split(",");
        for(let i = 0; i < tmpRoot.length; i++){
            let tmpChild = tmpRoot[i].split(":");
            if(tmpChild.length > 1 && tmpChild[0] == key){
                return tmpChild[1];
            }
        }
    },
    /**
     * 获取表单数据
     * @param {Object} $form  表单对象
     */
    getFormData: function($form) {
        var d = {};
        var t = $form.serializeArray();
        $.each(t, function() {
            d[this.name] = this.value;
        });
        return d;
    },
    /**
     * 返回当前设备运动方向描述，一共分为8种，45度一个
     *
     * @param {number} direction 方向数据
     * @return {string} 方向描述
     */
    getDirection: function(direction) {
        var directionDesc = '';
        direction = direction || 0;
        switch (Math.floor((direction) / 22.5)) {
            case 0:
            case 15:
                directionDesc = '正北';
                break;
            case 1:
            case 2:
                directionDesc = '东北';
                break;
            case 3:
            case 4:
                directionDesc = '正东';
                break;
            case 5:
            case 6:
                directionDesc = '东南';
                break;
            case 7:
            case 8:
                directionDesc = '正南';
                break;
            case 9:
            case 10:
                directionDesc = '西南';
                break;
            case 11:
            case 12:
                directionDesc = '正西';
                break;
            case 13:
            case 14:
                directionDesc = '西北';
                break;
        }
        return directionDesc;
    },
    /**
     * 格式化秒数为时间数
     * @param time 秒数
     */
    formatTime:function (time) {
        let m = parseFloat(time);
        let resultTime = "";
        let second, minute, hour;
        let haveHour = false;
        if (m >= 60 && m < 60 * 60) {
            if (parseInt(m / 60.0) < 10) {
                minute = "0" + parseInt(m / 60.0)
            } else {
                minute = parseInt(m / 60.0)
            }
            let cs = parseInt(m - parseInt(m / 60.0) * 60);
            if (cs < 10) {
                second = "0" + cs
            } else {
                second = "" + cs
            }
            resultTime = minute + ":" + second;
        } else if (m >= 60 * 60) {
            let ch = parseInt(m / 3600.0);
            let cm = parseInt((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60);
            let csx = parseInt((parseFloat((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60) - parseInt((parseFloat(m / 3600.0) - parseInt(m / 3600.0)) * 60)) * 60);
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
            resultTime = hour + ":" + minute + ":" + second;
        } else {
            if (parseInt(m) > 9) {
                second = "" + parseInt(m)
            } else {
                second = "0" + parseInt(m)
            }
            resultTime = "00:" + second
        }
        return resultTime
    },
    /**
     * 检查日期是否正确
     * @param date
     * @returns {boolean}
     */
    checkDate:function(date){
        return (new Date(date).getDate()==date.substring(date.length-2));
    }
};


export default commonfun;