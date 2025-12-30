import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Form, FormGroup, Container, Row, Col, Card, CardBody } from 'reactstrap';
import logoSm from "../../assets/images/logo-sm.png";
import axiosInstance from 'pages/Utility/axiosInstance';
import Cookies from 'js-cookie';
import { showSuccess } from 'helpers/notification_helper';
import { ClipLoader } from 'react-spinners';

const OTPInput = ({ length = 6, onChange, value }) => {
    const handleChange = (e, index) => {
        const newOtp = [...value];
        const inputValue = e.target.value;

        if (inputValue.match(/[0-9]/)) {
            newOtp[index] = inputValue;
            onChange(newOtp);

            if (inputValue && index < length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        const newOtp = [...value];

        if (e.key === 'Backspace' && !newOtp[index] && index > 0) {
            newOtp[index] = '';
            onChange(newOtp);
            document.getElementById(`otp-input-${index - 1}`).focus();
        } else if (e.key === 'Backspace') {
            newOtp[index] = '';
            onChange(newOtp);
        }
    };

    return (
        <div className=''>
            <div className="d-flex justify-content-between gap-3">
                {Array.from({ length }).map((_, index) => (
                    <FormGroup key={index} style={{ width: '40px' }}>
                        <Input
                            type="text"
                            id={`otp-input-${index}`}
                            maxLength="1"
                            value={value[index]}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="text-center"
                            style={{
                                fontSize: '20px',
                                width: '40px',
                                height: '40px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />
                    </FormGroup>
                ))}
            </div>
        </div>
    );
};

const OTPForm = ({ length = 5 }) => {
    const { id } = useParams();
    const [otp, setOtp] = useState(Array(length).fill(''));
    const [isValid, setIsValid] = useState(true);
    const [timer, setTimer] = useState(60); // Timer in seconds
    const [loading,setLoading] = useState(false);
    const [otpKey,setOtpKey] = useState(id);
    const [resendLoading,setResendLoading] = useState(false);
    const [canResend, setCanResend] = useState(false); // Flag to enable/disable resend button

    const navigate = useNavigate()

    // Handle OTP input changes
    const handleOTPChange = (newOtp) => {
        setOtp(newOtp);
    };

      useEffect(() => {
        if (Cookies.get('access_token')) {
          navigate('/dashboard')
        }
      }, [])

    useEffect(() => {
        // Get the stored OTP sent time and expiry time from localStorage
        const otpSentTime = localStorage.getItem('otpSentTime');
        const otpExpiryTime = localStorage.getItem('otpExpiryTime');
        
        if (otpSentTime && otpExpiryTime) {
            const currentTime = Date.now();
            const remainingTime = otpExpiryTime - currentTime;

            if (remainingTime > 0) {
                setTimer(Math.floor(remainingTime / 1000)); // Set the remaining time
            } else {
                setCanResend(true); // Allow resend if time expired
                setTimer(0); // Set timer to 0 if OTP expired
            }
        }else{
            const currentTime = Date.now();
            const otpExpiryTime = currentTime + 60000; // OTP expires in 60 seconds
    
            // Store the OTP sent time and expiry time in localStorage
            localStorage.setItem('otpSentTime', currentTime.toString());
            localStorage.setItem('otpExpiryTime', otpExpiryTime.toString());
        }

        // Start countdown based on the timer value
        let countdown = null;
        if (timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        clearInterval(countdown);
                        setCanResend(true); // Enable resend button once timer finishes
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            clearInterval(countdown); // Clean up on component unmount
        };
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length === length && otpValue.match(/^\d+$/)) {
            setLoading(true);
            try {
                const { data } = await axiosInstance.post('', {
                    "sp": "usp_ValidateUserAuth",
                    "otp": Number(otpValue),
                    "otpKey": otpKey
                });
                if (data?.Data?.[0]?.AccessToken && data?.Data?.[0]?.RefreshToken) {
                    Cookies.set('access_token', data?.Data?.[0]?.AccessToken);
                    Cookies.set('refresh_token', data?.Data?.[0]?.RefreshToken);
                    Cookies.set('authUser', JSON.stringify({
                        "userId": data?.Data?.[0]?.userId,
                        "emailId": data?.Data?.[0]?.emailId,
                        "phoneNo": data?.Data?.[0]?.phoneNo,
                        "userName": data?.Data?.[0]?.userName,
                        "lastLoginTime": data?.Data?.[0]?.lastLoginTime,
                        "userRole": data?.Data?.[0]?.userRole,
                    }));
                    const userPermissions = JSON.parse(data?.Data?.[0]?.userPermissions || '[]');
                    localStorage.setItem('permissions', JSON.stringify(userPermissions));
                    localStorage.removeItem('otpSentTime');
                    localStorage.removeItem('otpExpiryTime');
                    navigate('/dashboard');
                    setLoading(false);
                    showSuccess("Login Successfull!")
                }

            } catch (error) {
                console.error('OTP validation failed:', error);
                setLoading(false);
            }
        } else {
            setIsValid(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true)
        try {
            const { data } = await axiosInstance.post('', {
                "sp": "usp_ResetOtp",
                "otpKey": otpKey
            });
            if (data) {
                showSuccess('OTP resent successfully');
                console.log(data?.Data?.[0]?.NewOtpKey)
                setOtpKey(data?.Data?.[0]?.NewOtpKey)
                const currentTime = Date.now();
                const otpExpiryTime = currentTime + 60000; // OTP expires in 60 seconds
        
                // Store the OTP sent time and expiry time in localStorage
                localStorage.setItem('otpSentTime', currentTime.toString());
                localStorage.setItem('otpExpiryTime', otpExpiryTime.toString());
        
                setTimer(60); // Reset the timer to 60 seconds
                setCanResend(false); // Disable resend button until timer expires
                setResendLoading(false)
            }
        } catch (error) {
            setResendLoading(false);
            console.error('Error resending OTP:', error);
        }
    };

    return (
        <React.Fragment>
            <div className="account-pages pt-sm-5" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={4}>
                            <Card className="overflow-hidden shadow-sm">
                                <div className="bg-primary">
                                    <div className="text-primary text-center p-4">
                                        <h5 className="text-white font-size-20 mb-3">
                                            VERIFY OTP
                                        </h5>
                                        <Link to="/" className="logo logo-admin">
                                            <img src={logoSm} height="34" alt="logo" width="70px"/>
                                        </Link>
                                    </div>
                                </div>

                                <CardBody className="p-4">
                                    <div className='mt-5'>
                                        <Form onSubmit={handleSubmit}>
                                            <FormGroup>
                                                <OTPInput value={otp} onChange={handleOTPChange} length={length} />
                                                {!isValid && <p style={{ color: 'red', fontSize: '12px' }}>Please enter a valid OTP!</p>}
                                            </FormGroup>
                                            <Button type="submit" color="primary" className='mb-4' block>
                                                {loading ? <ClipLoader size={16} color="white"/>:"Submit"}
                                            </Button>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <span style={{ fontSize: '12px' }}>
                                                    {timer > 0 ? `Resend OTP in ${timer}s` : 'You can resend OTP now.'}
                                                </span>
                                                <Button
                                                    
                                                    className="text-decoration-none text-white bg-primary"
                                                    onClick={()=>handleResendOTP()}
                                                    disabled={!canResend} // Disable button until the timer ends
                                                    style={{ cursor: canResend ? "pointer" : "not-allowed",minWidth:"100px" }}
                                                    
                                                >
                                                    {resendLoading ? <ClipLoader size={16} color="white"/>:"Resend OTP"}
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default OTPForm;
