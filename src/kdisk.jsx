
import axios from 'axios';
import jsonAdapter from 'axios-jsonp';
class Kdisk{
    static Search(keyword){
        alert("[KDISK]"+keyword+"를 검색");
        axios.get("127.0.0.1/search?site=kdisk&keyword="+keyword).then(result=>{
            console.log(result);
        });
        
    };
}
export default Kdisk;