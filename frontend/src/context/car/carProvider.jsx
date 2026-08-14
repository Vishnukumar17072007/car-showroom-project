import { apiGet, apiPatch, apiPost, apiPut } from "../../api/axios";
import toast from "react-hot-toast";

export async function addCar(updateCar) {
    try{
        const res = await apiPost("/cars/", updateCar);
        toast.success("Car added successfully!");
        return res;
    }
    catch (err){
      toast.error(err.response?.data?.message || "Failed to add car!");
    }
};

export async function getCarById(carId) {
    try{
        const res = await apiGet(`/cars/${carId}`);
        return res;
    }
    catch {
        toast.error("failed to get data to edit the car.");
    }
}

export async function deleteCar(id) {
    try{
        const res = await apiPatch(`/cars/soft-delete/${id}`);
        toast.success("Car deleted successfully.");
        return res;
    }
    catch (err){
      toast.error(err.response?.data?.message || "Delete failed");
    }
}

export async function editCar(id, editData) {
    try{
        const res = await apiPut(`/cars/${id}`, editData);
        toast.success("Car updated successfully!");
        return res;
    }
    catch (err) {
        toast.error(err.response?.data?.message || "Update failed");
    }
}