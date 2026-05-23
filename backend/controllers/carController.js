const Car = require('../models/CarSchema');
const { safeRegex } = require('../utils/regex');
const { isValidObjectId } = require('../utils/objectId');



const getCars = async(req,res)=>{

const {
brand,
model,
bodyType,
available,
transmission,
fuelType,
maxPrice,
search
}=req.query;

const query={
isDeleted:false
};


const brandRx=safeRegex(brand);
if(brandRx) query.brand=brandRx;

const modelRx=safeRegex(model);
if(modelRx) query.model=modelRx;

const bodyTypeRx=safeRegex(bodyType);
if(bodyTypeRx) query.bodyType=bodyTypeRx;

const transmissionRx=safeRegex(transmission);
if(transmissionRx) query.transmission=transmissionRx;

const fuelTypeRx=safeRegex(fuelType);
if(fuelTypeRx) query.fuelType=fuelTypeRx;

if(available==="true"){
query.available={$gt:0};
}

if(maxPrice){

const priceNum=Number(maxPrice);

if(!Number.isNaN(priceNum)){
query.price={
$lte:priceNum
};
}

}

const searchRx=safeRegex(search);

if(searchRx){

query.$or=[

{carName:searchRx},
{brand:searchRx},
{model:searchRx}

];

}

const page=Math.max(
1,
parseInt(req.query.page)||1
);

const limit=Math.min(
50,
Math.max(
1,
parseInt(req.query.limit)||12
)
);

const skip=(page-1)*limit;

const [cars,total]=await Promise.all([

Car.find(query)
.skip(skip)
.limit(limit)
.lean(),

Car.countDocuments(query)

]);

res.json({

cars,
total,
page,
pages:
Math.ceil(total/limit)

});

};



const addCar=async(req,res)=>{

const car=new Car({

...req.body,

carName:
`${req.body.brand}
${req.body.model}`,

available:
req.body.available ?? 1

});

await car.save();

res.status(201)
.json(car);

};



const getCar=async(req,res)=>{

if(
!isValidObjectId(
req.params.id
)
){

const error=
new Error(
"Invalid car id"
);

error.status=400;

throw error;

}

const car=
await Car.findOne({

_id:req.params.id,
isDeleted:false

});

if(!car){

const error=
new Error(
"Car not found"
);

error.status=404;

throw error;

}

res.json(car);

};



module.exports={

getCars,
addCar,
getCar

};