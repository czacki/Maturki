import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import pl from 'date-fns/locale/pl'
import './Form.css'
import Select from 'react-select'

export default function Wrapper() {
  const availableDates = [
    new Date(2020, 0, 10, 10, 15),
    new Date(2020, 0, 12, 12, 15),
    new Date(2020, 0, 11),
    new Date(2020, 0, 13),
    new Date(2020, 0, 16),
  ]
  const checkForMobile = () => {
    window.innerWidth <= 760 ? setMobileVal(true) : setMobileVal(false)
  }
  const [isMobile, setMobileVal] = useState(false)
  window.addEventListener('resize', checkForMobile)
  window.addEventListener('load', checkForMobile)
  return <Form availableDates={availableDates} isMobile={isMobile} />
}

function Form(props) {
  const [isEnglish, setEnglish] = useState(false)
  const availableDates = props.availableDates
  const { register, errors, handleSubmit, watch, control } = useForm()
  const onSubmit = (data) => {
    alert(JSON.stringify(data))
    console.log(watchLang)
  }

  const watchLang = watch('language')
  const checkMobile = (isMob) => (isMob ? 'mobile' : '')
  const languages = [
    { value: 'polish', label: 'Polski' },
    { value: 'english', label: 'Angielski' },
  ]
  const teachersEng = [
    { label: 'Soszka', value: 'soszka' },
    { label: 'Karina', value: 'karina' },
    { label: 'Kuran', value: 'kuran' },
  ]

  const updateLang = () => {
    let x = watchLang
    x.value === 'english' ? setEnglish(true) : setEnglish(false)
  }
  return (
    <div className={`wrapper ${checkMobile(props.isMobile)}`}>
      <h1>Zapisy na matury ustne</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Podaj kod
          <input
            type='text'
            name='code'
            ref={register({
              required: true,
              pattern: /[A-Z]{4}[0-9]{4}/,
              max: 8,
            })}
          />
        </label>

        {errors.code && errors.code.type === 'required' && (
          <p>Kod jest wymagany</p>
        )}
        {errors.code && errors.code.type === 'pattern' && (
          <p>Kod nie spełnia formatu: ABCD1234</p>
        )}
        {errors.code && errors.code.type === 'max' && (
          <p>Kod ma maksymalnie 8 znaków</p>
        )}
        <label>
          Wybierz język
          <Controller
            name='language'
            as={Select}
            options={languages}
            control={control}
            rules={{ required: true }}
            onChange={updateLang}
          />
        </label>

        {errors.language && <p>Wybierz język</p>}
        {isEnglish ? console.log(isEnglish) : console.log(isEnglish)}
        {errors.teacher && <p>Wybierz nauczyciela</p>}
        <Controller
          defaultValue={availableDates[0]}
          control={control}
          name='date'
          render={({ onChange, onBlur, value }) => (
            <DatePicker
              onChange={onChange}
              onBlur={onBlur}
              selected={value}
              showTimeSelect
              timeFormat='HH:mm'
              timeIntervals={15}
              locale={pl}
              timeCaption='godzina'
              includeDates={availableDates}
            />
          )}
        />
        <input type='submit' />
      </form>
    </div>
  )
}
