/**
 * @file 全局变量操作
 * @author CM 2018.05.16
 */

var GlobalParam = {
    set:function (key,val) {
        localStorage.setItem(key,JSON.stringify({data:val,time:(new Date()).getTime()}));
    },
    get:function (key) {
        var data = localStorage.getItem(key);
        if(!data) return null;
        var dataObj = JSON.parse(data);
        return dataObj.data;
    },
    getExpire:function (key, exp) {
        var data = localStorage.getItem(key);
        if(!data) return null;
        var dataObj = JSON.parse(data);
        if ((new Date()).getTime() - dataObj.time>exp) {
            return null;
        }else{
            return dataObj.data;
        }
    },
    clearAll:function () {
        localStorage.clear();
    }
}

export default GlobalParam;