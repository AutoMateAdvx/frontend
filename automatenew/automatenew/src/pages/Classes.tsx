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
                    className="card bg-dark text-white border-0 rounded-4 shadow-sm h-100"
                    style={{
                      transition: "all 0.3s ease",
                      transform:
                        hoveredCard === item.id ? "scale(1.08)" : "scale(1)",
                      boxShadow:
                        hoveredCard === item.id
                          ? "0 10px 20px rgba(0,0,0,0.3)"
                          : "none",
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
                        }}
                      />
                    )}
                    <div className="card-body p-4">
                      <h5 className="card-title fw-bold text-light mb-3">
                        {item.title}
                      </h5>
                      <p className="card-text text-light">{item.description}</p>
                    </div>
                    <div className="card-footer bg-transparent border-0 text-end pe-4 pb-3">
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Example 20px high"
                        aria-valuenow={1}
                        aria-valuemin={0}
                        aria-valuemax={item.levels.length}
                        style={{ height: "20px", marginBottom: "20px" }}
                      >
                        <div
                          className="progress-bar"
                          style={{ width: `${calculateProgress(item)}` }}
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
          <div className="spinner-grow text-primary" role="status" />
          <div className="mt-3" style={{fontSize: 18}}>Loading...</div>
        </div>
      )}
    </div>
  );
}

export default Classes;
