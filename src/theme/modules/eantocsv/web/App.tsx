import * as React from 'react';
import host from '../../../../config/host';

import RawList from './components/RawList';

interface IProps {}
interface IState {
    duplicates_dict: any
}

export default class App extends React.Component<IProps, IState> {
    constructor(props: any){
        super(props)
        this.state = {
            duplicates_dict: {}
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
            this.fetchFile(file)
        });
    }

    fetchFile = (file: File) => {
        fetch(`${host.server_host}/eantocsv/konwertexcel/plik`, {
            method: 'POST',
            body: file
        })
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            this.setState({ duplicates_dict: responseJson })
        })
        .catch(error => console.log(error))
    }

    render() {
        let list = Object.keys(this.state.duplicates_dict).map((instance: any, key:number) => {
            return (
                <li key={key}>
                    {instance}
                    {Object.keys(this.state.duplicates_dict[instance]).map((item:any, index:number) => <p key={index}>{item != "quantity" ? item : null  }</p>)}
                    <p>{this.state.duplicates_dict[instance]['quantity']}</p>
                </li>
            )
        })
        return (
            <div>
                <h2>.XLS Z KODAMI EAN DO PLIKU .CSV</h2>
                <div style={{ backgroundColor: '#aaa', paddingLeft: 15, paddingRight: 25, paddingTop: 2, paddingBottom: 2, borderRadius: 10 }}>
                    <div style={{ borderColor: 'blue', borderStyle: 'solid', borderRight: 0, borderBottom: 0, borderTop: 0, paddingLeft: 10 }}>
                        <h3>Instrukcja</h3>
                        <p>
                            Aby przekonwertować plik .xls z kodami ean do pliku .csv należy dodać plik .xml, w którym w kolumnie 8 od 2 
                            wiersza zaczynają się kody EAN, a w 7 kolumnie od 2 wiersza są ilości produktów.<br />
                            Następnie zaznacz produkty które chcesz skopiować. Zwróć uwagę że niektóre produkty mają przypisany ten sam 
                            kod kreskowy, w takiej sytuacji wybierz tylko jeden produkt z podlisty kodu kreskowego. <br />
                            Następnie skopiuj produkty klikając "Kopiuj zaznaczone produkty". Produkty skopiują się do schowka i będzie można wkleić 
                            je do dokumentu Enovy. <br />
                            Po skopiowaniu na stronie w lewym dolnym rogu pokaże się informacja o pomyślnym skopiowaniu i przycisk który zmieni listę 
                            na produkty których nie udało się skopiować przez brak kodu EAN w bazie Enovy lub produkty te nie zostały zaznaczone w poprzednim zestawie.
                            <br /> dsdacsad
                        </p>
                    </div>
                </div>
                <div style={{ marginTop: 10, width: "100%" }}>
                    Dodaj plik Excela .xls:
                    <input type="file" id="fileupload" />
                    <RawList duplicates_list={this.state.duplicates_dict} setDuplicatesList={(newList: any) => this.setState({ duplicates_dict: newList })} />
                </div>
            </div>
        )
    }
}