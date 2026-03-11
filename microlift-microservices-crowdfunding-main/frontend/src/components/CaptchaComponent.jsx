import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, Card } from 'react-bootstrap';
import { FaSyncAlt } from 'react-icons/fa';

const CaptchaComponent = ({ onVerify }) => {
    const [captcha, setCaptcha] = useState(() => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        return { num1, num2, answer: num1 + num2 };
    });
    const [userInput, setUserInput] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [touched, setTouched] = useState(false);

    const generateCaptcha = React.useCallback(() => {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        setCaptcha({ num1, num2, answer: num1 + num2 });
        setUserInput('');
        setIsValid(false);
        setTouched(false);
        onVerify(false);
    }, [onVerify]);

    useEffect(() => {
        onVerify(false);
    }, [onVerify]);

    const handleChange = (e) => {
        const val = e.target.value;
        setUserInput(val);
        setTouched(true);
        const valid = parseInt(val) === captcha.answer;
        setIsValid(valid);
        onVerify(valid);
    };

    return (
        <div className="mb-3">
            <Form.Label>Security Check</Form.Label>
            <Card body className="bg-light d-flex flex-row align-items-center justify-content-between py-2 px-3 mb-2">
                <span className="fw-bold fs-5 user-select-none">
                    {captcha.num1} + {captcha.num2} = ?
                </span>
                <Button variant="link" onClick={generateCaptcha} className="text-decoration-none text-muted" title="Refresh CAPTCHA">
                    <FaSyncAlt />
                </Button>
            </Card>
            <InputGroup hasValidation>
                <Form.Control
                    type="number"
                    placeholder="Enter answer"
                    value={userInput}
                    onChange={handleChange}
                    isInvalid={touched && !isValid}
                    isValid={touched && isValid}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Incorrect answer. Please try again.
                </Form.Control.Feedback>
            </InputGroup>
        </div>
    );
};

export default CaptchaComponent;
