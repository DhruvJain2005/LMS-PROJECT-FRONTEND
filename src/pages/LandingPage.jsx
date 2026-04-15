import { Link } from 'react-router-dom';
import { BookOpen, Users, Video, Target } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(to bottom, rgba(79, 70, 229, 0.1), transparent)' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', color: 'var(--primary)' }}>
          Welcome to Sikhoo
        </h1>
        <p style={{ fontSize: '20px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Your ultimate destination for online learning. Discover high-quality courses, learn safely, and track your progress in real-time.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '18px', padding: '16px 32px' }}>Start Learning Now</Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '18px', padding: '16px 32px' }}>Login</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>What you can do on Sikhoo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '12px' }}>Explore Courses</h3>
            <p style={{ color: 'var(--text-muted)' }}>Browse through a variety of expert-led courses across multiple domains.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Video size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '12px' }}>Interactive Video Lessons</h3>
            <p style={{ color: 'var(--text-muted)' }}>Learn at your own pace with engaging and descriptive video content.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Target size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '12px' }}>Track Progress</h3>
            <p style={{ color: 'var(--text-muted)' }}>Keep yourself accountable by seamlessly tracking your course enrollments and progress.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Users size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '12px' }}>Instructor Access</h3>
            <p style={{ color: 'var(--text-muted)' }}>Share your knowledge by creating and managing courses as an instructor.</p>
          </div>
        </div>
      </section>
      
      {/* Footer / CTA */}
      <section style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Ready to unlock your potential?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Join thousands of students building their future today.</p>
        <Link to="/register" className="btn btn-primary">Join Unacademy Alternative</Link>
      </section>
    </div>
  );
};

export default LandingPage;
