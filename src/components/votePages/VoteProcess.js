import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { Formik } from "formik";
import * as Yup from "yup";

const schema = Yup.object().shape({
    password: Yup.string().required('Por favor introduza uma password válida'),
});

class VoteProcess extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonProcess: false,
        }
    }

    render() {
        const { candidateName } = this.props;
        return (
            <Formik
                validationSchema={schema}
                onSubmit={ async (values, { setErrors }) => {
                    this.setState({ buttonProcess: true });
                    const error = await this.props.makeVote(this.props.voter, this.props.candidateID, values.password);
                    if (error) {
                        setErrors({ password: error });
                        this.setState({ buttonProcess: false });
                    };
                } }
                initialValues={{ password: '' }}
            >
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group controlId="voter-password">
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
                        <Button variant="success" type="submit" block>
                            { this.state.buttonProcess
                                ? <>
                                    <Spinner
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                    /> Processando voto
                                </>
                                : <>Votar em {candidateName}</>
                            }
                        </Button>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default VoteProcess;
