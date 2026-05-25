import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/order/useOrder";
import { useCart } from "../context/cart/useCart";   // ← NEW
import { useAuth } from "../context/auth/useAuth";

const CheckoutModal = ({ onClose, carIds }) => {
    const { user } = useAuth();
    const { placeOrder } = useOrder();
    const { fetchCart } = useCart();                 // ← NEW
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', phone: '', address: '', city: '',state: '', pincode: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(true);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleUseExistingData = () => {
        setForm({
            name:    user.userName                          || '',
            phone: user.phone?.replace(/\D/g,'').slice(-10) || '',
            address: user.location?.address                 || '',
            city:    user.location?.city                    || '',
            state:   user.location?.state                   || '',
            pincode: user.location?.pincode?.toString()     || '',
        });
        setShowModal(false);
    };

    const handleSubmit = async () => {
        const { name, phone, address, city, state, pincode } = form;
        if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
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
            onClose(); // close modal first
            await fetchCart();    // ← NEW: re-sync cart after order placed
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
                    <input name="name" placeholder="e.g. User Name"
                        value={form.name} onChange={handleChange} />
                </div>

                <div className="modal_field">
                    <label>Mobile Number</label>
                    <input name="phone" placeholder="10-digit number"
                        value={form.phone} onChange={handleChange} maxLength={10} />
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
                        <label>state</label>
                        <input name="state" placeholder="e.g. Tamil Nadu"
                            value={form.state} onChange={handleChange} />
                    </div>
                    <div className="modal_field">
                        <label>Pincode</label>
                        <input name="pincode" placeholder="6-digit pincode"
                            value={form.pincode} onChange={handleChange} maxLength={6} />
                    </div>
                </div>

                {showModal && (
                    <div className="detailsModal">
                        <p>Want to you your existing data ?</p>
                        <div className="btnGroup">
                            <button className="yes" onClick={handleUseExistingData}>YES</button>
                            <button className="no" onClick={() => {setShowModal(false); }}>NO</button>
                        </div>
                    </div>
                )}

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