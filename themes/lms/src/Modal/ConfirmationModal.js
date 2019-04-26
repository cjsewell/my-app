import React, {Component} from 'react';
import {Modal, Button, Form} from 'react-bootstrap';
import {ToastsStore} from 'react-toasts';

export default class ConfirmationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: props.show,
            elementId: props.id,
            data: props.data,
            action: props.action,
            route: props.route,
        };
    }

    componentDidMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);
    }

    updateState = (state) => {
        this.setState({
            showModal: state.show,
            elementId: state.id,
            data: state.data,
            action: state.action,
            route: state.route
        });
    };


    onSuccess = (data) => {
        this.setState({
            showModal: undefined,
            elementId: undefined,
            data: [],
            action: undefined,
            route: undefined,
        }, () => {
            ToastsStore.error(data.message);
            this.props.onSuccess(data);
        });
    };
    onError = (data) => {
        ToastsStore.error(data.message);
        if (this.props.onError) {
            this.props.onError(data);
        }
    };

    render() {
        const {showModal, elementId, data, action, route} = this.state;
        return (
            <Modal show={showModal} onHide={() => {
                this.setState({showModal: false})
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Business Role</Modal.Title>
                </Modal.Header>

                <Form onSubmit={(e) => {
                    e.preventDefault();
                    fetch(`${route}/${action}/${elementId}`, {
                        method: 'POST'
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                this.onSuccess(data)
                            } else {
                                this.onError(data)
                            }
                        })
                        .catch(e => {
                            this.onError(e)
                        })
                        .finally(() => {

                        });
                }}>
                    <Modal.Body>
                        <p>Are you sure you want to delete <strong>{data.Name}</strong></p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            this.setState({
                                showModal: false,
                                elementId: undefined
                            })
                        }}>No </Button>
                        <Button variant="primary" type="submit">Yes </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}
