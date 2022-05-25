import React from 'react';
import { withStyles } from '@material-ui/styles';
import {
    Grid
} from '@material-ui/core';

import MUIDataTable from "mui-datatables";
import Swal from 'sweetalert2';
import { fetchAPI } from '../../utils';
import AppLayout from '../../Component/Layout/Layout'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';


const styles = theme => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
});

const columns = [
    {
        name: "client.displayName",
        label: "Customer Name",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "paymentType",
        label: "Payment Method",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "discount",
        label: "Discount",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "addon",
        label: "Add-ons",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "total",
        label: "Total",
        options: {
            filter: false,
            sort: true,
        }
    },
    {
        name: "createdAt",
        label: "Date",
        options: {
            filter: false,
            sort: true,
        }
    }
];

class Invoice extends React.Component {


    state = {
        invoiceList: [],
        displayServiceList: []
    };

    getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTableBodyCell: {
                root: {
                    width: "100px"
                },
            }
        }
    })

    async componentDidMount() {
        try {
            let invoiceList = await fetchAPI('GET', 'invoiceMgt/invoicelist');
            invoiceList.map(invoice => {
                invoice.createdAt = new Date(invoice.createdAt).toLocaleDateString()
            })
            this.setState({
                invoiceList: invoiceList
            });
        } catch (error) {
            Swal.fire({
                type: 'error',
                title: "Opps... Something Wrong...",
                text: error
            })
        }
    }

    handleRowClick = async (rowMeta) => {
        let invoice = await fetchAPI('GET', `invoiceMgt/invoice/${this.state.invoiceList[rowMeta.dataIndex]._id}`)
        const { history } = this.props;
        history.push({
            pathname: "/invoice/detail",
            state: {
                invoice: invoice
            }
        });
    }

    async handleRowDelete(rowsDeleted) {
        try {
            const deleteObjList = rowsDeleted.map((row) => {
                return this.state.invoiceList[row.dataIndex]
            });
            const response = await fetchAPI('DELETE', 'invoiceMgt/invoice', deleteObjList);
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
        const { classes } = this.props;
        return (
            <AppLayout title="Invoice" {...this.props} >
                <Grid container justify="flex-end" spacing={32} >
                    <Grid item xs={12}>
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title="Service List"
                                data={this.state.invoiceList}
                                columns={columns}
                                options={{
                                    onRowClick: (rowData, rowMeta) => {
                                        this.handleRowClick(rowMeta);
                                    },
                                    onRowsDelete: rowsDeleted => {
                                        this.handleRowDelete(rowsDeleted.data);
                                    },
                                    filterType: 'checkbox',
                                }}
                            />
                        </MuiThemeProvider>
                    </Grid>
                </Grid>
            </AppLayout>
        );
    }
}

export default withStyles(styles)(Invoice);
