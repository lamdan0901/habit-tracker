import React from 'react'
import TextField from '@mui/material/TextField'
import StaticTimePicker from '@mui/lab/StaticTimePicker'
import MobileTimePicker from '@mui/lab/MobileTimePicker'

import { useState } from 'react'

import MainLayout from 'layouts/MainLayout'
import './SleepCalculator.scss'

export default function SleepCalculator(props) {
  document.title = 'Sleep Time Calculator'

  const [resultsShowed, setResultsShowed] = useState(false)
  const [moreInfoShowed, setMoreInfoShowed] = useState(false)

  const [time, setTime] = useState(new Date())

  const [calculatedTime, setCalculatedTime] = useState({
    sleepTime1: { hour: 0, minute: 0 },
    sleepTime2: { hour: 0, minute: 0 },
    sleepTime3: { hour: 0, minute: 0 },
    sleepTime4: { hour: 0, minute: 0 },
  })

  function calSleepTime(numOfCycles) {
    let sleepTime = { hour: 0, minute: 0 }

    const hour = ~~time.toString().slice(16, 18),
      minute = ~~time.toString().slice(19, 21)

    switch (numOfCycles) {
      case '3 cycles': {
        sleepTime.hour = hour - 4
        sleepTime.minute = minute - 45
        break
      }
      case '4 cycles': {
        sleepTime.hour = hour - 6
        sleepTime.minute = minute - 15
        break
      }
      case '5 cycles': {
        sleepTime.hour = hour - 7
        sleepTime.minute = minute - 45
        break
      }
      case '6 cycles': {
        sleepTime.hour = hour - 9
        sleepTime.minute = minute - 15
        break
      }
      default: {
        break
      }
    }

    if (sleepTime.minute < 0) {
      sleepTime.minute = 60 + sleepTime.minute
      sleepTime.hour -= 1
    }
    if (sleepTime.hour < 0) {
      sleepTime.hour = 12 + sleepTime.hour
      sleepTime.minute += ' PM'
    } else {
      sleepTime.minute += ' AM'
    }

    // add '0' before if hour or minute is less than 10
    if (sleepTime.hour < 10) {
      sleepTime.hour = '0' + sleepTime.hour
    }
    if (~~sleepTime.minute.toString().slice(0, 2) < 10) {
      sleepTime.minute = '0' + sleepTime.minute
    }

    return sleepTime
  }

  function handleCalculatedTimeChange() {
    let sleepTime1 = calSleepTime('3 cycles'),
      sleepTime2 = calSleepTime('4 cycles'),
      sleepTime3 = calSleepTime('5 cycles'),
      sleepTime4 = calSleepTime('6 cycles')

    setCalculatedTime(() => ({
      sleepTime1,
      sleepTime2,
      sleepTime3,
      sleepTime4,
    }))
  }

  return (
    <MainLayout
      clockState={props.clockState}
      sidebarOpen={props.sidebarOpen}
      setSidebarOpen={props.setSidebarOpen}>
      <div className="sleep-cal">
        <h3>You want to wake up at...</h3>

        <div className="selector-wrapper">
          {props.windowWidth > 480 ? (
            <StaticTimePicker
              ampm
              orientation={props.windowWidth > 768 ? 'landscape' : 'portrait'}
              openTo="hours"
              value={time}
              onChange={(newValue) => {
                setTime(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          ) : (
            <MobileTimePicker
              label="Select time"
              orientation="portrait"
              ampm
              value={time}
              onChange={(newValue) => {
                setTime(newValue)
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          )}

          <button
            className="cal-btn"
            onClick={() => {
              handleCalculatedTimeChange()
              setResultsShowed(true)
            }}>
            Calculate
          </button>
        </div>
      </div>

      <div className={resultsShowed ? 'results' : 'results inactive'}>
        <h3>You should try to fall asleep at one of these following times:</h3>

        <div className="calculated-time">
          <div></div>

          <div className="item">
            <h1>{`${calculatedTime.sleepTime1.hour} : ${calculatedTime.sleepTime1.minute}`}</h1>
            <p>(3 sleep cycles)</p>
          </div>
          <div className="item">
            <h1>{`${calculatedTime.sleepTime2.hour} : ${calculatedTime.sleepTime2.minute}`}</h1>
            <p>(4 sleep cycles)</p>
          </div>

          <div></div>
          <div></div>

          <div className="item">
            <h1>{`${calculatedTime.sleepTime3.hour} : ${calculatedTime.sleepTime3.minute}`}</h1>
            <p>(5 sleep cycles)</p>
          </div>
          <div className="item">
            <h1>{`${calculatedTime.sleepTime4.hour} : ${calculatedTime.sleepTime4.minute}`}</h1>
            <p>(6 sleep cycles)</p>
          </div>

          <div></div>
        </div>

        <div className="more-info-wrapper">
          <button
            className="learn-more-btn"
            onClick={() => {
              setMoreInfoShowed(!moreInfoShowed)
            }}>
            {!moreInfoShowed ? 'Learn more' : 'Hide info'}
          </button>

          <div className={moreInfoShowed ? 'more-info' : 'more-info inactive'}>
            <p>
              The average human takes <strong>fifteen minutes</strong> to fall asleep, so we added
              it to the calculation.
            </p>
            <p>
              Waking up in the middle of a sleep cycle leaves you feeling tired and groggy, but
              waking up in between cycles wakes you up feeling refreshed and alert!
            </p>
            <a
              href="https://www.sleephealthfoundation.org.au/good-sleep-habits.html"
              target="_blank"
              rel="noreferrer">
              Click here to find out more about good sleep habits
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
