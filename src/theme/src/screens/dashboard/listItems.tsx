import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Programy" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Lista programów</ListSubheader>
    <Link to="/plancreator">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Generator grafików" />
      </ListItem>
    </Link>
    <Link to="/allegro_fv">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Znajdywanie FV z Allegro" />
      </ListItem>
    </Link>
    <Link to="/label_creator">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Kreator Etykiet" />
      </ListItem>
    </Link>
    <Link to="/inventoryturnoverratiocalculator">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Kalkulator WRZ" />
      </ListItem>
    </Link>
    <Link to="/winienima">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Winien i ma" />
      </ListItem>
    </Link>
    <Link to="/vatcomparer">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="VAT Comparer" />
      </ListItem>
    </Link>
    <Link to="/eantocsv">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary=".xls EAN do CSV" />
      </ListItem>
    </Link>
    <Link to="/supercomparer">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Super Comparer" />
      </ListItem>
    </Link>
    <Link to="/supermagazynier">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Super Magazynier" />
      </ListItem>
    </Link>
  </div>
);
