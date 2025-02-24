import {useState} from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password
            });
            console.log('Logged in:', response.data);
            localStorage.setItem('token', response.data.token);
        }   catch (error) {
            setErrorMessage('Invalid credentials');
    }
};

return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}/>

        <input 
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />   

        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          /> 
    </div>
)