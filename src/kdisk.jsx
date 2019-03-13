
import axios from 'axios';
import jsonAdapter from 'axios-jsonp';

let Kdisk_Search = (keyword) => {
    return new Promise((resolve, reject) => {
        axios.get("http://127.0.0.1:5000/api/search_webhard?mode=kdisk&keyword=" + keyword).then(result => {
            resolve(result);
        }).catch(
            result => {
                reject(result);
            }
        );
    });
};

export default Kdisk_Search;