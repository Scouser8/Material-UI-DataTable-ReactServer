import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import axios from "../../axios";

const options = ["Edit", "Delete"];

const ITEM_HEIGHT = 48;

function ActionsMenu({ user, setOpenPopup, setPopUpTitle, setUserToEdit }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const editUser = () => {
    setAnchorEl(null);
    setOpenPopup(true);
    setPopUpTitle("Edit User");
    setUserToEdit(user);
  };

  const deleteUser = () => {
    setAnchorEl(null);
    axios.delete(`/user/${user._id}/delete`)
    .then(res =>{
      alert(res.data)
    })
  };


  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem
          key="Edit"
          onClick={editUser}
        >
          Edit
        </MenuItem>
        <MenuItem
          key="Delete"
          onClick={deleteUser}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ActionsMenu;
