import { useState, useEffect } from "react";
import { carContext } from "./carContext";
import API from "../../api/axios";
import toast from "react-hot-toast";

export async function addCar(updateCar) {
    try{
        const res = await API.post("/cars/", updateCar);
        toast.success("Car added successfully!");
        return res;
    }
    catch (err){
      toast.error(err.response?.data?.message || "Failed to add car!");
    }
};

export async function deleteCar(id) {
    try{
        const res = await API.patch(`/cars/soft-delete/${id}`);
        toast.success("Car deleted successfully.");
        return res;
    }
    catch (err){
      toast.error(err.response?.data?.message || "Delete failed");
    }
}

export async function editCar(id, editData) {
    try{
        const res = await API.put(`/cars/${id}`, editData);
        toast.success("Car updated successfully!");
        return res;
    }
    catch (err) {
        toast.error(err.response?.data?.message || "Update failed");
    }
}