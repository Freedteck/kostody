import { useState } from "react";
import styles from "./ReturnJobSearch.module.css";
import BottomSheet from "../bottomSheet/BottomSheet";

// Mock database of OLD/PAST jobs
const mockPastJobs = [
  {
    id: "KSD-9F3A",
    device: "iPhone 13 Pro",
    customer: "Chidi O.",
    phone: "08012345678",
  },
  {
    id: "KSD-5G2H",
    device: "iPhone 12 Mini",
    customer: "Chidi O.",
    phone: "08012345678",
  }, // Same customer, second phone
  {
    id: "KSD-4K1L",
    device: "Samsung S22 Ultra",
    customer: "Ada E.",
    phone: "07098765432",
  },
];

const ReturnJobSearch = ({ onSelectJob, title, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);

    // Simple mock search logic
    const filtered = mockPastJobs.filter(
      (job) =>
        job.phone.includes(query) ||
        job.id.toLowerCase().includes(query.toLowerCase()),
    );
    setResults(filtered);
  };

  return (
    <BottomSheet title={title} onClose={onClose}>
      <div className={styles.searchContainer}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Enter Phone Number or Job ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            required
          />
          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
        </form>

        <div className={styles.resultsContainer}>
          {hasSearched && results.length === 0 && (
            <p className={styles.noResults}>
              No previous jobs found for that search.
            </p>
          )}

          {results.map((job) => (
            <div
              key={job.id}
              className={styles.resultCard}
              onClick={() => onSelectJob(job)}
            >
              <div className={styles.resultHeader}>
                <h3 className={styles.resultDevice}>{job.device}</h3>
                <span className={styles.resultId}>#{job.id}</span>
              </div>
              <p className={styles.resultCustomer}>
                {job.customer} · {job.phone}
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
