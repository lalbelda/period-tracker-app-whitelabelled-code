import * as React from 'react'
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { approximates, runSpring } from 'react-native-redash'
import { useTheme } from '../../../components/context/ThemeContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { assets } from '../../../assets/index'
import { translate } from '../../../i18n'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../../redux/actions/index'
import * as selectors from '../../../redux/selectors'
import moment from 'moment'
import { useTodayPrediction } from '../../../components/context/PredictionProvider'
import _ from 'lodash'

const {
  Value,
  useCode,
  cond,
  Clock,
  and,
  set,
  add,
  not,
  clockRunning,
  block,
  stopClock,
  interpolate,
} = Animated

const heightOfScreen = Dimensions.get('window').height

function checkForVerifiedDay(cardValues) {
  if (_.has(cardValues, 'periodDay')) {
    return cardValues.periodDay
  }
  return false
}

function useStatusForSource(isOnPeriod, isOnFertile, themeName, cardValues) {
  const isVerified = checkForVerifiedDay(cardValues)
  const themeIcon = switcher(themeName)

  if (isOnPeriod && isVerified) return assets.static.icons[themeIcon].period
  if (isOnPeriod && !isVerified) return assets.static.icons[themeIcon].notVerifiedDay
  if (isOnFertile) return assets.static.icons[themeIcon].fertile

  return assets.static.icons[themeIcon].nonPeriod
}

function switcher(value) {
  switch (value) {
    case 'mosaic':
      return 'stars'
    case 'desert':
      return 'segment'
    default:
      return 'clouds'
  }
}

export function CircularElement({
  radius,
  isActive,
  index,
  currentIndex,
  dataEntry,
  segment,
  cardValues,
  state,
}) {
  const { id: themeName } = useTheme()
  const clock = new Clock()
  const value = new Value(0)
  const margin = themeName === 'desert' ? 0 : 10 // No margin for the continuos circle
  // const verifiedDates = useSelector(selectors.userVerifiedDates)
  // const todaysInfo = useTodayPrediction()

  useCode(
    block([
      cond(and(not(isActive), approximates(index, currentIndex)), [
        set(value, runSpring(clock, 0, 1)),
        cond(not(clockRunning(clock)), set(isActive, 0)),
      ]),
      cond(isActive, [stopClock(clock), set(value, 0)]),
    ]),
    [],
  )
  const scale = interpolate(value, {
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  })

  const InnerRotateZ = interpolate(index, {
    inputRange: [0, 12],
    outputRange: [0, 2 * Math.PI],
  })
  const source = useStatusForSource(dataEntry.onPeriod, dataEntry.onFertile, themeName, cardValues)
  const cloudAdjust = themeName !== 'mosaic' && themeName !== 'desert' ? { left: -3 } : null

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        // @ts-ignore
        style={{
          width: (radius - margin) * 2,
          height: (radius - margin) * 2,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [
            {
              scale: themeName === 'desert' ? 1 : scale,
              rotateZ:
                themeName === 'desert'
                  ? '-0.2deg'
                  : add(InnerRotateZ, new Value(-currentIndex * segment + 0.5 * Math.PI)),
            },
          ],
        }}
      >
        <TouchableOpacity
          accessibilityLabel={`${dataEntry.date.format('DD')}\n${translate(
            dataEntry.date.format('MMM'),
          )}`}
          onPress={() => null}
        >
          <ImageBackground
            style={{
              width: themeName === 'desert' ? 0.15 * heightOfScreen : 70,
              height: themeName === 'desert' ? 0.15 * heightOfScreen : 70,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="contain"
            source={source}
          >
            <Animated.Text
              style={[
                // @ts-ignore
                themeName === 'desert' && {
                  transform: [
                    {
                      rotateZ: add(
                        InnerRotateZ,
                        new Value(-currentIndex * segment + 0.5 * Math.PI),
                      ),
                    },
                  ],
                },
                {
                  width: '100%',
                  alignItems: 'center',
                  textAlign: 'center',
                  // color: dataEntry.onPeriod ? '#e3629b' : 'white',
                  color:
                    dataEntry.onPeriod && !checkForVerifiedDay(cardValues) ? '#e3629b' : 'white',
                  fontSize: 11,
                  fontFamily: 'Roboto-Black',
                },
                themeName !== 'desert' && {
                  right: -2,
                },
                cloudAdjust,
              ]}
            >
              {`${dataEntry.date.format('DD')}\n${translate(dataEntry.date.format('MMM'))}`}
            </Animated.Text>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}
