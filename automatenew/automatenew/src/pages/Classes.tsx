import React, { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";

function Classes() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Auto.Mate
          </a>
          <a className="navbar-brand" href="#">
            Your very own AI powerhouse #edTech
          </a>
        </div>
      </nav>

      <div className="d-flex">
        {/* Main Content */}
        <div
          className="p-4"
          style={{ flex: 1, display: "flex", flexDirection: "row" }}
        >
          <div className="row g-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="col-12 col-md-6 col-lg-4 ">
                <Link
                  to={`/automate`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card shadow-sm rounded-4 h-100">
                    <div className="card-header">Class Title {item}</div>
                    <div className="card-body">
                      <p className="card-text text-muted">
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
    </div>
  );
}

export default Classes;
