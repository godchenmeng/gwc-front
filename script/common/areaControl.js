/**
 * @file AreaControl公共方法
 * @author Banji 2017.08.09
 * @readme
 * html格式如下
 *     <input data-action="0" type="text" id="startArea" class="add-input" placeholder="请选择上车地点">
 *     <div id="startAreaTab" class="area-tab"></div>
 *     <input  type="text" placeholder="请输入街道名称">
 * 其中地区显示控件 data-ation 自定义属性必须，值为txtIds参数对应id选择器下标
 *
 */

var AreaControl = {
    /**
     * @param {Array} txtIds 地区显示控件id选择器列表，例如：["#startArea","#endArea"]
     * @param {Array} areaIDs 地区选项卡容器id选择器列表，例如：["#startAreaTab","#endAreaTab"]
     */
    initArea:function(txtIds,areaIDs){
        let that = this;
        // let areaSelectScript = document.createElement('script');
        // areaSelectScript.src = 'static/other/js/areaSelect.js';
        // document.getElementsByTagName('head')[0].appendChild(areaSelectScript);
        ZXB.AreaQuery.areaSelects.init(txtIds,areaIDs);
    }
};
export default AreaControl;