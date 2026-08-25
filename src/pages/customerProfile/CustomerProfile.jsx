import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopAppBar, Avatar, Card, Icon, Divider, Switch, Button } from "../../ui";
import CustomerEditSheet from "../../components/customerEdit/CustomerEdit";
import ChangePinSheet from "../../components/changePin/ChangePin";
import useTheme from "../../hooks/useTheme";
import mark from "../../assets/mark.png";
import styles from "./CustomerProfile.module.css";

const InfoRow = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <span className={styles.infoIcon}>
      <Icon name={icon} size={20} />
    </span>
    <div className={styles.infoText}>
      <span className={`${styles.infoLabel} md-typescale-label-medium`}>
        {label}
      </span>
      <span className={`${styles.infoValue} md-typescale-body-large`}>
        {value}
      </span>
    </div>
  </div>
);

const ActionRow = ({ icon, label, onClick }) => (
  <button type="button" className={styles.actionRow} onClick={onClick}>
    <span className={styles.rowLeft}>
      <span className={styles.infoIcon}>
        <Icon name={icon} size={20} />
      </span>
      <span className="md-typescale-body-large">{label}</span>
    </span>
    <Icon name="chevron_right" size={22} className={styles.chevron} />
  </button>
);

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("kostody_customer")) || {
      name: "Guest",
      phone: "",
      id: null,
    },
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPinOpen, setIsPinOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("kostody_token");
    localStorage.removeItem("kostody_customer");
    navigate("/c/login");
  };

  const handleSave = (newData) => {
    const merged = { ...userData, ...newData };
    setUserData(merged);
    localStorage.setItem("kostody_customer", JSON.stringify(merged));
    setIsEditOpen(false);
  };

  return (
    <div className={styles.page}>
      <TopAppBar
        title="Profile"
        leading={<img src={mark} alt="Kostody" className={styles.mark} />}
      />

      <div className={styles.content}>
        <div className={styles.identity}>
          <Avatar name={userData.name} size={72} />
          <div className={styles.identityText}>
            <h2 className={`${styles.name} md-typescale-headline-small`}>
              {userData.name}
            </h2>
            <p className={`${styles.phone} md-typescale-body-medium`}>
              <Icon name="call" size={16} />
              {userData.phone}
            </p>
          </div>
        </div>

        <section className={styles.group}>
          <h3 className={`${styles.groupTitle} md-typescale-title-small`}>
            Account
          </h3>
          <Card variant="outlined" padded={false} className={styles.list}>
            <ActionRow
              icon="edit"
              label="Edit profile"
              onClick={() => setIsEditOpen(true)}
            />
            <Divider />
            <ActionRow
              icon="password"
              label="Change Universal PIN"
              onClick={() => setIsPinOpen(true)}
            />
          </Card>
        </section>

        <section className={styles.group}>
          <h3 className={`${styles.groupTitle} md-typescale-title-small`}>
            Appearance
          </h3>
          <Card variant="outlined" padded={false} className={styles.list}>
            <div className={styles.actionRow}>
              <span className={styles.rowLeft}>
                <span className={styles.infoIcon}>
                  <Icon name="dark_mode" size={20} />
                </span>
                <span className="md-typescale-body-large">Dark theme</span>
              </span>
              <Switch
                selected={theme === "dark"}
                onChange={(e) => setTheme(e.target.selected ? "dark" : "light")}
                aria-label="Toggle dark theme"
              />
            </div>
          </Card>
        </section>

        <section className={styles.group}>
          <h3 className={`${styles.groupTitle} md-typescale-title-small`}>
            Support
          </h3>
          <Card variant="outlined" padded={false} className={styles.list}>
            <InfoRow
              icon="help"
              label="Help &amp; support"
              value="Contact the shop handling your repair."
            />
          </Card>
        </section>

        <Button
          variant="outlined"
          full
          icon="logout"
          onClick={handleLogout}
          style={{
            "--md-outlined-button-label-text-color":
              "var(--md-sys-color-error)",
            "--md-outlined-button-icon-color": "var(--md-sys-color-error)",
            "--md-outlined-button-outline-color":
              "var(--md-sys-color-outline-variant)",
          }}
        >
          Log out
        </Button>
        <p className={`${styles.version} md-typescale-label-medium`}>
          Kostody Customer · v1.0.0
        </p>
      </div>

      {isEditOpen && (
        <CustomerEditSheet
          onClose={() => setIsEditOpen(false)}
          onSave={handleSave}
          currentData={userData}
          customerId={userData.id}
        />
      )}

      {isPinOpen && (
        <ChangePinSheet
          onClose={() => setIsPinOpen(false)}
          onSuccess={() => setIsPinOpen(false)}
          customerId={userData.id}
        />
      )}
    </div>
  );
};

export default CustomerProfile;
