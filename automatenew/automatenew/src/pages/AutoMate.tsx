import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EditorComponent from "../components/editor";
import TerminalComponent from "../components/terminal";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For tables, strikethroughs, etc.
import rehypeHighlight from "rehype-highlight"; // For syntax highlighting
import "highlight.js/styles/github.css";

import Live2DCanvas from "../components/live2d";
import Live2dRender from "../components/live2dRender";
import Live2dProvider from "../components/live2dProvider";
import Model from "../components/live2d";
import { getLevel, getCourse } from "../Api";
import { CurrentLevel, CurrentCourse } from "../Interface";

type LocationState = {
  courseId: number;
  level: number;
};

function AutoMate() {
  const [collapsed, setCollapsed] = useState(false);
  const [release, setRelease] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentLevel, setCurrentLevel] = useState<CurrentLevel>();
  const [currentCourse, setCurrentCourse] = useState<CurrentCourse>();

  const location = useLocation<LocationState>();
  const { courseId, level } = location.state || { courseId: 555, level: 555 };
  const [levelToGet, setLevelToGet] = useState(level);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCourse({ course_id: courseId });
        console.log(data.levels);
        setCurrentCourse(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLevel({ level_id: levelToGet });
        console.log(data);
        setCurrentLevel(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchData();
    localStorage.setItem(`course_${courseId}_level`, `${levelToGet}`);
  }, [levelToGet]);

  const handleSubmit = () => {
    if (!currentCourse?.levels?.length) {
      console.error("No course selected");
      return;
    }

    const levelIds = currentCourse.levels.map((level) => level.id);
    const maxLevelId = Math.max(...levelIds);

    const totalLevels = maxLevelId;
    console.log("total levels", totalLevels);
    if (levelToGet < totalLevels) {
      setLevelToGet((prev: number) => prev + 1);
      console.log("level to get", levelToGet);
    } else {
      navigate("/");
    }
  };

  return (
    <div style={{backgroundColor:'#121212'}}>
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
            overflow: "auto",
            backgroundColor: 'darkgrey',
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
                {!isLoading ? <div className="card shadow-sm rounded-4">
                  <div className="card-header fw-bold fs-5">
                    {currentLevel?.title}
                  </div>
                  <div className="card-body">
                    <p className="text-muted mb-2">
                      <strong>章节:</strong>{" "}
                      {currentLevel?.order_number} / {currentCourse?.levels.length}
                    </p>
                    <div className="mb-3">
                      <strong>描述:</strong>
                      <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}>
                        {currentLevel?.description || ""}
                      </ReactMarkdown>
                    </div>
                    <div>
                      <strong>要求:</strong>
                      <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}>
                        {currentLevel?.requirements || ""}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div> : 
                <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "200px" }}
              >
                <div className="spinner-grow text-primary" role="status" />
                <div className="mt-3" style={{fontSize: 18}}>Loading...</div>
              </div>}
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
          style={{ flex: 1, display: "flex", flexDirection: "row", backgroundColor: '#121212' }}
        >
          <div
            className="d-flex flex-column"
            style={{ flex: 1, maxWidth: "75%" }}
          >
            {" "}
            <div className="d-flex ">
              <p className="mb-0 me-5" style={{color:"white"}}>
                <strong>课程:</strong> {currentLevel?.course.title}
              </p>
              <p className="mb-0" style={{color:"white"}}>
                <strong>关卡:</strong> {currentLevel?.id} /{" "}
                {currentLevel?.title}
              </p>
            </div>
            <div
              style={{
                flex: "0 0 65%",
                maxHeight: "650px",
                border: "1px solid black",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <EditorComponent />
            </div>
            <div className="mt-2 " style={{ flex: "0 0 25%" }}>
              <button
                className="btn btn-primary"
                style={{ color: "white", marginRight: 1 }}
                onClick={handleSubmit}
              >
                提交
              </button>
              <TerminalComponent />
              {/* You can replace this with xterm.js or a simulated output */}
            </div>
          </div>
          <div style={{ width: "25%", paddingLeft: "1rem" }}>
            {/* <Live2DCanvas /> */}
            <Model />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoMate;
