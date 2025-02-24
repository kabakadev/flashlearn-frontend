import { useState } from 'react';
import axios from 'axios'; 

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/signup', {
              username,
              email,
              password,
            });
            console.log('Signup success:', response.data);
    } catch (error) {
      console.error('Signup failed', error); 
    }
  };
}