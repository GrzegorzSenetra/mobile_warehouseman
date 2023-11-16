import * as React from 'react'
import DeleteIcon from '@material-ui/icons/Delete'

export default function File(props: any) {
    return (
        <div style={{paddingBottom: 15}}>
            {props.name}
            <a onClick={() => props.remove()}><DeleteIcon fontSize={"small"} /></a>
        </div>
    )
}