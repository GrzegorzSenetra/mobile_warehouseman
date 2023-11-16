import { List } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import * as React from 'react'
import getServices from '../services/getServices';
import postServices from '../services/postServices';
import CommentIcon from '@material-ui/icons/Comment';
import Select from 'react-select'
import Button from '@material-ui/core/Button'
import FadeMenu from './FadeMenu';
import host from '../../../../../../../config/host';

interface IProps {

}
interface IState {
    products: any,
    window_url_splitted: any,
    authors: any,
    csv: string,
    inwentarisations: any,
    tags_list: any,
    base64image: any,
    selected_tag: string
}

export default class ProductList extends React.Component<IProps, IState> {
    input: any;
    select_tags: any;
    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
            window_url_splitted: window.location.href.split("/"),
            authors: [],
            csv: '',
            inwentarisations: [],
            tags_list: [],
            base64image: '',
            selected_tag: ""
        }
        this.input = React.createRef();
        this.select_tags = React.createRef();
    }
    
    componentDidMount = () => {
        this.getProducts()
        this.get_tags()
    }

    get_preview = (product: any, tag: any) => {
        // let selected_tag = (document.getElementById("labels") as HTMLSelectElement).value
        let selected_tag = tag
        let data = {
          code: product["Kod"],
          EAN: product["EAN"],
          name: product["Nazwa"],
          price: (product["CenaDetaliczna"]*1.23).toFixed(2),
          jm: product["jm"]
        }
        postServices._get_tag_preview(data, selected_tag)
          .then((response: any) => response.json())
          .then((responseJson: any) => {
            this.setState({ base64image: {
              size: [responseJson[1],responseJson[2]],
              code: responseJson[0]
            } })
            console.log(this.state.base64image)
          })
          .catch(error => {
            alert(error)
          })
    }

    get_tags = () => {
        getServices._get_tags_list(1)
        .then((response:any) => response.json())
        .then((responseJson:any) => {
          this.setState({ tags_list: responseJson })
          console.log(responseJson)
        })
        .catch(error => alert(error))
    }

    removeDuplicates = (arr: any) => {
        let set = arr.filter((item: any, index: number) => arr.indexOf(item) === index)
        return set
    }

    getProducts = () => {
        let window_url_splitted = window.location.href.split("/");
        let id_doc = window_url_splitted[window_url_splitted.length - 1];
        getServices._getProductsInDocument(id_doc)
            .then((response: any) => response.json())
            .then((responseJson: any) => {
                console.log(responseJson);
                this.setState({ products: responseJson })
                // SPRAWDZANIE JACY AUTORZY MAJA DOKUMENTY INWENTARYZACYJNE W TYM DOKUMENCIE

                let tmp_authors: any = [];
                responseJson.map((item: any, index: number) => {
                    if (item['Author']) {
                        tmp_authors.push(item['Author']['Name'] + " " + item['Author']['Surname'])
                    }
                })
                console.log('Authors:::');
                console.log(tmp_authors);
                this.setState({ authors: this.removeDuplicates(tmp_authors) })
                // KONIEC - SPRAWDZANIE JACY AUTORZY MAJA DOKUMENTY INWENTARYZACYJNE W TYM DOKUMENCIE

                // SPRAWDZANIE JAKIE DOKUMENTY INWENTARYZACYJNE SA PRZYPISANE DO PRODUKTOW W TYM DOKUMENCIE
                let inwentarisations: any = [];
                responseJson.map((item: any, index: number) => {
                    if (item['Inwentaryzacja']) {
                        inwentarisations.push(item['Inwentaryzacja'])
                    }
                })
                console.log('INWENTARISATIONS:::');
                console.log(inwentarisations);
                this.setState({ inwentarisations: this.removeDuplicates(inwentarisations) })
                // KONIEC - SPRAWDZANIE JAKIE DOKUMENTY INWENTARYZACYJNE SA PRZYPISANE DO PRODUKTOW W TYM DOKUMENCIE
            })
            .catch(error => console.log(error))
    }

    exportToCSV = () => {
        console.log("EXPORT TO CSV")
    }

    handleExportPress = (type: string) => {
        let body = this.state.products;
        // let export_buttons_html_elements = document.getElementsByTagName('button')
        document.body.style.cursor = 'wait'
        postServices._exportToCSV(type, body)
            .then((response: any) => response.json())
            .then((responseJson: any) => {
                console.log(responseJson);
                this.copyToClipboard(responseJson);
            })
            .then(() => document.body.style.cursor = 'default')
            .catch(error => console.log(error))
    }
    copyToClipboard = (str: string) => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
    lightOrDark = (color: any) => {
        let r, g, b, hsp;
        // Check the format of the color, HEX or RGB?
        if (color.match(/^rgb/)) {

            // If HEX --> store the red, green, blue values in separate variables
            color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

            r = color[1];
            g = color[2];
            b = color[3];
        }
        else {

            // If RGB --> Convert it to HEX: http://gist.github.com/983661
            color = +("0x" + color.slice(1).replace(
                color.length < 5 && /./g, '$&$&'
            )
            );

            r = color >> 16;
            g = color >> 8 & 255;
            b = color & 255;
        }

        // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
        hsp = Math.sqrt(
            0.299 * (r * r) +
            0.587 * (g * g) +
            0.114 * (b * b)
        );

        // Using the HSP value, determine whether the color is light or dark
        if (hsp > 127.5) {

            return 'light';
        }
        else {

            return 'dark';
        }
    }

    print_all_tags = () => {
        let window_url_splitted = window.location.href.split("/")
        let id_doc = window_url_splitted[window_url_splitted.length - 1]
        // let selected_tag = (document.getElementById("labels") as HTMLSelectElement).value;
        let selected_tag = this.state.selected_tag
        document.body.style.cursor = 'wait'
        getServices._printAllTags(id_doc, selected_tag)
            .then((response:any) => console.log(response))
            // .then((response:any) => response.blob())
            .then((blob: any) => {
                // const url = window.URL.createObjectURL(new Blob([blob]));
                const url = `${host.server_host}/print_all_tags/${id_doc}/${selected_tag}`
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `etykiety.docx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .then(() => document.body.style.cursor = 'default')
            .catch(error => console.log(error))
    }

    generate_HTML_select = () => {
        let select = `<select name="labels" id="labels" onClick=${() => {console.log('testest')}}>`
        if(this.state.tags_list.length > 1){
            this.state.tags_list.map((tag:any, index: number) => {
                select += `<option key="${index}" value="${tag.filename}">${tag.filename}</option>`
            });
        }
        select += '</select>'
        return select
    }

    handleChange = (e:any) => {
        this.setState({ selected_tag: e.value })
        this.get_preview(this.state.products[0].Product, e.value)
    }

    render() {
        let HTML_select_tags = this.generate_HTML_select()
        const options: any[] = []
        this.state.tags_list.map((tag: any, index: number) => {
            options.push({ value: tag.filename, label: tag.filename })
        })
        return (
            <List className="List">
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <h1>Kopiuj produkty do Enovy</h1>
                        <div style={{ backgroundColor: '#aaa', paddingLeft: 15, paddingRight: 25, paddingTop: 2, paddingBottom: 20, borderRadius: 10, marginBottom: 20 }}>
                            <div style={{ borderColor: 'blue', borderStyle: 'solid', borderRight: 0, borderBottom: 0, borderTop: 0, paddingLeft: 10 }}>
                                <h3>Instrukcja</h3>
                                    <p>Aby skopiować produkty do dokumentu Enovy należy kliknąć:</p>
                                <ul>
                                    <li>EXPORT BRAK - kopiuje produkty nie przypisane do żadnej inwentaryzacji</li>
                                    <li>EXPORT WSZYSTKO - kopiuje wszyskie produkty z tego dokumentu</li>
                                    <li>EXPORT {'<'}NR INWENTARYZACJI{'>'} - kopiuje produkty przipisane do danej inwentaryzaji</li>
                                </ul>
                            </div>
                        </div>
                        <Button variant="contained" color="primary" onClick={() => this.handleExportPress('EXPORT_BRAK')}>
                            EXPORT BRAK
                        </Button>
                        <Button variant="contained" color="primary" onClick={() => this.handleExportPress('EXPORT_ALL')}>
                            EXPORT WSZYSTKO
                        </Button>
                            {/* <button className="export_buttons" onClick={() => this.handleExportPress('EXPORT_BRAK')}>EXPORT BRAK</button>
                                    <button className="export_buttons" onClick={() => this.handleExportPress('EXPORT_ALL')}>EXPORT WSZYSTKO</button> */}
                                    {/* {this.state.authors.map((item: any, index: number) => {
                                        if (item) {
                                            return <button key={index} onClick={() => {
                                                this.handleExportPress('EXPORT_' + item)
                                            }}>Export {item}</button>
                                        }
                                    })} */}
                                    {this.state.inwentarisations.map((item: any, index: number) => {
                                        if (item) {
                                            return <button className="export_buttons" key={index} onClick={() => {
                                                //console.log('EXPORT_' + item);
                                                this.handleExportPress('EXPORT_' + item.replaceAll("/","-"))
                                            }}>Export {item}</button>
                                        }
                                    })}
                    </Grid>
                    <Grid item xs={6}>
                        <h1>Drukuj etykiety</h1>
                        <div style={{ backgroundColor: '#aaa', paddingLeft: 15, paddingRight: 25, paddingTop: 2, paddingBottom: 20, borderRadius: 10, marginBottom: 20 }}>
                            <div style={{ borderColor: 'blue', borderStyle: 'solid', borderRight: 0, borderBottom: 0, borderTop: 0, paddingLeft: 10 }}>
                                <h3>Instrukcja</h3>
                                    <p>Aby wydrukować etykiety na kartce w formacie A4 należy:</p>
                                    <ul>
                                        <li>wybrać schemat metki</li>
                                        <li>kliknąć przycisk drukuj metki</li>
                                        <li>poczekać (czasem dłuższą chwilę) aż zostanie pobrany plik Word (.docx), otworzyć plik i go wydrukować (ctrl+p)</li>
                                    </ul>
                            </div>
                        </div>
                        <div>
                            <Select options={options} onChange={this.handleChange} style={{ width: 200}} placeholder="Wybierz metkę" />
                            <span>ROZMIAR METKI (mm): [{this.state.base64image == '' ? 0 : (this.state.base64image.size[0]/7.98).toFixed(0)}, {this.state.base64image == '' ? 0 : (this.state.base64image.size[1]/7.98).toFixed(0)}]</span>
                            <Button variant="contained" color="primary" onClick={() => this.print_all_tags()} 
                            style={{
                                float:'right',
                                top: 10
                                }}>
                                DRUKUJ METKI
                            </Button>
                            {/* <Button variant="contained" color="primary" 
                            style={{
                                float:'right',
                                top: 10
                                }}
                                href={`${host.server_host}/label_creator`}>
                                KREATOR METEK
                            </Button> */}
                        </div>
                        <img style={{ 
                            top: 10, 
                            borderWidth: 1, 
                            borderColor:'hsl(0, 0%, 80%)', 
                            borderStyle: 'solid', 
                            borderRadius: 20, 
                            margin: 'auto', 
                            width: this.state.base64image == '' ? 100 : this.state.base64image.size[0],
                            position: 'relative' }} src={`data:image/png;base64,${this.state.base64image.code}`} alt="Wybierz schemat metki"></img>
                    </Grid>
                </Grid>
                <div style={{...styles.GridComponent, borderBottomLeftRadius: 0, borderBottomRightRadius: 0,}}>
                    <Grid className="Grid" container spacing={3}>
                        <Grid item xs>

                        </Grid>
                        <Grid item xs>
                            <h4>Dokument: {decodeURI(this.state.window_url_splitted[this.state.window_url_splitted.length - 2])}</h4>
                        </Grid>
                        <Grid item xs>
                        </Grid>
                    </Grid>
                    <ListItem style={{ borderBottom: 'solid 1px' }}>
                        <Grid className="Grid" container spacing={3}>
                            <Grid item xs>
                                Produkt
                            </Grid>
                            <Grid item xs>
                                Pracownik
                            </Grid>
                            <Grid item xs>
                                Nr Inwentaryzacji
                            </Grid>
                        </Grid>
                        <ListItemSecondaryAction style={{ alignItems: 'center' }}>
                            {/* <FadeMenu authors={this.state.authors}
                                press={(type: string) => this.handleExportPress(type)}
                                cp={() => this.copyToClipboard("dupa")} /> */}
                            
                        </ListItemSecondaryAction>
                    </ListItem>
                    {this.state.products.map((item: any, index: number) => {

                        return (
                            <ListItem
                                key={index}
                                role={undefined}
                                dense
                                button
                                onClick={() => this.lightOrDark(item['Product']['color'] ? item['Product']['color'] : '#8bc34a')}
                                style={{
                                    backgroundColor: item['Product']['color'] ? item['Product']['color'] : '#8bc34a',
                                    color: this.lightOrDark(item['Product']['color'] ? item['Product']['color'] : '#8bc34a') == 'dark' ? 'white' : 'black'
                                }}>

                                <Grid className="Grid" container spacing={3}>
                                    <Grid item xs>
                                        <ListItemText primary={`Index: ${item['Product']['Kod']}`} />
                                        <ListItemText primary={`Nazwa: ${item['Product']['Nazwa']}`} />
                                        <ListItemText primary={`Ilość: ${item['Quantity']} ${item['Product']['jm']}`} />
                                        <ListItemText primary={`Stan magazynowy: ${item['Product']['Ilosc']} ${item['Product']['jm']}`} />
                                    </Grid>
                                    <Grid item xs>
                                        <ListItemText primary={`${item['Author'] ? item['Author']['Name'] + " " + item['Author']['Surname'] : "Brak"}`} />
                                    </Grid>
                                    <Grid item xs>
                                        <ListItemText primary={`${item['Author'] ? item["Inwentaryzacja"] : "Brak"}`} />
                                    </Grid>
                                </Grid>
                                <ListItemSecondaryAction>

                                </ListItemSecondaryAction>
                            </ListItem>
                        );
                    })}
                </div>
            </List> 
        );
    }
}

const styles = {
    GridComponent: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 10,
        borderColor: 'hsl(0, 0%, 80%)',
        marginTop: 50
    }
}