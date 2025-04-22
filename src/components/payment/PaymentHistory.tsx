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
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Completed
          </span>
        );
      case PaymentStatus.PROCESSING:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Pending
          </span>
        );
      case PaymentStatus.FAILED:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            Failed
          </span>
        );
      case PaymentStatus.REFUNDED:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            Refunded
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
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
        <h2 className="text-2xl font-bold text-desert-800 dark:text-desert-100 mb-4 sm:mb-0">
          Payment History
        </h2>
        
        {/* Filter dropdown */}
        <div className="relative">
          <div className="flex items-center border border-desert-300 dark:border-night-desert-600 rounded-md">
            <Filter className="ml-3 w-4 h-4 text-desert-500 dark:text-desert-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-transparent py-2 pl-2 pr-8 text-desert-700 dark:text-desert-300 focus:outline-none"
            >
              <option value="all">All Payments</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-desert-700 dark:text-desert-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-md">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Payment history table */}
      <div className="bg-white dark:bg-night-desert-900 rounded-lg shadow-desert overflow-hidden">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-desert-500" />
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-6 text-center text-desert-600 dark:text-desert-400">
            <p>No payment records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-desert-200 dark:divide-night-desert-700">
              <thead className="bg-desert-50 dark:bg-night-desert-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-desert-500 dark:text-desert-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-desert-500 dark:text-desert-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-desert-500 dark:text-desert-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-desert-500 dark:text-desert-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-desert-500 dark:text-desert-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-night-desert-900 divide-y divide-desert-200 dark:divide-night-desert-700">
                {filteredPayments.map((payment: PaymentRecord) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-desert-700 dark:text-desert-300">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-desert-700 dark:text-desert-300">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-desert-700 dark:text-desert-300">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {/* View details implementation */}}
                          className="text-desert-600 hover:text-desert-800 dark:text-desert-400 dark:hover:text-desert-200"
                          title="View details"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        {payment.status === PaymentStatus.SUCCEEDED && (
                          <button
                            onClick={() => downloadInvoice(payment.id)}
                            className="text-desert-600 hover:text-desert-800 dark:text-desert-400 dark:hover:text-desert-200"
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
