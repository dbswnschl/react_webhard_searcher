import React from "react";
import ReactDOM from "react-dom";
import Kdisk_Search from './kdisk.jsx';
import axios from 'axios';
import jsonAdapter from 'axios-jsonp'

let search_request = (mode, keyword, row = 1) => {
    return new Promise((resolve, reject) => {
        axios.get("http://127.0.0.1:5000/api/search_webhard?row=" + row + "&mode=" + mode + "&keyword=" + encodeURI(keyword)).then(result => {
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
    "cursor":"Pointer"
}

class Searcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_keyword: '',
            kdisk_max_row: null,
            kdisk_search_result: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.kdisk_pageChange = this.kdisk_pageChange.bind(this);
    };
    handleChange(e) {
        this.setState({ search_keyword: e.target.value });
    };
    handleClick() {
        search_request("all", this.state.search_keyword).then(
            result => {
                this.setState({ kdisk_max_row: result.data.max_row, kdisk_search_result: result.data.search_result });
            }
        );
    };
    kdisk_pageChange(row) {
            search_request("kdisk", this.state.search_keyword, row).then(result => {
                this.setState({ kdisk_max_row: result.data.max_row, kdisk_search_result: result.data.search_result });
            })
        
    }
    handleKeyPress(e) {
        if (e.key == 'Enter') {
            this.handleClick();
        }
    };
    createKdiskRow() {
        let row = [];
        for (let i = 0; i < this.state.kdisk_max_row; i += 1) {
            row.push(<a key={"goPage"+(i+1)} style={rowStyle} onClick={()=>this.kdisk_pageChange(i+1)} >{i + 1}</a>);
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
                    {(this.state.kdisk_search_result) ? this.state.kdisk_search_result.map((obj, i) => {
                        return <li key={'kdisk_search_result' + i}><a href={'http://www.kdisk.co.kr/pop.php?sm=bbs_info&idx=' + obj.idx} target="_blank">[{obj.idx}] {obj.title}</a></li>
                    }) : null
                    }
                </ul>
                <div>
                    {(this.state.kdisk_max_row) ? this.createKdiskRow() : null}
                </div>
            </div>
        );
    }

}


export default Searcher;
ReactDOM.render(<Searcher />, document.getElementById("Searcher"));
