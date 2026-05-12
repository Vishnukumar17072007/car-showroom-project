import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/order/useOrder";
import { useCart } from "../context/cart/useCart";   // ← NEW

const CheckoutModal = ({ onClose, carIds }) => {
    const { placeOrder } = useOrder();
    const { fetchCart } = useCart();                 // ← NEW
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', mobile: '', address: '', city: '', pincode: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async () => {
        const { name, mobile, address, city, pincode } = form;
        if (!name.trim() || !mobile.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (!/^\d{10}$/.test(mobile)) {
            setError('Mobile number must be exactly 10 digits.');
            return;
        }
        if (!/^\d{6}$/.test(pincode)) {
            setError('Pincode must be exactly 6 digits.');
            return;
        }

        setLoading(true);
        try {
            await placeOrder(form, carIds);
            await fetchCart();    // ← NEW: re-sync cart after order placed
            onClose();
            navigate('/orders');
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal_overlay">
            <div className="modal_card">
                <h2 className="modal_title">Shipping Details</h2>
                <p className="modal_subtitle">Fill in your details to complete the order</p>

                <div className="modal_field">
                    <label>Full Name</label>
                    <input name="name" placeholder="e.g. Vishnu Kumar"
                        value={form.name} onChange={handleChange} />
                </div>

                <div className="modal_field">
                    <label>Mobile Number</label>
                    <input name="mobile" placeholder="10-digit number"
                        value={form.mobile} onChange={handleChange} maxLength={10} />
                </div>

                <div className="modal_field">
                    <label>Address</label>
                    <textarea name="address" placeholder="Door no, Street, Area"
                        value={form.address} onChange={handleChange} rows={3} />
                </div>

                <div className="modal_row">
                    <div className="modal_field">
                        <label>City</label>
                        <input name="city" placeholder="e.g. Chennai"
                            value={form.city} onChange={handleChange} />
                    </div>
                    <div className="modal_field">
                        <label>Pincode</label>
                        <input name="pincode" placeholder="6-digit pincode"
                            value={form.pincode} onChange={handleChange} maxLength={6} />
                    </div>
                </div>

                {error && <p className="modal_error">{error}</p>}

                <div className="modal_actions">
                    <button className="modal_cancel_btn" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button className="modal_confirm_btn" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Placing Order...' : 'Confirm Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;