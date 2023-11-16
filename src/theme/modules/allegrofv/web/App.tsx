import * as React from 'react';
import host from '../../../../config/host';
import { Button } from '@material-ui/core';

import Header from './Header'
import FvsTable from './FvsTable'

interface IProps {}
interface IState {
    orders_tab: any,
    date: any,
    file: File
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props)
        this.state = {
            orders_tab: [],
            date: ['', ''],
            file: null
        }
    }

    componentDidMount = () => {
        this.fileListener()
    }

    fileListener = () => {
        const fileSelector = document.getElementById('fileupload');
        fileSelector.addEventListener('change', (event: any) => {
            const fileList = event.target.files;
            let file = fileList[0]
            this.setState({ file: file })
        });
    }

    fetchFile = (file: File, date: any) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('date_start', date[0])
        formData.append('date_stop', date[1])
        
        fetch(`${host.server_host}/allegro_fv/fvfinder/file`, {
            method: 'POST',
            body: formData
        })
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            console.log(responseJson)
            this.setState({ orders_tab: responseJson[4] })
        })
        .catch(error => console.log(error))
    }

    convertDate = (date:any) => {
        return [date[0]+" 00:00:00.000", date[1]+" 00:00:00.000"]
    }

    handleDateChange = (e: any, which: number) => {
        if(!which) this.setState({ date: [e.target.value, this.state.date[1]] })
        else this.setState({ date: [this.state.date[0], e.target.value] })
    }

    runScript = () => {
        let date = this.convertDate(this.state.date)
        if(this.state.file) this.fetchFile(this.state.file, date)
    }

    render() {
        return (
          <div>
            <Header />
            <div style={{ float: 'left' }}>
              <div style={{ marginTop: 10, width: "100%" }}>
                Dodaj plik Excela .xls:
                <input type="file" id="fileupload" />
                &nbsp;Start:
                <input
                  type="date"
                  id="start"
                  name="fv-start"
                  value={this.state.date[0]}
                  onChange={(e) => this.handleDateChange(e, 0)}
                />
                &nbsp;Koniec:
                <input
                  type="date"
                  id="stop"
                  name="fv-stop"
                  value={this.state.date[1]}
                  onChange={(e) => this.handleDateChange(e, 1)}
                />
              </div>
              <div style={{ float: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={(this.state.date[0] == '' || this.state.date[1] == '' || !this.state.file) ? true : false}
                  onClick={() => this.runScript()}
                >
                  Wyszukaj faktury
                </Button>
              </div>
            </div>
            <div style={{ float: 'left' }}>
              <FvsTable orders={this.state.orders_tab} />
            </div>
          </div>
        );
    }
}