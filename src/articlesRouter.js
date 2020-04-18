const express = require('express')
const ArticlesService = require('./articles-service')
const xss = require('xss')
const articlesRouter = express.Router()
const jsonParser = express.json()


articlesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        ArticlesService.getAllArticles(knexInstance)
            .then(articles => {
                res.json(articles)
            })
            .catch(next)
        })
    .post(jsonParser, (req, res, next) => {
        const { title, content, style } = req.body
        const newArticle = { title, content, style }

        for( const [key, value] of Object.entries(newArticle)) {
            if(value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in the request body`}
                })
            }
        }

        ArticlesService.insertArticles(
            req.app.get('db'),
            newArticle
        )
            .then(article => {
                res
                    .status(201)
                    .location(`/api/articles/${article.id}`)
                    .json(article)
            })
            .catch(next)
    })

articlesRouter
    .route('/:article_id')
    .all((req, res, next) => {
        ArticlesService.getById(
            req.app.get('db'), 
            req.params.article_id
        )
        .then(article => {
            if(!article) {
                return res.status(404).json({
                    error: { message: `Article does not exist`}
                })
            }
            res.article = article
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.article.id,
            style: res.article.style,
            title: xss(res.article.title),
            content: xss(res.article.content),
            date_published: res.article.date_published,
        })
    })
    .delete((req, res, next) => {
        ArticlesService.deleteArticle(
            req.app.get('db'),
            req.params.article_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = articlesRouter