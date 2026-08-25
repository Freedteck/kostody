import { useEffect } from "react";
import {
  TopAppBar,
  IconButton,
  Card,
  StatusChip,
  Icon,
  Timeline,
} from "../../ui";
import job from "../../pages/customerJob/CustomerJob.module.css";

const EVENTS = [
  { id: 1, icon: "photo_camera", text: "Device logged with 4 condition photos", time: "Aug 20, 09:02 AM" },
  { id: 2, icon: "description", text: "Fault recorded and diagnosis added", time: "Aug 20, 09:08 AM" },
  { id: 3, icon: "request_quote", text: "Quote issued: ₦85,000, valid 7 days", time: "Aug 20, 09:11 AM" },
  { id: 4, icon: "lock", text: "Agreement locked with customer PIN", time: "Aug 20, 09:14 AM" },
  { id: 5, icon: "build", text: "Repair started on the workbench", time: "Aug 20, 10:37 AM" },
];

const HeroShot = () => {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      root.classList.remove("dark");
      root.classList.add("light");
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
        minHeight: "764px",
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
        <Card padded={false} className={job.statusCard}>
          <div className={job.statusBody}>
            <span className={job.statusIcon}>
              <Icon name="build" size={26} filled />
            </span>
            <div className={job.statusText}>
              <div className={job.statusHead}>
                <h2 className="md-typescale-title-medium">Repair in progress</h2>
                <StatusChip status="In Progress" size="small" />
              </div>
              <p className={`${job.muted} md-typescale-body-medium`}>
                Your device is on the workbench being repaired.
              </p>
            </div>
          </div>
        </Card>

        <Card className={job.section}>
          <h3 className={`${job.sectionTitle} md-typescale-title-small`}>
            Device &amp; diagnosis
          </h3>
          <p className={`${job.device} md-typescale-title-medium`}>iPhone 12</p>
          <p className={`${job.fault} md-typescale-body-medium`}>
            Cracked screen, no touch response on the lower half.
          </p>
        </Card>

        <Card className={job.section}>
          <h3 className={`${job.sectionTitle} md-typescale-title-small`}>
            Tracking history
          </h3>
          <Timeline events={EVENTS} />
        </Card>
      </div>
    </div>
  );
};

export default HeroShot;
