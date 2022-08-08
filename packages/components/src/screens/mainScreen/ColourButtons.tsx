import React from 'react'
import styled from 'styled-components/native'
import { useTheme } from '../../components/context/ThemeContext'
import { Text } from '../../components/common/Text'
import {
  usePredictionDispatch,
  usePredictDay,
  useTodayPrediction,
  useUndoPredictionEngine,
  useIsActiveSelector,
  useHistoryPrediction,
} from '../../components/context/PredictionProvider'
import { View, Platform, TouchableOpacity, ImageBackground } from 'react-native'
import { assets } from '../../assets/index'
import { useDisplayText } from '../../components/context/DisplayTextContext'
import { InformationButton } from '../../components/common/InformationButton'
import { decisionProcessNonPeriod, decisionProcessPeriod } from './predictionLogic/predictionLogic'
import { translate } from '../../i18n'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../redux/actions/index'
import * as selectors from '../../redux/selectors'
import firebase from 'react-native-firebase'
import moment from 'moment'
import { fetchNetworkConnectionStatus } from '../../services/network'

const minBufferBetweenCycles = 2

function useStatusForSource(themeName) {
  switch (themeName) {
    case 'mosaic':
      return assets.static.icons.stars
    case 'desert':
      return assets.static.icons.circles
    default:
      return assets.static.icons.clouds
  }
}

export function ColourButtons({
  inputDay,
  isDayCard = false,
  hide,
  isCalendar = false,
  navigateToTutorial = () => null,
  onPress = () => null,
  cardValues,
  selectedDayInfo,
}) {
  const { id: themeName } = useTheme()
  const source = useStatusForSource(themeName)
  const { setDisplayTextStatic } = useDisplayText()
  const dispatch = usePredictionDispatch()
  const undoFunc = useUndoPredictionEngine()
  const history = useHistoryPrediction()
  const selectedDayInfoEngine = usePredictDay(inputDay)
  const isActive = useIsActiveSelector()
  const appDispatch = useDispatch()
  const userID = useSelector(selectors.currentUserSelector).id
  const currentUser = useSelector(selectors.currentUserSelector)
  const currentCycleInfo = useTodayPrediction()
  const inputDayStr = moment(inputDay).format('YYYY-MM-DD')
  const todayStr = moment().format('YYYY-MM-DD')
  const [showPeriodOptions, setPeriodOptions] = React.useState(false)

  React.useEffect(() => {
    if (moment(inputDayStr).isSame(moment(todayStr))) {
      // console.log('hello --------- ',todayStr, currentCycleInfo,  moment(todayStr).diff(moment(currentCycleInfo.cycleStart), 'days') , !selectedDayInfo.onPeriod &&
      // inputDay.diff(moment().startOf('day'), 'days') === 0 &&
      // inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
      //   selectedDayInfo.periodLength + minBufferBetweenCycles);

      // console.log(' hey ----------', moment(todayStr).diff(moment(currentCycleInfo.cycleStart), 'days') < 11 &&
      // !selectedDayInfo.onPeriod &&
      // inputDay.diff(moment().startOf('day'), 'days') === 0 &&
      // inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
      //   selectedDayInfo.periodLength + minBufferBetweenCycles );
      if (
        !selectedDayInfo.onPeriod &&
        inputDay.diff(moment().startOf('day'), 'days') === 0 &&
        inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
          selectedDayInfo.periodLength + minBufferBetweenCycles
      ) {
        // if (
        //   moment(todayStr).diff(moment(currentCycleInfo.cycleStart), 'days') > 11 &&
        //   !selectedDayInfo.onPeriod &&
        //   inputDay.diff(moment().startOf('day'), 'days') === 0 &&
        //   inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
        //     selectedDayInfo.periodLength + minBufferBetweenCycles
        // ) {
        setPeriodOptions(true)
      }
    }
  }, [showPeriodOptions])

  const minimizeToTutorial = () => {
    hide()
    setTimeout(
      () => {
        navigateToTutorial()
      },
      Platform.OS === 'ios' ? 500 : 300,
    )
  }

  if (inputDay === null) {
    return <View />
  }

  const errorCallBack = (err: string): any => {
    if (err) {
      setDisplayTextStatic(err)
    }
  }
  const actionPink = decisionProcessPeriod({
    inputDay,
    selectedDayInfo: selectedDayInfoEngine,
    currentCycleInfo,
    history,
    isActive,
    errorCallBack,
  })

  const actionBlue = decisionProcessNonPeriod({
    inputDay,
    selectedDayInfo: selectedDayInfoEngine,
    currentCycleInfo,
    history,
    isActive,
  })

  const checkForDay = () => {
    // For Current day
    if (moment(inputDayStr).isSame(moment(todayStr))) {
      if (
        !selectedDayInfo.onPeriod &&
        inputDay.diff(moment().startOf('day'), 'days') === 0 &&
        inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
          selectedDayInfo.periodLength + minBufferBetweenCycles
      ) {
        if (moment(todayStr).diff(moment(currentCycleInfo.cycleStart), 'days') < 11) {
          dispatch({ type: actionPink.type, inputDay: actionPink.day, errorCallBack })
        } else {
          dispatch({
            type: 'start-next-cycle',
            inputDay,
            errorCallBack,
          })
        }
      } else {
        if (actionPink) {
          dispatch({ type: actionPink.type, inputDay: actionPink.day, errorCallBack })
        }
      }
      // if (
      //   !selectedDayInfo.onPeriod &&
      //   inputDay.diff(moment().startOf('day'), 'days') === 0 &&
      //   inputDay.diff(selectedDayInfo.cycleStart, 'days') >=
      //     selectedDayInfo.periodLength + minBufferBetweenCycles
      // ) {
      //   dispatch({
      //     type: 'start-next-cycle',
      //     inputDay,
      //     errorCallBack,
      //   })
      // } else {
      //   if (actionPink) {
      //     dispatch({ type: actionPink.type, inputDay: actionPink.day, errorCallBack })
      //   }
      // }
    } else {
      dispatch({ type: actionPink.type, inputDay: actionPink.day, errorCallBack })
    }
    appDispatch(
      actions.answerVerifyDates({
        userID,
        utcDateTime: inputDay,
        periodDay: true,
      }),
    )
  }

  return (
    <Container activeOpacity={1} onPress={onPress}>
      <InformationButton
        style={{
          position: 'absolute',
          alignItems: 'center',
          top: 10,
          left: 10,
          flexDirection: 'row',
          zIndex: 99,
          elevation: 99,
        }}
        label="tutorial_launch_label"
        onPress={() => minimizeToTutorial()}
      />
      <InstructionText>share_period_details_heading</InstructionText>
      <HeadingText>{isDayCard ? 'are_you_on_period' : 'user_input_instructions'}</HeadingText>
      <View
        style={{
          width: '80%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity>
          <ImageBackground
            style={{
              width: 110,
              height: 110,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 50,
              paddingRight: isCalendar ? 0 : 0,
            }}
            resizeMode="contain"
            source={isCalendar ? assets.static.icons.periodFuture : source.notVerifiedDay}
          >
            <CycleCardBodyText>
              {`${inputDay.format('DD')}`}
              {!isCalendar && <RNText>{`\n${translate(inputDay.format('MMM'))}`}</RNText>}
            </CycleCardBodyText>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <Row
        style={{
          marginBottom: 20,
          width: showPeriodOptions ? '80%' : '60%',
        }}
      >
        {showPeriodOptions && (
          <TouchableOpacity
            onPress={() => {
              if (fetchNetworkConnectionStatus()) {
                firebase.analytics().logEvent('period_tracker', { user: currentUser })
              }

              // if (moment(inputDayStr).isSame(moment(todayStr))) {
              //   if (moment(todayStr).diff(moment(currentCycleInfo.cycleStart), 'days') < 11 && !selectedDayInfo.onPeriod) {
              dispatch({
                type: 'start-next-cycle',
                inputDay,
                errorCallBack,
              })
              //   } else {
              //     checkForDay()
              //   }
              // } else {
              //   checkForDay()
              // }
              appDispatch(
                actions.answerVerifyDates({
                  userID,
                  utcDateTime: inputDay,
                  periodDay: true,
                }),
              )

              hide()
            }}
          >
            <ImageBackground
              style={{
                width: showPeriodOptions ? 90 : 80,
                height: showPeriodOptions ? 90 : 80,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              resizeMode="contain"
              source={source.period}
            >
              <Text
                style={{
                  width: '100%',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 12,
                  fontFamily: 'Roboto-Black',
                  paddingTop: 5,
                }}
              >
                new_cycle
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            if (fetchNetworkConnectionStatus()) {
              firebase.analytics().logEvent('period_tracker', { user: currentUser })
            }
            if (selectedDayInfo.onPeriod) {
              appDispatch(
                actions.answerVerifyDates({
                  userID,
                  utcDateTime: inputDay,
                  periodDay: true,
                }),
              )
            } else {
              checkForDay()
            }
            hide()
          }}
        >
          <ImageBackground
            style={{
              width: showPeriodOptions ? 90 : 80,
              height: showPeriodOptions ? 90 : 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="contain"
            source={source.period}
          >
            <Text
              style={{
                width: '100%',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white',
                fontSize: 12,
                fontFamily: 'Roboto-Black',
              }}
            >
              Yes
              {/* {showPeriodOptions ? 'period_day' : 'Yes'} */}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (fetchNetworkConnectionStatus()) {
              firebase.analytics().logEvent('period_tracker', { user: currentUser })
            }
            if (selectedDayInfoEngine.onPeriod) {
              if (actionBlue) {
                dispatch({
                  type: actionBlue.type,
                  inputDay: actionBlue.day,
                  errorCallBack,
                })
                appDispatch(
                  actions.answerVerifyDates({
                    userID,
                    utcDateTime: inputDay,
                    periodDay: false,
                  }),
                )
              }
            }
            hide()
          }}
        >
          <ImageBackground
            style={{
              width: showPeriodOptions ? 90 : 80,
              height: showPeriodOptions ? 90 : 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="contain"
            source={source.nonPeriod}
          >
            <Text
              style={{
                width: '100%',
                alignItems: 'center',
                textAlign: 'center',
                color: 'white',
                fontSize: 12,
                fontFamily: 'Roboto-Black',
              }}
            >
              no_day
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      </Row>
    </Container>
  )
}

const Container = styled.TouchableOpacity`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`
const Row = styled.View`
  width: 60%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const Button = styled.TouchableOpacity`
  height: 85px;
  width: 85px;
  align-items: center;
  justify-content: center;
`

const LongButton = styled.TouchableOpacity`
  height: 90px;
  width: 120px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`

const InnerText = styled(Text)`
  color: white;
  font-size: 14;
  position: absolute;
  text-align: center;
  font-family: Roboto-Black;
`

const InstructionText = styled(Text)`
  color: white;
  font-size: 13;
  width: 75%;
  margin-top: 50%;
  margin-bottom: 20px;
  text-align: center;
`
const HeadingText = styled(Text)`
  color: white;
  font-size: 19;
  width: 75%;
  margin-bottom: 50px;
  text-align: center;
  font-family: Roboto-Black;
`

const Mask = styled.ImageBackground`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`

const Column = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const RNText = styled.Text`
  font-family: Roboto-Black;
  font-size: 16;
  text-align: center;
  color: #e3629b;
`

const CycleCardBodyText = styled.Text`
  font-family: Roboto-Black;
  text-align: center;
  color: #e3629b;
  font-size: 16;
`
