const nhentai=require(`./nhentai.js`);

const Crawler={
	nhentai:{
		search:nhentai.search,
		bookDetail:nhentai.getBook
	}
};


//code test area
/*
(async function (){
	//console.log(await search("test",20,50));
	console.log(await Crawler.nhentai.bookDetail(273908));
}());
search:function(input,begin,end,option){
	return new Promise(async (resolve, reject) => {
		resolve(await nhentai.search(input,begin,end));
	});
},
*/
module.exports={
	Crawler:Crawler
};