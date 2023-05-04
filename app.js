const express = require("express");
const morgan = require('morgan');
const postBank = require('./postBank');
const app = express();

const timeAgo = require('node-time-ago');

app.use(morgan('dev'));
app.use(express.static('public'));

app.get("/", (req, res) => {
  try {
    const posts = postBank.list();
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css"/>
      </head>
      <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${posts.map(post => `
          <div class='news-item'>
            <p>
              <span class="news-position">${post.id}. ▲</span>
              ${post.title}
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${timeAgo(post.date)}
            </small>
          </div>`).join('')}
        </div>
      </body>
    </html>`;
    res.send(html);
  } catch (error) {
    next(error)
  }
  
});

app.get( '/posts/:id', (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const post = postBank.find(id);
    if (!post.id)
      throw new Error('postid not found');
    const html=`<!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css"/>
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
          <div class="news-item">
            <h3>${post.title} by ${post.name}<h3>
            <p>${post.content}</p>
          </div>
        </div>
      </body>
    </html>
    `
    res.send(html);
  } catch (error) {
    next(error)
  }
});

app.get('*', (req, res, next)=>{
  console.error(err.stack)
  res.status(404).send("Oops, endpoint doesn't exist")
})

app.use((err,req,res,next)=>{
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const {PORT = 1337} = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});

