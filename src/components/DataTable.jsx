import { memo, useState, useMemo } from "react";

const PAGE_SIZE = 10;

function DataTable({ data, loading }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return data;
    return data.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.body?.toLowerCase().includes(q) ||
        String(item.id).includes(q)
    );
  }, [data, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const sortIcon = (field) => {
    if (sortField !== field) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="data-table-wrapper">
      <div className="data-table__toolbar">
        <div className="search-box">
          <svg viewBox="0 0 20 20" className="search-icon">
            <path d="M8 3a5 5 0 100 10A5 5 0 008 3zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts…"
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <span className="data-table__count">
          {filtered.length} of {data.length} posts
        </span>
      </div>

      <div className="table-scroll">
        <table className={`data-table ${loading ? "loading" : ""}`}>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")} className="sortable">
                ID{sortIcon("id")}
              </th>
              <th onClick={() => handleSort("userId")} className="sortable">
                User{sortIcon("userId")}
              </th>
              <th onClick={() => handleSort("title")} className="sortable">
                Title{sortIcon("title")}
              </th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="empty-row">
                  {loading ? "Loading…" : "No posts found."}
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr key={item.id}>
                  <td className="cell-id">{item.id}</td>
                  <td className="cell-user">
                    <span className="user-badge">U{item.userId}</span>
                  </td>
                  <td className="cell-title">{item.title}</td>
                  <td className="cell-body">{item.body}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="page-btn"
          >
            ← Prev
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - currentPage) <= 2
              )
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`e-${i}`} className="ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`page-num ${p === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                )
              )}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(DataTable);
