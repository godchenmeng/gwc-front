/**
 * @file 短信管理台Reflux Store
 * @author CM 2017.08.23
 */

import SmsAction from '../actions/smsAction';
import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';
import BootstrapTree from '../../../common/bootstrapTree';

var SmsStore = Reflux.createStore({
    listenables: [SmsAction],
    init: function () {
    },
    data: {
        smsColumns:[{
            field:'type',
            title:'违规类型',
            align:'center',
            valign:'middle',
            width:'10%',
            formatter:function (value,row,index) {
                switch (value){
                    case "2":
                        return "超速";
                        break;
                    case "1":
                        return "越界";
                        break;
                    case "0":
                        return "违章";
                        break;
                    case "4":
                        return "拔插设备";
                        break;
                    case "3":
                        return "非规定时段";
                        break;
                    default:
                        return "未知违规";
                }
            }
        },{
            field:'senddate',
            title:'时间',
            align:'center',
            valign:'middle',
            width:'20%',
        },{
            field:'content',
            title:'内容',
            align:'center',
            valign:'middle',
            width:'45%',
        },{
            field:'memberNames',
            title:'发送对象',
            align:'center',
            valign:'middle',
            width:'20%',
        },{
            field:'sendcount',
            title:'短信条数',
            align:'center',
            valign:'middle',
            width:'5%',
        }]
    },
    /**
     * 响应 Action getsmslist 获取短信列表
     * @param param
     */
    onGetsmslist:function (param) {
        let that = this;
        if(param){
            BootstrapTable.initTable("sms_list_table", 10, [10, 20], Urls.loadsmslist, that.data.smsColumns, param, Urls.post);
        }else{
            BootstrapTable.render("sms_list_table");
        }
    },
    /**
     * 响应 Action getuserorg 获取用户和机构列表
     */
    onGetuserorg:function () {
        let that = this;
        Urls.get(Urls.loadorguserlist,{},function(data){
            BootstrapTree.initTree("org_member_tree", data, null, null, that, true, false);
        });
    }
});

export default SmsStore