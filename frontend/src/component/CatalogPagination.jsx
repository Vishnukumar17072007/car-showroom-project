import PropTypes from 'prop-types';

function CatalogPagination({ page, pages, total, onPageChange, disabled }) {
    if (pages <= 1 && total <= 0) return null;

    return (
        <nav className="catalog-pagination" aria-label="Car catalog pages">
            <button
                type="button"
                className="catalog-pagination-btn"
                disabled={disabled || page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </button>
            <span className="catalog-pagination-info">
                Page {page} of {pages} · {total} vehicle{total === 1 ? '' : 's'}
            </span>
            <button
                type="button"
                className="catalog-pagination-btn"
                disabled={disabled || page >= pages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </nav>
    );
}

CatalogPagination.propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default CatalogPagination;
