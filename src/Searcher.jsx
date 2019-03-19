import React from "react";
import ReactDOM from "react-dom";
// import Dotenv from"dotenv";
import Animated from 'animated/lib/targets/react-dom';
import Easing from 'animated/lib/Easing';
import axios from 'axios';
let search_request = (mode, keyword, row = 1) => {

    console.log("http://" + process.env.SERVER_ADDR + ":" + process.env.SERVER_PORT);
    return new Promise((resolve, reject) => {
        axios.get("http://" + process.env.SERVER_ADDR + ":" + process.env.SERVER_PORT + "/api/search_webhard?row=" + row + "&mode=" + mode + "&keyword=" + encodeURI(keyword)).then(result => {
        if(result.data.length == 0 ){
            alert("검색 결과가 없습니다.");
            reject(null);
        }    
        resolve(result);

        }).catch(
            result => {
                console.log("ERR");
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
            loading:false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.pageChange = this.pageChange.bind(this);
        this.animatedValue = new Animated.Value(0);
    };
    handleChange(e) {
        this.setState({ search_keyword: e.target.value });
    };
    handleClick() {
        this.setState({loading:false});
        this.animate();

        search_request("all", this.state.search_keyword).then(
            result => {
                this.setState({ kdisk: JSON.parse(result.data.kdisk), ondisk: JSON.parse(result.data.ondisk),filejo:JSON.parse(result.data.filejo), loading:true });
                // this.setState({ kdisk_max_row: result.data.max_row, kdisk_search_result: result.data.search_result });
                
            }
        );
    };
    pageChange(mode,row) {
        this.setState({loading:false});
        this.animate();
        search_request(mode, this.state.search_keyword, row).then(result => {
            let tmp = {}
            tmp[mode+""] = JSON.parse(result.data[mode+""]);
            this.setState(tmp);
            this.setState({loading:true});
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
    createFilejoRow(){
        let row = []
        for (let i = 0 ; i < this.state.filejo.max_row ; i+=1){
            row.push(<a key={"goPage_filejo" + (i + 1)} style={rowStyle} onClick={() => this.pageChange("filejo",i + 1)} >{i + 1}</a>);
        }
        return row;

    }

    animate(){
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,{
                toValue:1,
                duration:1000,
                easing: Easing.elastic(1)
            }
        ).start();
    }

    render() {
        let marginLeft = this.animatedValue.interpolate({
            inputRange: [0,1],
            outputRange:[-120,0]
        })
        return (
            <div>
                <p>검색기 메인</p>
                <input id="search_bar" type="text" placeholder="검색 내용을 입력" onChange={this.handleChange} onKeyPress={this.handleKeyPress} />
                <button onClick={this.handleClick}>검색</button>
                <hr />
                {
                    this.state.loading == false ? 
                <Animated.div style={
                    Object.assign({},{
                        opacity:this.animatedValue,marginLeft, position:"fixed", "textAlign":"center", top:"50%", left:"50%"
                    })
                }>
                    <p style={
                        Object.assign({},{
                            position:"relative",top:"-50%", left: "-50%", border:"solid 1px ", padding:"50px"
                        })
                    }>Loading!</p>
                </Animated.div> : null
                }
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
                <br />
                <h4>FileJo</h4>
                <ul>
                    {(this.state.filejo) && (this.state.filejo.search_result) ? this.state.filejo.search_result.map((obj, i) => {
                        return <li key={'filejo_search_result' + i}><a href={'http://www.filejo.com/main/popup/bbs_info.php?idx=' + obj.idx} target="_blank">[{obj.idx}] {obj.title}</a></li>
                    }) : null
                    }
                </ul>
                <div>
                    {(this.state.filejo) && (this.state.filejo.max_row) ? this.createFilejoRow() : null}
                </div>
            </div>
        );
    }

}


export default Searcher;
ReactDOM.render(<Searcher />, document.getElementById("Searcher"));
