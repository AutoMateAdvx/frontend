import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MyModal from "../components/modal";
import "bootstrap/dist/js/bootstrap.bundle.min";

function Classes() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div
      style={{ backgroundColor: "#0a0a0a", minHeight: "100vh", color: "white" }}
    >
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark border-bottom border-secondary"
        style={{ backgroundColor: "#121212" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#">
            Auto.Mate
          </a>
          <span className="navbar-text text-light">
            Your very own AI powerhouse #edTech
          </span>
        </div>
      </nav>

      {/* Welcome Section */}
      <div
        className="d-flex flex-column align-items-center text-center"
        style={{ marginTop: "5%" }}
      >
        <h1 className="display-5 fw-bold">Welcome to Auto.Mate</h1>
        <h4 className="text-secondary">
          Your AI Powerhouse Companion for Learning Code
        </h4>
        <div className="mt-4 mb-5">
          <button
            type="button"
            className="btn btn-outline-light px-4 py-2"
            onClick={handleShow}
          >
            <i className="fas fa-plus me-2"></i> Add your GitHub Repo
          </button>
          <MyModal show={showModal} handleClose={handleClose} />
        </div>
      </div>

      {/* Card Grid */}
      <div className="container pb-5">
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="col-12 col-md-6 col-lg-4">
              <Link
                to={`/automate`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  className="card bg-dark text-white border-0 rounded-4 shadow-sm h-100"
                  style={{
                    transition: "all 0.3s ease",
                    transform:
                      hoveredCard === item ? "scale(1.08)" : "scale(1)",
                    boxShadow:
                      hoveredCard === item
                        ? "0 10px 20px rgba(0,0,0,0.3)"
                        : "none",
                  }}
                  onMouseEnter={() => setHoveredCard(item)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="card-header border-0 bg-transparent fw-semibold">
                    Class Title {item}
                  </div>
                  <div className="card-body">
                    <p className="card-text text-secondary small">
                      This is some placeholder content for the selected class.
                      You can add details, lessons, or actions here.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Classes;
