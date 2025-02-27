import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div>
            <h1>Welcome to FlashLearn!</h1>
            <p>Your place to master flashcards.</p>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
        </div>
    );
};

export default Homepage;
