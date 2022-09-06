import clsx from 'clsx'
import { useState } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { toast } from 'react-toastify'
import { StaticTimePicker } from '@mui/x-date-pickers'
import { MobileTimePicker } from '@mui/x-date-pickers'

import MainLayout from '../../layouts/MainLayout'
import { useUtilities } from '../../contexts/UtilitiesProvider'
import './SleepCalculator.scss'

type CalculatingTimeType = Array<{ hour: number | string; minute: number | string }>

export default function SleepCalculator() {
  document.title = 'Sleep Time Calculator'

  const { notifyTime, windowWidth, handleSetNotifyTime } = useUtilities()
  const [resultsShowed, setResultsShowed] = useState(false)
  const [moreInfoShowed, setMoreInfoShowed] = useState(false)
  const [time, setTime] = useState(new Date())

  const initialCalculatingTime: CalculatingTimeType = [
    { hour: 0, minute: 0 },
    { hour: 0, minute: 0 },
    { hour: 0, minute: 0 },
    { hour: 0, minute: 0 },
  ]
  const [calculatedTime, setCalculatedTime] = useState(initialCalculatingTime)

  function calSleepTime() {
    let calculatingTime = initialCalculatingTime

    const hour = ~~time.toString().slice(16, 18),
      minute = ~~time.toString().slice(19, 21)

    for (let i = 0; i < 4; i++) {
      switch (i) {
        case 0: {
          //'3 cycles'
          calculatingTime[i].hour = hour - 4
          calculatingTime[i].minute = minute - 45
          break
        }
        case 1: {
          //'4 cycles'
          calculatingTime[i].hour = hour - 6
          calculatingTime[i].minute = minute - 15
          break
        }
        case 2: {
          //'5 cycles'
          calculatingTime[i].hour = hour - 7
          calculatingTime[i].minute = minute - 45
          break
        }
        case 3: {
          //'6 cycles'
          calculatingTime[i].hour = hour - 9
          calculatingTime[i].minute = minute - 15
          break
        }
        default: {
          break
        }
      }

      if (calculatingTime[i].minute < 0) {
        calculatingTime[i].minute = +calculatingTime[i].minute + 60
        calculatingTime[i].hour = +calculatingTime[i].hour - 1
      }
      if (calculatingTime[i].hour < 0) {
        calculatingTime[i].hour = +calculatingTime[i].hour + 12
        calculatingTime[i].minute += ' PM'
      } else {
        calculatingTime[i].minute += ' AM'
      }

      // add '0' before if hour or minute is less than 10
      if (calculatingTime[i].hour < 10) {
        calculatingTime[i].hour = '0' + calculatingTime[i].hour
      }
      if (~~calculatingTime[i].minute.toString().slice(0, 2) < 10) {
        calculatingTime[i].minute = '0' + calculatingTime[i].minute
      }
    }

    return calculatingTime
  }

  function handleChangeCalculatedTime() {
    setCalculatedTime(calSleepTime())
  }

  function handleSetNotifySleepTime(time: string) {
    handleSetNotifyTime(time)

    const msg =
      time === ''
        ? '✅ Sleep time notification cleared!'
        : `✅ Sleep time notification at ${time} saved!`

    toast(msg, {
      position: 'top-right',
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
    })
  }

  return (
    <MainLayout habits={[]} setIsSearching={() => {}} onSetSearchHabits={() => {}}>
      <div
        className={clsx('sleep-container', (resultsShowed || notifyTime === '') && 'has-overflow')}>
        <div className="sleep-cal">
          <h3>You want to wake up at...</h3>

          <div className="selector-wrapper">
            {windowWidth > 480 ? (
              <StaticTimePicker
                ampm
                orientation={windowWidth > 768 ? 'landscape' : 'portrait'}
                openTo="hours"
                value={time}
                onChange={(val: any) => {
                  setTime(val)
                }}
                renderInput={(params: TextFieldProps) => <TextField {...params} />}
              />
            ) : (
              <MobileTimePicker
                label="Select time"
                orientation="portrait"
                ampm
                value={time}
                onChange={(val: any) => {
                  setTime(val)
                }}
                renderInput={(params: TextFieldProps) => <TextField {...params} />}
              />
            )}

            <button
              className="cal-btn"
              onClick={() => {
                handleChangeCalculatedTime()
                setResultsShowed(true)
              }}>
              Calculate
            </button>
          </div>
        </div>

        <div className={clsx('results', !resultsShowed && 'inactive')}>
          <h3>You should try to fall asleep at one of these following times:</h3>

          <div className="calculated-time">
            <div></div>

            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[0].hour}:${calculatedTime[0].minute}`)
              }}>
              <h1>{`${calculatedTime[0].hour} : ${calculatedTime[0].minute}`}</h1>
              <p>(3 sleep cycles)</p>
            </div>
            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[1].hour}:${calculatedTime[1].minute}`)
              }}>
              <h1>{`${calculatedTime[1].hour} : ${calculatedTime[1].minute}`}</h1>
              <p>(4 sleep cycles)</p>
            </div>

            <div></div>
            <div></div>

            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[2].hour}:${calculatedTime[2].minute}`)
              }}>
              <h1>{`${calculatedTime[2].hour} : ${calculatedTime[2].minute}`}</h1>
              <p>(5 sleep cycles)</p>
            </div>
            <div
              className="item"
              onClick={() => {
                handleSetNotifySleepTime(`${calculatedTime[3].hour}:${calculatedTime[3].minute}`)
              }}>
              <h1>{`${calculatedTime[3].hour} : ${calculatedTime[3].minute}`}</h1>
              <p>(6 sleep cycles)</p>
            </div>

            <div></div>
          </div>

          <div className="reminder-text">
            {notifyTime !== '' ? (
              <div>
                Sleep time notification set at {notifyTime}.
                <button
                  className="clear-reminder-time-btn"
                  onClick={() => {
                    handleSetNotifySleepTime('')
                  }}>
                  Clear
                </button>
              </div>
            ) : (
              'Select one of those to set a reminder to fall asleep at that time.'
            )}
          </div>

          <div className="more-info-wrapper">
            <button
              className="learn-more-btn"
              onClick={() => {
                setMoreInfoShowed(!moreInfoShowed)
              }}>
              {!moreInfoShowed ? 'Learn more' : 'Hide info'}
            </button>

            <div className={clsx('more-info', !moreInfoShowed && 'inactive')}>
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
      </div>
    </MainLayout>
  )
}
