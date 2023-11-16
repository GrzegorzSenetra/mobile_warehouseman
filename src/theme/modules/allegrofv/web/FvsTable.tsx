import * as React from 'react'
import { useState } from 'react';

interface IProps {
    orders: any
}

export default function FvsTable(props: IProps) {

    const [table, setTable] = useState('')

    console.log("---------FVSTABLE---------")
    console.log(props.orders)

    return (
        <div>
            <table style={border}>
            <thead><tr><th>l.p.</th><th>Nr faktury</th><th>Nazwa</th><th>Data</th><th>Kwota Enova</th><th>Kwota Allegro</th><th>Kwota Presta</th></tr></thead>
            <tbody>
            {props.orders.map((order: any, i: number) => {
                return (
                <tr key={i}>
                    {order.map((field: any, j: number) => {
                        return (
                        <td style={border} key={j}>{field}</td>
                        )
                    })}
                </tr>
                )
            })}
            </tbody>
            </table>
        </div>
    )
}

const border = {
    borderStyle: 'solid',
    borderWidth: '1px',
}