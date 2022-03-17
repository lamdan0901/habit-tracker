import './NotFound.scss'
// import 'bootstrap/dist/css/bootstrap.min.css'

export default function NotFound() {
  return (
    <section className="page_404">
      <div className="container">
        <div className="four_zero_four_bg">
          <h1 className="text-center ">404</h1>
        </div>

        <div className="box_404">
          <h3 className="h2">Look like you're lost</h3>

          <p>The page you are looking for is not available!</p>

          <a href="/" className="link_404">
            Go back Home
          </a>
        </div>
      </div>
    </section>
  )
}
