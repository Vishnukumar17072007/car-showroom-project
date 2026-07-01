import { useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";

function resolveIsAdmin(user) {
  if (user?.role) return user.role === "admin";
  try {
    return localStorage.getItem("userRole") === "admin";
  } catch {
    return false;
  }
}

export function DashboardRouteSkeleton() {
  const { user } = useAuth();
  return resolveIsAdmin(user) ? <DashboardAdminSkeleton /> : <DashboardUserSkeleton />;
}

export function SkeletonBlock({ className = "", style = {} }) {
  return <div className={`skeleton-box ${className}`.trim()} style={style} />;
}

export function PageTitleSkeleton({ width = "120px" }) {
  return (
    <div className="page-title-skeleton">
      <SkeletonBlock style={{ width, height: 20, borderRadius: 6 }} />
    </div>
  );
}

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

export function CarDetailsSkeleton() {
  return (
    <div className="cd-page">
      <div className="cd-breadcrumb">
        <SkeletonBlock style={{ width: 220, height: 12 }} />
      </div>
      <div className="cd-header">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            <SkeletonBlock style={{ width: 280, height: 36, borderRadius: 6 }} />
            <SkeletonBlock style={{ width: 56, height: 24, borderRadius: 4 }} />
            <SkeletonBlock style={{ width: 90, height: 24, borderRadius: 4 }} />
          </div>
          <SkeletonBlock style={{ width: 200, height: 14 }} />
        </div>
      </div>
      <div className="cd-body">
        <div className="cd-gallery">
          <SkeletonBlock className="cd-skeleton-main-img" />
          <div className="cd-thumbs">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBlock key={i} className="cd-skeleton-thumb" />
            ))}
          </div>
          <div className="cd-specs-card" style={{ marginTop: 16 }}>
            <SkeletonBlock style={{ width: 160, height: 14, marginBottom: 14 }} />
            <div className="cd-specs-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="cd-spec-item cd-skeleton-spec-item">
                  <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
                  <SkeletonBlock style={{ width: "70%", height: 10 }} />
                  <SkeletonBlock style={{ width: "50%", height: 12 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cd-right">
          <div className="cd-price-card cd-skeleton-card">
            <SkeletonBlock style={{ width: 120, height: 10, marginBottom: 8 }} />
            <SkeletonBlock style={{ width: 180, height: 32, marginBottom: 8 }} />
            <SkeletonBlock style={{ width: "90%", height: 10, marginBottom: 16 }} />
            <SkeletonBlock style={{ width: "100%", height: 42, borderRadius: 8 }} />
          </div>
          <div className="cd-emi-card cd-skeleton-card">
            <SkeletonBlock style={{ width: 120, height: 14, marginBottom: 12 }} />
            <SkeletonBlock style={{ width: 140, height: 28, marginBottom: 8 }} />
            <SkeletonBlock style={{ width: "80%", height: 10, marginBottom: 16 }} />
            <SkeletonBlock style={{ width: "100%", height: 6, borderRadius: 4, marginBottom: 12 }} />
            <SkeletonBlock style={{ width: "100%", height: 60, borderRadius: 8 }} />
          </div>
          <div className="cd-specs-card cd-skeleton-card">
            <SkeletonBlock style={{ width: 80, height: 14, marginBottom: 14 }} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="cd-skeleton-overview-row">
                <SkeletonBlock style={{ width: "40%", height: 12 }} />
                <SkeletonBlock style={{ width: "35%", height: 12 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardUserSkeleton() {
  return (
    <div className="db-page">
      <div className="db-header">
        <div>
          <SkeletonBlock style={{ width: 160, height: 28, marginBottom: 8 }} />
          <SkeletonBlock style={{ width: 240, height: 12 }} />
        </div>
        <SkeletonBlock style={{ width: 90, height: 34, borderRadius: 8 }} />
      </div>
      <div className="db-stats-row">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="db-stat-card db-skeleton-stat-card">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <SkeletonBlock style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }} />
              <SkeletonBlock style={{ width: 60, height: 28, flex: 1 }} />
            </div>
            <SkeletonBlock style={{ width: "55%", height: 10, marginTop: 8 }} />
          </div>
        ))}
      </div>
      <div className="db-mid-row">
        <div className="db-section-card">
          <div className="db-section-header">
            <SkeletonBlock style={{ width: 140, height: 12 }} />
            <SkeletonBlock style={{ width: 90, height: 22, borderRadius: 20 }} />
          </div>
          <SkeletonBlock style={{ width: "100%", height: 220, borderRadius: 8 }} />
        </div>
        <div className="db-section-card">
          <div className="db-section-header">
            <SkeletonBlock style={{ width: 100, height: 12 }} />
          </div>
          <div className="db-skeleton-pie-row">
            <SkeletonBlock style={{ width: 180, height: 180, borderRadius: "50%", flexShrink: 0 }} />
            <div className="db-skeleton-legend">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} style={{ width: "100%", height: 12 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="db-order-table-wrap">
        <div className="db-section-header">
          <SkeletonBlock style={{ width: 120, height: 12 }} />
          <SkeletonBlock style={{ width: 110, height: 30, borderRadius: 8 }} />
        </div>
        <div className="db-skeleton-table">
          <div className="db-skeleton-table-head">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} style={{ height: 12 }} />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, row) => (
            <div key={row} className="db-skeleton-table-row">
              {Array.from({ length: 6 }).map((_, col) => (
                <SkeletonBlock key={col} style={{ height: 12 }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardAdminSkeleton() {
  return (
    <div className="db-scroll">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <SkeletonBlock style={{ width: 200, height: 26, marginBottom: 8 }} />
          <SkeletonBlock style={{ width: 280, height: 12 }} />
        </div>
        <SkeletonBlock style={{ width: 90, height: 34, borderRadius: 8 }} />
      </div>
      <div className="db-stats-row" style={{ marginBottom: 20 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="db-stat-card db-skeleton-stat-card">
            <SkeletonBlock style={{ width: 30, height: 30, marginBottom: 12 }} />
            <SkeletonBlock style={{ width: "50%", height: 10, marginBottom: 8 }} />
            <SkeletonBlock style={{ width: "70%", height: 24, marginBottom: 8 }} />
            <SkeletonBlock style={{ width: "40%", height: 10 }} />
          </div>
        ))}
      </div>
      <div className="admin-db-mid-row">
        <div className="db-section-card">
          <SkeletonBlock style={{ width: 180, height: 12, marginBottom: 16 }} />
          <SkeletonBlock style={{ width: "100%", height: 220, borderRadius: 8 }} />
        </div>
        <div className="db-section-card">
          <div className="db-section-header">
            <SkeletonBlock style={{ width: 100, height: 12 }} />
          </div>
          <div className="db-skeleton-pie-row">
            <SkeletonBlock style={{ width: 180, height: 180, borderRadius: "50%", flexShrink: 0 }} />
            <div className="db-skeleton-legend">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} style={{ width: "100%", height: 12 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="admin-db-last-row">
        <div className="db-section-card">
          <SkeletonBlock style={{ width: 140, height: 12, marginBottom: 16 }} />
          <SkeletonBlock style={{ width: "100%", height: 220, borderRadius: 8 }} />
        </div>
        <div className="db-section-card">
          <SkeletonBlock style={{ width: 120, height: 12, marginBottom: 16 }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="db-skeleton-order-row">
              <SkeletonBlock style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <SkeletonBlock style={{ width: "60%", height: 11, marginBottom: 5 }} />
                <SkeletonBlock style={{ width: "40%", height: 10 }} />
              </div>
              <div>
                <SkeletonBlock style={{ width: 50, height: 12, marginBottom: 5 }} />
                <SkeletonBlock style={{ width: 50, height: 10 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="profile-scroll-area">
      <div className="profile">
        <div className="profile-details-card profile-skeleton-card">
          <SkeletonBlock className="profile-skeleton-avatar" />
          <div className="name-subscription" style={{ flex: 1 }}>
            <SkeletonBlock style={{ width: 160, height: 22, marginBottom: 10 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <SkeletonBlock style={{ width: 70, height: 24, borderRadius: 20 }} />
              <SkeletonBlock style={{ width: 80, height: 24, borderRadius: 20 }} />
            </div>
          </div>
          <SkeletonBlock style={{ width: 80, height: 32, borderRadius: 8 }} />
        </div>
        <SkeletonBlock className="profile-skeleton-upgrade" />
        <div className="profile-bottom-grid">
          <div className="activity-overview profile-skeleton-activity">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="activity-block">
                <SkeletonBlock style={{ width: 24, height: 24, borderRadius: 6 }} />
                <SkeletonBlock style={{ width: 32, height: 22 }} />
                <SkeletonBlock style={{ width: 56, height: 10 }} />
              </div>
            ))}
          </div>
          <div className="account-details profile-skeleton-details">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="detail-row">
                <SkeletonBlock style={{ width: 100, height: 12 }} />
                <SkeletonBlock style={{ width: "60%", height: 12 }} />
              </div>
            ))}
          </div>
        </div>
        <SkeletonBlock className="profile-skeleton-edit-btn" />
      </div>
    </div>
  );
}

export function NotificationListSkeleton({ count = 5 }) {
  return (
    <div className="cart_page">
      <div className="page-title-skeleton page-title-skeleton--row">
        <SkeletonBlock style={{ width: 140, height: 20 }} />
        <SkeletonBlock style={{ width: 70, height: 32, borderRadius: 8 }} />
      </div>
      <div className="cart_layout">
        <div className="cart_items_scroll notification-skeleton-list">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="notification-skeleton-card">
              <div className="notification-skeleton-top">
                <SkeletonBlock style={{ width: "45%", height: 14 }} />
                <SkeletonBlock style={{ width: 8, height: 8, borderRadius: "50%" }} />
              </div>
              <SkeletonBlock style={{ width: "85%", height: 12, marginTop: 8 }} />
              <SkeletonBlock style={{ width: "30%", height: 10, marginTop: 10 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VehiclesPageSkeleton() {
  return (
    <div className="vehicles-skeleton-layout">
      <div className="filter_column vehicles-skeleton-filter">
        <SkeletonBlock style={{ width: 80, height: 12, marginBottom: 20 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="vehicles-skeleton-filter-group">
            <SkeletonBlock style={{ width: "70%", height: 10, marginBottom: 10 }} />
            {Array.from({ length: 3 }).map((_, j) => (
              <SkeletonBlock key={j} style={{ width: "90%", height: 28, marginBottom: 6, borderRadius: 6 }} />
            ))}
          </div>
        ))}
      </div>
      <div className="vehicles-skeleton-main">
        <div className="vehicles-skeleton-toolbar">
          <SkeletonBlock style={{ width: 90, height: 34, borderRadius: 8 }} />
          <SkeletonBlock style={{ width: 140, height: 34, borderRadius: 8 }} />
        </div>
        <CarGridSkeleton count={12} />
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <main className="landing-page">
      <section className="landing-hero home-skeleton-hero">
        <SkeletonBlock style={{ width: 140, height: 12, marginBottom: 12 }} />
        <SkeletonBlock style={{ width: "80%", maxWidth: 520, height: 42, marginBottom: 14 }} />
        <SkeletonBlock style={{ width: "70%", maxWidth: 420, height: 16, marginBottom: 20 }} />
        <div className="landing-cta-row">
          <SkeletonBlock style={{ width: 164, height: 40, borderRadius: 8 }} />
          <SkeletonBlock style={{ width: 164, height: 40, borderRadius: 8 }} />
        </div>
      </section>
      <section className="landing-stats-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <article key={i} className="landing-stat-card">
            <SkeletonBlock style={{ width: "60%", height: 12, marginBottom: 10 }} />
            <SkeletonBlock style={{ width: "40%", height: 28 }} />
          </article>
        ))}
      </section>
      <section className="landing-section-grid">
        <div className="landing-feature-column">
          <SkeletonBlock style={{ width: 140, height: 20, marginBottom: 14 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className="landing-feature-card">
              <SkeletonBlock style={{ width: "55%", height: 16, marginBottom: 8 }} />
              <SkeletonBlock style={{ width: "90%", height: 12 }} />
            </article>
          ))}
        </div>
        <div className="landing-feature-column">
          <SkeletonBlock style={{ width: 160, height: 20, marginBottom: 14 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <article key={i} className="landing-category-card">
              <SkeletonBlock style={{ width: "50%", height: 16, marginBottom: 8 }} />
              <SkeletonBlock style={{ width: "85%", height: 12 }} />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export function LoginSkeleton() {
  return (
    <div className="auth-page">
      <div className="auth-card login-skeleton-card">
        <div className="auth-card-header">
          <SkeletonBlock style={{ width: 48, height: 48, borderRadius: 12, margin: "0 auto 14px" }} />
          <SkeletonBlock style={{ width: 160, height: 24, margin: "0 auto 8px" }} />
          <SkeletonBlock style={{ width: 200, height: 12, margin: "0 auto" }} />
        </div>
        <SkeletonBlock style={{ width: "100%", height: 40, borderRadius: 8, marginBottom: 20 }} />
        <div className="login-skeleton-fields">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i}>
              <SkeletonBlock style={{ width: 80, height: 10, marginBottom: 8 }} />
              <SkeletonBlock style={{ width: "100%", height: 44, borderRadius: 8 }} />
            </div>
          ))}
        </div>
        <SkeletonBlock style={{ width: "100%", height: 44, borderRadius: 8, marginTop: 20 }} />
        <SkeletonBlock style={{ width: "100%", height: 44, borderRadius: 8, marginTop: 12 }} />
      </div>
    </div>
  );
}

export function EditProfileSkeleton() {
  return (
    <div className="edit-profile-scroll-area">
      <div className="edit-profile">
        <div className="ep-header">
          <SkeletonBlock style={{ width: 38, height: 38, borderRadius: 9 }} />
          <div>
            <SkeletonBlock style={{ width: 140, height: 24, marginBottom: 6 }} />
            <SkeletonBlock style={{ width: 200, height: 12 }} />
          </div>
        </div>
        <div className="ep-avatar-section" style={{ alignItems: "center", display: "flex", flexDirection: "column", marginBottom: 24 }}>
          <SkeletonBlock style={{ width: 90, height: 90, borderRadius: "50%" }} />
          <SkeletonBlock style={{ width: 120, height: 10, marginTop: 10 }} />
        </div>
        <div className="ep-form-grid">
          <div className="ep-card">
            <SkeletonBlock style={{ width: 160, height: 12, marginBottom: 18 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="ep-field">
                <SkeletonBlock style={{ width: 90, height: 10, marginBottom: 8 }} />
                <SkeletonBlock style={{ width: "100%", height: 40, borderRadius: 8 }} />
              </div>
            ))}
          </div>
          <div className="ep-card">
            <SkeletonBlock style={{ width: 80, height: 12, marginBottom: 18 }} />
            <SkeletonBlock style={{ width: "100%", height: 40, borderRadius: 8, marginBottom: 12 }} />
            <SkeletonBlock style={{ width: 160, height: 32, borderRadius: 8 }} />
          </div>
        </div>
        <div className="ep-actions">
          <SkeletonBlock style={{ width: 100, height: 40, borderRadius: 8 }} />
          <SkeletonBlock style={{ width: 140, height: 40, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

export function SupportSkeleton() {
  return (
    <div className="support-wrapper">
      <div className="support-header">
        <SkeletonBlock className="support-skeleton-avatar" />
        <div className="support-header-info">
          <SkeletonBlock style={{ width: 140, height: 16, marginBottom: 6 }} />
          <SkeletonBlock style={{ width: 60, height: 10 }} />
        </div>
      </div>
      <div className="support-messages support-skeleton-messages">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`msg-row ${i % 2 === 0 ? "msg-bot" : "msg-user"}`}>
            {i % 2 === 0 && <SkeletonBlock className="support-skeleton-bot-icon" />}
            <SkeletonBlock
              className={`support-skeleton-bubble ${i % 2 === 0 ? "support-skeleton-bubble--bot" : "support-skeleton-bubble--user"}`}
            />
          </div>
        ))}
      </div>
      <div className="support-input-area">
        <SkeletonBlock style={{ flex: 1, height: 40, borderRadius: 8 }} />
        <SkeletonBlock style={{ width: 72, height: 40, borderRadius: 8 }} />
      </div>
    </div>
  );
}

export function AuthCallbackSkeleton() {
  return (
    <div className="auth-callback-skeleton">
      <SkeletonBlock style={{ width: 48, height: 48, borderRadius: "50%", marginBottom: 16 }} />
      <SkeletonBlock style={{ width: 180, height: 16 }} />
    </div>
  );
}

export function AppBootstrapSkeleton({ pathname }) {
  const hideLayout = pathname === "/login";
  const hideSidebar = pathname === "/" || pathname === "/login";

  if (hideLayout) {
    return <LoginSkeleton />;
  }

  return (
    <div className="app-bootstrap-skeleton">
      <div className="app-bootstrap-header">
        <SkeletonBlock style={{ width: 120, height: 20 }} />
        <SkeletonBlock style={{ width: 200, height: 34, borderRadius: 8 }} />
      </div>
      <div className="main-body d-flex flex-wrap">
        {!hideSidebar && (
          <div className="app-bootstrap-sidebar">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonBlock key={i} style={{ width: "80%", height: 14, marginBottom: 14 }} />
            ))}
          </div>
        )}
        <div className={hideSidebar ? "w-100" : "OutLetContent"}>
          <RoutePageSkeleton pathname={pathname} />
        </div>
      </div>
    </div>
  );
}

export function RoutePageSkeleton({ pathname: pathProp }) {
  const { pathname: locationPath } = useLocation();
  const pathname = pathProp ?? locationPath;

  switch (pathname) {
    case "/":
      return <HomeSkeleton />;
    case "/login":
      return <LoginSkeleton />;
    case "/auth/callback":
      return <AuthCallbackSkeleton />;
    case "/dashboard":
      return <DashboardRouteSkeleton />;
    case "/vehicles":
      return <VehiclesPageSkeleton />;
    case "/wishlist":
      return (
        <div className="cart_page">
          <PageTitleSkeleton width="100px" />
          <CarGridSkeleton count={10} />
        </div>
      );
    case "/cartList":
      return (
        <div className="cart_page">
          <PageTitleSkeleton width="60px" />
          <CartListSkeleton count={4} />
        </div>
      );
    case "/orders":
      return (
        <div className="cart_page">
          <PageTitleSkeleton width="80px" />
          <OrderListSkeleton count={4} />
        </div>
      );
    case "/support":
      return <SupportSkeleton />;
    case "/profile":
      return <ProfileSkeleton />;
    case "/editProfile":
      return <EditProfileSkeleton />;
    case "/notifications":
      return <NotificationListSkeleton />;
    default:
      if (pathname.startsWith("/vehicles/")) {
        return <CarDetailsSkeleton />;
      }
      return (
        <div className="cart_page">
          <PageTitleSkeleton />
          <SkeletonBlock style={{ width: "100%", height: 200, borderRadius: 12 }} />
        </div>
      );
  }
}
