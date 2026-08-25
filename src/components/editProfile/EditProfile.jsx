import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TopAppBar, IconButton, Card, TextField, Select, Option, Button } from "../../ui";
import { updateShopProfile } from "../../services/api";
import useShop from "../../hooks/useShop";
import useToast from "../../hooks/useToast";
import styles from "./EditProfile.module.css";

const SPECIALTIES = [
  { value: "General Repairs", label: "General Repairs (Hardware / Software)" },
  { value: "Hardware / Microsoldering", label: "Hardware / Microsoldering" },
  { value: "Software / Flashing", label: "Software / Flashing" },
  { value: "Board Level Repairs", label: "Board Level Repairs" },
];

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { shopId } = useShop();
  const { showToast } = useToast();

  const initialData = location.state?.currentData;
  const [formData, setFormData] = useState(initialData || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!initialData) navigate("/app/profile");
  }, [initialData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateShopProfile(shopId, formData)
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

  if (!initialData) return null;

  return (
    <div className={styles.page}>
      <TopAppBar
        title="Edit profile"
        leading={
          <IconButton
            variant="standard"
            icon="arrow_back"
            label="Go back"
            onClick={() => navigate(-1)}
          />
        }
      />

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.group}>
          <h2 className={`${styles.groupTitle} md-typescale-title-small`}>
            Business identity
          </h2>
          <Card variant="outlined" className={styles.card}>
            <TextField
              className={styles.field}
              label="Shop / business name"
              name="shopName"
              value={formData.shopName || ""}
              onChange={handleChange}
              leadingIcon="storefront"
              required
              disabled={isSaving}
            />
            <TextField
              className={styles.field}
              label="Lead engineer name"
              name="engineerName"
              value={formData.engineerName || ""}
              onChange={handleChange}
              leadingIcon="badge"
              required
              disabled={isSaving}
            />
            <Select
              className={styles.field}
              label="Specialty"
              name="specialty"
              value={formData.specialty || ""}
              onChange={handleChange}
              leadingIcon="handyman"
              required
              disabled={isSaving}
            >
              {SPECIALTIES.map((s) => (
                <Option key={s.value} value={s.value}>
                  {s.label}
                </Option>
              ))}
            </Select>
          </Card>
        </section>

        <section className={styles.group}>
          <h2 className={`${styles.groupTitle} md-typescale-title-small`}>
            Contact
          </h2>
          <Card variant="outlined" className={styles.card}>
            <TextField
              className={styles.field}
              label="Contact phone (WhatsApp)"
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              leadingIcon="call"
              required
              disabled={isSaving}
            />
            <TextField
              className={styles.field}
              label="Email address"
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              leadingIcon="mail"
              required
              disabled={isSaving}
            />
            <TextField
              className={styles.field}
              label="Shop address / area"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              leadingIcon="location_on"
              required
              disabled={isSaving}
            />
          </Card>
        </section>

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="filled"
            full
            icon="save"
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
