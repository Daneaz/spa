import React from 'react';
import { withStyles } from '@material-ui/styles';
import {
  Grid,
} from '@material-ui/core';
import Swal from 'sweetalert2';
import AppLayout from '../../Component/Layout/Layout'
import MUIDataTable from "mui-datatables";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import RoleIcon from "@material-ui/icons/Add";
import AddIcon from "@material-ui/icons/PersonAdd";
import { fetchAPI } from '../../utils';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
});

const columns = [
  {
    name: "username",
    label: "Userame",
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: "displayName",
    label: "Display Name",
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: "email",
    label: "Email",
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: "mobile",
    label: "Mobile",
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: "role.name",
    label: "Role",
    options: {
      filter: true,
      sort: true,
    }
  },
];

class Staff extends React.Component {
  constructor() {
    super();
    this.state = { userList: [] };
  }

  async componentDidMount() {
    try {
      const response = await fetchAPI('GET', 'staffMgt/staffs');
      this.setState({ userList: response });
    } catch (error) {
      Swal.fire({
        type: 'error',
        title: "Opps... Something Wrong...",
        text: error
      })
    }
  }

  handleAddStaff = () => {
    const { history } = this.props;
    history.push('/staff/new');
  }

  handleAddRole = () => {

  }

  handleRowClick = (rowMeta) => {
    const { history } = this.props;
    history.push({
      pathname: "/staff/detail",
      state: {
        data: this.state.userList[rowMeta.dataIndex]
      }
    });
  }

  async handleRowDelete(rowsDeleted) {
    try {
      const deleteObjList = rowsDeleted.map((row) => {
        return this.state.userList[row.dataIndex]
      });
      const response = await fetchAPI('DELETE', 'staffMgt/staffs', deleteObjList);
      if (response && response.ok) {
        Swal.fire({
          type: 'success', text: response.ok,
          title: "Success!"
        })
      } else {
        Swal.fire({
          type: 'error',
          title: "Opps... Something Wrong...",
          text: response.error
        })
      }
    }
    catch (error) {
      Swal.fire({
        type: 'error',
        title: "Opps... Something Wrong...",
        text: error
      })
    }
  }

  render() {
    return (
      <AppLayout title="Staff List" {...this.props} >
        <Grid container justify="flex-end" spacing={32} >
          <Grid item xs={12}>
            <MUIDataTable
              title="Client List"
              data={this.state.userList}
              columns={columns}
              options={{
                customToolbar: () => {
                  return (
                    <React.Fragment>
                      <Tooltip title={"Add Staff"}>
                        <IconButton onClick={this.handleAddStaff}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
                    </React.Fragment>
                  );
                },
                onRowClick: (rowData, rowMeta) => {
                  this.handleRowClick(rowMeta);
                },
                onRowsDelete: rowsDeleted => {
                  this.handleRowDelete(rowsDeleted.data);
                },
                filterType: 'checkbox',
              }}
            />
          </Grid>
        </Grid>
      </AppLayout>
    );
  }
}

export default withStyles(styles)(Staff);
