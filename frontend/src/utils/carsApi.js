/** Normalizes GET /cars — supports legacy array or paginated { cars, total, page, pages }. */
export function normalizeCarsResponse(data) {
    if (!data) {
        return { cars: [], page: 1, pages: 1, total: 0 };
    }
    if (Array.isArray(data)) {
        return { cars: data, page: 1, pages: 1, total: data.length };
    }
    return {
        cars: data.cars ?? [],
        page: data.page ?? 1,
        pages: data.pages ?? 1,
        total: data.total ?? 0,
    };
}
