import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Article } from '../entity/Article'
import uuid = require('uuid')

export class ArticleController {
  private articleRepository = getRepository(Article)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.articleRepository.find({ where: { lang: request.user.lang } })
  }
  async mobileArticlesByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.articleRepository.query(
      `SELECT ar.id, ca.title as category_title, 
      CAST(ca.id as CHAR(50))as cat_id, sc.title as subcategory_title, 
      CAST(sc.id as CHAR(50)) as subcat_id, 
      ar.article_heading, 
      ar.article_text, 
      ca.primary_emoji,
      ca.primary_emoji_name,
      ar.lang 
      FROM article ar 
      INNER JOIN category ca 
      ON ar.category = CAST(ca.id as CHAR(50))
      INNER JOIN subcategory sc  
      ON ar.subcategory = CAST(sc.id as CHAR(50))
      WHERE ar.lang = $1
      AND ar.live = true
      ORDER BY ca.title, sc.title ASC
      `,
      [request.params.lang],
    )
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.articleRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const article = await this.articleRepository.findOne({
      article_heading: request.body.article_heading,
    })
    if (article) {
      return { article, isExist: true }
    }
    const articleToSave = request.body
    articleToSave.lang = request.user.lang
    articleToSave.id = uuid()
    await this.articleRepository.save(articleToSave)
    return articleToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const article = await this.articleRepository.findOne({
      article_heading: request.body.article_heading,
    })
    if (article && request.params.id !== article.id) {
      return { article, isExist: true }
    }
    const booleanFromString = request.body.live === 'true'
    const articleToUpdate = await this.articleRepository.findOne(request.params.id)
    articleToUpdate.category = request.body.category
    articleToUpdate.subcategory = request.body.subcategory
    articleToUpdate.article_heading = request.body.article_heading
    articleToUpdate.article_text = request.body.article_text
    articleToUpdate.live = booleanFromString
    articleToUpdate.lang = request.user.lang
    await this.articleRepository.save(articleToUpdate)
    return articleToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const articleToRemove = await this.articleRepository.findOne(request.params.id)
    await this.articleRepository.remove(articleToRemove)
    return articleToRemove
  }
}
