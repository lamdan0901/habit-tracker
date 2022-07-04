import { LegacyRef } from 'react'

interface AuthInputProps {
  icon: any
  inputType: string
  inputRef: LegacyRef<HTMLInputElement>
  placeHolder: string
  parentClass: string
  inputClass: string
}

const AuthInput = ({
  parentClass,
  icon,
  inputType,
  inputRef,
  placeHolder,
  inputClass,
}: AuthInputProps) => {
  return (
    <div className={parentClass}>
      {icon}
      <input type={inputType} ref={inputRef} placeholder={placeHolder} className={inputClass} />
    </div>
  )
}

export default AuthInput
