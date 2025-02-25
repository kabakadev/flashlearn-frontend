import { Link } from "react-router-dom";

const Homepage = () => {
    return(
        <div>
           <h1> Welcomee to FlashLearnnn!!!!!</h1>
           <p> Your place to master flashcardss.</p>

           <Link to ="/login">
           <button>Login</button>
           </Link>

           <Link to ="/register">
           <button>Register</button>
           </Link>
        </div>
    );
};

export default Homepage;