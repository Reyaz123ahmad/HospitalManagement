import {FaUserMd,FaHospital,FaStethoscope,FaHeartbeat,FaPhone,FaCalendarCheck,FaBars,FaTimes} from 'react-icons/fa'
import { Link } from 'react-router-dom';
// Services Page Component
const Services = () => {
  const services = [
    { 
      title: "Cardiology", 
      description: "Comprehensive heart care including diagnostics, treatment, and rehabilitation.", 
      icon: <FaHeartbeat className="service-icon" />
    },
    { 
      title: "Orthopedics", 
      description: "Treatment for bone, joint, and muscle conditions including sports injuries.", 
      icon: <img src="https://cdn-icons-png.flaticon.com/512/1997/1997928.png" alt="Orthopedics" className="service-icon" />
    },
    { 
      title: "Pediatrics", 
      description: "Specialized care for infants, children, and adolescents.", 
      icon: <img src="https://cdn-icons-png.flaticon.com/512/3464/3464110.png" alt="Pediatrics" className="service-icon" />
    },
    { 
      title: "Neurology", 
      description: "Diagnosis and treatment of disorders affecting the nervous system.", 
      icon: <img src="https://cdn-icons-png.flaticon.com/512/3022/3022851.png" alt="Neurology" className="service-icon" />
    },
    { 
      title: "Oncology", 
      description: "Comprehensive cancer care including chemotherapy and radiation therapy.", 
      icon: <img src="https://cdn-icons-png.flaticon.com/512/2784/2784459.png" alt="Oncology" className="service-icon" />
    },
    { 
      title: "Dermatology", 
      description: "Treatment for skin conditions, allergies, and cosmetic procedures.", 
      icon: <img src="https://cdn-icons-png.flaticon.com/512/2933/2933816.png" alt="Dermatology" className="service-icon" />
    },
  ];

  return (
    <div className="page services-page">
      <section className="services-hero">
        <div className="hero-content">
          <h1>Our Medical Services</h1>
          <p>Comprehensive healthcare services for all your needs</p>
        </div>
      </section>

      <section className="services-intro">
        <div className="container">
          <h2>Specialized Medical Care</h2>
          <p>At MediCare Hospital, we provide a wide range of medical services using the latest technology and evidence-based practices. Our team of specialists is dedicated to delivering personalized care for each patient.</p>
        </div>
      </section>

      <section className="services-list">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-icon-container">
                  {service.icon}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <button className="btn outline">Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="emergency-care">
        <div className="container">
          <div className="emergency-content">
            <h2>24/7 Emergency Care</h2>
            <p>Our emergency department is staffed 24 hours a day, 7 days a week with board-certified emergency physicians and experienced nurses.</p>
            <p>We provide immediate care for serious injuries, acute illnesses, and life-threatening conditions.</p>
            <div className="contact-info">
              <FaPhone className="icon" />
              <div>
                <h3>Emergency Hotline</h3>
                <Link to="tel:(123) 456-7890"><p>(123) 456-7890</p></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="appointment-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Schedule Your Appointment</h2>
            <p>Book a consultation with one of our specialists today</p>
            <Link to="/doctor-list-page" className="btn primary">
              <FaCalendarCheck className="icon" /> Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services