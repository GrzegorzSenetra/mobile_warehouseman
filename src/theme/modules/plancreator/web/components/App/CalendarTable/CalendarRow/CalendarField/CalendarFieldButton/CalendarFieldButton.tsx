import * as React from 'react'
import * as types from '../../../../../../types'

import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'

interface IProps {
    handleClick: any,
    classesButton: any,
    workday: types.Day,
    pworkday: types.Day
}

export default function CalendarFieldButton(props: IProps) {
  return (
    <Button
        variant="outlined"
        onClick={props.handleClick}
        className={props.classesButton}
    >
        {props.workday ?
          props.workday.Zmiana.Godz_pracy
          : props.pworkday ?
            props.pworkday.Zmiana.Godz_pracy
          :
          <AddIcon />
        }
    </Button>
  )
}
