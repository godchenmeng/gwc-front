/**
 * @file 审批-列表 Reflux View
 * @author Banji 2017.08.14
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import ApprovalStore from '../stores/approvalStore';
import CommonStore from "../../common/stores/commonStore";

var ApprovalList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        BootstrapTable.initTable("approval_table",20,[10,20,30,40],Urls.approvalPage,ApprovalStore.data.columns,ApprovalStore.data.queryParams,Urls.post);
        $("#approval_table").on("load-success.bs.table",function(e,data){
            if(data.rows.length > 0){
                $.each(data.rows,function(index,obj){
                    if(obj.sp_status == "1"){//待办数据设置字体加粗
                        $("#approval_table tr[data-index='"+index+"']").css('font-weight','bold');
                    }
                })
            }
        });
        $("#approval_table").on("click-row.bs.table",function(e, row, $element, field){
            if(field !== "operate"){
                $("li#li_sp_reason,li#li_sp_result,li#li_reason,li#li_repeal_reason,button#btn-green,button#btn-orange,button#btn-submit").addClass("hide");
                if(row.sp_status == "1"){//待办
                    $("li#li_sp_reason").removeClass("hide");
                    if(CommonStore.verifyPermission('check/apply')) $("button#btn-green").removeClass("hide");
                    $("button#btn-orange").removeClass("hide");
                }
                if(row.sp_status == "2"){//同意
                    $("li#li_sp_result").removeClass("hide");
                }
                if(row.sp_status == "3"){//驳回
                    $("li#li_sp_result").removeClass("hide");
                    $("li#li_reason").removeClass("hide");
                }
                if(row.sp_status == "4"){//撤销
                    $("li#li_repeal_reason").removeClass("hide");
                }

                $("#approval_modal").modal('toggle');
                ApprovalStore.trigger("showDetails",row);
            }
        });
    },
    render: function () {
        return (
            <table id="approval_table"  className="table-striped"></table>
        )
    }
});

export default ApprovalList;