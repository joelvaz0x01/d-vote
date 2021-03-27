import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Formik } from "formik";

const schema = values => {
    const errors = {};
    let number, maxNumber, lowerCase, upperCase, specialChar;
    if (!values.password) {
        errors.password = ['Por favor introduza uma password válida'];
    } else if (!/^(?=^.{8,}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]))^.*$/.test(values.password)) {
        const initRequirements = 'A password deve ter pelo menos:';
        !/(?=.*?[a-z])/.test(values.password) ? lowerCase = '✖ Uma letra minúscula' : lowerCase = '✔ Uma letra minúscula';
        !/(?=.*?[A-Z])/.test(values.password) ? upperCase = '✖ Uma letra maiúscula' : upperCase = '✔ Uma letra maiúscula';
        !/(?=.*?[0-9])/.test(values.password) ? number = '✖ Um número' : number = '✔ Um número';
        !/(?=.*?[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])/.test(values.password) ? specialChar = '✖ Uma carater especial' : specialChar = '✔ Uma carater especial';
        !/^(?=^.{8,}$)/.test(values.password) ? maxNumber = '✖ Mínimo de 8 carateres' : maxNumber = '✔ Mínimo de 8 carateres';
        errors.password = [initRequirements, maxNumber, number, lowerCase, upperCase, specialChar];
    }
    if (values.confirmation !== values.password && !errors.password) {
        errors.confirmation = 'As passwords não coincidem'
    }
    return errors;
}

class CreateAccount extends Component {

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
                validate={schema}
                onSubmit={values => {
                    this.setState({ buttonProcess: true });
                    this.props.getVoterAddress(values.password);
                    this.setState({ buttonProcess: false });
                }}
                initialValues={{ password: '', confirmation: '' }}
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
                                <p>
                                    { errors.password
                                        ? errors.password.map((error, id) =>
                                            errors.password.length === 1 ? <React.Fragment key={id}>{error}</React.Fragment> :
                                                id === 0
                                                    ? <React.Fragment key={id}><strong>{error}</strong><br></br></React.Fragment>
                                                    : <React.Fragment key={id}>{error}<br></br></React.Fragment>
                                        ) : errors.password
                                    }
                                </p>
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="id-password-confirmation">
                            <Form.Label>Confirmar password</Form.Label>
                            <Form.Control
                                name="confirmation"
                                type="password"
                                placeholder="Confirmar password"
                                value={values.confirmation}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmation}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmation}
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
                                            /> A criar a conta
                                        </>
                                        : <>Criar conta</>
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

export default CreateAccount;
