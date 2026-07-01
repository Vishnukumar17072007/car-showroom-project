import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

function CatalogPagination({
  page,
  pages,
  total,
  pageSize,
  onPageSizeChange,
  onPageChange,
  disabled,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (pages <= 1 && total <= 0) return null;

  const visiblePages = [];
  let start = Math.max(1, page - 2);
  let end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  const pageSizeOptions = [20, 40, 60, 80, 100];

  return (
    <>
      <nav className="catalog-pagination">
        <div className="catalog-page-buttons">
          <button
            type="button"
            disabled={disabled || page === 1}
            onClick={() => onPageChange(page - 1)}
            className="catalog-pagination-btn"
          >
            ‹
          </button>

          {start > 1 && (
            <>
              <button
                type="button"
                className="catalog-page-number"
                onClick={() => onPageChange(1)}
              >
                1
              </button>
              {start > 2 && <span>...</span>}
            </>
          )}

          {visiblePages.map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`catalog-page-number ${pageNum === page ? "active" : ""}`}
            >
              {pageNum}
            </button>
          ))}

          {end < pages && (
            <>
              {end < pages - 1 && <span>...</span>}
              <button
                type="button"
                className="catalog-page-number"
                onClick={() => onPageChange(pages)}
              >
                {pages}
              </button>
            </>
          )}

          <button
            type="button"
            disabled={disabled || page === pages}
            onClick={() => onPageChange(page + 1)}
            className="catalog-pagination-btn catalog-page-number"
          >
            ›
          </button>
        </div>
        <div className="catalog-page" ref={dropdownRef}>
        <button
          type="button"
          className="catalog-page-size"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {pageSize} <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <ul className="custom-dropdown-menu">
            {pageSizeOptions.map((size) => (
              <li key={size}>
                <button
                  type="button"
                  className={`custom-dropdown-item ${size === pageSize ? "active" : ""}`}
                  onClick={() => {
                    onPageSizeChange(size);
                    setIsOpen(false);
                  }}
                >
                  {size}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      </nav>

      
    </>
  );
}

CatalogPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CatalogPagination;