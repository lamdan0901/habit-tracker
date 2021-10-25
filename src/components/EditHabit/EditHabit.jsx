import AddHabit from 'components/AddHabit/AddHabit'
// import { useState } from 'react'
export default function EditHabit(props) {
  return (
    <div>
      {props.modalOpened && (
        <AddHabit
          editModalOpened={props.modalOpened}
          onEditHabit={props.onEditHabit}
          onDeleteHabit={props.onDeleteHabit}
          editMode={true}
          habit={props.habit}
          onCloseModal={props.onCloseModal}
        />
      )}
    </div>
  )
}
