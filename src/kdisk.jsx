
import axios from 'axios';

let Kdisk_Search = (keyword) => {
    return new Promise((resolve, reject) => {
        axios.get("http://127.0.0.1:5000/api/search_webhard?mode=kdisk&keyword=" + encodeURI(keyword)).then(result => {
            resolve(result);
        }).catch(
            result => {
                reject(result);
            }
        );
    });
};

export default Kdisk_Search;