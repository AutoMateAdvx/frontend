import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import MyModal from "../components/modal";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { listClasses, getCourse } from "../Api";
import { Course, Level } from "../Interface";

function Classes() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [courses, setCourses] = useState<Course[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    //localStorage.clear();

    const fetchData = async () => {
      try {
        const data = await listClasses();
        console.log(data);
        setCourses(data.courses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
  }, []);

  const calculateProgress = (item: Course): string => {
    if (!item.levels || item.levels.length === 0) return "0%";

    const lowestLevel = item.levels[0]?.id;
    const noLevels = item.levels.length;

    if (typeof lowestLevel !== "number") return "0%";

    const storedLevelStr = localStorage.getItem(`course_${item.id}_level`);
    const storedLevel = storedLevelStr ? parseInt(storedLevelStr) : NaN;
    const currentLevel = !isNaN(storedLevel) ? storedLevel : lowestLevel;

    const diff = currentLevel - lowestLevel;
    const progress = (diff / noLevels) * 100;

    return `${Math.min(Math.max(progress, 0), 100).toFixed(0)}%`;
  };

  const handleCardClick = async (item: Course) => {
    const courseId = item.id;
    let lowestLevelInCourse = 0;

    try {
      const data = await getCourse({ course_id: courseId });
      console.log(data.levels[0].id);
      lowestLevelInCourse = data.levels[0].id;
    } catch (error) {
      console.error("Error fetching courses:", error);
    }

    console.log("courseid", courseId);
    const savedLevel = localStorage.getItem(`course_${courseId}_level`);
    const level =
      savedLevel !== null ? parseInt(savedLevel) : lowestLevelInCourse;
    if (savedLevel === null) {
      localStorage.setItem(
        `course_${courseId}_level`,
        `${lowestLevelInCourse}`
      );
    }
    console.log("CURRENTLEVEL", level);
    navigate("/automate", {
      state: { courseId, level },
    });
  };

  return (
    <div style={{ 
      backgroundColor: '#0a192f', // Deep navy blue background
      minHeight: '100vh', 
      color: '#ccd6f6' // Light blue-gray text
    }}>
      {/* Top Navbar - Darker blue with teal accent */}
      <nav className="navbar navbar-expand-lg" style={{ 
        backgroundColor: '#020c1b',
        borderBottom: '1px solid #1e2a3a'
      }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#" style={{ color: '#64ffda' }}> {/* Teal accent */}
            Auto.Mate
          </a>
          <span className="navbar-text" style={{ color: '#8892b0' }}> {/* Muted blue-gray */}
            Your very own AI powerhouse #edTech
          </span>
        </div>
      </nav>
  
      {/* Welcome Section */}
      <div className="d-flex flex-column align-items-center text-center" style={{ marginTop: '5%' }}>
        <h1 className="display-5 fw-bold" style={{ color: '#e6f1ff' }}>Welcome to Auto.Mate</h1>
        <h4 className="" style={{ color: '#e6f1ff' }}>
          Your AI Powerhouse Companion for Learning Code
        </h4>
        <div className="mt-4 mb-5">
          <button
            type="button"
            className="btn px-4 py-2"
            style={{
              backgroundColor: 'transparent',
              color: '#64ffda',
              border: '1px solid #64ffda',
              transition: 'all 0.3s ease'
            }}
            onClick={handleShow}
          >
            <i className="fas fa-plus me-2"></i> Add your GitHub Repo
          </button>
          <MyModal show={showModal} handleClose={handleClose} />
        </div>
      </div>
  
      {/* Card Grid */}
      {!isLoading ? (
        <div className="container pb-5">
          <div className="row g-4">
            {Array.isArray(courses) &&
              courses?.map((item) => (
                <div
                  key={item.id}
                  className="col-12 col-md-6 col-lg-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCardClick(item)}
                >
                  <div
                    className="card border-0 rounded-4 h-100"
                    style={{
                      transition: "all 0.3s ease",
                      transform: hoveredCard === item.id ? "scale(1.03)" : "scale(1)",
                      backgroundColor: '#112240', // Dark blue card
                      boxShadow: hoveredCard === item.id 
                        ? '0 10px 20px rgba(100, 255, 218, 0.1)' // Teal glow
                        : '0 4px 6px rgba(0,0,0,0.1)',
                      border: '1px solid #1e2a3a'
                    }}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="card-img-top"
                        style={{
                          height: "220px",
                          objectFit: "cover",
                          borderTopLeftRadius: '0.75rem',
                          borderTopRightRadius: '0.75rem'
                        }}
                      />
                    )}
                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold mb-3" style={{ color: '#e6f1ff' }}>
                        {item.title}
                      </h5>
                      <p className="card-text" style={{ color: '#8892b0' }}>
                        {item.description}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-0 text-end pe-4 pb-3">
                      <div
                        className="progress"
                        role="progressbar"
                        style={{ 
                          height: "8px",
                          marginBottom: "20px",
                          backgroundColor: '#1e2a3a'
                        }}
                      >
                        <div
                          className="progress-bar"
                          style={{ 
                            width: `${calculateProgress(item)}`,
                            backgroundColor: '#64ffda' // Teal progress bar
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "200px" }}
        >
          <div className="spinner-grow" style={{ color: '#64ffda' }} role="status" />
          <div className="mt-3" style={{ fontSize: 18, color: '#ccd6f6' }}>Loading...</div>
        </div>
      )}
    </div>
  );
}

export default Classes;
