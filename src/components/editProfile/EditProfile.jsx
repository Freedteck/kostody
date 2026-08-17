import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";
import { updateShopProfile } from "../../services/api";
import useShop from "../../hooks/useShop";
import useToast from "../../hooks/useToast";

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shopId } = useShop();
  const { showToast } = useToast();

  const initialData = location.state?.currentData;
  const [formData, setFormData] = useState(initialData || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    await updateShopProfile(shopId, formData)
      .then(() => {
        showToast("Profile updated successfully.", "success");
        navigate("/app/profile");
      })
      .catch((error) => {
        showToast(error.message || "Failed to update profile.", "error");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  if (!initialData) {
    navigate("/app/profile");
    return null;
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1>Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="shopName">
            Shop / Business Name
          </label>
          <input
            type="text"
            id="shopName"
            name="shopName"
            className={styles.input}
            value={formData.shopName || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="engineerName">
            Lead Engineer Name
          </label>
          <input
            type="text"
            id="engineerName"
            name="engineerName"
            className={styles.input}
            value={formData.engineerName || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="phone">
            Contact Phone (WhatsApp)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.input}
            value={formData.phone || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData.email || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="address">
            Shop Address / Area
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className={styles.input}
            value={formData.address || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="specialty">
            Specialty
          </label>
          <select
            id="specialty"
            name="specialty"
            className={styles.select}
            value={formData.specialty || ""}
            onChange={handleChange}
            required
            disabled={isSaving}
          >
            <option value="General Repairs">
              General Repairs (Hardware/Software)
            </option>
            <option value="Hardware / Microsoldering">
              Hardware / Microsoldering
            </option>
            <option value="Software / Flashing">Software / Flashing</option>
            <option value="Board Level Repairs">Board Level Repairs</option>
          </select>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSaving}>
          {isSaving ? (
            <>
              <span className={styles.spinner}></span> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
