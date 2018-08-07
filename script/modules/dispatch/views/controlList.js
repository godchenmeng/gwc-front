/**
 * @file 派遣-列表 Reflux View
 * @author Banji 2017.08.21
 */
import React, { Component } from 'react'
import { render } from 'react-dom'

import Urls from '../../../common/urls';
import BootstrapTable from '../../../common/bootstrapTable';

import ControlStore from '../stores/controlStore';

var ControlList = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentDidMount: function () {
        BootstrapTable.initTable("control_table",20,[10,20,30,40],Urls.controlPage,ControlStore.data.columns,ControlStore.data.queryParams,Urls.post);
        $("#control_table").on("load-success.bs.table",function(e,data){
            if(data.rows.length > 0){
                $.each(data.rows,function(index,obj){
                    if(obj.apply_status == "1"){//待签收数据设置字体加粗
                        $("#control_table tr[data-index='"+index+"']").css('font-weight','bold');
                    }
                })
            }
        });
        $("#control_table").on("click-row.bs.table",function(e, row, $element, field){
            if(field !== "operate"){
                $("#driver_feedback,#li_dd_result,#li_repeal_reason,.li_driver_info,#li_driver_feedback,#li_pq_status,#btn-green,#btn-orange,#btn-submit").addClass("hide");
                if(row.apply_status == "1"){//待签收
                    $("#driver_feedback").removeClass("hide");
                    $("#btn-green").removeClass("hide");
                    $("#btn-orange").removeClass("hide");
                }else if(row.apply_status == "2"){//反馈
                    $("#li_dd_result").removeClass("hide");
                    $(".li_driver_info").removeClass("hide");
                    $("#li_driver_feedback").removeClass("hide");
                    $("#btn-green").removeClass("hide");
                }else if(row.apply_status == "3"){//待完成
                    $("#li_dd_result").removeClass("hide");
                    $(".li_driver_info").removeClass("hide");
                    $("#li_pq_status").removeClass("hide");
                }else if(row.apply_status == "4"){//已撤销
                    $("#li_repeal_reason").removeClass("hide");
                }else if(row.apply_status == "5"){//已完成
                    $("#li_dd_result").removeClass("hide");
                    $(".li_driver_info").removeClass("hide");
                    $("#li_pq_status").removeClass("hide");
                }
                $("#control_modal").modal('toggle');
                ControlStore.trigger('controlEvent',row);
            }
        });
    },
    render: function () {
        return (
            <table id="control_table"  className="table-striped"></table>
        )
    }
});

export default ControlList;