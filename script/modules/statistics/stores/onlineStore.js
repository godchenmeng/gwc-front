/**
 * @file 上线率 Reflux Store
 * @author Banji 2017.08.24
 */

import OnlineAction from '../actions/onlineAction';
import Urls from '../../../common/urls';
import CommonFun from '../../../common/commonfun';
import BootstrapTree from '../../../common/bootstrapTree';
import CommonStore from '../../common/stores/commonStore';

var OnlineStore = Reflux.createStore({
    listenables: [OnlineAction],
    data: {
        columns:[],
        queryParams:function(params){
            var org_ids = [];
            if(!!$('#org_tree').treeview(true).getChecked){
                org_ids  = BootstrapTree.getChecked("org_tree",true);
            }
            var param = {
                org_ids:org_ids,
                start_time : $("input[name='start_date']").val(),
                end_time : $("input[name='end_date']").val(),
                limit : params.limit, // 页面大小
                pageIndex : this.pageNumber - 1,
            }
            return param;
        },
        listWeek: CommonFun.getDateArray("listWeek"),
        isChangeDate:false,//是否改变查询时间
    },
    /**
     * 响应Action seerch，上线率搜索功能
     * @param {dataType} paramName  说明
     */
    onSearch: function(){
        $('#online_rate_table').bootstrapTable('refresh');
    },
    /**
     * 上线率列表数据导出
     * @param {object} data 提交的数据
     */
    onExport: function(data){
        Urls.open(Urls.onlineExport,data);
    },
});

export default OnlineStore