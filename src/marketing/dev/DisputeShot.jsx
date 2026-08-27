import { useEffect } from "react";
import { TopAppBar, IconButton, Card, Icon, Timeline } from "../../ui";
import job from "../../pages/customerJob/CustomerJob.module.css";

const EVENTS = [
  { id: 1, icon: "photo_camera", text: "Device logged with 4 condition photos", time: "Aug 20, 09:02 AM" },
  { id: 2, icon: "description", text: "Fault recorded: cracked screen, no touch on the lower half", time: "Aug 20, 09:08 AM" },
  { id: 3, icon: "request_quote", text: "Quote issued: ₦85,000, valid 7 days", time: "Aug 20, 09:11 AM" },
  { id: 4, icon: "lock", text: "Agreement locked with customer PIN", time: "Aug 20, 09:14 AM" },
  { id: 5, icon: "build", text: "Repair started on the workbench", time: "Aug 20, 10:37 AM" },
  { id: 6, icon: "task_alt", text: "Repair completed and bench-tested", time: "Aug 20, 02:20 PM" },
  { id: 7, icon: "verified_user", text: "Device handed back, receipt signed", time: "Aug 20, 03:05 PM" },
];

const DisputeShot = () => {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.remove("light");
      root.classList.add("dark");
    };
    apply();
    const t = setTimeout(apply, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={job.page}
      style={{
        width: "384px",
        minHeight: "640px",
        margin: "0 auto",
        background: "var(--md-sys-color-background)",
      }}
    >
      <TopAppBar
        title="iPhone 12"
        subtitle="TechFix, Ikeja"
        leading={<IconButton icon="arrow_back" label="Back" />}
      />

      <div className={job.content}>
        <Card className={job.section}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <h3 className={`${job.sectionTitle} md-typescale-title-small`} style={{ margin: 0 }}>
              Tamper-proof record
            </h3>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "999px",
                backgroundColor: "var(--md-sys-color-primary-container)",
                color: "var(--md-sys-color-on-primary-container)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              <Icon name="lock" size={14} filled />
              Locked
            </span>
          </div>
          <Timeline events={EVENTS} />
        </Card>
      </div>
    </div>
  );
};

export default DisputeShot;
