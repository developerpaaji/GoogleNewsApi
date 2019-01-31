const cheerio=require("cheerio")
const async=require('async')
const request=require('request');
var data=[];
var storeData;
function base(code)
  {
    return `https://news.google.com/?gl=${code}`
  }
function initialize(storeNews) 
{
  if(!storeNews)
  {
    throw 'StoreFunction can not be undefined';
  }

  storeData=storeNews; 
  refresh();
}
module.exports.initialize=initialize;
function addCountryCode(countryCode='IN')
{
  data[countryCode]=true;
}
module.exports.addCountryCode=addCountryCode;
function refresh()
{
     console.log("Refreshing.....");
     async.map(Object.keys(data),(code,done)=>{
       crawlGoogle(code,done)
     },(err,results)=>{
        var mainResults={};
        results.forEach((result)=>{
          for(key in result)
          {
            mainResults[key]=result[key];
          }
        })
        storeData(mainResults) 
     })
     
}
module.exports.refresh=refresh;
class News{
    constructor(title="",description="",thumbnail="",publisher="",publishedAt=0,url="",category="")
    {
        this.title=title;
        this.description=description;
        this.thumbnail=thumbnail;
        this.publisher=publisher;
        this.publishedAt=publishedAt;
        this.category=category;
        if(url.startsWith('./'))
        this.url="https://news.google.com"+url.substring(1);
        this.related=[];
    }
}
const headers = { 
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
};
function crawlGoogle(code,done)
{
   request.get({uri:base(code),headers:headers}, function(err, resp, body){
    var urls={}
    $ = cheerio.load(body);
    //Scraping topics
    var topics=[];
    $('.SFllF').each((index,elm)=>{
        var link=$(elm).attr('href');
        if(link&&link.indexOf('/topics')!=-1)
        {
          topics.push({link:`https://news.google.com${link}`,name:$(elm).attr('aria-label')});  
        }
       })
    async.map(topics,(topic,done)=>{
        crawlGoogleLink(topic,done);
      },(err,jsonData)=>{
        var results={};
        for(var i in jsonData){
          var key = i;
          var val = jsonData[i];
          for(var j in val){
              var sub_key = j;
              var sub_val = val[j];
              results[sub_key]=sub_val;
          }
        }
        var mainResults={};
        mainResults[code]=results;
        done(null,mainResults);   
      })  
    })
}
function search(query)
{
  if(!query)
  {
    throw 'Query can not be empty';
  }
  var searchLink=`https://news.google.com/search?q=${query}`;
  return new Promise((resolve,reject)=>{
    function done(err,results)
    {
      resolve(results);
    }
    crawlGoogleLink({link:searchLink,name:'Results'},done)
  });
}

module.exports.search=search;
function crawlGoogleLink(topic,done)
{  
 var googleLink=topic.link;
 request.get({uri:googleLink,headers:headers}, function(err, resp, body){
  var urls={}
  $ = cheerio.load(body);
   var articlesGrid=$(`[jsname=${"esK7Lc"}]`);
   var articles=[];
   $(articlesGrid).children().each((index,article)=>{
      try {
        var mainArticle=$(article).find('figure').parent();
        var relatedArticles=$(mainArticle.find('.SbNwzf'));
        var thumbnail=$(mainArticle.find('img')[0]).attr('src')
        var mainNews=new getDetails(mainArticle,'h3');
        if(thumbnail)
        {
            mainNews.thumbnail=thumbnail;
        }
        mainNews.category=topic.name;
        relatedArticles.each((index,elm)=>{
          var relatedNews=getDetails($(elm),'h4');
          if(relatedNews.title)
          {
              relatedNews.category=topic.name;
              mainNews.related.push(relatedNews);
          }
        })
        if(mainNews.title)
        articles.push(mainNews);
        
      } catch (error) {
      }
   })
   done(null,{[topic.name]:articles});
  })
}
function getDetails(element,titleTag)
{
    var title=$(element.find(titleTag)[0]).text();
    var description=$(element.find('p')[0]).text();
    var publisher=$(element.find('.KbnJ8')[0]).text();
    var publishedAt=$(element.find('time')[0]).attr('datetime');
    if(publishedAt)
    {
      var time=publishedAt.replace("seconds: ","");
      time=time.replace("\n","");
      publishedAt=parseInt(time);
    }
    var url=$(element.find('a')[0]).attr('href');
    if(url)
    return new News(title,description,"",publisher,publishedAt,url);
    return new News();
}
