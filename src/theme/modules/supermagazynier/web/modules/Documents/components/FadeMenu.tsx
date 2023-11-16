import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import CommentIcon from '@material-ui/icons/Comment';

const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};


export default function FadeMenu(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  

  return (
    <div>
      <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
          <CommentIcon />
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => {
          props.press('EXPORT_BRAK');
          props.cp();
        }}>Export Brak</MenuItem>
        <MenuItem onClick={() => {
          props.press('EXPORT_ALL')
        }}>Export Wszystko</MenuItem>
        {props.authors.map((item: any, index: number) => {
          if(item){
            return <MenuItem key={index} onClick={() => {
              props.press('EXPORT_'+item)
            }}>Export {item}</MenuItem>
          }
        })}
      </Menu>
    </div>
  );
}
