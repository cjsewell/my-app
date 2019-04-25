import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ToastsStore } from 'react-toasts';

export default class ConfirmationModal extends Component {
    constructor() {
        super();
        this.state = {
            showModal: undefined,
            elementId: undefined,
            data: [],
            action: undefined,
            route: undefined,
        };
    }

    componentDidMount() {
        this.setState({
            showModal: this.props.show,
            elementId: this.props.id,
            data: this.props.data,
            action: this.props.action,
            route: this.props.route
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showModal: nextProps.show,
            elementId: nextProps.id,
            data: nextProps.data,
            action: nextProps.action,
            route: nextProps.route
        });
    }

    render() {
        const { showModal, elementId, data, action, route } = this.state
        return (
            <Modal show={showModal} onHide={() => { this.setState({ showModal: false }) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Business Role</Modal.Title>
                </Modal.Header>

                <Form onSubmit={() => {
                    fetch(`${route}/${action}/${elementId}`, {
                        method: 'POST'
                    }).finally(() => {
                        this.setState({
                            showModal: false,
                            elementId: undefined
                        });
                        ToastsStore.success("You have deleted the business role")
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
