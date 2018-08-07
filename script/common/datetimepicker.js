/**
 * @file bootstrap-datetimepicker公共方法 对插件进行简单封装
 * @author Banji 2017.08.02 update 2017.11.12
 * @see http://www.bootcss.com/p/bootstrap-datetimepicker/index.htm
 */

var datetimepicker = {
    /**
     * @param {string} input selector 被渲染的input控件选择器表达式
     * @param {Object} options 参数对象
     */
    optionsDefault:{
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        minView:'month',
        autoclose:true,
        todayHighlight: true,
        todayBtn: 'linked'
    },
    init:function(selector,options){
        if(!!options){
            $.extend(this.optionsDefault,options)
        }
        $(selector).datetimepicker(this.optionsDefault);
    },
    setDate:function (selector, date) {
        if(typeof date === "string") date = new Date(date);
        $(selector).datetimepicker('setDate',date);
    }
};
export default datetimepicker;