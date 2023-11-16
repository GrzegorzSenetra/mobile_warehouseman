import * as React from 'react'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import getServices from '../services/getServices'
//import '../styles/style.css';
import { Grid } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useRouteMatch } from 'react-router-dom';
import NewPzList from './NewPzList';

interface IProps {

}
interface IState {
  documents: any,
  csv: string
}


export default class DocumentList extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      documents: [{ "Nazwa": "Ładowanie dokumentów..." }],
      csv: ''
    }
  }
  componentDidMount() {
    this.getDocuments();
  }

  getDocuments = () => {
    getServices._getDocuments()
      .then((response: any) => response.json())
      .then((responseJson: any) => {
        console.log(responseJson);
        this.setState({ documents: responseJson });
      })
      .catch((error) => {
        console.log(error)
      })
  }


  exportToCSV = (id: number) => {
    getServices._exportToCSV(id)
      .then((response: any) => response.json())
      .then((responseJson: any) => {
        
        console.log(responseJson);
        this.setState({ csv: responseJson });
        this.copyCodeToClipboard();
      })
  }

  copyCodeToClipboard = () => {
    this.copyToClipboard(this.state.csv);
    //window.prompt("Copy to clipboard: Ctrl+C, Enter", this.state.csv);
  }

  copyToClipboard = (str:string) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  render() {
    return (
      <List className="List">
        <Grid className="Grid" container spacing={3}>
          <Grid item xs>
            <h2>Super-Magazynier dokumenty</h2>
          </Grid>
          <Grid item xs>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => this.getDocuments()}
            >
              <RefreshIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <a href="http://metalzbyt.com.pl/sm.apk">
              Pobierz Aplikację Mobilną
            </a>
          </Grid>
        </Grid>

        <div className="table-section">
        <ListItem style={{ borderBottom: "solid 1px" }}>
          <Grid className="Grid" container spacing={3}>
            <Grid item xs>
              Nazwa dokumentu
            </Grid>
            <Grid item xs>
              Data dodania
            </Grid>
            <Grid item xs>
              Autor
            </Grid>
          </Grid>
          <ListItemSecondaryAction>Export do csv</ListItemSecondaryAction>
        </ListItem>
        {this.state.documents.map((item: any, index: number) => {
          return (
            <ListItem
              key={index}
              role={undefined}
              dense
              button
              component="a"
              href={`supermagazynier/document/${item.Nazwa}/${item.id}`}
            >
              <Grid className="Grid" container spacing={3}>
                <Grid item xs>
                  <ListItemText primary={`${item.Nazwa}`} />
                </Grid>
                <Grid item xs>
                  <ListItemText primary={`${item.Data_dodania}`} />
                </Grid>
                <Grid item xs>
                  <ListItemText primary={`${item.Author}`} />
                </Grid>
              </Grid>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => this.exportToCSV(item.id)}
                >
                  <CommentIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
        </div>

        <Grid container spacing={3}>
          <NewPzList />
        </Grid>
      </List>
    );
  }
}
