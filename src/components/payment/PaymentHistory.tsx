import { useState } from 'react';
import { Loader2, FileText, Download, Filter } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { PaymentHistoryItem as PaymentRecord, PaymentStatus } from '../../types/payment';

export function PaymentHistory() {
  const { paymentHistory, isLoading, error } = usePayment();
  const [filter, setFilter] = useState<string>('all');
  
  // Filter payment records
  const filteredPayments = paymentHistory.filter(payment => {
    if (filter === 'all') return true;
    if (filter === 'completed' && payment.status === PaymentStatus.SUCCEEDED) return true;
    if (filter === 'pending' && payment.status === PaymentStatus.PROCESSING) return true;
    if (filter === 'failed' && payment.status === PaymentStatus.FAILED) return true;
    if (filter === 'refunded' && payment.status === PaymentStatus.REFUNDED) return true;
    return false;
  });

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCEEDED:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-tertiary-container text-on-tertiary-container">
            Completed
          </span>
        );
      case PaymentStatus.PROCESSING:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary-container text-on-secondary-container">
            Pending
          </span>
        );
      case PaymentStatus.FAILED:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-error-container text-on-error-container">
            Failed
          </span>
        );
      case PaymentStatus.REFUNDED:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface-container-high text-on-surface-variant">
            Refunded
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface-container-high text-on-surface-variant">
            {status}
          </span>
        );
    }
  };

  // Mock function to download invoice (would be implemented with actual backend)
  const downloadInvoice = (paymentId: string) => {
    // In a real application, this would trigger a backend request to generate
    // and download a PDF invoice
    console.log(`Downloading invoice for payment ${paymentId}`);
    alert('Invoice download would be implemented with actual backend integration');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-on-surface mb-4 sm:mb-0">
          Payment History
        </h2>
        
        {/* Filter dropdown */}
        <div className="relative">
          <div className="flex items-center border border-outline rounded-xl bg-surface-container-high">
            <Filter className="ml-3 w-4 h-4 text-on-surface-variant" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-transparent py-2 pl-2 pr-8 text-on-surface-variant focus:outline-none"
            >
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-error-container border border-error rounded-xl">
          <p className="text-on-error-container">{error}</p>
        </div>
      )}

      {/* Payment history table */}
      <div className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden border border-outline-variant">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-on-surface-variant" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-6 text-center text-on-surface-variant">
            <p>No payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-outline-variant">
              <thead className="bg-surface-container">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface-container-low divide-y divide-outline-variant">
                {filteredPayments.map((payment: PaymentRecord) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {/* View details implementation */}}
                          className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                          title="View details"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        {payment.status === PaymentStatus.SUCCEEDED && (
                          <button
                            onClick={() => downloadInvoice(payment.id)}
                            className="text-on-surface-variant hover:text-primary transition-colors duration-[var(--md-sys-motion-duration-short3)]"
                            title="Download invoice"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
