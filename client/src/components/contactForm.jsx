import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus({ loading: true, success: null, error: null });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/submit-form`,
        formData
      );

      setStatus({
        loading: false,
        success: "Message sent successfully!",
        error: null,
      });

      // Clear form after success
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);

      setStatus({
        loading: false,
        success: null,
        error: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div id="contact">
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          className="name"
          id="firstName"
          name="firstName"
          placeholder="Your name.."
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          className="name"
          id="lastName"
          name="lastName"
          placeholder="Your last name.."
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email Address</label>
        <br></br>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <br></br>
        <br></br>

        <label htmlFor="subject">Subject</label>
        <textarea
          id="subject"
          name="subject"
          placeholder="Write something.."
          value={formData.subject}
          onChange={handleInputChange}
          required
        />

        <button type="submit" disabled={status.loading}>
          {status.loading ? "Sending..." : "Submit"}
        </button>

        {status.success && (
          <p style={{ color: "green" }}>{status.success}</p>
        )}

        {status.error && (
          <p style={{ color: "red" }}>{status.error}</p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
