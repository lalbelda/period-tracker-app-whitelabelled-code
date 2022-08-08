import React from 'react'
import { assets } from '../../assets/index'
import styled from 'styled-components/native'
import { useTheme } from '../context/ThemeContext'
import { translate } from '../../i18n'
import { TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import * as selectors from '../../redux/selectors'
import _ from 'lodash'

function checkForVerifiedDay(cardValues) {
  if (_.has(cardValues, 'periodDay')) {
    return cardValues.periodDay
  }
  return false
}

function useStatusForSource(isOnPeriod, isOnFertile, themeName, cardValues) {
  const isVerified = checkForVerifiedDay(cardValues)
  const themeIcon = switcher(themeName)

  if (!isVerified && isOnPeriod) return assets.static.icons[themeIcon].notVerifiedDay
  if (isOnPeriod) return assets.static.icons[themeIcon].period
  if (isOnFertile) return assets.static.icons[themeIcon].fertile
  return assets.static.icons[themeIcon].nonPeriod
}

function switcher(value) {
  switch (value) {
    case 'mosaic':
      return 'stars'
    case 'desert':
      return 'circles'
    default:
      return 'clouds'
  }
}

export function DateBadge({ dataEntry, style, textStyle = null, showModal, cardValues }) {
  const { id: themeName } = useTheme()
  // const verifiedDates = useSelector(selectors.userVerifiedDates)

  const source = useStatusForSource(dataEntry.onPeriod, dataEntry.onFertile, themeName, cardValues)
  const cloudAdjust =
    themeName !== 'mosaic' && themeName !== 'desert' ? { left: -3 } : { fontSize: 8, right: -2 }
  return (
    <TouchableOpacity
      accessibilityLabel={`${dataEntry.date.format('DD')}\n${translate(
        dataEntry.date.format('MMM'),
      )}`}
      onPress={() => {
        showModal()
      }}
    >
      <Background
        resizeMode="contain"
        style={[
          style,
          themeName === 'mosaic' && { height: 52, width: 52 },
          themeName === 'desert' && { height: 40, width: 40 },
        ]}
        source={source}
      >
        {/* <DateText style={[textStyle, cloudAdjust, {color: dataEntry.onPeriod && !userVerified ? '#e3629b' : 'white',}]}>
        {`${dataEntry.date.format('DD')}\n${translate(dataEntry.date.format('MMM'))}`}
      </DateText> */}
        <DateText
          style={[
            textStyle,
            cloudAdjust,
            {
              color: dataEntry.onPeriod && !checkForVerifiedDay(cardValues) ? '#e3629b' : 'white',
            },
          ]}
        >
          {`${dataEntry.date.format('DD')}\n${translate(dataEntry.date.format('MMM'))}`}
        </DateText>
      </Background>
    </TouchableOpacity>
  )
}

const Background = styled.ImageBackground`
  width: 55px;
  px;
  justify-content: center;
  align-items: center;
`

const DateText = styled.Text`
  align-items: center;
  text-align: center;
  width: 100%;
  color: white;
  font-size: 10;
  font-family: Roboto-Black;
`
