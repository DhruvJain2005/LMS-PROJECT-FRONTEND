import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BookOpen, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  fetch(`${API}/api/courses`)
    .then(res => res.json())
    .then(data => setCourses(data));
}, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'instructor') {
      navigate('/instructor-dashboard');
    } else {
      fetchCourses();
      fetchMyEnrollments();
    }
  }, [user, navigate]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/courses');
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyEnrollments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/courses/enrollments/my', config);
      setMyEnrollments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const enroll = async (courseId) => {
    if (!user) return navigate('/login');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {}, config);
      fetchMyEnrollments();
    } catch (e) {
      alert(e.response?.data?.message || 'Enrollment failed');
    }
  };

  const enrolledCourseIds = myEnrollments.map(e => e.courseId._id);

  if (!user) return null;

  return (
    <div className="container page-layout animate-fade-in">
      {user.role === 'student' && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>My Learning progress</h2>
          {myEnrollments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You haven't enrolled in any courses yet.</p>
          ) : (
            <div className="grid-courses">
              {myEnrollments.map(en => (
                <div key={en._id} className="card glass-panel" style={{ cursor: 'pointer', border: '1px solid var(--secondary)' }} onClick={() => navigate(`/course/${en.courseId?._id}`)}>
                  <h3>{en.courseId?.title || 'Unknown Course'}</h3>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlayCircle size={18} color="var(--secondary)" />
                    <span style={{ color: 'var(--secondary)', fontWeight: '600' }}>Continue Learning</span>
                  </div>
                  <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '4px' }}>
                    <div style={{ width: `${en.progress}%`, background: 'var(--secondary)', height: '100%', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <h2 style={{ color: 'var(--primary)', marginBottom: '20px' }}>Explore Courses</h2>
      <div className="grid-courses">
        {courses.map(course => (
          <div key={course._id} className="card">
            <h3>{course.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '8px 0', minHeight: '44px' }}>
              {course.description.substring(0, 80)}...
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--primary)', marginBottom: '20px' }}>
              <BookOpen size={16} /> 
              <span>By {course.instructorId?.name || 'Instructor'}</span>
            </div>
            
            {enrolledCourseIds.includes(course._id) ? (
              <button className="btn btn-secondary" style={{ width: '100%', borderColor: 'var(--secondary)', color: 'var(--secondary)' }} onClick={() => navigate(`/course/${course._id}`)}>Go to Course</button>
            ) : (
              <button className="btn btn-primary" onClick={() => enroll(course._id)} style={{ width: '100%' }}>Enroll Now</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
