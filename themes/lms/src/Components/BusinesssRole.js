import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {Modal, Button, Form, Alert} from 'react-bootstrap';
import {Formik} from 'formik';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
import * as Yup from 'yup';
import ConfirmationModal from '../Modal/ConfirmationModal.js';

class BusinessRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            error: null,
            showDelete: false,
            isLoaded: false,
            rowData: {},
            showForm: false
        };
    }

    componentDidMount() {
        this.refreshGrid();
    }

    refreshGrid = () => fetch("api/businessrole/get")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    data: result,
                    isLoaded: true
                })
            },
            (error) => {
                this.setState({
                    error
                });
                ToastsStore.error(error)
            }
        );

    resetButtonStates = () => {
        this.setState({
            showForm: false,
            showDelete: false,
            editModal: false
        })
    };


    render() {
        const {data, showDelete, error, rowData, showForm} = this.state;

        const RoleValidation = Yup.object().shape({
            Name: Yup.string().required()
        });

        const columns = [{
            Header: 'Name',
            accessor: 'Name'
        }, {
            Header: <div className="text-right">
                <button className="btn btn-success btn-sm mr-1" onClick={() => {
                    this.resetButtonStates();
                    this.setState({
                        showForm: true
                    })
                }
                }>
                    Add
                </button>
            </div>,
            Cell: row => (
                <div className="text-right">
                    <button className="btn btn-success btn-sm mr-1" type="submit"
                            onClick={() => {
                                this.resetButtonStates();
                                this.setState({
                                    showForm: true,
                                    rowData: row.original
                                })
                            }}
                    >Edit
                    </button>
                    <button className="btn btn-danger btn-sm ml-1"
                            type="submit" onClick={() => {
                        this.resetButtonStates();
                        this.setState({
                            showDelete: true,
                            rowData: row.original

                        })
                    }}>Delete
                    </button>
                </div>
            ),
            filterable: false
        }];


        if (error) {
            return (
                <div className="container-fluid">
                    <Alert variant="danger">
                        There was a error with loading content from the database.
                        {error.message && (<pre>{error.message}</pre>)}
                    </Alert>
                </div>
            );
        } else {
            return (
                <div className='container-fluid'>
                    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/>

                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={20}
                        filterable={true}
                        multiSort={true}
                        sortable={true}
                    />
                    <Modal show={showForm} onHide={() => {
                        this.setState({showForm: false})
                    }}>
                        <Formik
                            initialValues={rowData}
                            onSubmit={(values, {setSubmitting}) => {
                                fetch('api/businessrole/save', {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(values, null, 2)
                                })
                                    .then((response) => response.json())
                                    .then((data) => {
                                        if (data.success) {
                                            this.setState({
                                                showForm: false,
                                                rowData: {},
                                            });
                                            ToastsStore.success(data.message);
                                            this.refreshGrid();
                                        } else {
                                            ToastsStore.error(data.message)
                                        }
                                    })
                                    .finally(() => {
                                        setSubmitting(false);
                                    });
                            }}
                            validationSchema={RoleValidation}
                        >
                            {({handleSubmit, errors, handleBlur, handleChange, values, touched}) => (
                                <Form onSubmit={handleSubmit}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Modal Heading</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                        <Form.Label>Business Role</Form.Label>
                                        <Form.Control
                                            name="Name"
                                            type="text"
                                            placeholder="Enter role name"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.Name || ""}
                                            isValid={touched.Name && !errors.Name}
                                            isInvalid={!!errors.Name}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => {
                                            this.setState({
                                                showForm: false,
                                            })
                                        }}> Close
                                        </Button>
                                        <Button variant="primary" type="submit"> Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )
                            }
                        </Formik>
                    </Modal>


                    <ConfirmationModal
                        show={showDelete}
                        id={rowData.ID}
                        data={rowData}
                        route="api/businessrole"
                        action="delete"
                        onSuccess={() => {
                            this.setState({
                                showDelete: false,
                                rowData: {}
                            });
                            this.refreshGrid();
                        }}
                    />
                </div>
            )
        }
    };
}

export default BusinessRole;
