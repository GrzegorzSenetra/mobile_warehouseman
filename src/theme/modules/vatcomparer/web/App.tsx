import { Button } from '@material-ui/core';
import * as React from 'react';
import host from '../../../../config/host';

import File from './File'

interface IProps {}
interface IState {
    files: any,
    duplicates_dict: any,
    documents: any
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props)
        this.state = {
            files: [],
            duplicates_dict: {},
            documents: []
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
            console.log(file.name)
            this.setState({ files: [...this.state.files, file] })
        });
    }

    fetchFile = (files: Array<File>) => {
        const formData = new FormData()
        files.map(file => formData.append("myFiles", file))
        fetch(`${host.server_host}/vatcomparer/addfile`, {
            method: 'POST',
            body: formData
        })
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            this.setState({ documents: responseJson })
            console.log(this.state.documents)
        })
        .catch(error => console.log(error))
    }

    remove_file = (key: number) => {
        let files = this.state.files
        files.splice(key, 1)
        this.setState({ files: files })
    }

    render() {
        console.log(this.state.files)
        let JSX_filelist = this.state.files.map((file: any, index: number) => {
            return (<File key={index} name={file.name} remove={() => this.remove_file(index)} />)
        })
        let documents = this.state.documents.map((document:any,index:number) => {
          return (
            <tr key={index} style={tableStyle}>
              <td style={tableStyle}>{document}</td>
              <td style={tableStyle}></td>
            </tr>
          )
        })
        return (
          <div>
            <h2>PORÓWNYWARKA DOKUMENTÓW VAT</h2>
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
                <p>Aby ...</p>
              </div>
            </div>
            <div style={{ marginTop: 10, width: "100%" }}>
              Dodaj plik Excela .xls:
              <input type="file" id="fileupload" />
            </div>
            {this.state.files.length > 0 ? (
              <div>
                <p>Lista dodanych plików:</p>
                {JSX_filelist}
              </div>
            ) : null}
            <Button
              style={{ float: "right" }}
              variant="contained"
              color="primary"
              disabled={this.state.files.length == 2 ? false : true}
              onClick={() => this.fetchFile(this.state.files)}
            >
              Porównaj pliki
            </Button>
            {this.state.documents.length > 0 ?
              <div>
                <h3>Wynik:</h3>
                <table style={{...tableStyle, margin: 'auto'}}>
                  <thead>
                    <tr style={tableStyle}>
                      <th>Index dokumentu</th>
                      <th>Kwota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents}
                  </tbody>
                </table>
              </div>
            : null}
          </div>
        );
    }
}

const tableStyle = {
  borderWidth: 1,
  borderColor: 'black',
  borderStyle: 'solid'
}