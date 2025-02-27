import { defaultTheme, defaultAvatar } from '../../themes'
import _ from 'lodash'
import { Actions } from '../types'
import { ThemeName, AvatarName } from '../../types'
import { currentLocale } from '../../i18n'
import DeviceInfo from 'react-native-device-info'

export interface AppState {
  appLocale: string
  locale: string
  chosenRegion: string
  appVersionName: string
  appVersionCode: string
  firebaseToken: string
  hasOpened: boolean
  isTutorialOneActive: boolean
  isTutorialTwoActive: boolean
  isLoginPasswordActive: boolean
  isTtsActive: boolean
  theme: ThemeName
  avatar: AvatarName
  verifiedDates: any
}

const initialState: AppState = {
  appVersionName: DeviceInfo.getVersion(),
  appVersionCode: DeviceInfo.getBuildNumber(),
  firebaseToken: null,
  appLocale: 'en',
  locale: 'en',
  chosenRegion: 'en', // @TODO: PENAL CODE change to currentLocale() if no penal code   // @TODO: LANGUAGES This is commented in case the client wants multiple languages
  hasOpened: false,
  isTutorialOneActive: true,
  isTutorialTwoActive: true,
  isLoginPasswordActive: true,
  isTtsActive: false,
  theme: defaultTheme,
  avatar: defaultAvatar,
  verifiedDates: [],
}

export function appReducer(state = initialState, action: Actions): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload.theme,
      }
    case 'SET_AVATAR':
      return {
        ...state,
        avatar: action.payload.avatar,
      }
    case 'SET_UPDATED_VERSION':
      return {
        ...state,
        appVersionName: DeviceInfo.getVersion(),
        appVersionCode: DeviceInfo.getBuildNumber(),
      }
    case 'STORE_FIREBASE_KEY':
      return {
        ...state,
        firebaseToken: action.payload.firebaseToken,
      }
    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.payload.locale,
      }
    case 'SET_CHOSEN_REGION':
      return {
        ...state,
        chosenRegion: action.payload.region,
      }
    case 'SET_HAS_OPENED':
      return {
        ...state,
        hasOpened: action.payload.hasOpened,
      }
    case 'SET_TUTORIAL_ONE_ACTIVE':
      return {
        ...state,
        isTutorialOneActive: action.payload.isTutorialActive,
      }
    case 'SET_TUTORIAL_TWO_ACTIVE':
      return {
        ...state,
        isTutorialTwoActive: action.payload.isTutorialActive,
      }
    case 'SET_LOGIN_PASSWORD_ACTIVE':
      return {
        ...state,
        isLoginPasswordActive: action.payload.isLoginPasswordActive,
      }
    case 'SET_TTS_ACTIVE':
      return {
        ...state,
        isTtsActive: action.payload.isTtsActive,
      }
    case 'VERIFY_PERIOD_DAY':
      return {
        ...state,
        verifiedDates: action.payload.date,
      }

    default:
      return state
  }
}
