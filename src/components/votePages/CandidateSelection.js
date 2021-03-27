import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Formik } from "formik";

class CandidateSelection extends Component {
    render() {
        const { candidates } = this.props;
        return (
            <Formik
                onSubmit={ async (values, { setErrors }) => {
                    const validation = this.props.candidates.find(candidate => values.candidate === candidate.name);
                    !validation ? setErrors({ candidate: 'Por favor selecione um candidato válido' }) : this.props.validateCandidate(this.props.candidates.indexOf(validation));
                }}
                initialValues={{ candidate: this.props.candidates[0].name }}
            >
                {({ handleSubmit, handleChange, errors }) => (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="candidate">
                            <Form.Label>Selecione o candidato:</Form.Label>
                            <Form.Control
                                as="select"
                                name="candidate"
                                onChange={handleChange}
                                isInvalid={!!errors.candidate}
                            >
                                { candidates.map((candidate, id) => {
                                    return <option key={id}>{candidate.name}</option>
                                }) }
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">{errors.candidate}</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="success" type="submit" block>
                            Seguinte
                        </Button>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default CandidateSelection;
