import React from 'react';
import {hasOwnDefinedProperty} from '../../util';
import Button from '@material-ui/core/Button';
import BaseService from "./BaseService";

export default class Zeta36ChessAlphaZero extends BaseService {

    constructor(props) {
        super(props);
        this.submitAction = this.submitAction.bind(this);
        this.handleServiceName = this.handleServiceName.bind(this);
        this.handleFormUpdate = this.handleFormUpdate.bind(this);
        this.getServiceMethods = this.getServiceMethods.bind(this);

        this.state = {
            users_guide: "https://github.com/singnet/dnn-model-services/blob/master/docs/users_guide/zeta36-chess-alpha-zero.md",
            code_repo: "https://github.com/singnet/dnn-model-services/blob/master/Services/gRPC/zeta36-chess-alpha-zero",
            reference: "https://github.com/Zeta36/chess-alpha-zero",

            serviceName: "AlphaZero",
            methodName: "play",

            uid: "",
            move: "",
            cmd: "",

            response: undefined
        };
        this.isComplete = false;
        this.serviceMethods = [];
        this.allServices = [];
        this.methodsForAllServices = [];
        this.parseProps(props);
    }

    parseProps(nextProps) {
        this.isComplete = nextProps.isComplete;
        if (!this.isComplete) {
            this.parseServiceSpec(nextProps.serviceSpec);
        } else {
            console.log(nextProps.response);
            if (typeof nextProps.response !== 'undefined') {
                this.state.response = nextProps.response;
            }
        }
    }


    getServiceMethods(strService) {
        this.setState({
            serviceName: strService
        });
        var data = this.methodsForAllServices[strService];
        if (typeof data === 'undefined') {
            data = [];
        }
        this.serviceMethods = data;
    }

    handleFormUpdate(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    handleServiceName(event) {
        var strService = event.target.value;
        this.setState({
            serviceName: strService
        });
        console.log("Selected service is " + strService);
        var data = this.methodsForAllServices[strService];
        if (typeof data === 'undefined') {
            data = [];
        }
        this.serviceMethods = data;
    }

    submitAction() {
        this.props.callApiCallback(this.state.serviceName,
            this.state.methodName, {
                uid: this.state.uid,
                move: this.state.move,
                cmd: this.state.cmd
            });
    }

    renderForm() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{fontSize: "13px", marginLeft: "10px"}}>Service Name</div>
                    <div className="col-md-3 col-lg-3">
                        <select id="select1"
                                style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                                onChange={this.handleServiceName}>
                            {this.allServices.map((row, index) =>
                                <option key={index}>{row}</option>)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{fontSize: "13px", marginLeft: "10px"}}>Method Name</div>
                    <div className="col-md-3 col-lg-3">
                        <select name="methodName"
                                style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                                onChange={this.handleFormUpdate}>
                            {this.serviceMethods.map((row, index) =>
                                <option key={index}>{row}</option>)}
                        </select>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{fontSize: "13px", marginLeft: "10px"}}>UID</div>
                    <div className="col-md-3 col-lg-2">
                        <input name="uid" type="text"
                               style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                               value={this.state.uid}onChange={this.handleFormUpdate}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{fontSize: "13px", marginLeft: "10px"}}>Move</div>
                    <div className="col-md-3 col-lg-2">
                        <input name="move" type="text"
                               style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                               value={this.state.move}onChange={this.handleFormUpdate}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{fontSize: "13px", marginLeft: "10px"}}>Command</div>
                    <div className="col-md-3 col-lg-2">
                        <input name="cmd" type="text"
                               style={{height: "30px", width: "250px", fontSize: "13px", marginBottom: "5px"}}
                               value={this.state.cmd}onChange={this.handleFormUpdate}></input>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 col-lg-3" style={{fontSize: "13px", marginLeft: "10px"}}>About</div>
                    <div className="col-xs-3 col-xs-2">
                        <Button target="_blank" href={this.state.users_guide}
                                style={{fontSize: "13px", marginLeft: "10px"}}>Guide</Button>
                    </div>
                    <div className="col-xs-3 col-xs-2">
                        <Button target="_blank" href={this.state.code_repo} style={{fontSize: "13px", marginLeft: "10px"}}>Code</Button>
                    </div>
                    <div className="col-xs-3 col-xs-2">
                        <Button target="_blank" href={this.state.reference}
                                style={{fontSize: "13px", marginLeft: "10px"}}>Reference</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-lg-6" style={{textAlign: "right"}}>
                        <button type="button" className="btn btn-primary" onClick={this.submitAction}>Invoke</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderComplete() {
        let status = "\n";
        let uid = "\n";
        let board = "\n";

        if (typeof this.state.response === "object") {
            status = this.state.response.status + "\n";
            uid = this.state.response.uid + "\n";
            board = "\n" + this.state.response.board;
        } else {
            status = this.state.response + "\n";
        }
        return (
            <div>
                <p style={{fontSize: "13px"}}>Response from service is: </p>
                <pre>
                    Status: {status}
                    UID   : {uid}
                    {board}
                </pre>
            </div>
        );
    }

    render() {
        if (this.isComplete)
            return (
                <div>
                    {this.renderComplete()}
                </div>
            );
        else {
            return (
                <div>
                    {this.renderForm()}
                </div>
            )
        }
    }
}
