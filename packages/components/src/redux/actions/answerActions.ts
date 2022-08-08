import { createAction } from '../helpers'
import { Moment } from 'moment'
import { CardName, DailyCard } from '../../types'

export function answerSurvey({
  id,
  // question,
  // answerID,
  // answer,
  // response,
  user_id,
  isCompleted,
  isSurveyAnswered,
  questions,
  utcDateTime,
}: // inProgress,
{
  id: string
  // question: string
  // answerID: string
  // answer: string
  // response: string
  user_id: string
  isCompleted: boolean
  isSurveyAnswered: boolean
  questions: any
  utcDateTime: Moment
  // inProgress: boolean
}) {
  return createAction('ANSWER_SURVEY', {
    id,
    // question,
    // answerID,
    // answer,
    // response,
    user_id,
    isCompleted,
    isSurveyAnswered,
    questions,
    utcDateTime,
    // inProgress,
  })
}
export function updateSurveyWithAnswer({
  id,
  // question,
  // answerID,
  // answer,
  // response,
  user_id,
  isCompleted,
  isSurveyAnswered,
  questions,
  utcDateTime,
  inProgress,
}: {
  id: string
  // question: string
  // answerID: string
  // answer: string
  // response: string
  user_id: string
  isCompleted: boolean
  isSurveyAnswered: boolean
  questions: any
  utcDateTime: Moment
  inProgress: boolean
}) {
  return createAction('UPDATE_SURVEY_WITH_ANSWER', {
    id,
    // question,
    // answerID,
    // answer,
    // response,
    user_id,
    isCompleted,
    isSurveyAnswered,
    questions,
    utcDateTime,
    inProgress,
  })
}

export function answerQuiz({
  id,
  question,
  answerID,
  emoji,
  answer,
  isCorrect,
  response,
  userID,
  utcDateTime,
}: {
  id: string
  question: string
  answerID: number
  emoji: string
  answer: string
  isCorrect: boolean
  response: string
  userID: string
  utcDateTime: Moment
}) {
  return createAction('ANSWER_QUIZ', {
    id,
    question,
    answerID,
    emoji,
    answer,
    isCorrect,
    response,
    userID,
    utcDateTime,
  })
}

export function answerDailyCard<T extends CardName>({
  cardName,
  answer,
  userID,
  utcDateTime,
  mutuallyExclusive = false,
  periodDay = false,
}: {
  cardName: T
  answer: DailyCard[T]
  userID: string
  utcDateTime: Moment
  mutuallyExclusive: boolean
  periodDay: boolean
}) {
  return createAction('ANSWER_DAILY_CARD', {
    cardName,
    answer,
    userID,
    utcDateTime,
    mutuallyExclusive,
    periodDay,
  })
}

export function answerVerifyDates({
  userID,
  utcDateTime,
  periodDay = false,
}: {
  userID: string
  utcDateTime: Moment
  periodDay: boolean
}) {
  return createAction('ANSWER_VERIFY_DATES', {
    userID,
    utcDateTime,
    periodDay,
  })
}

export function answerNotesCard({
  title,
  notes,
  userID,
  utcDateTime,
}: {
  title: string
  notes: string
  userID: string
  utcDateTime: Moment
}) {
  return createAction('ANSWER_NOTES_CARD', { title, notes, userID, utcDateTime })
}

export function shareApp() {
  return createAction('SHARE_APP')
}

// export function verifyPeriodDays({
//   periodDate,
//   userID,
//   utcDateTime,
// }: {
//   periodDate: []
//   userID: string
//   utcDateTime: Moment
// }) {
//   return createAction('VERIFIY_PERIOD_DAYS', {
//     periodDate,
//     userID,
//     utcDateTime,
//   })
// }
