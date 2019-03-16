import React from "react";
import ReactDOM from "react-dom";
// import Dotenv from"dotenv";

import axios from 'axios';
let search_request = (mode, keyword, row = 1) => {

    console.log("http://" + process.env.SERVER_ADDR + ":" + process.env.SERVER_PORT);
    return new Promise((resolve, reject) => {
        axios.get("http://" + process.env.SERVER_ADDR + ":" + process.env.SERVER_PORT + "/api/search_webhard?row=" + row + "&mode=" + mode + "&keyword=" + encodeURI(keyword)).then(result => {
            resolve(result);

        }).catch(
            result => {
                reject(result);
            }
        );
    });
};
let rowStyle = {
    "paddingRight": "15px",
    "paddingLeft": "15px",
    "cursor": "Pointer"
}

class Searcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_keyword: '',
            search_result: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.pageChange = this.pageChange.bind(this);
    };
    handleChange(e) {
        this.setState({ search_keyword: e.target.value });
    };
    handleClick() {
        search_request("all", this.state.search_keyword).then(
            result => {
                this.setState({ kdisk: JSON.parse(result.data.kdisk), ondisk: JSON.parse(result.data.ondisk) })
                // this.setState({ kdisk_max_row: result.data.max_row, kdisk_search_result: result.data.search_result });
            }
        );
    };
    pageChange(mode,row) {
        search_request(mode, this.state.search_keyword, row).then(result => {
            let tmp = {}
            tmp[mode+""] = JSON.parse(result.data[mode+""]);
            this.setState(tmp);
        })

    }
    handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleClick();
        }
    };
    createKdiskRow() {
        let row = [];
        for (let i = 0; i < this.state.kdisk.max_row; i += 1) {
            row.push(<a key={"goPage_kdisk" + (i + 1)} style={rowStyle} onClick={() => this.pageChange("kdisk",i + 1)} >{i + 1}</a>);
        }
        return row;
    }
    createOndiskRow(){
        let row = []
        for (let i = 0 ; i < this.state.ondisk.max_row ; i+=1){
            row.push(<a key={"goPage_ondisk" + (i + 1)} style={rowStyle} onClick={() => this.pageChange("ondisk",i + 1)} >{i + 1}</a>);
        }
        return row;
    }
    render() {
        return (
            <div>
                <p>검색기 메인</p>
                <input id="search_bar" type="text" placeholder="검색 내용을 입력" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                <button onClick={this.handleClick}>검색</button>
                <hr />
                <br />
                <h4>Kdisk</h4>
                <ul>
                    {(this.state.kdisk) && (this.state.kdisk.search_result) ? this.state.kdisk.search_result.map((obj, i) => {
                        return <li key={'kdisk_search_result' + i}><a href={'http://www.kdisk.co.kr/pop.php?sm=bbs_info&idx=' + obj.idx} target="_blank">[{obj.idx}] {obj.title}</a></li>
                    }) : null
                    }
                </ul>
                <div>
                    {(this.state.kdisk) && (this.state.kdisk.max_row) ? this.createKdiskRow() : null}
                </div>
                <br />
                <h4>Ondisk</h4>
                <ul>
                    {(this.state.ondisk) && (this.state.ondisk.search_result) ? this.state.ondisk.search_result.map((obj, i) => {
                        return <li key={'ondisk_search_result' + i}><a href={'http://ondisk.co.kr/pop.php?sm=bbs_info&idx=' + obj.idx} target="_blank">[{obj.idx}] {obj.title}</a></li>
                    }) : null
                    }
                </ul>
                <div>
                    {(this.state.ondisk) && (this.state.ondisk.max_row) ? this.createOndiskRow() : null}
                </div>
            </div>
        );
    }

}


export default Searcher;
ReactDOM.render(<Searcher />, document.getElementById("Searcher"));
