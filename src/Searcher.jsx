import React from "react";
import ReactDOM from "react-dom";
import Kdisk_Search from './kdisk.jsx';
import axios from'axios';
import jsonAdapter from 'axios-jsonp'

let search_request = (mode,keyword) => {
    return new Promise((resolve, reject) => {
        axios.get("http://127.0.0.1:5000/api/search_webhard?mode="+mode+"&keyword=" + encodeURI(keyword)).then(result => {
            resolve(result);
        }).catch(
            result => {
                reject(result);
            }
        );
    });
};

class Searcher extends React.Component{
    constructor(props){
        super(props);
        this.state={
            search_keyword:'',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    };
    handleChange(e){
        this.setState({ search_keyword: e.target.value });
    };
    handleClick(){
        //Kdisk.Search(this.state.search_keyword);
        search_request("all",this.state.search_keyword).then(
            result=>{
                console.log(result);
                this.setState({kdisk:result});
                console.log(this.state);
            }
        );
    };
    handleKeyPress(e){
        if(e.key == 'Enter'){
            this.handleClick();
        }
    };
    render(){
    return(
        <div>
           <p>검색기 메인</p>
           <input id="search_bar" type="text" placeholder="검색 내용을 입력" onChange={ this.handleChange } onKeyPress={this.handleKeyPress}/>
           <button onClick={this.handleClick}>검색</button>
           <hr />
           <br />
           <h4>Kdisk</h4>
            <ul>
                {(this.state.kdisk)?this.state.kdisk.data.map((obj,i) =>{
                    return <li key={'kdisk_search_result'+i}><a href={'http://www.kdisk.co.kr/pop.php?sm=bbs_info&idx='+obj.idx} target="_blank">[{obj.idx}] {obj.title}</a></li>
                }):null    
                }
            </ul>
        </div>
    );
    }

}


export default Searcher;
ReactDOM.render(<Searcher />, document.getElementById("Searcher"));
