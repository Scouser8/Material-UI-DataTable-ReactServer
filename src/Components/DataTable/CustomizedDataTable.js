import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./CustomizedDataTable.css";
import axios from "../../axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Button,
  IconButton,
  InputAdornment,
  TableFooter,
  TablePagination,
  TableSortLabel,
  TextField,
  useTheme,
} from "@material-ui/core";
import {
  AddCircleOutline,
  FindInPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
import Popup from "../Popup/Popup";
import UserForm from "../UserForm/UserForm";
import ActionsMenu from "../ActionsMenu/ActionsMenu";
import moment from "moment";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const headCells = [
  { id: "id", label: "ID", disableSorting: true },
  { id: "first_name", label: "First Name" },
  { id: "last_name", label: "Last Name" },
  { id: "email", label: "E-mail" },
  { id: "birth_date", label: "Birth Date", searchField: "birth_date_display" },
  {
    id: "created_date",
    label: "Created Date",
    searchField: "created_date_display",
  },
  { id: "actions", label: "Actions", disableSorting: true },
];

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  button: {
    margin: theme.spacing(0),
    width: 150,
  },
}));

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

function CustomizedDataTable() {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("created_date");
  const [openPopup, setOpenPopup] = useState(false);
  const [userToEdit, setUserToEdit] = useState("");
  const [popUpTitle, setPopUpTitle] = useState("Add New User");
  const [searchMode, setSearchMode] = useState(false);

  //On the first render get user count for UX pagination purposes & their data
  useEffect(() => {
    axios.get("/user/count").then((res) => {
      setUsersCount(parseInt(res.data));
    });
    axios.get("/user").then((res) => {
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    if (!searchMode) {
      axios
        .get("user/paginate", {
          params: {
            recordsPerPage: rowsPerPage == -1 ? usersCount : rowsPerPage,
            pageNumber: page,
            order: order,
            orderBy: orderBy,
          },
        })
        .then((res) => {
          setUsers(res.data);
        });
    }
  }, [page]);

  useEffect(() => {
    axios
      .get("user/paginate", {
        params: {
          recordsPerPage: rowsPerPage == -1 ? usersCount : rowsPerPage,
          pageNumber: page,
          order: order,
          orderBy: orderBy,
        },
      })
      .then((res) => {
        setUsers(res.data);
      });
  }, [rowsPerPage]);

  useEffect(() => {
    axios
      .get("user/paginate", {
        params: {
          recordsPerPage: rowsPerPage == -1 ? usersCount : rowsPerPage,
          pageNumber: page,
          order: order,
          orderBy: orderBy,
        },
      })
      .then((res) => {
        setUsers(res.data);
      });
  }, [order]);

  //update the page number with new data
  const handleChangePage = async (event, newPage) => {
    await setPage(newPage);
  };

  //update the number of records for each page with new data
  const handleChangeRowsPerPage = async (e) => {
    const numberOfRows = e.target.value;
    await setRowsPerPage(parseInt(numberOfRows, 10));
    await setPage(0);
  };

  //Change the arrow label direction
  const handleSortRequest = (cellId) => {
    const isAsc = orderBy === cellId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cellId);
  };

  const handleSearch = (e) => {
    const searchIndex = e.target.id;
    const valueToSearchFor = e.target.value.toLowerCase();
    setSearchMode(true);
    if (page !== 0) {
      setPage(0);
    }

    axios
      .get("user/filter", {
        params: {
          column: searchIndex,
          data: valueToSearchFor,
          recordsPerPage: parseInt(rowsPerPage) === -1 ? usersCount : rowsPerPage,
          pageNumber: page,
          order: order,
          orderBy: orderBy,
        },
      })
      .then((res) => {
        setUsers(res.data);
        setSearchMode(false);
      });
  };

  const dateSearch = (e) => {
    const searchIndex =
      e.target.id === "birth_date"
        ? "birth_date_display"
        : "created_date_display";
    const valueToSearchFor =
      searchIndex === "birth_date_display"
        ? moment(e.target.value).format("L")
        : moment(e.target.value).format("MMM Do YYYY");

    axios
      .get("user/filter", {
        params: {
          column: searchIndex,
          data: valueToSearchFor,
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
    <Fragment>
      <TableContainer className="table" component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <h2>Search</h2>
              </TableCell>
              {headCells.slice(1, 4).map((headCell) => (
                <TableCell>
                  <TextField
                    id={headCell.id}
                    defaultValue=""
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FindInPage />
                        </InputAdornment>
                      ),
                    }}
                    onBlur={handleSearch}
                  />
                </TableCell>
              ))}
              {headCells.slice(4, 6).map((headCell) => (
                <TableCell>
                  <TextField
                    id={headCell.id}
                    label={headCell.label}
                    type="date"
                    defaultValue={
                      headCell.id === "birth_date" ? "1990-01-01" : "2021-01-01"
                    }
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={dateSearch}
                  />
                </TableCell>
              ))}
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<AddCircleOutline />}
                  onClick={() => {
                    setOpenPopup(true);
                    setPopUpTitle("Add New User");
                    setUserToEdit(null);
                  }}
                >
                  New User
                </Button>
              </TableCell>
            </TableRow>
            <TableRow className="table__header">
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.disableSorting ? (
                    <h3 className="table__header__actions">{headCell.label}</h3>
                  ) : (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      className="table__header__cell"
                      onClick={() => {
                        handleSortRequest(headCell.id);
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user, index) => (
              <StyledTableRow key={user._id}>
                <StyledTableCell style={{ width: "5%" }} align="left">
                  {index + 1 + page * rowsPerPage}
                </StyledTableCell>
                <StyledTableCell style={{ width: "15%" }} align="left">
                  {user.first_name}
                </StyledTableCell>
                <StyledTableCell style={{ width: "15%" }} align="left">
                  {user.last_name}
                </StyledTableCell>
                <StyledTableCell style={{ width: "20%" }} align="left">
                  {user.email}
                </StyledTableCell>
                <StyledTableCell style={{ width: "15%" }} align="left">
                  {user.birth_date_display}
                </StyledTableCell>
                <StyledTableCell style={{ width: "15%" }} align="left">
                  {
                    /*user.created_date.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })*/
                    user.created_date_display
                  }
                </StyledTableCell>
                <StyledTableCell style={{ width: "5%" }} align="left">
                  <ActionsMenu
                    user={user}
                    setUsers={setUsers}
                    setOpenPopup={setOpenPopup}
                    setPopUpTitle={setPopUpTitle}
                    setUserToEdit={setUserToEdit}
                    setUsersCount={setUsersCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    order={order}
                    orderBy={orderBy}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {
              // users.length === 0?(
              //   <NoRowsOverlay/>
              // ):(
              //   <></>
              // )
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
                colSpan={5}
                count={usersCount}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Popup
        title={popUpTitle}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <UserForm
          user={userToEdit}
          setUsers={setUsers}
          setUsersCount={setUsersCount}
          rowsPerPage={rowsPerPage}
          page={page}
          order={order}
          orderBy={orderBy}
        />
      </Popup>
    </Fragment>
  );
}

export default CustomizedDataTable;
