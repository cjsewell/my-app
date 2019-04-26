import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { Formik } from 'formik';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import * as Yup from 'yup';
import ConfirmationModal from '../Modal/ConfirmationModal.js';

class BusinessRole extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            data: [],
            error: null,
            deleteModel: false,
            isLoaded: false,
            idToModify: undefined,
            rowData: [],
            editModal: false
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
            show: false,
            deleteModel: false,
            editModal: false
        })
    }

    render() {
        const { data, show, deleteModel, idToModify, error, rowData, editModal } = this.state;

        const RoleValidation = Yup.object().shape({
            name: Yup.string().required()
        })

        const columns = [{
            Header: 'Name',
            accessor: 'Name'
        }, {
            Header: <div className="text-right">
                <button className="btn btn-success btn-sm mr-1" onClick={() => {
                    this.resetButtonStates();
                    this.setState({
                        show: true
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
                                idToModify: row.original.ID,
                                editModal: true,
                                rowData: row.original
                            })
                        }}
                    >Edit
                    </button>
                    <button className="btn btn-danger btn-sm ml-1"
                        type="submit" onClick={() => {
                            this.resetButtonStates();
                            this.setState({
                                deleteModel: true,
                                idToModify: row.original.ID,
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
                        There was a error with loading content from the database
                    </Alert>
                </div>
            );
        } else {
            return (
                <div className='container-fluid'>
                    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />

                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={20}
                        filterable={true}
                        multiSort={true}
                        sortable={true}
                    />

                    <Formik
                        onSubmit={(values, { setSubmitting }) => {
                            fetch('api/businessrole/add', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(values, null, 2)
                            }).then((response) => response.json())
                                .then((data) => {
                                    if (data.success) {
                                        this.setState({ show: false });
                                        ToastsStore.success("You have just added a new business role")
                                        this.refreshGrid();
                                    }
                                }).finally(() => {
                                    setSubmitting(false);
                                });
                        }}
                        validationSchema={RoleValidation}
                    >
                        {({ handleSubmit, errors, handleBlur, handleChange }) => (
                            <Modal show={show} onHide={() => {
                                this.setState({ show: false })
                            }}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Modal Heading</Modal.Title>
                                </Modal.Header>

                                <Form onSubmit={handleSubmit}>
                                    <Modal.Body>
                                        <label>Business Role</label>
                                        <input
                                            className="form-control"
                                            name="name"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.name ? (<div className="form-errors">{errors.name}</div>) : null}
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => {
                                            this.setState({
                                                show: false,
                                            })
                                        }}> Close
                                        </Button>
                                        <Button variant="primary" type="submit"> Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>
                        )}
                    </Formik>




                    <Formik
                        initialValues={{ name: `${rowData.Name}` }}
                        onSubmit={(values, { setSubmitting }) => {
                            fetch(`api/businessrole/edit/${idToModify}`, {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(values, null, 2)
                            }).finally(() => {
                                this.setState({ editModal: false });
                                ToastsStore.success("You have just edited the business role")
                                this.refreshGrid();
                                setSubmitting(false);
                            });
                        }}
                    >
                        {({ handleSubmit, errors, handleBlur, handleChange, values }) => (
                            <Modal show={editModal} onHide={() => {
                                this.setState({ editModal: false })
                            }}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Modal Heading</Modal.Title>
                                </Modal.Header>

                                <Form onSubmit={handleSubmit}>
                                    <Modal.Body>
                                        {console.log(values)}
                                        <label>Business Role</label>
                                        <input
                                            className="form-control"
                                            name="name"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.Name}
                                        />
                                        {console.log(rowData.Name)}

                                        {errors.name ? (<div className="form-errors">{errors.name}</div>) : null}
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => {
                                            this.setState({
                                                editModal: false,
                                            })
                                        }}> Close
                                        </Button>
                                        <Button variant="primary" type="submit"> Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            </Modal>
                        )}
                    </Formik>


                    <ConfirmationModal
                        show={deleteModel}
                        id={idToModify}
                        data={rowData}
                        route="api/businessrole"
                        action="delete"
                    />
                </div>
            )
        }
    };
}

export default BusinessRole;