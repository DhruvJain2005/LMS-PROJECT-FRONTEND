import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { PlusCircle, Trash2, Edit2, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  
  // Create Course State
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Add Lesson State
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'instructor') {
      navigate('/');
    } else {
      fetchMyCourses();
    }
  }, [user, navigate]);

  const fetchMyCourses = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/courses');
      const myCourses = data.filter(c => c.instructorId?._id === user._id);
      setCourses(myCourses);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/courses', { title, description }, config);
      setShowCreate(false);
      setTitle('');
      setDescription('');
      fetchMyCourses();
    } catch (e) {
      alert(e.response?.data?.message || 'Error creating course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, config);
      fetchMyCourses();
    } catch (e) {
      alert('Error deleting course');
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!videoFile) return alert('Please select a video file');

    try {
      setUploading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // 1. Upload Video
      const formData = new FormData();
      formData.append('video', videoFile);
      const { data: uploadData } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      // 2. Add Lesson
      await axios.post(`http://localhost:5000/api/courses/${activeCourseId}/lessons`, {
        title: lessonTitle,
        videoUrl: `http://localhost:5000${uploadData.url}`,
        content
      }, config);
      
      setActiveCourseId(null);
      setLessonTitle('');
      setVideoFile(null);
      setContent('');
      fetchMyCourses();
    } catch (e) {
      alert(e.response?.data?.message || 'Error adding lesson');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container page-layout animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--primary)' }}>Instructor Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          <PlusCircle size={18} /> {showCreate ? 'Cancel' : 'Create Course'}
        </button>
      </div>

      {showCreate && (
        <div className="card glass-panel" style={{ marginBottom: '30px' }}>
          <h3>Create New Course</h3>
          <form style={{ marginTop: '20px' }} onSubmit={handleCreateCourse}>
            <div className="input-group">
              <label>Course Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Publish Course</button>
          </form>
        </div>
      )}

      <h4>My Published Courses</h4>
      <div className="grid-courses" style={{ marginTop: '20px' }}>
        {courses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>You haven't created any courses yet.</p>
        ) : (
          courses.map(course => (
            <div key={course._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3>{course.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '10px 0', flex: 1 }}>{course.description}</p>
              
              <div style={{ margin: '10px 0', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Lessons ({course.lessons?.length || 0})</span>
                </div>
                
                {activeCourseId === course._id ? (
                  <form onSubmit={handleAddLesson} style={{ marginTop: '10px' }}>
                    <input className="input-group" style={{ marginBottom: '8px', padding: '8px', width: '100%' }} type="text" placeholder="Lesson Title" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} required />
                    
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Upload Video File:</label>
                      <input className="input-group" style={{ padding: '8px', width: '100%' }} type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} required />
                    </div>

                    <textarea className="input-group" style={{ marginBottom: '8px', padding: '8px', width: '100%' }} placeholder="Lesson Text Content" value={content} onChange={e => setContent(e.target.value)} required />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} disabled={uploading}>
                        {uploading ? 'Uploading Video...' : 'Save Lesson'}
                      </button>
                      <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setActiveCourseId(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', width: '100%' }} onClick={() => setActiveCourseId(course._id)}>
                    <PlusCircle size={14} /> Add Video Lesson
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ padding: '8px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)' }} onClick={() => handleDeleteCourse(course._id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
