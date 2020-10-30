let express = require('express')
let db = require('../models')
let router = express.Router()

// POST /articles - create a new post
router.post('/', (req, res) => {
  db.article.create({
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  })
  .then((post) => {
    res.redirect('/')
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/new - display form for creating new articles
router.get('/new', (req, res) => {
  db.author.findAll()
  .then((authors) => {
    res.render('articles/new', { authors: authors })
  })
  .catch((error) => {
    res.status(400).render('main/404')
  })
})

// GET /articles/:id - display a specific post and its author
router.get('/:id', (req, res) => {
  db.article.findOne({
    where: { id: req.params.id },
    include: [db.author]
  })
  .then((article) => {
    if (!article) throw Error()
    console.log(req.params.id)
    // console.log(article.author)
    db.comment.findAll({
      where:{
        articleId:req.params.id
      }
    })
    .then(comments => {
      res.render('articles/show', { article: article, comments:comments, id: req.params.id})
    })
  })
  .catch((error) => {
    console.log(error)
    res.status(400).render('main/404')
  })
})

router.post('/:id', (req, res) => {
  // res.send(req.body)
  // res.send(req.body.comment)
  // res.send(req.body.id)
  // res.send(req.body.title)
  db.comment.create({
    title:req.body.title,
    articleId:req.body.id,
    content:req.body.comment
  })
  .then(createdComment => {
    console.log("then post")
    console.log(req.body.id)
    res.redirect(""+req.body.id);
  })
})

module.exports = router
