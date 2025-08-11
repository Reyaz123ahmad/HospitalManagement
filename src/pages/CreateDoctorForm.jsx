import React, { useState, useEffect } from "react";
//import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import './CreateDoctorForm.css';

const CreateDoctorForm = () => {
  const [doctorData, setDoctorData] = useState({
    doctorName: "",
    specialization: "",
    consultationFee: "",
    experience: "",
    category: "",
    imageFile: null,
    status: "Draft",
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    axiosInstance.get("/doctor/showAllCategories")
      .then(res => setCategories(res.data.data))
      .catch(err => console.error("Error fetching categories", err));
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!doctorData.doctorName.trim()) errors.doctorName = "Doctor name is required";
    if (!doctorData.specialization.trim()) errors.specialization = "Specialization is required";
    if (!doctorData.consultationFee || Number(doctorData.consultationFee) <= 0) {
      errors.consultationFee = "Fee must be a positive number";
    }
    if (!doctorData.category) errors.category = "Category is required";
    if (doctorData.experience && Number(doctorData.experience) < 0) {
      errors.experience = "Experience can't be negative";
    }
    if (doctorData.imageFile) {
      if (!doctorData.imageFile.type.match("image.*")) {
        errors.imageFile = "Only image files are allowed";
      }
      if (doctorData.imageFile.size > 2 * 1024 * 1024) {
        errors.imageFile = "File size exceeds 2MB limit";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      const file = files[0];
      if (file) {
        setDoctorData(prev => ({ ...prev, imageFile: file }));
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setDoctorData(prev => ({ ...prev, imageFile: null }));
        setImagePreview(null);
      }
    } else {
      setDoctorData(prev => ({ ...prev, [name]: value }));
      if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authentication token missing. Please log in.");
        setIsSubmitting(false);
        return;
      }

      const formPayload = new FormData();
      formPayload.append("doctorName", doctorData.doctorName);
      formPayload.append("specialization", doctorData.specialization);
      formPayload.append("consultationFee", Number(doctorData.consultationFee));
      formPayload.append("experience", Number(doctorData.experience));
      formPayload.append("category", doctorData.category);
      formPayload.append("status", doctorData.status);
      if (doctorData.imageFile) {
        formPayload.append("imageFile", doctorData.imageFile);
      }

      const res = await axiosInstance.post(
        "/doctor/createDoctor",
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      alert("Doctor profile created successfully!");
      setDoctorData({
        doctorName: "",
        specialization: "",
        consultationFee: "",
        experience: "",
        category: "",
        imageFile: null,
        status: "Draft",
      });
      setImagePreview(null);
      setFormErrors({});
      document.getElementById("imageFile").value = "";
    } catch (err) {
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || "Please try again later";
      alert("Error creating doctor: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="doctor-form">
      <div className="doctor-form__card">
        <div className="doctor-form__header">
          <h2 className="doctor-form__title">Create New Doctor Profile</h2>
          <p className="doctor-form__subtitle">Add medical professionals to your healthcare directory</p>
        </div>

        <form onSubmit={handleFormSubmit} className="doctor-form__form" noValidate>
          <div className="doctor-form__grid">
            {/* Left Column */}
            <div className="doctor-form__column">
              <div className={`form-group ${formErrors.doctorName ? 'form-group--error' : ''}`}>
                <label htmlFor="doctorName" className="form-group__label">
                  Doctor's Full Name {formErrors.doctorName && <span className="form-group__required">*</span>}
                </label>
                <input 
                  id="doctorName"
                  name="doctorName"
                  type="text"
                  placeholder="Dr. John Smith"
                  value={doctorData.doctorName}
                  onChange={handleInputChange}
                  className={`form-group__input ${formErrors.doctorName ? 'form-group__input--error' : ''}`}
                />
                {formErrors.doctorName && <div className="form-group__error">{formErrors.doctorName}</div>}
              </div>

              <div className={`form-group ${formErrors.specialization ? 'form-group--error' : ''}`}>
                <label htmlFor="specialization" className="form-group__label">
                  Specialization {formErrors.specialization && <span className="form-group__required">*</span>}
                </label>
                <input 
                  id="specialization"
                  name="specialization"
                  type="text"
                  placeholder="Cardiology"
                  value={doctorData.specialization}
                  onChange={handleInputChange}
                  className={`form-group__input ${formErrors.specialization ? 'form-group__input--error' : ''}`}
                />
                {formErrors.specialization && <div className="form-group__error">{formErrors.specialization}</div>}
              </div>

              <div className={`form-group ${formErrors.experience ? 'form-group--error' : ''}`}>
                <label htmlFor="experience" className="form-group__label">Experience (years)</label>
                <input 
                  id="experience"
                  name="experience"
                  type="number"
                  placeholder="10"
                  min="0"
                  value={doctorData.experience}
                  onChange={handleInputChange}
                  className={`form-group__input ${formErrors.experience ? 'form-group__input--error' : ''}`}
                />
                {formErrors.experience && <div className="form-group__error">{formErrors.experience}</div>}
              </div>
            </div>

            {/* Right Column */}
            <div className="doctor-form__column">
              <div className={`form-group ${formErrors.consultationFee ? 'form-group--error' : ''}`}>
                <label htmlFor="consultationFee" className="form-group__label">
                  Consultation Fee (₹) {formErrors.consultationFee && <span className="form-group__required">*</span>}
                </label>
                <div className="form-group__input-wrapper">
                  <span className="form-group__currency">₹</span>
                  <input 
                    id="consultationFee"
                    name="consultationFee"
                    type="number"
                    placeholder="500"
                    min="0"
                    step="50"
                    value={doctorData.consultationFee}
                    onChange={handleInputChange}
                    className={`form-group__input ${formErrors.consultationFee ? 'form-group__input--error' : ''}`}
                  />
                </div>
                {formErrors.consultationFee && <div className="form-group__error">{formErrors.consultationFee}</div>}
              </div>

              <div className={`form-group ${formErrors.category ? 'form-group--error' : ''}`}>
                <label htmlFor="category" className="form-group__label">
                  Specialty Category {formErrors.category && <span className="form-group__required">*</span>}
                </label>
                <select 
                  id="category"
                  name="category"
                  value={doctorData.category}
                  onChange={handleInputChange}
                  className={`form-group__input ${formErrors.category ? 'form-group__input--error' : ''}`}
                >
                  <option value="">Select a specialty</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {formErrors.category && <div className="form-group__error">{formErrors.category}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-group__label">Status</label>
                <select 
                  id="status"
                  name="status"
                  value={doctorData.status}
                  onChange={handleInputChange}
                  className="form-group__input"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div className={`form-group form-group--full ${formErrors.imageFile ? 'form-group--error' : ''}`}>
              <label className="form-group__label">Doctor Photo</label>
              <div className="image-upload">
                <div className="image-upload__preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Doctor preview" className="image-upload__image" />
                  ) : (
                    <div className="image-upload__placeholder">
                      <i className="fas fa-user-md image-upload__icon"></i>
                      <p className="image-upload__text">No image selected</p>
                    </div>
                  )}
                </div>
                <div className="image-upload__controls">
                  <label htmlFor="imageFile" className="image-upload__button">
                    <i className="fas fa-cloud-upload-alt"></i> Choose Photo
                  </label>
                  <input 
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="image-upload__input"
                  />
                  <p className="image-upload__hint">JPG or PNG, max 2MB</p>
                  {formErrors.imageFile && <div className="form-group__error">{formErrors.imageFile}</div>}
                </div>
              </div>
            </div>
          </div>

          <div className="doctor-form__actions">
            <button 
              type="submit" 
              className="doctor-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin doctor-form__spinner"></i> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus doctor-form__icon"></i> Create Doctor Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctorForm;


