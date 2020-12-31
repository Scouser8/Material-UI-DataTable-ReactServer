import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import axios from "../../axios";

const ITEM_HEIGHT = 48;

function ActionsMenu({
  user,
  setUsers,
  setOpenPopup,
  setPopUpTitle,
  setUserToEdit,
  setUsersCount,
  rowsPerPage,
  page,
  order,
  orderBy,
}) {
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

  const deleteUser = async () => {
    setAnchorEl(null);
    await axios.delete(`/user/${user._id}/delete`).then((res) => {
      alert(res.data);
    });
    await axios.get("/user/count").then((res) => {
      setUsersCount(parseInt(res.data));
    });
    axios
      .get("user/paginate", {
        params: {
          recordsPerPage: rowsPerPage,
          pageNumber: page,
          order: order,
          orderBy: orderBy,
        },
      })
      .then((res) => {
        setUsers(res.data);
      });
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
        <MenuItem key="Edit" onClick={editUser}>
          Edit
        </MenuItem>
        <MenuItem key="Delete" onClick={deleteUser}>
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ActionsMenu;
