/**
 * @file bootstrap-typeahead公共方法 对插件进行简单封装
 * @author CM 2017.08.08
 * @see https://github.com/bassjobsen/Bootstrap-3-Typeahead
 */
import Urls from 'urls';

var autoComplete = {
    initInput:function (inputer,options) {
        $(inputer).typeahead({
            source: function(query,process) {
                let param = {name:query};
                return Urls.post(Urls.searchcars,param,function (result) {
                    let texts = new Array();
                    for(let i=0; i < result.length; i++){
                        result[i].name = result[i].text;
                    }
                    process(result);
                });
            }
        });
    },
    initCarBrandInput:function (inputer,options) {
        Urls.get(Urls.carBrand,{},function(result){
            if(result.length > 0){
                var $input = $(inputer);
                let sourceArray = [];
                for(let i=0; i < result.length; i++){
                    sourceArray.push(result[i].text);
                }
                $input.typeahead({
                    autoSelect:false,
                    source:sourceArray
                });
            }
        });
    },
    getActive:function (inputer) {//自己写的getActive方法，调用官网 .typeahead("getActive") 报错，可能原因：bootstrap版本不兼容
        var $input = $(inputer);
        var $ul = $input.next();
        var current = $ul.find("li.active").data("value");
        return current;
    }
};
export default autoComplete;
