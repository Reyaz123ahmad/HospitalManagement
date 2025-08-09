

const About = () => {
  
  return (
    <div className="page about-page">
      <section className="about-hero">
        <div className="hero-content">
          <h1>About MediCare Hospital</h1>
          <p>Providing exceptional healthcare since 1985</p>
        </div>
      </section>

      <section className="mission">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>To improve the health and well-being of our community through excellence in clinical care, education, and research. We strive to provide compassionate, high-quality healthcare to all patients.</p>
            
            <div className="stats">
              <div className="stat-item">
                <h3>35+</h3>
                <p>Years of Service</p>
              </div>
              <div className="stat-item">
                <h3>150+</h3>
                <p>Specialized Doctors</p>
              </div>
              <div className="stat-item">
                <h3>500+</h3>
                <p>Staff Members</p>
              </div>
            </div>
          </div>
          
          <div className="mission-image">
            <div className="image-placeholder"></div>
          </div>
        </div>
      </section>

      <section className="history">
        <div className="container">
          <h2>Our History</h2>
          <p>Founded in 1985 by Dr. James Wilson, MediCare Hospital started as a small clinic with just 10 beds. Over the decades, we've grown into a leading healthcare institution serving the entire region.</p>
          <p>In 2005, we opened our new state-of-the-art facility with advanced surgical suites and diagnostic centers. Today, we continue to expand our services while maintaining our commitment to personalized patient care.</p>
        </div>
      </section>

      <section className="leadership">
        <div className="container">
          <h2>Our Leadership</h2>
          <div className="doctors">
            <div className="doctor-card">
              <div className="doctor-image"></div>
              <h3>Dr. Sarah Johnson</h3>
              <p>Chief Medical Officer</p>
            </div>
            
            <div className="doctor-card">
              <div className="doctor-image"></div>
              <h3>Dr. Michael Chen</h3>
              <p>Head of Surgery</p>
            </div>
            
            <div className="doctor-card">
              <div className="doctor-image"></div>
              <h3>Dr. Emily Rodriguez</h3>
              <p>Director of Patient Care</p>
            </div>
          </div>
        </div>
      </section>

      <section className="values">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Compassion</h3>
              <p>Treating every patient with empathy, dignity, and respect.</p>
            </div>
            
            <div className="value-card">
              <h3>Excellence</h3>
              <p>Striving for the highest standards in medical care and service.</p>
            </div>
            
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Embracing new technologies and treatments to improve outcomes.</p>
            </div>
            
            <div className="value-card">
              <h3>Community</h3>
              <p>Serving and supporting the health needs of our local community.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default About