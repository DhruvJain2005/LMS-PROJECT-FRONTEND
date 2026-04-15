import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { PlayCircle, CheckCircle } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchCourseDetails();
      fetchProgress();
    }
  }, [id, user, navigate]);

  const fetchCourseDetails = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`, config);
      setCourse(data);
      if (data.lessons && data.lessons.length > 0) {
        setActiveLesson(data.lessons[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProgress = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/courses/enrollments/my', config);
      const enrollment = data.find(en => en.courseId?._id === id);
      if (enrollment) {
        setProgress(enrollment.progress);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateProgress = async () => {
    if (!course || course.lessons.length === 0) return;
    
    // Simple logic: if they mark a lesson as done, increment progress
    let newProgress = Math.min(progress + (100 / course.lessons.length), 100);
    newProgress = Math.round(newProgress);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`http://localhost:5000/api/courses/${id}/progress`, { progress: newProgress }, config);
      setProgress(newProgress);
    } catch (e) {
      console.error(e);
    }
  };

  const getEmbedUrl = (url) => {
    if (url && url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    return url;
  };

  if (!course) return <div className="container page-layout">Loading Course...</div>;

  return (
    <div className="container page-layout animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        
        {/* Left Side (Video Player) */}
        <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>{course.title}</h2>
          
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '20px' }}>
            {activeLesson ? (
              activeLesson.videoUrl.includes('youtube.com') ? (
                <iframe 
                  width="100%" 
                  height="450" 
                  src={getEmbedUrl(activeLesson.videoUrl)} 
                  title="Lesson Video"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ display: 'block', maxWidth: '100%' }}
                ></iframe>
              ) : (
                <video 
                  width="100%" 
                  height="450" 
                  controls
                  controlsList="nodownload"
                  style={{ display: 'block', maxWidth: '100%', background: '#000' }}
                  src={activeLesson.videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
                <p>No video lessons available yet</p>
              </div>
            )}
          </div>
          
          {activeLesson && (
            <div className="card">
              <h3>{activeLesson.title}</h3>
              <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>{activeLesson.content}</p>
              
              <button className="btn btn-secondary" style={{ marginTop: '20px' }} onClick={updateProgress}>
                <CheckCircle size={18} color="var(--secondary)" /> Mark as Completed
              </button>
            </div>
          )}
        </div>

        {/* Right Side (Lessons List) */}
        <div>
          <div className="card glass-panel" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ marginBottom: '10px' }}>Course Progress</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span>Completed</span>
              <span>{progress}%</span>
            </div>
            
            <div style={{ marginBottom: '20px', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
              <div style={{ width: `${progress}%`, background: 'var(--secondary)', height: '100%', borderRadius: '4px', transition: 'width 0.5s' }}></div>
            </div>

            <h4>Lessons</h4>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {course.lessons.map((lesson, idx) => (
                <div 
                  key={lesson._id} 
                  onClick={() => setActiveLesson(lesson)}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    background: activeLesson?._id === lesson._id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'var(--transition)'
                  }}
                >
                  <PlayCircle size={16} />
                  <span style={{ fontSize: '14px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{idx + 1}. {lesson.title}</span>
                </div>
              ))}
              
              {course.lessons.length === 0 && (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Instructor is still preparing lessons.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseDetails;
