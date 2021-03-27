import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from "formik";
import * as Yup from "yup";

const schema = Yup.object().shape({
    nic: Yup.string().required('Por favor introduza um Número de Identificação Civil válido'),
});

class DetectAccount extends Component {
    render() {
        return (
            <Formik
                validationSchema={schema}
                onSubmit={ async (values, { setErrors }) => {
                    const error = await this.props.checkVoter(values.nic);
                    if (error) { setErrors({ nic: error }) };
                } }
                initialValues={{ nic: '' }}
            >
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="id-number">
                            <Form.Label>Número de Identificação Civil (cifrado)</Form.Label>
                            <Form.Control
                                name="nic"
                                placeholder="Número de Identificação Civil (cifrado)"
                                value={values.nic}
                                onChange={handleChange}
                                isInvalid={!!errors.nic}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.nic}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="success" type="submit" block>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default DetectAccount;
