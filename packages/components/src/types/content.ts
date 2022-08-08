export interface Articles {
  byId: {
    [id: string]: {
      id: string
      title: string
      content: string
      category: string
      subCategory: string
    }
  }
  allIds: string[]
}

interface AvatarMessageItem {
  id: string
  content: string
}
export interface AvatarMessages extends Array<AvatarMessageItem> {}

export interface Categories {
  byId: {
    [id: string]: {
      id: string
      name: string
      tags: {
        primary: {
          name: string
          emoji: string
        }
        secondary: {
          name: string
          emoji: string
        }
      }
      subCategories: string[]
    }
  }
  allIds: string[]
}

export interface SubCategories {
  byId: {
    [id: string]: {
      id: string
      name: string
      articles: string[]
    }
  }
  allIds: string[]
}

export interface DidYouKnows {
  byId: {
    [id: string]: {
      id: string
      isAgeRestricted: boolean
      title: string
      content: string
    }
  }
  allIds: string[]
}

export interface Quizzes {
  byId: {
    [id: string]: {
      id: string
      isAgeRestricted: boolean
      question: string
      answers: Array<{
        text: string
        emoji: string
        isCorrect: boolean
      }>
      response: {
        correct: string
        in_correct: string
      }
    }
  }
  allIds: string[]
}

// export interface Surveys {
//   byId: {
//     [id: string]: {
//       id: string
//       question: string
//       answers: Array<{
//         text: string
//         emoji: string
//       }>
//     }
//   }
//   allIds: string[]
// }
// export interface Surveys extends Array<ContentItem> {}
export interface Surveys {
  date_created: string
  id: string
  isAgeRestricted: false
  is_multiple: true
  lang: string
  live: true
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  question: string
  questions: ContentItem[]
}
// export interface AllSurveys {
//   data: []
// }
interface SurveyContentItem {
  date_created: string
  id: string
  isAgeRestricted: false
  is_multiple: true
  lang: string
  live: true
  option1: string
  option2: string
  option3: string
  option4: string
  option5: string
  question: string
  questions: SurveyQuestionContentItem[]
  inProgress: boolean
  currentQuestionIndex: number
  answeredQuestion: AnsweredSurveyQuestionContentItem[]
}
interface SurveyQuestionContentItem {
  id: string
  is_multiple: boolean
  next_question: ContentItem
  options: ContentItem[]
  question: string
  response: string
  sort_number: string
  surveyId: string
  answeredQuestion: AnsweredSurveyQuestionContentItem
}

interface AnsweredSurveyQuestionContentItem {
  questionId: string
  question: string
  answerID: string
  answer: string
  response: string
  isMultiple: boolean
}
export interface AllSurveys extends Array<SurveyContentItem> {}
export interface CompletedSurveys extends Array<CompletedSurveyItem> {}
interface CompletedSurveyItem {
  id: string
}

interface HelpCenterItem {
  id: number
  title: string
  caption: string
  contactOne: string
  contactTwo: string
  address: string
  website: string
  lang: string
}
export interface HelpCenters extends Array<HelpCenterItem> {}

interface ContentItem {
  type: 'HEADING' | 'CONTENT'
  content: string
}

export interface PrivacyPolicy extends Array<ContentItem> {}
export interface TermsAndConditions extends Array<ContentItem> {}
export interface About extends Array<ContentItem> {}
