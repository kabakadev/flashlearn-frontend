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
  return(
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}></form>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
         <button type="submit">Signup</button>
        </form>
    </div>
  );
};

export default Signup;