import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EditorComponent from "../components/editor";
import TerminalComponent from "../components/terminal";
import { Navigate, useNavigate } from "react-router-dom";
import Live2DCanvas from "../components/live2d";

function AutoMate() {
  const [collapsed, setCollapsed] = useState(false);
  const [release, setRelease] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1100;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true); // Auto-collapse on mobile
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        {/* Side Navbar */}
        <div
          className={`border-end p-3 `}
          style={{
            width: collapsed ? "70px" : "350px",
            height: "100vh",
            transition: "width 0.3s ease",
            overflow: "hidden",
            backgroundColor: "#03002e",
          }}
        >
          <button
            className="btn btn-light btn-outline-dark me-3"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>

          {!collapsed && (
            <div className="sidebar-content">
              <div className="pt-2 mt-2">
                <div className="card shadow-sm rounded-4">
                  <div className="card-header">Class Title</div>
                  <div className="card-body">
                    <p className="card-text text-muted">
                      This is some placeholder content for the selected class.
                      You can add details, lessons, or actions here.
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary mt-3 mb-3 rounded-pill w-80"
                onClick={() => navigate("/")}
              >
                ← Back to Classes
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div
          className="p-4"
          style={{ flex: 1, display: "flex", flexDirection: "row" }}
        >
          <div
            className="d-flex flex-column"
            style={{ flex: 1, maxWidth: "75%" }}
          >
            <div
              style={{
                flex: "0 0 65%",
                minHeight: "400px",
                border: "1px solid black",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <EditorComponent />
             
            </div>
            
            <div className="mt-2 " style={{ flex: "0 0 25%" }}>
            <button
                className="btn btn-primary" style={{color: "white", marginRight: 1}}
                
              >Submit</button>
              <TerminalComponent />
              {/* You can replace this with xterm.js or a simulated output */}
            </div>
          </div>
          <div style={{ width: "25%", paddingLeft: "1rem" }}>
            <Live2DCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoMate;
