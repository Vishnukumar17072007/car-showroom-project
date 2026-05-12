const side_bar_menu_lists=document.querySelectorAll(".side_bar_menu_lists");
side_bar_menu_lists.forEach(i=>{
    i.addEventListener("click",()=>{

        side_bar_menu_lists.forEach(j=>{
            j.classList.remove("active");
        })

        i.classList.add("active");
    });
});

const car_brand = document.querySelector(".car_brand");
const car_brand_list=document.querySelector(".car_brand_list");
car_brand.addEventListener("click",()=>{
    car_brand.classList.toggle("active");
    car_brand_list.classList.toggle("show");
});

const car_type = document.querySelector(".car_type");
const car_type_list=document.querySelector(".car_type_list");
car_type.addEventListener("click",()=>{
    car_type.classList.toggle("active");
    car_type_list.classList.toggle("show");
});

// const transmission = document.querySelector(".transmission");
// const trans_btn=document.querySelector(".trans-btn");
// transmission.addEventListener("click",()=>{
//     trans_btn.classList.toggle("hidden");
// });

const transmission = document.querySelector(".transmission");
const transBtn = document.querySelector(".trans-btn");

transmission.addEventListener("click", () => {
    transBtn.classList.toggle("show");
    transmission.classList.toggle("active");
});

const fuel_type = document.querySelector(".fuel-type");
const fuel_type_list=document.querySelector(".fuel-type-list");
fuel_type.addEventListener("click",()=>{
    fuel_type.classList.toggle("active");
    fuel_type_list.classList.toggle("show");
});