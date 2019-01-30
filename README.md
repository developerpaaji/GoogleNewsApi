# GoogleNewsApi
A REST api which will give all news from any location of different categories and also related news

### Installation 
```
npm i googlenewsapi

```
### Sample

```
News {
  title: 'Watch SpaceX get very close to catching its rocket’s nose cone during a test',
  description: 'SpaceX is getting excruciatingly close to catching a part of its rocket that falls out of the sky after each launch. A new video shows a recent drop test of the ...',
  thumbnail: 'https://lh3.googleusercontent.com/NKOw3Vvids-nNCfx1vmll-wR88AvTqnRK3vakt4XhxhtYzgWlurhPEOWY-lq413YTava0bMKdwIKrxQvRjQ=pf-w200-h200',
  publisher: 'The Verge',
  publishedAt: 'seconds: 1548865689\n',
  category: 'Science',
  url: 'https://news.google.com/articles/CAIiEGxY4QfBKcLIDNpvJ1mDS2AqFggEKg4IACoGCAow3O8nMMqOBjD38Ak?hl=en-US&gl=US&ceid=US%3Aen',
  related:
   [ News {
       title: 'Watch SpaceX rocket\'s nose cone miss the boat, again',
       description: 'A ship named Mr. Steven keeps trying to catch the thing.',
       thumbnail: '',
       publisher: 'CNET',
       publishedAt: 1548870300,
       category: 'Science',
       url: 'https://news.google.com/articles/CAIiECurGhHT3ziGtrQLkWIu6OIqEwgEKgwIACoFCAow4GowoAgwkRo?hl=en-US&gl=US&ceid=US%3Aen',
       related: [] 
       }
   ] 
}

```
### Usage 
```
var googleNewsApi=require('googlenewsapi');
// Initialize with storeFunction,country code and language code.
googleNewsApi.initialize(storeFunction,'IN','en');
setInterval(googleNewsApi.refresh,1000*60);

```

### Built With

Following is list of  libraries used in app.
1) async
2) cheerio
5) request


## Authors

* **Bhavneet Singh**  - [singhbhavneet](https://github.com/singhbhavneet)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Its because of my mummy's motivation,god's blessing and family'support that I am able to complete this project.

