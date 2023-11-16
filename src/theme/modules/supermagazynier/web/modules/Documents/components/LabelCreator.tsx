import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, Checkbox } from '@material-ui/core';
import postServices from '../services/postServices';
import getServices from '../services/getServices';
import deleteServices from '../services/deleteServices';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Grid } from '@material-ui/core';
import AlertDialogSlide from './Dialog/AlertDialogSlide';

interface IProps {

}
interface IState {
    label: ILabel,
    product_name: {
        font_size: number,
        X: number,
        Y: number,
    },
    barcode: {
        X: number,
        Y: number,
        width: number,
        height: number,
    },
    indexBarcode: {
        X: number,
        Y: number,
        width: number,
        height: number,
    },
    index: {
        X: number,
        Y: number,
        font_size: number,
    },
    price: {
        X: number,
        Y: number,
        font_size: number,
    },
    jm: {
        X: number,
        Y: number,
        font_size: number,
    },
    base64image: any,
    checkboxes: Array<boolean>,
    labels_list: Array<string>,
    show_labels_list: boolean,
    openDialog: boolean,
    dialogQuestionText: string,
    dialogDescriptionText: string,
    labelNameToDelete: string,
    editModalVisible: boolean
}

interface ILabel {
    title?: string,
    width?: number,
    height?: number
}

type LabelFields = {
  label: ILabel,
  product_name: Object,
  barcode: Object,
  indexBarcode: Object,
  index: Object,
  price: Object,
  jm: Object,
  base64image: Object,
  checkboxes: Array<string>,
  labels_list: Array<any>,
  show_labels_list: Boolean,
  openDialog: Boolean,
  dialogQuestionText: String,
  dialogDescriptionText: String,
  labelNameToDelete: String
};

export default class LabelCreator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      label: {
        title: "",
        width: 50,
        height: 40,
      },
      product_name: {
        font_size: 2.8,
        X: 25,
        Y: 6,
      },
      barcode: {
        X: 25,
        Y: 6,
        height: 5,
        width: 0.25,
      },
      indexBarcode: {
        X: 25,
        Y: 12,
        height: 5,
        width: 0.25,
      },
      index: {
        font_size: 3,
        X: 24,
        Y: 18,
      },
      price: {
        font_size: 11,
        X: 25,
        Y: 32,
      },
      jm: {
        font_size: 3.5,
        X: 40,
        Y: 37.5,
      },
      base64image: {
        size: [50, 40],
        code: "",
      },
      checkboxes: [true, true, true, true, true, true],
      labels_list: [],
      show_labels_list: false,
      openDialog: false,
      dialogQuestionText: "",
      dialogDescriptionText: "",
      labelNameToDelete: "",
      editModalVisible: false
    };
  }

  componentDidMount(): void {
    this.getAllLabels();
  }

  show_preview = () => {
    let data = {
      checkboxes: this.state.checkboxes,
      label: this.state.label,
      product_name: this.state.product_name,
      barcode: this.state.barcode,
      indexBarcode: this.state.indexBarcode,
      index: this.state.index,
      price: this.state.price,
      jm: this.state.jm,
    };
    postServices
      ._postLabelPreview("preview", data)
      .then((response: any) => response.json())
      .then((responseJson: any) => {
        console.log(responseJson);
        this.setState({
          base64image: { size: responseJson.size, code: responseJson.image },
        });
      })
      .catch((error) => console.log(error));
  };

  create_label = () => {
    let data = {
      checkboxes: this.state.checkboxes,
      label: this.state.label,
      product_name: this.state.product_name,
      barcode: this.state.barcode,
      indexBarcode: this.state.indexBarcode,
      index: this.state.index,
      price: this.state.price,
      jm: this.state.jm,
    };
    postServices
      ._postLabelPreview("create", data)
      .then((response: any) => response.json())
      .then((responseJson: any) => {
        console.log(responseJson);
        this.getAllLabels();
      })
      .catch((error) => {
        this.setState({editModalVisible: true})
      });
  };

  // Label
  handleChangeLabelTitle = (e: any) => {
    this.setState({ label: { ...this.state.label, title: e.target.value } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeLabelWidth = (e: any) => {
    this.setState({ label: { ...this.state.label, width: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeLabelHeight = (e: any) => {
    this.setState({ label: { ...this.state.label, height: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };

  // Product_name
  handleChangeProductNameFont = (e: any) => {
    this.setState({
      product_name: { ...this.state.product_name, font_size: e.target.value },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeProductNameX = (e: any) => {
    this.setState({
      product_name: { ...this.state.product_name, X: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeProductNameY = (e: any) => {
    this.setState({
      product_name: { ...this.state.product_name, Y: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };

  // Barcode
  handleChangeBarcodeX = (e: any) => {
    this.setState({ barcode: { ...this.state.barcode, X: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeBarcodeY = (e: any) => {
    this.setState({ barcode: { ...this.state.barcode, Y: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeBarcodeWidth = (e: any) => {
    this.setState({
      barcode: { ...this.state.barcode, width: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeBarcodeHeight = (e: any) => {
    this.setState({
      barcode: { ...this.state.barcode, height: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };

  // Index Barcode
  handleChangeIndexBarcodeX = (e: any) => {
    this.setState({
      indexBarcode: { ...this.state.indexBarcode, X: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeIndexBarcodeY = (e: any) => {
    this.setState({
      indexBarcode: { ...this.state.indexBarcode, Y: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeIndexBarcodeWidth = (e: any) => {
    this.setState({
      indexBarcode: { ...this.state.indexBarcode, width: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeIndexBarcodeHeight = (e: any) => {
    this.setState({
      indexBarcode: { ...this.state.indexBarcode, height: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };

  // Index
  handleChangeIndexFont = (e: any) => {
    this.setState({
      index: { ...this.state.index, font_size: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeIndexX = (e: any) => {
    this.setState({ index: { ...this.state.index, X: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeIndexY = (e: any) => {
    this.setState({ index: { ...this.state.index, Y: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };

  // Price
  handleChangePriceFont = (e: any) => {
    this.setState({
      price: { ...this.state.price, font_size: parseFloat(e.target.value) },
    });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangePriceX = (e: any) => {
    this.setState({ price: { ...this.state.price, X: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangePriceY = (e: any) => {
    this.setState({ price: { ...this.state.price, Y: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };

  // Jm
  handleChangeJmFont = (e: any) => {
    this.setState({ jm: { ...this.state.jm, font_size: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeJmX = (e: any) => {
    this.setState({ jm: { ...this.state.jm, X: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };
  handleChangeJmY = (e: any) => {
    this.setState({ jm: { ...this.state.jm, Y: parseFloat(e.target.value) } });
    setTimeout(() => this.show_preview(), 500);
    // this.show_preview()
  };

  getAllLabels = () => {
    getServices
      ._getAllLabels()
      .then((response: any) => response.json())
      .then((responseJson: any) => this.setState({ labels_list: responseJson }))
      .catch((error) => console.log(error));
  };

  handleClickOpen = (dialogQuestionText: string, dialogDescriptionText: string): void => {
    this.setState({
        dialogDescriptionText: dialogDescriptionText,
        dialogQuestionText: dialogQuestionText, 
        openDialog: true
    });
  };

  handleClose = () => {
    this.setState({ openDialog: false, editModalVisible: false })
  };

  removeLabel = () => {
      deleteServices._deleteLabel(this.state.labelNameToDelete)
      .then((response: any) => {
          if(response.status == 200) return response.json()
      })
      .then((responseJson: any) => {
          console.log(responseJson)
          this.getAllLabels()
      })
      .catch(error => console.log(error))
  }

  handleEdit = (labelName: string) => {
    console.log("EDIT ACTION");
    location.href = "#";
    location.href = "#label-creator";

    getServices._getLabelParams(labelName)
    .then((response: any) => response.json())
    .then((responseJson: any) => {
      this.setState({base64image: { size: responseJson[0].size, code: responseJson[0].image },})
      this.setEditLabelState(responseJson[1])
    })
    .catch(error => {
      console.log(error)
    })
  }

  // @LABEL PARAMS STATE
  //
  // label: {
  //   title: "",
  //   width: 50,
  //   height: 40,
  // },
  // product_name: {
  //   font_size: 2.8,
  //   X: 25,
  //   Y: 6,
  // },
  // barcode: {
  //   X: 25,
  //   Y: 6,
  //   height: 5,
  //   width: 0.25,
  // },
  // indexBarcode: {
  //   X: 25,
  //   Y: 12,
  //   height: 5,
  //   width: 0.25,
  // },
  // index: {
  //   font_size: 3,
  //   X: 24,
  //   Y: 18,
  // },
  // price: {
  //   font_size: 11,
  //   X: 25,
  //   Y: 32,
  // },
  // jm: {
  //   font_size: 3.5,
  //   X: 40,
  //   Y: 37.5,
  // },
  // base64image: {
  //   size: [50, 40],
  //   code: "",
  // },
  // checkboxes: [true, true, true, true, true, true],

  setEditLabelState = (params: any) => {
    console.log(params)
    this.setState({
      label: {
        title: params.name,
        width: parseFloat(params.size[0]),
        height: parseFloat(params.size[1])
      },
      product_name: {
        font_size: parseFloat(params.opis_towaru.size),
        X: parseFloat(params.opis_towaru.x),
        Y: parseFloat(params.opis_towaru.y)
      },
      barcode: {
        X: parseFloat(params.barcode.x),
        Y: parseFloat(params.barcode.y),
        height: parseFloat(params.barcode.height),
        width: parseFloat(params.barcode.width),
      },
      indexBarcode: {
        X: parseFloat(params.indexBarcode.x),
        Y: parseFloat(params.indexBarcode.y),
        height: parseFloat(params.indexBarcode.height),
        width: parseFloat(params.indexBarcode.width),
      },
      index: {
        font_size: parseFloat(params.index.size),
        X: parseFloat(params.index.x),
        Y: parseFloat(params.index.y),
      },
      price: {
        font_size: parseFloat(params.cena.size),
        X: parseFloat(params.cena.x),
        Y: parseFloat(params.cena.y),
      },
      jm: {
        font_size: parseFloat(params.jm.size),
        X: parseFloat(params.jm.x),
        Y: parseFloat(params.jm.y),
      }
    })

    let tmp_checkboxes = [true, true, true, true, true, true]

    if (params.opis_towaru.x == 0 || !params.opis_towaru) tmp_checkboxes[0] = false
    if (params.barcode.x == 0 || !params.barcode) tmp_checkboxes[1] = false
    if (params.indexBarcode.x == 0 || !params.indexBarcode) tmp_checkboxes[2] = false
    if (params.index.x == 0 || !params.index) tmp_checkboxes[3] = false
    if (params.cena.x == 0 || !params.cena) tmp_checkboxes[4] = false
    if (params.jm.x == 0 || !params.jm) tmp_checkboxes[5] = false

    this.setState({ checkboxes: tmp_checkboxes })
  }

  editLabel = () => {
    let data = {
      checkboxes: this.state.checkboxes,
      label: this.state.label,
      product_name: this.state.checkboxes[0] ? this.state.product_name : Object(),
      barcode: this.state.checkboxes[1] ? this.state.barcode : Object(),
      indexBarcode: this.state.checkboxes[2] ? this.state.indexBarcode : Object(),
      index: this.state.checkboxes[3] ? this.state.index : Object(),
      price: this.state.checkboxes[4] ? this.state.price : Object(),
      jm: this.state.checkboxes[5] ? this.state.jm : Object()
    };

    postServices._editLabel('edit', data)
    .then((response: any) => {
      if(response.status == 200) return response.json()
    })
    .then((responseJson: any) => {
      console.log(responseJson)
      this.getAllLabels()
    })
    .catch(error => console.log(error))
  }

  render() {

    let formItem = {
      padding: 10,
    };
    return (
      <div>
        <h2>
          DOSTĘPNE ETYKIETY &nbsp;
          <a
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() =>
              this.setState({ show_labels_list: !this.state.show_labels_list })
            }
          >
            {this.state.show_labels_list ? "zwiń" : `rozwiń`}
          </a>
        </h2>

        <List
          className="List"
          style={
            this.state.show_labels_list
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <ListItem style={{ borderBottom: "solid 1px" }}>
            <Grid className="Grid" container spacing={4}>
              <Grid item xs>
                Nazwa Etykiety
              </Grid>
              <Grid item xs>
                Edytuj
              </Grid>
              <Grid item xs>
                Usuń
              </Grid>
            </Grid>
          </ListItem>
          {this.state.labels_list.map((label: string, index: number) => {
            return (
              <ListItem key={index} role={undefined} dense button component="a">
                <Grid className="Grid" container spacing={4}>
                  <Grid item xs>
                    <ListItemText primary={`${label}`} />
                  </Grid>
                  <Grid item xs>
                    <a style={{ color: "blue" }} onClick={() => this.handleEdit(label)}>
                    <ListItemText primary={"Edytuj"} />
                    </a>
                  </Grid>
                  <Grid item xs>
                    <a style={{ color: "red" }} onClick={ () =>
                        {
                            this.handleClickOpen(
                                "Usuń Etykietę", 
                                "Czy napewno usunąć etykietę "+label+"?"
                            )
                            this.setState({ labelNameToDelete: label })
                        }
                    }>
                      <ListItemText primary={"Usuń"} />
                    </a>
                  </Grid>
                </Grid>
              </ListItem>
            );
          })}
        </List>

        <h2 id="label-creator" aria-labelledby="label-creator" >KREATOR ETYKIET
            <a 
            href="#label-creator"
            onClick={() => {
                location.href = "#"
                location.href = "#label-creator"
            }}>#</a>
        </h2>
        
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
            <p>
              Aby stworzyć schemat wypełnij pola formularza.
            </p>
          </div>
        </div>
        <div
          style={{
            marginTop: 20,
          }}
        >
          <form noValidate autoComplete="off">
            <div>
              <h3>Ustawienia ogólne</h3>
              <TextField
                style={formItem}
                id="outlined-required"
                label="Tytuł metki"
                value={this.state.label.title}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                onChange={this.handleChangeLabelTitle}
              />
              <TextField
                value={this.state.label.width}
                style={formItem}
                id="outlined-required"
                label="Szerokość metki"
                variant="outlined"
                onChange={this.handleChangeLabelWidth}
              />
              <TextField
                value={this.state.label.height}
                style={formItem}
                id="outlined-required"
                label="Wysokość metki"
                variant="outlined"
                onChange={this.handleChangeLabelHeight}
              />
              <h3>
                <Checkbox
                  checked={this.state.checkboxes[0]}
                  onChange={() => {
                    this.setState({
                      checkboxes: [
                        !this.state.checkboxes[0],
                        this.state.checkboxes[1],
                        this.state.checkboxes[2],
                        this.state.checkboxes[3],
                        this.state.checkboxes[4],
                        this.state.checkboxes[5],
                      ],
                    });
                    setTimeout(() => this.show_preview(), 500);
                  }}
                />
                Nazwa towaru
              </h3>
              <TextField
                value={this.state.product_name.font_size}
                style={formItem}
                id="outlined-required"
                label="Rozmiar czcionki"
                variant="outlined"
                onChange={this.handleChangeProductNameFont}
              />
              <TextField
                value={this.state.product_name.X}
                style={formItem}
                id="outlined-required"
                label="Położenie nazwy towaru X"
                variant="outlined"
                onChange={this.handleChangeProductNameX}
              />
              <TextField
                value={this.state.product_name.Y}
                style={formItem}
                id="outlined-required"
                label="Położenie nazwy towaru Y"
                variant="outlined"
                onChange={this.handleChangeProductNameY}
              />

              <h3>
                <Checkbox
                  checked={this.state.checkboxes[1]}
                  onChange={() => {
                    this.setState({
                      checkboxes: [
                        this.state.checkboxes[0],
                        !this.state.checkboxes[1],
                        this.state.checkboxes[2],
                        this.state.checkboxes[3],
                        this.state.checkboxes[4],
                        this.state.checkboxes[5],
                      ],
                    });
                    setTimeout(() => this.show_preview(), 500);
                  }}
                />
                Kod kreskowy
              </h3>
              <TextField
                value={this.state.barcode.X}
                style={formItem}
                id="outlined-required"
                label="Położenie kodu kreskowego towaru X"
                variant="outlined"
                onChange={this.handleChangeBarcodeX}
              />
              <TextField
                value={this.state.barcode.Y}
                style={formItem}
                id="outlined-required"
                label="Położenie kodu kreskowego towaru Y"
                variant="outlined"
                onChange={this.handleChangeBarcodeY}
              />
              <TextField
                value={this.state.barcode.height}
                style={formItem}
                id="outlined-required"
                label="Wysokość kodu kreskowego"
                variant="outlined"
                onChange={this.handleChangeBarcodeHeight}
              />
              <TextField
                value={this.state.barcode.width}
                style={formItem}
                id="outlined-required"
                label="Szerokość kodu kreskowego"
                variant="outlined"
                onChange={this.handleChangeBarcodeWidth}
              />

              <h3>
                <Checkbox
                  checked={this.state.checkboxes[2]}
                  onChange={() => {
                    this.setState({
                      checkboxes: [
                        this.state.checkboxes[0],
                        this.state.checkboxes[1],
                        !this.state.checkboxes[2],
                        this.state.checkboxes[3],
                        this.state.checkboxes[4],
                        this.state.checkboxes[5],
                      ],
                    });
                    setTimeout(() => this.show_preview(), 500);
                  }}
                />
                Kod kreskowy z indeksu
              </h3>
              <TextField
                value={this.state.indexBarcode.X}
                style={formItem}
                id="outlined-required"
                label="Położenie kodu kreskowego towaru X"
                variant="outlined"
                onChange={this.handleChangeIndexBarcodeX}
              />
              <TextField
                value={this.state.indexBarcode.Y}
                style={formItem}
                id="outlined-required"
                label="Położenie kodu kreskowego towaru Y"
                variant="outlined"
                onChange={this.handleChangeIndexBarcodeY}
              />
              <TextField
                value={this.state.indexBarcode.height}
                style={formItem}
                id="outlined-required"
                label="Wysokość kodu kreskowego"
                variant="outlined"
                onChange={this.handleChangeIndexBarcodeHeight}
              />
              <TextField
                value={this.state.indexBarcode.width}
                style={formItem}
                id="outlined-required"
                label="Szerokość kodu kreskowego"
                variant="outlined"
                onChange={this.handleChangeIndexBarcodeWidth}
              />

              <h3>
                <Checkbox
                  checked={this.state.checkboxes[3]}
                  onChange={() => {
                    this.setState({
                      checkboxes: [
                        this.state.checkboxes[0],
                        this.state.checkboxes[1],
                        this.state.checkboxes[2],
                        !this.state.checkboxes[3],
                        this.state.checkboxes[4],
                        this.state.checkboxes[5],
                      ],
                    });
                    setTimeout(() => this.show_preview(), 500);
                  }}
                />
                Indeks
              </h3>
              <TextField
                value={this.state.index.font_size}
                style={formItem}
                id="outlined-required"
                label="Rozmiar czcionki"
                variant="outlined"
                onChange={this.handleChangeIndexFont}
              />
              <TextField
                value={this.state.index.X}
                style={formItem}
                id="outlined-required"
                label="Położenie indeksu X"
                variant="outlined"
                onChange={this.handleChangeIndexX}
              />
              <TextField
                value={this.state.index.Y}
                style={formItem}
                id="outlined-required"
                label="Położenie indeksu Y"
                variant="outlined"
                onChange={this.handleChangeIndexY}
              />
              <h3>
                <Checkbox
                  checked={this.state.checkboxes[4]}
                  onChange={() => {
                    this.setState({
                      checkboxes: [
                        this.state.checkboxes[0],
                        this.state.checkboxes[1],
                        this.state.checkboxes[2],
                        this.state.checkboxes[3],
                        !this.state.checkboxes[4],
                        this.state.checkboxes[5],
                      ],
                    });
                    setTimeout(() => this.show_preview(), 500);
                  }}
                />
                Cena
              </h3>
              <TextField
                value={this.state.price.font_size}
                style={formItem}
                id="outlined-required"
                label="Rozmiar czcionki"
                variant="outlined"
                onChange={this.handleChangePriceFont}
              />
              <TextField
                value={this.state.price.X}
                style={formItem}
                id="outlined-required"
                label="Położenie Ceny X"
                variant="outlined"
                onChange={this.handleChangePriceX}
              />
              <TextField
                value={this.state.price.Y}
                style={formItem}
                id="outlined-required"
                label="Położenie Ceny Y"
                variant="outlined"
                onChange={this.handleChangePriceY}
              />
              <h3>
                <Checkbox
                  checked={this.state.checkboxes[5]}
                  onChange={() => {
                    this.setState({
                      checkboxes: [
                        this.state.checkboxes[0],
                        this.state.checkboxes[1],
                        this.state.checkboxes[2],
                        this.state.checkboxes[3],
                        this.state.checkboxes[4],
                        !this.state.checkboxes[5],
                      ],
                    });
                    setTimeout(() => this.show_preview(), 500);
                  }}
                />
                Jednostka
              </h3>
              <TextField
                value={this.state.jm.font_size}
                style={formItem}
                id="outlined-required"
                label="Rozmiar czcionki"
                variant="outlined"
                onChange={this.handleChangeJmFont}
              />
              <TextField
                value={this.state.jm.X}
                style={formItem}
                id="outlined-required"
                label="Położenie Jednostki X"
                variant="outlined"
                onChange={this.handleChangeJmX}
              />
              <TextField
                value={this.state.jm.Y}
                style={formItem}
                id="outlined-required"
                label="Położenie Jednostki Y"
                variant="outlined"
                onChange={this.handleChangeJmY}
              />
            </div>
            <div style={{ float: "right" }}>
              <Button
                variant="contained"
                color="primary"
                style={{ marginRight: 20 }}
                onClick={() => this.show_preview()}
              >
                Podgląd
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.create_label()}
              >
                Stwórz schemat
              </Button>
            </div>
            <div>
              <img
                style={{
                  top: 10,
                  borderWidth: 1,
                  borderColor: "hsl(0, 0%, 80%)",
                  borderStyle: "solid",
                  borderRadius: 20,
                  margin: "auto",
                  width:
                    this.state.base64image == ""
                      ? 100
                      : this.state.base64image.size[0],
                  position: "relative",
                }}
                src={`data:image/png;base64,${this.state.base64image.code}`}
                alt="Wybierz schemat metki"
              ></img>
            </div>
          </form>
        </div>

        {/* MODALS */}
        <AlertDialogSlide
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
          open={this.state.openDialog}
          dialogQuestionText={this.state.dialogQuestionText}
          dialogDescriptionText={this.state.dialogDescriptionText}
          submitAction={this.removeLabel}
        />
        <AlertDialogSlide
          handleClickOpen={this.handleClickOpen}
          handleClose={this.handleClose}
          open={this.state.editModalVisible}
          dialogQuestionText={"Znaleziono schemat o takiej samej nazwie"}
          dialogDescriptionText={"Edytuj schemat?"}
          submitAction={this.editLabel}
        />
      </div>
    );
  }
}