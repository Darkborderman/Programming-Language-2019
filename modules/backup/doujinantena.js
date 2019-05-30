const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request=require('request');
const fs=require('fs');

async function download (page,bookNumber)
{
    console.log(page);
    let web='doujinantena';
    let dir=createDir(web,bookNumber);
    for(let i=0;i<=page.pageNumber-1;i++)
    {
        await downloadImage(page.galleryNumber,i,page.filetype,dir);
    }
}

//Create comic directory
function createDir(mainDir,targetDir){

    if (!fs.existsSync(`./${mainDir}/`)){
        fs.mkdirSync(`./${mainDir}/`);
    }
    if (!fs.existsSync(`./${mainDir}/${targetDir}/`)){
        fs.mkdirSync(`./${mainDir}/${targetDir}/`);
    }
    return `./${mainDir}/${targetDir}`;
}

function getPages(uri){
    return new Promise(function(resolve,reject){
        request(uri, function(err, res, body){

            console.log('get pages');
            let html=new JSDOM(body);
            let document=html.window.document;

            let pagesElement=document.getElementsByClassName('notice');
            let rawString=pagesElement[0].nextElementSibling.innerHTML;
            let filterPatt=/[(/)]/g;
            let pagesString = rawString.split(filterPatt);
            let pages=parseInt(pagesString[2]);

            let  imagesource=document.getElementsByTagName('img')[0].getAttribute('src');
            let galleryNumber = imagesource.split('/')[4];

            let filetype = '.jpg';

            //get
            let Package={
                galleryNumber:galleryNumber,
                pageNumber:pages,
                filetype:filetype,
            };

            resolve(Package);
        });
    });
}

function downloadImage(number,pages,type,targetDir){

    for(let i=1;i<=pages;i++)
    {
        //need to adjust array iterate
        //i from 1-25, type from 0-24
        let page = i.toString().padStart('3','0');
        let uri=`http://cdn.doujinantena.com/contents_jpg/${number}/${page}${type}`;
        request(uri).pipe(fs.createWriteStream(`${targetDir}/${page}.jpg`)).on('close',function(){
            console.log(`${page} done`);
        });
    }
}

module.exports={
    download:download,
    getPages:getPages
};