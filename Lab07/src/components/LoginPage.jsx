import { useNavigate } from "react-router"

function LoginPage(){
    const navigate = useNavigate()

    const handleLogin = () => navigate('/app')

    return (
        <div>
            <h2>Login</h2>
            <div className="mb-3">
                <label>Email</label>
                <input type="email" className="form-control" />
            </div>

            <div className="mb-3">
                <label>Password</label>
                <input type="password" className="form-control" />
            </div>

            <button className="btn btn-primary" onClick={handleLogin}>
                Login
            </button>
        </div>
    )
}

export default LoginPage