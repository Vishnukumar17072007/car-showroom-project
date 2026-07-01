import Cards from "./car-cards";
import { useAuth } from "../context/auth/useAuth";
import API from "../api/axios";
import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { CarGridSkeleton, SkeletonBlock } from "../components/PageSkeletons";
import CatalogPagination from "../components/CatalogPagination";
import { useCarsCatalog, CARS_PAGE_SIZE } from "../hooks/useCarsCatalog";
import { addCar } from "../context/car/carProvider";

function CarDetailsFetchingListForCards({ filters, search, priceSort }) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateCar, setUpdateCar] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    setPage(1);
  }, [filters, search, priceSort]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const {
    cars: carList,
    page: currentPage,
    pages,
    total,
    loading,
    error,
  } = useCarsCatalog({
    filters,
    search,
    page,
    limit: pageSize,
    refreshKey,
    priceSort
  });

  function handleUpdateSubmit() {
    const {
      brand,
      model,
      image,
      frontImage,
      rearImage,
      rightSideImage,
      leftSideImage,
      bodyType,
      fuelType,
      transmission,
      seats,
      engineType,
      mileage,
      price,
      rating,
      available,
    } = updateCar;

    if (
      !brand?.trim() ||
      !model?.trim() ||
      !bodyType?.trim() ||
      !image?.trim() ||
      !frontImage?.trim() ||
      !rearImage?.trim() ||
      !rightSideImage?.trim() ||
      !leftSideImage?.trim() ||
      !fuelType?.trim() ||
      !transmission?.trim() ||
      !engineType?.trim() ||
      !mileage?.trim()
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (!seats || seats < 1) {
      toast.error("Please enter a valid seat count.");
      return;
    }

    if (!price || price <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!rating || rating < 1 || rating > 10) {
      toast.error("Valid Rating must be between 1 and 10.");
      return;
    }

    if ( !available || available < 0 ) {
      toast.error("Enter a valid Stock count.");
      return;
    }
    addCar(updateCar);
    
    setShowUpdateForm(false);
    setUpdateCar({});
    setPage(1);

    handleRefresh();
  }

  if (loading) {
    return (
      <>
        <div className="vehicles-skeleton-toolbar">
          <SkeletonBlock style={{ width: 90, height: 34, borderRadius: 8 }} />
          <SkeletonBlock style={{ width: 140, height: 34, borderRadius: 8 }} />
        </div>
        {!error && <CarGridSkeleton count={CARS_PAGE_SIZE} />}
        {error && <p className="catalog-error">{error}</p>}
      </>
    );
  }

  if (error) {
    return <p className="catalog-error">{error}</p>;
  }

  return (
    <div className="catalog-list-wrap">
      <div className="car_card_box d-flex flex-column">
        {user?.role === "admin" && (
          <div
            className="car-card-update"
            onClick={() => setShowUpdateForm(true)}
          >
            <div className="car_card_body-update">Add CARS</div>
          </div>
        )}
        {/* Cards Grid */}
        <div className={`d-flex flex-wrap gap-2 ${user.role === "admin" ? "pt-2" : ""}`}>
          {carList.length > 0 ? (
            carList.map((detail) => (
              <Cards
                key={detail._id}
                _id={detail._id}
                brand={detail.brand}
                model={detail.model}
                bodyType={detail.bodyType}
                image={detail.image}
                frontImage={detail.frontImage}
                rearImage={detail.rearImage}
                leftSideImage={detail.leftSideImage}
                rightSideImage={detail.rightSideImage}
                transmission={detail.transmission}
                fuelType={detail.fuelType}
                seats={detail.seats}
                mileage={detail.mileage}
                engineType={detail.engineType}
                price={detail.price}
                rating={detail.rating}
                available={detail.available}
                onUpdate={handleRefresh}
              />
            ))
          ) : (
            <div
              className="d-flex justify-content-center align-items-center w-100"
              style={{ minHeight: "200px" }}
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "gray",
                }}
              >
                🚗 No cars found matching your search.
              </p>
            </div>
          )}

        </div>

        {/* Pagination INSIDE cards area */}
        <div className="d-flex justify-content-center mt-4">
          <CatalogPagination
            page={currentPage}
            pages={pages}
            total={total}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
            }}
            onPageChange={setPage}
          />
        </div>
      </div>

      {showUpdateForm && (
        <div className="updateForm">
          <div className="updateFormContent">
            <label>Brand Name: </label>
            <input
              type="text"
              placeholder="Brand Name"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, brand: e.target.value })
              }
            />
            <label>Modal Name: </label>
            <input
              type="text"
              placeholder="Model Name"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, model: e.target.value })
              }
            />
            <label>Image URL: </label>
            <input
              type="text"
              placeholder="Image URL"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, image: e.target.value })
              }
            />
            <label>Front Image URL: </label>
            <input
              type="text"
              placeholder="Front Image URL"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, frontImage: e.target.value })
              }
            />
            <label>Rear Image URL: </label>
            <input
              type="text"
              placeholder="Rear Image URL"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, rearImage: e.target.value })
              }
            />
            <label>Right Side Image URL: </label>
            <input
              type="text"
              placeholder="Right Side Image URL"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, rightSideImage: e.target.value })
              }
            />
            <label>Left Side Image URL: </label>
            <input
              type="text"
              placeholder="Left Side Image URL"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, leftSideImage: e.target.value })
              }
            />
            <label>Body Type: </label>
            <input
              type="text"
              placeholder="Body Type"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, bodyType: e.target.value })
              }
            />
            <label>Transmission Type: </label>
            <input
              type="text"
              placeholder="Transmission Type"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, transmission: e.target.value })
              }
            />
            <label>Fuel Type: </label>
            <input
              type="text"
              placeholder="Fuel Type"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, fuelType: e.target.value })
              }
            />
            <label>Engine Type: </label>
            <input
              type="text"
              placeholder="Engine Type"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, engineType: e.target.value })
              }
            />
            <label>Seats: </label>
            <input
              type="number"
              placeholder="Seats"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, seats: Number(e.target.value) })
              }
            />
            <label>Mileage: </label>
            <input
              type="text"
              placeholder="Mileage"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, mileage: e.target.value })
              }
            />
            <label>Price: </label>
            <input
              type="number"
              placeholder="Price"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, price: Number(e.target.value) })
              }
            />
            <label>Rating: </label>
            <input
              type="number"
              placeholder="Rating"
              onChange={(e) =>
                setUpdateCar({ ...updateCar, rating: Number(e.target.value) })
              }
            />
            <label>Stock: </label>
            <input
              type="number"
              placeholder="Stock count"
              onChange={(e) =>
                setUpdateCar({
                  ...updateCar,
                  available: Number(e.target.value),
                })
              }
            />

            <div className="SaveOrCancel-btnGroup">
              <button
                className="cancelBtn btn"
                onClick={() => setShowUpdateForm(false)}
              >
                Cancel
              </button>

              <button className="saveBtn btn" onClick={handleUpdateSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarDetailsFetchingListForCards;