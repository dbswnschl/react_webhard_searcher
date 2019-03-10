
import React from "react";
import ReactDOM from "react-dom";
import TopLogo from "../assets/img/logo.png";
const Top_Menu = ()=>{
    return(
        <div>
            <ul>
                <li>
                    <img src={TopLogo} />
                </li>
                <li>
                    <a>홈</a>
                </li>
                <li>
                    <a>요청 게시판</a>
                </li>
            </ul>
        </div>
    );
};
export default Top_Menu;
ReactDOM.render(<Top_Menu />, document.getElementById("top_menu"));