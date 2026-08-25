import { Link } from "react-router-dom";
import Sheet from "../../ui/Sheet";
import Card from "../../ui/Card";
import Avatar from "../../ui/Avatar";
import StatusChip from "../../ui/StatusChip";
import styles from "./CustomerProfile.module.css";

const CustomerProfile = ({ onClose, customer }) => {
  if (!customer) return null;

  return (
    <Sheet open onClose={onClose} title="Customer profile">
      <div className={styles.head}>
        <Avatar name={customer.name} size={56} />
        <div className={styles.identity}>
          <h3 className={`${styles.name} md-typescale-title-large`}>
            {customer.name}
          </h3>
          <p className={`${styles.phone} md-typescale-body-medium`}>
            {customer.phone}
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={`${styles.statValue} md-typescale-headline-small`}>
            {customer.jobs.length}
          </span>
          <span className={`${styles.statLabel} md-typescale-label-medium`}>
            Total repairs
          </span>
        </div>
        <div className={styles.statBox}>
          <span className={`${styles.statValue} md-typescale-headline-small`}>
            ₦{customer.totalSpent.toLocaleString()}
          </span>
          <span className={`${styles.statLabel} md-typescale-label-medium`}>
            Lifetime value
          </span>
        </div>
      </div>

      <p className={`${styles.sectionTitle} md-typescale-title-small`}>
        Repair history
      </p>
      <div className={styles.jobList}>
        {customer.jobs.map((job) => (
          <Card
            key={job.id}
            as={Link}
            to={`/app/job/${job.id}`}
            viewTransition
            variant="outlined"
            interactive
            onClick={onClose}
            className={styles.jobCard}
          >
            <div className={styles.jobTop}>
              <span className={`${styles.device} md-typescale-title-small`}>
                {job.device}
              </span>
              <span className={`${styles.date} md-typescale-label-small`}>
                {job.date}
              </span>
            </div>
            <p className={`${styles.fault} md-typescale-body-medium`}>
              {job.fault}
            </p>
            <div className={styles.jobFoot}>
              <span className={`${styles.price} md-typescale-title-small`}>
                ₦{job.price.toLocaleString()}
              </span>
              <StatusChip status="Completed" size="small" />
            </div>
          </Card>
        ))}
      </div>
    </Sheet>
  );
};

export default CustomerProfile;
