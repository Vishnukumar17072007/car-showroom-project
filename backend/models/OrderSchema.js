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
                priceAtPurchase: {
                    type: Number,
                    required: true,
                },
                carName: {
                    type: String,
                    default: "",
                },
            }
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "confirmed", "delivered", "cancelled"],
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
