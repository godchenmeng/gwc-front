/**
 * @file 等待框
 * @author CM 2017.08.10
 * @file http://www.runoob.com/bootstrap/bootstrap-modal-plugin.html
 */

import React, { Component } from 'react'
import { render } from 'react-dom'


var Loading = React.createClass({
    render: function () {
        return (
            <div className="modal fade" id="loading" role="dialog" aria-labelledby="loading" data-backdrop='static'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="myModalLabel">提示</h4>
                        </div>
                        <div className="modal-body">
                            请稍候。。。
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

export default Loading;