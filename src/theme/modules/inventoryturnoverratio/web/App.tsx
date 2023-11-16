import * as React from 'react'
import { Button } from '@material-ui/core'
import host from '../../../../config/host'

interface IProps {}
interface IState {
    sales: number,
    itr: number,
    inventory: number,
    t: number
}

export default class App extends React.Component <IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            sales: 0,
            itr: 5,
            inventory: 0,
            t: 0
        }
    }

    handleChange = (event:any) => {
        this.setState({ sales: event.target.value })
    }
    handleChangeT = (event:any) => {
        this.setState({ t: event.target.value })
    }

    countInventory = (sales: number, itr: number, t: number) => {
        return (sales * itr)/t
    }

    render() {
        return (
            <div>
            <h2>KALKULATOR ROTACJI ZAPASÓW</h2>
            <div
              style={{
                backgroundColor: "#aaa",
                paddingLeft: 15,
                paddingRight: 25,
                paddingTop: 2,
                paddingBottom: 2,
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  borderColor: "blue",
                  borderStyle: "solid",
                  borderRight: 0,
                  borderBottom: 0,
                  borderTop: 0,
                  paddingLeft: 10,
                }}
              >
                <h3>Instrukcja</h3>
                <p>Menu: Zestawienia -{'>'} Obroty wg towarów -{'>'} wybieramy odpowiednią datę i magazyn, W pole wartość sprzedaży wpisujemy sumę z kolumny (Wartość/P)</p>
              </div>
            </div>
            <div 
              style={{
                marginTop: 20
              }}
            >
                <div>
                    <span style={{marginRight: 10}}>Wartość sprzedaży:</span>
                    <input type="text" value={this.state.sales} onChange={this.handleChange} /><br />
                    <span style={{marginRight: 10}}>Badany okres (w dniach):</span>
                    <input type="text" value={this.state.t} onChange={this.handleChangeT} />
                </div>
                {
                    this.state.sales != 0 && this.state.t != 0 ?
                    <div style={{margin: 'auto', textAlign: 'center', marginTop: 20}}>
                        <span><span style={{fontSize: 20, color: 'green', fontWeight: 500}}>OPTYMALNA</span> WARTOŚĆ ZAPASÓW DLA PODANEJ SPRZEDAŻY WYNOSI<br /></span>
                        <span style={{
                            color: 'green',
                            fontSize: 40
                        }}>{this.countInventory(this.state.sales, this.state.itr, this.state.t).toFixed(2)} zł</span>
                    </div>   
                    :
                    null
                }
                
            </div>
        </div>
        )
    }
}