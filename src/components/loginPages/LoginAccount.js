import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Formik } from "formik";
import * as Yup from "yup";

const schema = Yup.object().shape({
    password: Yup.string().required('Por favor introduza uma password válida'),
});

class LoginAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonProcess: false,
        }
    }

    render() {
        const { IDnumberSelected } = this.props;
        return (
            <Formik
                validationSchema={schema}
                onSubmit={ async (values, { setErrors }) => {
                    this.setState({ buttonProcess: true });
                    const error = await this.props.getVoterAddress(values.password);
                    if (error) {
                        setErrors({ password: error });
                        this.setState({ buttonProcess: false });
                    };
                }}
                initialValues={{ password: '' }}
            >
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="id-number">
                            <Form.Label>Número de Identificação Civil: <strong>{IDnumberSelected}</strong></Form.Label>
                        </Form.Group>
                        <Form.Group controlId="id-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={values.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Row xs={1} md={2}>
                            <Form.Group as={Col}>
                                <Button variant="success" onClick={() => this.props.logoutVoter()} block>
                                    Anterior
                                </Button>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Button variant="success" type="submit" block>
                                    { this.state.buttonProcess
                                        ? <>
                                            <Spinner
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                            /> A efetuar o login
                                        </>
                                        : <>Login</>
                                    }
                                </Button>
                            </Form.Group>
                        </Row>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default LoginAccount
