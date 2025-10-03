import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import styled from "styled-components";

const BackendUrl = "https://testcore-3en7.onrender.com"; // Replace with your actual backend URL

const ForgetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponseMessage(null);
    setErrorMessage(null);

    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setErrorMessage("You must be logged in to reset your password.");
      return;
    }

    try {
      const response = await axios.put(
        `${BackendUrl}/api/v1/user/userData`,
        {
          email: formData.email,
          role: formData.role,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token in the Authorization header
          },
        }
      );

      if (response.status === 200) {
        setResponseMessage("Password updated successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Failed to reset password.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <StyledWrapper>
      <form className="form_main" onSubmit={handleSubmit}>
        <p className="heading">Forget Password</p>

        <div className="form-group">
          <span>Role</span>
          <select
            id="role"
            name="role"
            required
            className="select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Choose your role
            </option>
            <option value="Student">Student</option>
            <option value="College">College</option>
            <option value="Examiner">Examiner</option>
          </select>
        </div>

        <div className="inputContainer">
          <svg
            className="inputIcon"
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="#2e2e2e"
            viewBox="0 0 16 16"
          >
            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z" />
          </svg>
          <input
            type="text"
            className="inputField"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputContainer">
          <svg
            className="inputIcon"
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="#2e2e2e"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
          <input
            type="password"
            className="inputField"
            id="newpassword"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button id="button" type="submit">
          Submit
        </button>

        {responseMessage && <p className="success-message">{responseMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </StyledWrapper>
  );
};



const StyledWrapper = styled.div`
  .form_main {
    width: 220px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(255, 255, 255);
    padding: 30px 30px 30px 30px;
    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.062);
    position: relative;
    overflow: hidden;
  }

  .form_main::before {
    position: absolute;
    content: "";
    width: 300px;
    height: 300px;
    background-color: rgb(209, 193, 255);
    transform: rotate(45deg);
    left: -180px;
    bottom: 30px;
    z-index: 1;
    border-radius: 30px;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.082);
  }

  .heading {
    font-size: 2em;
    color: #2e2e2e;
    font-weight: 700;
    margin: 5px 0 10px 0;
    z-index: 2;
  }

  .inputContainer {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .inputIcon {
    position: absolute;
    left: 3px;
  }

  .inputField {
    width: 100%;
    height: 30px;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid rgb(173, 173, 173);
    margin: 10px 0;
    color: black;
    font-size: .8em;
    font-weight: 500;
    box-sizing: border-box;
    padding-left: 30px;
  }

  .inputField:focus {
    outline: none;
    border-bottom: 2px solid rgb(199, 114, 255);
  }

  .inputField::placeholder {
    color: rgb(80, 80, 80);
    font-size: 1em;
    font-weight: 500;
  }

  #button {
    z-index: 2;
    position: relative;
    width: 100%;
    border: none;
    background-color: rgb(162, 104, 255);
    height: 30px;
    color: white;
    font-size: .8em;
    font-weight: 500;
    letter-spacing: 1px;
    margin: 10px;
    cursor: pointer;
  }

  #button:hover {
    background-color: rgb(126, 84, 255);
  }

  .forgotLink {
    z-index: 2;
    font-size: .7em;
    font-weight: 500;
    color: rgb(44, 24, 128);
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 20px;
  }`;

export default ForgetPassword;
