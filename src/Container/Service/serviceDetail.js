import React from 'react';
import Select from 'react-select';
import Picky from 'react-picky';
import { withStyles } from '@material-ui/styles';
import {
    Typography, Button, CssBaseline, Container, LinearProgress, Paper, Box,
} from '@material-ui/core';

import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { fetchAPI } from '../../utils';
import Swal from 'sweetalert2';
import AppLayout from '../../Component/Layout/Layout'

const styles = theme => ({
    container: {
        marginTop: theme.spacing(5)
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    cancel: {
        margin: theme.spacing(0, 0, 0),
    },
    select: {
        margin: theme.spacing(2, 0, 0),
    },
});

class ClientDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            staffList: [],
            arrayValue: [],
            categoryList: [],
            selectedCategory: { value: this.props.location.state.data.category.value, label: this.props.location.state.data.category.name },
        };
        this.selectMultipleOption = this.selectMultipleOption.bind(this);
    }

    async componentDidMount() {
        try {
            const response = await fetchAPI('GET', 'staffMgt/workingStaff');
            const categoryList = await fetchAPI('GET', 'serviceMgt/category');
            if (this.props.location.state.data.staff === "All Staff") {
                this.setState({ arrayValue: response });
            } else {
                const service = await fetchAPI('GET', `serviceMgt/services/${this.props.location.state.data._id}`);
                this.setState({ arrayValue: service.staff });
            }
            this.setState({
                staffList: response,
                categoryList: categoryList
            });
        } catch (error) {
            Swal.fire({
                type: 'error',
                title: "Opps... Something Wrong...",
                text: error
            })
        }
    }

    selectMultipleOption(value) {
        this.setState({ arrayValue: value });
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption });
    };

    handleChangeCategory = (event) => {
        this.setState({
            selectedCategory: event
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <AppLayout title="Service Details" {...this.props} >
                <Container component="main" maxWidth="md" className={classes.container} >
                    <Paper>
                        <Box p={2}>
                            <Typography>
                                <h3>
                                    Service Details
                        </h3>
                            </Typography>
                            <CssBaseline />
                            <Formik
                                initialValues={{ name: this.props.location.state.data.name, category: this.props.location.state.data.category, price: this.props.location.state.data.price, duration: this.props.location.state.data.duration }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.name) { errors.name = 'Please enter service name' }
                                    return errors;
                                }}
                                onSubmit={async (values, { setSubmitting, setErrors }) => {
                                    try {
                                        let rawStaffList = this.state.arrayValue;
                                        if (rawStaffList.length <= 0) {
                                            Swal.fire({
                                                type: 'error',
                                                title: "Please select a staff...",
                                            })
                                            setSubmitting(false);
                                            return
                                        } else {
                                            let staffList = [];
                                            for (let i = 0; i < rawStaffList.length; i++) {
                                                staffList.push(rawStaffList[i]._id)
                                            }
                                            values.staff = staffList;
                                        }
                                        values.category = this.state.selectedCategory.value;
                                        const respObj = await fetchAPI('PATCH', `serviceMgt/services/${this.props.location.state.data._id}`, values);

                                        if (respObj && respObj.ok) {

                                            window.history.back();
                                        } else {
                                            Swal.fire({
                                                type: 'error', text: respObj.error,
                                                title: "Opps... Something Wrong..."
                                            })
                                        }
                                    } catch (error) {
                                        Swal.fire({
                                            type: 'error', text: error,
                                            title: "Opps... Something Wrong..."
                                        })
                                    }
                                    setSubmitting(false);
                                }}
                                render={({ submitForm, isSubmitting, values, setFieldValue, errors, setErrors }) => (
                                    <Form>

                                        <Field
                                            component={TextField} variant="outlined" margin="normal" fullWidth autoFocus
                                            name="name" label="Service Name"
                                        />
                                        <Field
                                            component={TextField} variant="outlined" margin="normal" fullWidth
                                            name="price" label="Price ($)" type="number"
                                        />
                                        <Field
                                            component={TextField} variant="outlined" margin="normal" fullWidth
                                            name="duration" label="Duration (min)" type="number"
                                        />
                                        <Typography>
                                            <h5>
                                                Category
                                            </h5>
                                        </Typography>
                                        <Select className={classes.select}
                                            onChange={this.handleChangeCategory}
                                            options={this.state.categoryList}
                                            value={this.state.selectedCategory}
                                        />
                                        <Typography>
                                            <h5>
                                                Select staff who perform this service.
                                            </h5>
                                        </Typography>
                                        <Picky
                                            value={this.state.arrayValue}
                                            options={this.state.staffList}
                                            onChange={this.selectMultipleOption}
                                            numberDisplayed={10}
                                            valueKey="_id"
                                            labelKey="displayName"
                                            multiple={true}
                                            includeSelectAll={true}
                                            includeFilter={true}
                                            dropdownHeight={600}
                                        />

                                        <Button variant="contained" color="primary" fullWidth className={classes.submit}
                                            disabled={isSubmitting} onClick={submitForm}
                                        >
                                            Update
                                        </Button>
                                        <Button variant="contained" color="secondary" fullWidth className={classes.cancel}
                                            onClick={() => { window.history.back(); }}
                                        >
                                            Cancel
                                        </Button>
                                        {isSubmitting && <LinearProgress />}
                                    </Form>
                                )}
                            />
                        </Box>
                    </Paper>
                </Container>
            </AppLayout>
        );
    }
}

export default withStyles(styles)(ClientDetail);
