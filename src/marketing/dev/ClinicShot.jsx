import { useEffect } from "react";
import { TopAppBar, IconButton, Card, StatusChip, FilterChips, Icon } from "../../ui";
import mark from "../../assets/mark.png";
import dash from "../../pages/dashboard/Dashboard.module.css";

const FILTERS = [
  { value: "", label: "All" },
  { value: "Pending Confirmation", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Ready for Pickup", label: "Ready" },
];

const GRID = [
  {
    id: "2481",
    deviceModel: "Samsung Galaxy A54",
    customer: "Chinedu Balogun",
    fault: "Battery drains overnight, slight swelling near the camera",
    date: "Aug 24",
    status: "Ready for Pickup",
  },
  {
    id: "2483",
    deviceModel: "Tecno Spark 10",
    customer: "Fatima Bello",
    fault: "Charging port loose, only charges when the cable is held at an angle",
    date: "Aug 25",
    status: "Pending Confirmation",
  },
];

const ClinicShot = () => {
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

  const bell = (
    <div className={dash.bell}>
      <IconButton variant="standard" icon="notifications" label="Notifications" />
      <span className={dash.bellBadge}>2</span>
    </div>
  );

  return (
    <div
      className={dash.page}
      style={{
        width: "384px",
        margin: "0 auto",
        background: "var(--md-sys-color-background)",
      }}
    >
      <TopAppBar
        title="Active Jobs"
        subtitle="3 on the bench"
        leading={<img src={mark} alt="Kostody" className={dash.mark} />}
        actions={bell}
      />

      <div className={dash.controls}>
        <FilterChips
          className={dash.filters}
          options={FILTERS}
          value=""
          onChange={() => {}}
        />
      </div>

      <div className={dash.content}>
        <Card
          variant="elevated"
          padded={false}
          className={dash.spotlight}
          style={{
            background: "var(--md-sys-color-primary-container)",
            color: "var(--md-sys-color-on-primary-container)",
          }}
        >
          <div className={dash.spotlightBody}>
            <div className={dash.spotlightHead}>
              <span className={`${dash.spotlightTag} md-typescale-label-large`}>
                <Icon name="priority_high" size={16} filled />
                Needs attention
              </span>
              <StatusChip status="In Progress" size="small" />
            </div>
            <h2 className={`${dash.spotlightDevice} md-typescale-headline-small`}>
              iPhone 12
            </h2>
            <p className={`${dash.spotlightCustomer} md-typescale-body-large`}>
              Adaeze Okafor
            </p>
            <p className={`${dash.spotlightFault} md-typescale-body-medium`}>
              Cracked screen, no touch on the lower half
            </p>
            <div className={dash.spotlightFoot}>
              <span className={`${dash.bench} md-typescale-label-large`}>
                <Icon name="hourglass_top" size={16} />
                3d on the bench
              </span>
              <span className={`${dash.openLink} md-typescale-label-large`}>
                Open
                <Icon name="arrow_forward" size={18} />
              </span>
            </div>
          </div>
        </Card>

        <h2 className={`${dash.sectionLabel} md-typescale-title-small`}>
          On the bench
        </h2>

        <div className={dash.grid}>
          {GRID.map((job) => (
            <Card key={job.id} variant="elevated" className={dash.card}>
              <div className={dash.cardTop}>
                <div className={dash.device}>
                  <h3 className={`${dash.deviceName} md-typescale-title-medium`}>
                    {job.deviceModel}
                  </h3>
                </div>
                <span className={`${dash.jobId} md-typescale-label-medium`}>
                  #{job.id}
                </span>
              </div>
              <p className={`${dash.customer} md-typescale-body-medium`}>
                <Icon name="person" size={16} />
                {job.customer}
              </p>
              <p className={`${dash.fault} md-typescale-body-medium`}>
                {job.fault}
              </p>
              <div className={dash.cardFoot}>
                <span className={`${dash.date} md-typescale-label-medium`}>
                  {job.date}
                </span>
                <StatusChip status={job.status} size="small" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClinicShot;
