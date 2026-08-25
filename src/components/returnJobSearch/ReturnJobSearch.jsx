import { useState } from "react";
import { Sheet, TextField, Button, Skeleton, Card, StatusChip, Icon } from "../../ui";
import { searchJobs } from "../../services/api";
import useToast from "../../hooks/useToast";
import styles from "./ReturnJobSearch.module.css";

const ReturnJobSearch = ({ open, onSelectJob, title, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(false);

    searchJobs(query)
      .then((data) => {
        setResults(data);
        setHasSearched(true);
      })
      .catch(() => {
        showToast("Search failed. Please try again.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Sheet open={open} onClose={onClose} title={title} size="large">
      <form className={styles.form} onSubmit={handleSearch}>
        <TextField
          className={styles.field}
          label="Customer phone number"
          type="tel"
          inputmode="tel"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leadingIcon="call"
          required
        />
        <Button type="submit" variant="filled" icon="search" disabled={isLoading}>
          {isLoading ? "Searching…" : "Search"}
        </Button>
      </form>

      <div className={styles.results}>
        {isLoading && (
          <>
            <Skeleton width="100%" height="96px" radius="16px" />
            <Skeleton width="100%" height="96px" radius="16px" />
          </>
        )}

        {!isLoading && hasSearched && results.length === 0 && (
          <div className={styles.empty}>
            <Icon name="search_off" size={28} />
            <p className="md-typescale-body-medium">
              No previous jobs found for that number.
            </p>
          </div>
        )}

        {!isLoading &&
          results.map((job) => (
            <Card
              key={job.id}
              variant="filled"
              interactive
              className={styles.result}
              onClick={() => onSelectJob(job)}
            >
              <div className={styles.resultHead}>
                <h3 className="md-typescale-title-medium">{job.deviceModel}</h3>
                <span className={`${styles.id} md-typescale-label-medium`}>
                  #{job.id}
                </span>
              </div>
              <p className={`${styles.customer} md-typescale-body-medium`}>
                {job.customerName} · {job.customerPhone}
              </p>
              {job.status && (
                <div className={styles.resultFoot}>
                  <StatusChip status={job.status} size="small" />
                  <span className={`${styles.cta} md-typescale-label-large`}>
                    Create return
                    <Icon name="arrow_forward" size={18} />
                  </span>
                </div>
              )}
            </Card>
          ))}
      </div>
    </Sheet>
  );
};

export default ReturnJobSearch;
