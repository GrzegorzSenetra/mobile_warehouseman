import * as React from 'react'
import { Button } from '@material-ui/core'
import host from '../../../../config/host'

interface IProps {}
interface IState {
    docs: any
}

export default class App extends React.Component <IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            docs: []
        }
    }

    componentDidMount = () => {
        this.fileListener()
    }

    fileListener = () => {
        const fileSelector = document.getElementById('fileupload')
        fileSelector.addEventListener('change', (event: any) => {
            const fileList = event.target.files;
            let file = fileList[0]
            console.log(file)
            this.fetchFile(file)
        });
    }

    fetchFile = (file: File) => {
        fetch(`${host.server_host}/winienima/addfile/file`, {
            method: 'POST',
            body: file
        })
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            this.setState({ docs: responseJson })
            console.log(this.state.docs)
        })
        .catch(error => console.log(error))
    }

    render() {
        let JSX_list_winien = this.state.docs.length > 0 ? create_JSX_list(this.state.docs[0]) : null
        let JSX_list_ma = this.state.docs.length > 0 ? create_JSX_list(this.state.docs[1]) : null
        return (
            <div>
            <h2>PORÓWNYWARKA WINIEN - MA</h2>
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
                <p>Aby porównać kwoty Winien i Ma należy dodać plik excela wygenerowany z Enovy. {`\n`}
                  Aby wygenerować plik z Enovy wchodzimy w księgowość -{'>'} obroty salda, wybieramy konto -{'>'} pokaż zapisy -{'>'} strzałka przy drukarce -{'>'} zapisy na koncie pojedynczo i zaznaczamy druk do pliku 'arkusz Excel'.{`\n`}
                  Wygenerowany plik dodajemy na stronie i czekamy aż skrypt wyrzuci tabele winien i ma zawierające kwotowe różnice między tymi kolumnami.{`\n`}
                  Pokolorowane różnice oznaczają że istnieje kilka tych samych kwot w kolumnie i należy każdą sprawdzić i wyłuskać te które się nie łączą. Może być tak, że kilka kolorowych kwot się nie łączy, wszystkie lub jedna.</p>
              </div>
            </div>
            <div style={{ marginTop: 10, width: "100%" }}>
              Dodaj plik Excela .xls:
              <input type="file" id="fileupload" />
            </div>
            <div>
                {this.state.docs.length > 0 ?
                  <div style={{float: 'left'}}>
                    <h3>Winien:</h3>
                    <table style={{...tableStyle, margin: 'auto'}}>
                      <thead>
                        <tr style={tableStyle}>
                          <th>Kwota</th>
                          <th>Index</th>
                          <th>Data</th>
                          <th>Opis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSX_list_winien}
                      </tbody>
                    </table>
                  </div>
                : null}
                {this.state.docs.length > 0 ?
                  <div style={{float: 'right'}}>
                    <h3>Ma:</h3>
                    <table style={{...tableStyle, margin: 'auto'}}>
                      <thead>
                        <tr style={tableStyle}>
                          <th>Kwota</th>
                          <th>Index</th>
                          <th>Data</th>
                          <th>Opis</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSX_list_ma}
                      </tbody>
                    </table>
                  </div>
                : null}
            </div>
            
        </div>
        )
    }
}

const getRandomColor = () => {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const changeWordColor = (color: any) => {
  var c = color.substring(1); // strip #
  var rgb = parseInt(c, 16); // convert rrggbb to decimal
  var r = (rgb >> 16) & 0xff; // extract red
  var g = (rgb >> 8) & 0xff; // extract green
  var b = (rgb >> 0) & 0xff; // extract blue

  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  if (luma < 120) {
    return 'white'
  }else{
    return 'black'
  }
}


const create_JSX_list = (doc_list: any) => {
    let JSX_list = Object.keys(doc_list).map((item: any, index: number) => {
      let color = getRandomColor()
      let word_color = changeWordColor(color)
        let powtorzenia = doc_list[item]['POWTORZENIA'].map((powtorzenie: any, jndex: number) => {
          let ret = Object.keys(powtorzenie).map((powt_obj: any, yndex: number) => {
            return (
              <tr key={yndex} style={doc_list[item]['POWTORZENIA'].length > 1 ? {...tableStyle, backgroundColor: color, color: word_color} : tableStyle}>
                <td style={tableStyle}>{powt_obj}</td>
                <td style={tableStyle}>{powtorzenie[powt_obj]['DOKUMENT']}</td>
                <td style={tableStyle}>{powtorzenie[powt_obj]['DATA']}</td>
                <td style={{...tableStyle, width: 300, wordBreak: "break-all"}}>{powtorzenie[powt_obj]['OPIS']}</td>
              </tr>
            )
          })
          return ret
        })
        return powtorzenia
    })
    return JSX_list
}

const tableStyle = {
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid'
}