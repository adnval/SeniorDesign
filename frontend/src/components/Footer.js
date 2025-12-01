import 'bootstrap/dist/css/bootstrap.css';
import '../App.css';
function Footer() {
    return (     
        <>
            <footer className="text-center text-lg-start bg-body-tertiary text-muted" style={{ marginTop: '56px'} }>
          <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          </section>
          <section className="">
            <div className="container text-center text-md-start mt-5">
              <div className="row mt-3">
                <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">
                    <i className="fas me-3"></i>Team 7 DDD Store
                  </h6>
                  <p>
                  This database store relies on a PostgresSQL database connected and managed through
                  python with Django. The front end relies on React and Node.js.
                  </p>
                </div>
                <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">
                    Pages
                  </h6>
                  <p>
                    <a href="/categories" className="text-reset">Categories</a>
                  </p>
                  <p>
                    <a href="/Orders" className="text-reset">Orders</a>
                  </p>
                  <p>
                    <a href="/AddressBook" className="text-reset">Addresses</a>
                  </p>
                  <p>
                    <a href="/Wallet" className="text-reset">Wallet</a>
                  </p>
                </div>
                
                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                  <h6 className="text-uppercase fw-bold mb-4">Team Members</h6>
                  <p>
                    <i className="fas fa-envelope me-3"></i>
                    lyonme@mail.uc.edu
                  </p>
                  <p>
                    <i className="fas fa-envelope me-3"></i>
                    mareske@mail.uc.edu
                  </p>
                  <p>
                    <i className="fas fa-envelope me-3"></i>
                    sergerds@mail.uc.edu
                  </p>
                </div>
              </div>
            </div>
          </section>
        </footer>
        </>
    )
}
export default Footer;
