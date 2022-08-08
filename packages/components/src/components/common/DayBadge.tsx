import React from 'react'
import { assets } from '../../assets/index'
import styled from 'styled-components/native'
import { TextWithoutTranslation, Text } from './Text'
import _ from 'lodash'

function checkForVerifiedDay(cardValues) {
  if (_.has(cardValues, 'periodDay')) {
    return cardValues.periodDay
  }
  return false
}
function useStatusForSource(isOnPeriod, isOnFertile, cardValues) {
  const isVerified = checkForVerifiedDay(cardValues)

  if (isOnPeriod && isVerified) return assets.static.dayBadge.onPeriod
  if (isOnPeriod && !isVerified) return assets.static.dayBadge.notVerifiedDay
  if (isOnFertile) return assets.static.dayBadge.onFertile
  // if (isOnPeriod && !periodVerified) return assets.static.dayBadge.notVerifiedDay
  return assets.static.dayBadge.default
}

export const DayBadge = ({ dataEntry, style, fontSizes, cardValues }) => {
  const source = useStatusForSource(dataEntry.onPeriod, dataEntry.onFertile, cardValues)
  return (
    <Background
      accessibilityLabel={`day ${dataEntry.cycleDay === 0 ? '-' : dataEntry.cycleDay}`}
      resizeMode="contain"
      style={style}
      source={source}
    >
      <DayText
        style={{
          color: dataEntry.onPeriod && !checkForVerifiedDay(cardValues) ? '#e3629b' : 'white',
          fontSize: fontSizes.small,
          textTransform: 'capitalize',
        }}
      >
        day
      </DayText>
      <NumberText
        style={{
          fontSize: fontSizes.big,
          color: dataEntry.onPeriod && !checkForVerifiedDay(cardValues) ? '#e3629b' : 'white',
        }}
      >
        {dataEntry.cycleDay === 0 ? '-' : dataEntry.cycleDay}
      </NumberText>
    </Background>
  )
}

const Background = styled.ImageBackground`
  width: 90px;
  height: 40px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 18px;
`

const NumberText = styled(TextWithoutTranslation)`
  color: white;
  font-size: 28;
  font-family: Roboto-Black;
`

const DayText = styled(Text)`
  color: white;
  font-size: 28;
  font-family: Roboto-Black;
`
