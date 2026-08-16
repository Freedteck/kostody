import { useState } from "react";
import styles from "./ReturnJobSearch.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";
import { searchJobs } from "../../services/api";
import useToast from "../../hooks/useToast";
import { Skeleton } from "../skeleton/Skeleton";

const ReturnJobSearch = ({ onSelectJob, title, onClose }) => {
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
    <BottomSheet title={title} onClose={onClose}>
      <div className={styles.searchContainer}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter Phone Number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            required
          />
          <button
            type="submit"
            className={styles.searchBtn}
            disabled={isLoading}
          >
            {isLoading ? "..." : "Search"}
          </button>
        </form>

        <div className={styles.resultsContainer}>
          {isLoading && (
            <>
              <Skeleton width="100%" height="70px" radius="8px" />
              <Skeleton width="100%" height="70px" radius="8px" />
            </>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <p className={styles.noResults}>
              No previous jobs found for that search.
            </p>
          )}

          {!isLoading &&
            results.map((job) => (
              <div
                key={job.id}
                className={styles.resultCard}
                onClick={() => onSelectJob(job)}
              >
                <div className={styles.resultHeader}>
                  <h3 className={styles.resultDevice}>{job.deviceModel}</h3>
                  <span className={styles.resultId}>#{job.id}</span>
                </div>
                <p className={styles.resultCustomer}>
                  {job.customerName} · {job.customerPhone}
                </p>
                <button className={styles.selectBtn}>Create Return Job</button>
              </div>
            ))}
        </div>
      </div>
    </BottomSheet>
  );
};

export default ReturnJobSearch;
