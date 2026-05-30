import { useState } from "react";

function Invoices() {
  const [invoices, setInvoices] = useState([
    {
      id: "INV-1001",
      customer: "John Doe",
      vehicle: "BMW X5",
      amount: "₹55,00,000",
      status: "Paid",
      date: "29 May 2026",
    },
    {
      id: "INV-1002",
      customer: "Vishnu",
      vehicle: "Audi A6",
      amount: "₹48,00,000",
      status: "Pending",
      date: "28 May 2026",
    },
  ]);

  const createInvoice = () => {
    const newInvoice = {
      id: `INV-${1000 + invoices.length + 1}`,
      customer: "New Customer",
      vehicle: "Vehicle Name",
      amount: "₹0",
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    setInvoices([newInvoice, ...invoices]);
  };

  const downloadInvoice = (invoice) => {
    const content = `
Invoice ID : ${invoice.id}
Customer   : ${invoice.customer}
Vehicle    : ${invoice.vehicle}
Amount     : ${invoice.amount}
Status     : ${invoice.status}
Date       : ${invoice.date}
`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${invoice.id}.txt`;
    a.click();
  };

  return (
    <div className="invoice-page">
      <div className="invoice-header">
        <div>
          <h2>Invoices</h2>
          <p>Manage all generated invoices</p>
        </div>

        <button
          className="create-invoice-btn"
          onClick={createInvoice}
        >
          Create Invoice
        </button>
      </div>

      <div className="invoice-summary">
        <div className="invoice-card">
          <h3>{invoices.length}</h3>
          <span>Total Invoices</span>
        </div>

        <div className="invoice-card">
          <h3>
            {
              invoices.filter(
                (item) => item.status === "Paid"
              ).length
            }
          </h3>
          <span>Paid</span>
        </div>

        <div className="invoice-card">
          <h3>
            {
              invoices.filter(
                (item) => item.status === "Pending"
              ).length
            }
          </h3>
          <span>Pending</span>
        </div>
      </div>

      <div className="invoice-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Download</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.customer}</td>
                <td>{invoice.vehicle}</td>
                <td>{invoice.amount}</td>

                <td>
                  <span
                    className={`status-badge ${
                      invoice.status.toLowerCase()
                    }`}
                  >
                    {invoice.status}
                  </span>
                </td>

                <td>{invoice.date}</td>

                <td>
                  <button
                    className="download-btn"
                    onClick={() =>
                      downloadInvoice(invoice)
                    }
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Invoices;