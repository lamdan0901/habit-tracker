import { MutableRefObject } from 'react'

interface AuthInputProps {
  icon: any
  inputType: string
  inputRef: MutableRefObject<string>
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
      <input
        type={inputType}
        autoComplete={inputType === 'password' ? 'current-password' : ''}
        onChange={(e) => (inputRef.current = e.target.value)}
        placeholder={placeHolder}
        className={inputClass}
      />
    </div>
  )
}

export default AuthInput
