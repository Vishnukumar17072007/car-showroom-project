const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                carId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Car",
                    required: true,
                },
                image: {
                    type: String,
                },
                carName: {
                    type: String,
                    default: "",
                },
            }
        ],
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "in_progress", "approved", "delivered", "rejected", "cancelled"],
        },
        shippingDetails: {
            name: {
                type: String,
                required: true,
            },
            mobile: {
                type: Number,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            pincode: {
                type: Number,
                required: true,
            }
        },
        deletedByUser: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema, "OrderLists");
