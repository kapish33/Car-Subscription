import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold">404 Page Not Found</h1>
        <Link to="/">Go back to Home</Link>
    </div>
  )
}

export default NotFound