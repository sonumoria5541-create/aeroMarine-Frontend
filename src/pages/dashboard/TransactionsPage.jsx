import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { formatINR, formatDate } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';
import {
  History,
  Filter,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Box,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedTxn, setSelectedTxn] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const url =
        typeFilter === 'all'
          ? `/wallet/transactions?page=${page}&limit=15`
          : `/wallet/transactions?type=${typeFilter}&page=${page}&limit=15`;
      const res = await api.get(url);
      if (res.data?.success) {
        setTransactions(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, page]);

  const typeTabs = [
    { id: 'all', label: 'All Operations' },
    { id: 'deposit', label: 'Deposits' },
    { id: 'withdrawal_reserve', label: 'Withdrawal Reservations' },
    { id: 'withdrawal_paid', label: 'Paid Withdrawals' },
    { id: 'container_purchase', label: 'Container Purchases' },
    { id: 'earning_credit', label: 'Earnings Accruals' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black font-display text-ocean-900">Transaction History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Auditable Ledger Entries & Balance Movement Records
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {typeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setTypeFilter(tab.id);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              typeFilter === tab.id
                ? 'bg-ocean-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden">
        {loading ? (
          <p className="text-xs text-slate-500 py-12 text-center">Loading transactions from ledger...</p>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <History className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs">No transactions found under this category filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((txn) => {
              const isCredit =
                txn.type === 'deposit' || txn.type === 'earning_credit' || txn.type === 'withdrawal_release';
              return (
                <div
                  key={txn._id}
                  onClick={() => setSelectedTxn(txn)}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-ocean-900">{txn.transactionId}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {txn.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="font-medium text-slate-700">{txn.description}</p>
                    <p className="text-[11px] text-slate-400">{formatDate(txn.createdAt)}</p>
                  </div>

                  <div className="sm:text-right space-y-0.5">
                    <span
                      className={`text-base font-black font-display block ${
                        isCredit ? 'text-emerald-600' : 'text-ocean-900'
                      }`}
                    >
                      {isCredit ? '+' : '-'}
                      {formatINR(txn.amount)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Status: {txn.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-lg border border-slate-200 bg-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Transaction Ledger Audit Entry"
        subtitle={`ID: ${selectedTxn?.transactionId}`}
      >
        {selectedTxn && (
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Type:</span>
                <span className="font-bold uppercase text-ocean-900">{selectedTxn.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authoritative Amount:</span>
                <span className="font-black text-sm text-ocean-900 font-display">
                  {formatINR(selectedTxn.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Minor Units (Paise):</span>
                <span className="font-mono text-slate-700">{selectedTxn.amountPaise} paise</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Posting Date & Time:</span>
                <span className="font-medium text-slate-700">{formatDate(selectedTxn.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Description:</span>
                <span className="font-medium text-slate-800 text-right max-w-xs">{selectedTxn.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Audit Status:</span>
                <span className="font-bold text-emerald-600 uppercase">{selectedTxn.status}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-5 py-2 rounded-xl bg-ocean-900 text-white text-xs font-bold hover:bg-ocean-800"
              >
                Close Audit View
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
