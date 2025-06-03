import styled from "styled-components";

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Alto de la ventana */
    padding: 20px;
    background: linear-gradient(135deg, #e0e7ff, #ffffff);
    font-family: "Segoe UI", sans-serif;
`;

const LoginBox = styled.div`
    width: 100%;
    max-width: 400px;
    padding: 30px;
    background-color: #ffffffcc;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    gap: 15px;
`;


const LoginTitle = styled.h2`
    text-align: center;
    color: #2e8bfa;
    font-size: 28px;
    margin-bottom: 10px;
`;

const LoginInput = styled.input`
    padding: 12px;
    border: none;
    border-radius: 12px;
    background-color: #f3f4f6;
    font-size: 16px;
    &:focus {
        outline: none;
        background-color: #e0e7ff;
    }
`;

const LoginButton = styled.button`
    padding: 12px;
    background-color: #2e8bfa;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    &:hover {
        background-color: #1d6ee0;
    }
`;

const RegisterButton = styled(LoginButton)`
    background-color: #6c757d;
    &:hover {
        background-color: #5a6268;
    }
`;

const ErrorText = styled.p`
    color: red;
    text-align: center;
`;

export {
    LoginContainer,
    LoginBox,
    LoginTitle,
    LoginInput,
    LoginButton,
    RegisterButton,
    ErrorText
};
