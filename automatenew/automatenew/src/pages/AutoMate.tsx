import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import EditorComponent from "../components/editor";
import TerminalComponent from "../components/terminal";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For tables, strikethroughs, etc.
import rehypeHighlight from "rehype-highlight"; // For syntax highlighting
import 'highlight.js/styles/github-dark.css';

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
        const data = await getLevel({ course_id: courseId, level_id: levelToGet });
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
    <div style={{
      backgroundColor: '#121212',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top Navbar - Fixed height */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{
        backgroundColor: '#0a192f',
        flexShrink: 0,
        padding: '0.5rem 1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <a className="navbar-brand fw-bold" style={{ color: '#64ffda' }} href="/">
              Auto.Mate
            </a>
            <a className="navbar-brand text-muted ms-3" href="#">
              Your AI powerhouse #edTech
            </a>
          </div>
        </div>
      </nav>
  
      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Sidebar - Elegant dark blue */}
        <div style={{
          width: collapsed ? "70px" : "350px",
          backgroundColor: '#0a192f',
          transition: 'width 0.3s ease',
          overflowY: 'auto',
          borderRight: '1px solid #1e2a3a',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <button
            className="btn btn-sm m-2"
            style={{
              backgroundColor: '#112240',
              color: '#64ffda',
              alignSelf: 'flex-start'
            }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '☰' : '✕'}
          </button>
  
          {!collapsed && (
            <div style={{ padding: '1rem', flex: 1 }}>
              {!isLoading ? (
                <div style={{
                  backgroundColor: '#112240',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    color: '#ccd6f6',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    borderBottom: '1px solid #1e2a3a',
                    paddingBottom: '0.5rem'
                  }}>
                    {currentLevel?.title}
                  </div>
                  <div style={{ color: '#8892b0' }}>
                    <p style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#ccd6f6' }}>章节:</strong> {currentLevel?.order_number}/{currentCourse?.levels.length}
                    </p>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <strong style={{ color: '#ccd6f6' }}>描述:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {currentLevel?.description || ""}
                        </Markdown>
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: '#ccd6f6' }}>要求:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {currentLevel?.requirements || ""}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  color: '#64ffda'
                }}>
                  <div className="spinner-grow" style={{ color: '#64ffda' }} />
                  <div style={{ marginTop: '1rem' }}>Loading...</div>
                </div>
              )}
              <button
                style={{
                  backgroundColor: '#0a192f',
                  color: '#64ffda',
                  border: '1px solid #64ffda',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  marginTop: '1.5rem',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate("/")}
              >
                ← 课程列表
              </button>
            </div>
          )}
        </div>
  
        {/* Main Content - Sleek dark layout */}
        <div style={{
          flex: 1,
          display: 'flex',
          padding: '1rem',
          overflow: 'hidden',
          backgroundColor: '#0a192f'
        }}>
          {/* Editor/Terminal Column */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginRight: '1rem'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              marginBottom: '1rem',
              color: '#ccd6f6'
            }}>
              <p style={{ marginRight: '2rem' }}>
                <strong>课程:</strong> {currentLevel?.course.title}
              </p>
              <p>
                <strong>关卡:</strong> {currentLevel?.id}/{currentLevel?.title}
              </p>
            </div>
  
            {/* Editor - Glassmorphism effect */}
            <div style={{
              flex: 1,
              backgroundColor: 'rgba(17, 34, 64, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              border: '1px solid #1e2a3a',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <EditorComponent />
            </div>
  
            {/* Terminal Section */}
            <div style={{
              marginTop: '1rem',
              backgroundColor: 'rgba(17, 34, 64, 0.7)',
              borderRadius: '8px',
              padding: '1rem',
              border: '1px solid #1e2a3a'
            }}>
              <button
                style={{
                  backgroundColor: '#64ffda',
                  color: '#0a192f',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  marginBottom: '1rem',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onClick={handleSubmit}
              >
                提交
              </button>
              <TerminalComponent />
            </div>
          </div>
  
          {/* Model Viewer - Glass panel */}
          <div style={{
            width: '25%',
            backgroundColor: 'rgba(17, 34, 64, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            padding: '1rem',
            border: '1px solid #1e2a3a',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Model />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoMate;
