export function CarGridSkeleton({ count = 10 }) {
  return (
    <div className="car_card_box d-flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="car-card">
          <div className="car_image skeleton-box"></div>
          <div className="car_card_body">
            <div className="car_title">
              <div style={{ display: "flex", justifyContent: "start", alignItems: "flex-start", gap: "8px" }}>
                <div className="skeleton-box skeleton-line skeleton-line-lg"></div>
                <div className="skeleton-box skeleton-line skeleton-line-sm"></div>
              </div>
              <div className="skeleton-box skeleton-line skeleton-line-md"></div>
            </div>
            <div className="skeleton-box skeleton-line skeleton-line-price"></div>
            <div className="skeleton-box skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrderListSkeleton({ count = 4 }) {
  return (
    <div className="cart_items_scroll d-flex flex-column gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="cart_item_card order-skeleton-card">
          <div className="skeleton-box skeleton-line skeleton-line-lg"></div>
          <div className="skeleton-box skeleton-line skeleton-line-md"></div>
          <div className="skeleton-box order-skeleton-image"></div>
          <div className="skeleton-box skeleton-line skeleton-line-price"></div>
        </div>
      ))}
    </div>
  );
}

export function CartListSkeleton({ count = 4 }) {
  return (
    <div className="cart_items_scroll d-flex flex-column gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="cart_item_card cart-skeleton-card">
          <div className="skeleton-box cart-skeleton-image"></div>
          <div className="cart-skeleton-content">
            <div className="skeleton-box skeleton-line skeleton-line-lg"></div>
            <div className="skeleton-box skeleton-line skeleton-line-md"></div>
            <div className="skeleton-box skeleton-line skeleton-line-price"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
