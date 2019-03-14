const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
let cors = require('cors');
var request = require('request');
var Iconv = require('iconv').Iconv;
var urlencode = require('urlencode');
var jschardet = require('jschardet');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


////////////GET////////////
let search_kdisk = (keyword, row=1)=>{
        return new Promise((resolve,reject)=>{
            let reg_idx=/idx=\"[0-9]{8}\"/g;
            let reg_title = /title = \"(.*)\"/g;
            let reg_row = /goPage\([0-9]*\)\;/g;
            request(
        
                {
                    method:'GET',
                    encoding:null,
                    headers:{'User-Agent':"Mozilla/5.0",
                    'Content-Type':'text/html; charset=euc-kr',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                    uri:"http://www.kdisk.co.kr/main/module/bbs_list_sphinx_proc.php?mode=kdisk&list_count=&search_type=all&search_type2=title&search_keyword=title&sub_sec=&section=all&hide_adult=N&blind_rights=N&sort_type=default&sm_search=&sm_search_keyword=&plans_idx=&list_type=mnShare_text_list&p="+row+"&list_row="+row+"&search="+encodeURI(keyword),
            }, (err, response, body) => {
                var txt = JSON.parse(body).list;
                var pagingtxt = JSON.parse(body).paging;
                let idx = txt.match(reg_idx);
                let title = txt.match(reg_title);
                let tmp_row = pagingtxt.match(reg_row);
                let max_row = tmp_row==null?1:tmp_row.length;
                let returnObj = [];
                if(idx != null){
                for ( i = 0 ; i < idx.length ; i +=1){
                    idx[i] = idx[i].substring(5,idx[i].length-1);
                    title[i] = title[i].substring(9,title[i].length-1);
                    returnObj.push({
                        idx:idx[i],title:title[i]
                    });
                }
        
                console.log(title.length);
        
                resolve(JSON.stringify({search_result:returnObj,max_row:max_row}));
            }else{
                reject(null);
            }
            });
        });   
}


app.get('/api/search_webhard/', (req, res) => {
    let mode = req.query["mode"];
    let keyword = req.query["keyword"];
    console.log(mode);
    if (mode == "kdisk") {
        let row = req.query["row"];
        if( typeof(row) == "undefined")
            row = 1;
        search_kdisk(keyword,row).then(
            result=>{
                res.send(result);
            }
        ).catch(result=>{
            console.log("[ERR] kdisk 에러");
            res.send(result);
        });
    }else if(mode == "all"){
        search_kdisk(keyword).then(
            result=>{
                res.send(result);
            }
        ).catch(result=>{
            console.log("[ERR] kdisk 에러");
            res.send(result);
        });
    }



});

app.get('/api/hello', (req, res) => {
    res.send({ express: 'Hello From Express' });
});
////////////POST////////////
app.post('/api/world', (req, res) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`,
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));