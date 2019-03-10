import React from "react";
import ReactDOM from "react-dom";
import Kdisk from './kdisk.jsx';
import axios from'axios';
import jsonAdapter from 'axios-jsonp'
class Searcher extends React.Component{
    constructor(props){
        super(props);
        this.state={
            search_keyword:''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        
    };
    handleChange(e){
        this.setState({ search_keyword: e.target.value });
    }
    handleClick(){
        Kdisk.Search(this.state.search_keyword);
    };
    render(){
    return(
        <div>
           <p>검색기 메인</p>
           <input id="search_bar" type="text" placeholder="검색 내용을 입력" onChange={ this.handleChange }/>
           <button onClick={this.handleClick}>검색</button>
           <hr />
           <br />

        </div>
    );
    }

}


export default Searcher;
ReactDOM.render(<Searcher />, document.getElementById("Searcher"));
