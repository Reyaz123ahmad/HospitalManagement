// // src/pages/Gallery.js
// import React, { useState, useEffect } from 'react';
// import './GalleryPage.css';

// const GalleryPage = () => {
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [categories] = useState([
//     { id: 'all', name: 'All Departments' },
//     { id: 'emergency', name: 'Emergency' },
//     { id: 'surgery', name: 'Surgery' },
//     { id: 'pediatrics', name: 'Pediatrics' },
//     { id: 'cardiology', name: 'Cardiology' },
//     { id: 'oncology', name: 'Oncology' },
//   ]);

//   const [images] = useState([
//     { id: 1, category: 'emergency', title: 'Emergency Department', description: 'Our state-of-the-art emergency room with 24/7 care' },
//     { id: 2, category: 'surgery', title: 'Operating Theater', description: 'Modern surgical suite with advanced equipment' },
//     { id: 3, category: 'pediatrics', title: 'Childrens Ward', description: 'Child-friendly environment for our youngest patients' },
//     { id: 4, category: 'cardiology', title: 'Cardiac Care Unit', description: 'Specialized care for heart patients' },
//     { id: 5, category: 'oncology', title: 'Cancer Treatment Center', description: 'Advanced oncology department with compassionate care' },
//     { id: 6, category: 'emergency', title: 'Emergency Entrance', description: 'Ambulance bay with direct access to ER' },
//     { id: 7, category: 'surgery', title: 'Recovery Room', description: 'Comfortable recovery space post-surgery' },
//     { id: 8, category: 'pediatrics', title: 'Play Area', description: 'Recreational space for pediatric patients' },
//     { id: 9, category: 'cardiology', title: 'Cardiac Diagnostics', description: 'Advanced diagnostic imaging for heart conditions' },
//     { id: 10, category: 'oncology', title: 'Chemotherapy Suite', description: 'Comfortable environment for chemotherapy treatments' },
//     { id: 11, category: 'emergency', title: 'Trauma Center', description: 'Level 1 trauma center ready for critical cases' },
//     { id: 12, category: 'surgery', title: 'Neurosurgery', description: 'Specialized neurosurgical operating room' },
//   ]);

//   const filteredImages = activeCategory === 'all' 
//     ? images 
//     : images.filter(image => image.category === activeCategory);

//   const openLightbox = (image) => {
//     setCurrentImage(image);
//     setLightboxOpen(true);
//     document.body.style.overflow = 'hidden';
//   };

//   const closeLightbox = () => {
//     setLightboxOpen(false);
//     document.body.style.overflow = 'auto';
//   };

//   // Close lightbox on ESC key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === 'Escape') closeLightbox();
//     };
    
//     if (lightboxOpen) {
//       window.addEventListener('keydown', handleEsc);
//     }
    
//     return () => {
//       window.removeEventListener('keydown', handleEsc);
//     };
//   }, [lightboxOpen]);

//   return (
//     <div className="gallery-page">
//       <div className="gallery-hero">
//         <div className="hero-overlay"></div>
//         <div className="hero-content">
//           <h1>Hospital Gallery</h1>
//           <p>Take a virtual tour of our world-class facilities</p>
//         </div>
//       </div>
      
//       <div className="gallery-container">
//         <div className="gallery-intro">
//           <h2>Our State-of-the-Art Facilities</h2>
//           <p>
//             At MediCare Hospital, we pride ourselves on providing the most advanced medical care 
//             in a comfortable and welcoming environment. Explore our facilities through the gallery below.
//           </p>
//         </div>
        
//         <div className="gallery-controls">
//           <div className="category-filter">
//             {categories.map(category => (
//               <button
//                 key={category.id}
//                 className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
//                 onClick={() => setActiveCategory(category.id)}
//               >
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </div>
        
//         <div className="image-gallery">
//           {filteredImages.map(image => (
//             <div 
//               key={image.id} 
//               className="gallery-item"
//               onClick={() => openLightbox(image)}
//             >
//               <div className="image-placeholder">
//                 <div className={`image-content ${image.category}`}></div>
//               </div>
//               <div className="image-info">
//                 <h3>{image.title}</h3>
//                 <p>{image.description}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {lightboxOpen && currentImage && (
//         <div className="lightbox" onClick={closeLightbox}>
//           <div className="lightbox-content" onClick={e => e.stopPropagation()}>
//             <button className="close-btn" onClick={closeLightbox}>&times;</button>
//             <div className="lightbox-image">
//               <div className={`image-content ${currentImage.category}`}></div>
//             </div>
//             <div className="lightbox-info">
//               <h3>{currentImage.title}</h3>
//               <p>{currentImage.description}</p>
//               <div className="category-tag">{categories.find(c => c.id === currentImage.category)?.name}</div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div className="gallery-cta">
//         <div className="cta-content">
//           <h2>Experience Our Care Firsthand</h2>
//           <p>Schedule a tour of our facilities or book an appointment with one of our specialists.</p>
//           <div className="cta-buttons">
//             <button className="cta-btn primary">Schedule a Tour</button>
//             <button className="cta-btn secondary">Book an Appointment</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GalleryPage;



// src/components/Gallery.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './GalleryPage.css'

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
   const [accountType,setAccountType]=useState(null);
  const [categories] = useState([
    { id: 'all', name: 'All Departments' },
    { id: 'emergency', name: 'Emergency' },
    { id: 'surgery', name: 'Surgery' },
    { id: 'pediatrics', name: 'Pediatrics' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'oncology', name: 'Oncology' },
  ]);

  const [images] = useState([
    { id: 1, category: 'emergency', title: 'Emergency Department', description: 'Our state-of-the-art emergency room with 24/7 care' },
    { id: 2, category: 'surgery', title: 'Operating Theater', description: 'Modern surgical suite with advanced equipment' },
    { id: 3, category: 'pediatrics', title: 'Childrens Ward', description: 'Child-friendly environment for our youngest patients' },
    { id: 4, category: 'cardiology', title: 'Cardiac Care Unit', description: 'Specialized care for heart patients' },
    { id: 5, category: 'oncology', title: 'Cancer Treatment Center', description: 'Advanced oncology department with compassionate care' },
    { id: 6, category: 'emergency', title: 'Emergency Entrance', description: 'Ambulance bay with direct access to ER' },
    { id: 7, category: 'surgery', title: 'Recovery Room', description: 'Comfortable recovery space post-surgery' },
    { id: 8, category: 'pediatrics', title: 'Play Area', description: 'Recreational space for pediatric patients' },
    { id: 9, category: 'cardiology', title: 'Cardiac Diagnostics', description: 'Advanced diagnostic imaging for heart conditions' },
    { id: 10, category: 'oncology', title: 'Chemotherapy Suite', description: 'Comfortable environment for chemotherapy treatments' },
    { id: 11, category: 'emergency', title: 'Trauma Center', description: 'Level 1 trauma center ready for critical cases' },
    { id: 12, category: 'surgery', title: 'Neurosurgery', description: 'Specialized neurosurgical operating room' },
  ]);

  const filteredImages = activeCategory === 'all' 
    ? images 
    : images.filter(image => image.category === activeCategory);

  const openLightbox = (image) => {
    setCurrentImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Close lightbox on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    
    if (lightboxOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [lightboxOpen]);


 
  useEffect(()=>{
    const storedAccountType=localStorage.getItem('accountType');
    console.log('StoredAccountType',storedAccountType)
      if(storedAccountType && storedAccountType !=="null" && storedAccountType !=="undefined"){
        setAccountType(storedAccountType)
      }else{
        console.log('Account type not found in localStorage')
      }
        //setAccountType(storedAccountType)
    },[])

  return (
    <div className="abc-gallery-page">
      <div className="abc-gallery-hero">
        <div className="abc-hero-overlay"></div>
        <div className="abc-hero-content">
          <h1>Hospital Gallery</h1>
          <p>Take a virtual tour of our world-class facilities</p>
        </div>
      </div>
      
      <div className="abc-gallery-container">
        <div className="abc-gallery-intro">
          <h2>Our State-of-the-Art Facilities</h2>
          <p>
            At MediCare Hospital, we pride ourselves on providing the most advanced medical care 
            in a comfortable and welcoming environment. Explore our facilities through the gallery below.
          </p>
        </div>
        
        <div className="abc-gallery-controls">
          <div className="abc-category-filter">
            {categories.map(category => (
              <button
                key={category.id}
                className={`abc-filter-btn ${activeCategory === category.id ? 'abc-active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="abc-image-gallery">
          {filteredImages.map(image => (
            <div 
              key={image.id} 
              className="abc-gallery-item"
              onClick={() => openLightbox(image)}
            >
              <div className="abc-image-placeholder">
                <div className={`abc-image-content abc-${image.category}`}></div>
              </div>
              <div className="abc-image-info">
                <h3>{image.title}</h3>
                <p>{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {lightboxOpen && currentImage && (
        <div className="abc-lightbox" onClick={closeLightbox}>
          <div className="abc-lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="abc-close-btn" onClick={closeLightbox}>&times;</button>
            <div className="abc-lightbox-image">
              <div className={`abc-image-content abc-${currentImage.category}`}></div>
            </div>
            <div className="abc-lightbox-info">
              <h3>{currentImage.title}</h3>
              <p>{currentImage.description}</p>
              <div className="abc-category-tag">{categories.find(c => c.id === currentImage.category)?.name}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="abc-gallery-cta">
        <div className="abc-cta-content">
          <h2>Experience Our Care Firsthand</h2>
          <p>Schedule a tour of our facilities or book an appointment with one of our specialists.</p>
          <div className="abc-cta-buttons">
            <button className="abc-cta-btn abc-primary">Schedule a Tour</button>
            <Link to= {accountType === 'Customer'? "/doctor-list-page" : accountType ==='Admin' ?"#" : '/login'} onClick={(e)=>{if(accountType==="Admin"){e.preventDefault(); alert('only for customer')}}} className="btn secondary">
              Book Appointment
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
