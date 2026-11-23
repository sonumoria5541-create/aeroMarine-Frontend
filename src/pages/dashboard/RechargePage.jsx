import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Wallet,
  CheckCircle2,
  X,
  Copy,
  Check,
  ShieldCheck,
  UploadCloud,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  Lock,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  Download,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import api, { getApiErrorMessage } from '../../lib/api';

const PRESET_AMOUNTS = [285, 520, 720, 1000, 2000, 4785];

const OFFICIAL_RECHARGE_QR_URL =
  'https://res.cloudinary.com/uk36yvrq/image/upload/v1795418834/WhatsApp_Image_2026-11-23_at_12.56.05_PM.jpg';

const CHANNELS = [
  {
    id: 'channel_1',
    name: 'Channel 1 (VIP Fast UPI / GPay)',
    code: 'VIP-01',
    upiId: 'ajeetkumar7009.r@okaxis',
    payeeName: 'Ajeet Kumar',
    tag: '⚡ Official GPay QR',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    description: 'Official direct merchant QR • Google Pay, PhonePe, Paytm, BHIM',
    speed: '< 2 mins',
    qrImage: OFFICIAL_RECHARGE_QR_URL,
  },
  {
    id: 'channel_2',
    name: 'Channel 2 (Priority Express UPI)',
    code: 'EXP-02',
    upiId: 'ajeetkumar7009.r@okaxis',
    payeeName: 'Ajeet Kumar',
    tag: '🛡️ Priority Channel',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    description: 'Direct high-limit settlement route • All UPI apps supported',
    speed: '< 3 mins',
    qrImage: OFFICIAL_RECHARGE_QR_URL,
  },
];

const formatProofUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const RechargePage = () => {
  const navigate = useNavigate();
  const { wallet, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [amount, setAmount] = useState('720');
  const [selectedChannelId, setSelectedChannelId] = useState('channel_1');
  const [showPaymentStep, setShowPaymentStep] = useState(false);

  // Payment form state
  const [utr, setUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Screenshot upload state
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofPublicId, setProofPublicId] = useState('');
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isCloudinaryStorage, setIsCloudinaryStorage] = useState(false);

  // Form submission state
  const [submitting, setSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');

  const selectedChannel = CHANNELS.find((c) => c.id === selectedChannelId) || CHANNELS[0];

  const upiIntentUrl = `upi://pay?pa=${selectedChannel.upiId}&pn=${encodeURIComponent(
    selectedChannel.payeeName
  )}&am=${amount || 0}&cu=INR&aid=uGICAgJDIw-vKbQ&tn=AeroMarine-Deposit`;

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleCopy = (text, type = 'upi') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleContinue = () => {
    const num = Number(amount);
    if (!num || num < 250) {
      showToast('Minimum recharge amount is ₹250', 'error');
      return;
    }
    if (num > 10000000) {
      showToast('Maximum single recharge is ₹1,00,00,000', 'error');
      return;
    }
    setShowPaymentStep(true);
  };

  // Handle Screenshot File Selection & Automatic Upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      showToast('Only image files are accepted', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Screenshot file size must be under 10MB.');
      showToast('File too large (max 10MB)', 'error');
      return;
    }

    setUploadError('');
    setUploadingScreenshot(true);

    // Create local preview immediately
    const localUrl = URL.createObjectURL(file);
    setScreenshotPreview(localUrl);

    try {
      const formData = new FormData();
      formData.append('screenshot', file);

      const res = await api.post('/upload/payment-screenshot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.status === 'success' && res.data.data?.url) {
        setProofUrl(res.data.data.url);
        setProofPublicId(res.data.data.publicId || '');
        setIsCloudinaryStorage(Boolean(res.data.data.isCloudinary));
        showToast('Payment screenshot uploaded successfully!', 'success');
      } else {
        throw new Error(res.data?.message || 'Failed to upload screenshot');
      }
    } catch (err) {
      console.error('[Screenshot Upload Error]:', err);
      const msg = getApiErrorMessage(err, 'Failed to upload screenshot. Please retry.');
      setUploadError(msg);
      showToast(msg, 'error');
      setProofUrl('');
      setScreenshotPreview(null);
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotPreview(null);
    setProofUrl('');
    setProofPublicId('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit Recharge with Strict SS Check
  const handleSubmitRecharge = async (e) => {
    e.preventDefault();

    const num = Number(amount);
    if (!num || num < 250) {
      showToast('Minimum recharge amount is ₹250', 'error');
      return;
    }

    // STRICT VALIDATION: If not uploaded, do not submit!
    if (!proofUrl || !proofUrl.trim()) {
      showToast('⚠️ Payment screenshot is strictly required before submitting!', 'error');
      setUploadError('Payment screenshot proof is mandatory. Please upload your receipt.');
      return;
    }

    const cleanUtr = utr.trim().replace(/[^0-9A-Za-z]/g, '');
    if (!cleanUtr || cleanUtr.length < 6) {
      showToast('Please enter a valid 12-digit UTR reference number', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/wallet/recharge', {
        amount: num,
        channel: selectedChannel.name,
        utr: cleanUtr,
        proofUrl: proofUrl.trim(),
        proofPublicId,
      });

      if (res.data?.status === 'success') {
        showToast(res.data.message || 'Deposit submitted successfully! Processing audit...', 'success');
        await refreshUser();
        setTimeout(() => {
          navigate('/profit?tab=recharge');
        }, 1500);
      } else {
        showToast(res.data?.message || 'Error submitting deposit request', 'error');
      }
    } catch (err) {
      console.error('[Recharge Submit Error]:', err);
      showToast(getApiErrorMessage(err, 'Failed to submit deposit request'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold text-white flex items-center gap-2 animate-in fade-in slide-in-from-top max-w-[92vw] ${
            toastType === 'success' ? 'bg-[#0077B6]' : 'bg-rose-600'
          }`}
        >
          {toastType === 'success' ? <CheckCircle2 size={16} /> : <X size={16} />}
          <span className="truncate">{toastMsg}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-gradient-to-b from-[#0B2545] to-[#134074] px-4 pt-4 pb-8 text-white rounded-b-[36px] shadow-lg shadow-blue-950/20">
        <div className="flex items-center justify-between mb-4 max-w-lg mx-auto">
          <button
            onClick={() => {
              if (showPaymentStep) {
                setShowPaymentStep(false);
              } else {
                navigate(-1);
              }
            }}
            className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-full transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="text-xs font-semibold">{showPaymentStep ? 'Edit Amount' : 'Back'}</span>
          </button>
          <span className="text-sm font-black tracking-wide">
            {showPaymentStep ? 'Deposit Verification Desk' : 'Recharge Wallet'}
          </span>
          <Link
            to="/profit?tab=recharge"
            className="text-xs font-bold text-cyan-300 hover:text-cyan-200"
          >
            Records
          </Link>
        </div>

        {/* Current Balance Display */}
        <div className="text-center my-2 max-w-lg mx-auto">
          <div className="text-xs text-blue-200">Recharge Balance</div>
          <div className="text-3xl font-black text-white mt-0.5">
            ₹{wallet?.rechargeBalance ?? 0}
          </div>
        </div>

        {/* Recharge / Withdraw Toggle Switcher */}
        <div className="flex bg-white/10 p-1 rounded-2xl max-w-[260px] mx-auto mt-4 border border-white/10">
          <button
            type="button"
            className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-white text-[#0B2545] shadow-sm"
          >
            Recharge
          </button>
          <Link
            to="/withdraw"
            className="flex-1 py-1.5 rounded-xl text-xs font-bold text-blue-200 hover:text-white text-center transition-colors"
          >
            Withdraw
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* STEP 1: Enter Amount & Select Preferred Channel */}
        {!showPaymentStep ? (
          <>
            <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800">Enter deposit amount</span>
                <span className="text-[11px] text-slate-400">Min ₹250</span>
              </div>

              {/* Amount Input with Clear button */}
              <div className="flex items-center h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus-within:border-[#0077B6] focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <span className="text-xl font-black text-slate-800 mr-2">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent border-0 outline-none text-2xl font-black text-slate-900 placeholder:text-slate-300"
                />
                {amount && (
                  <button
                    type="button"
                    onClick={() => setAmount('')}
                    className="p-1 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Preset Amount Chips */}
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                      amount === amt.toString()
                        ? 'border-[#0077B6] bg-cyan-50 text-[#0077B6] shadow-sm font-black'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ₹ {amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Select Payment Channel Header */}
              <div className="pt-2">
                <div className="text-xs font-extrabold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Select Payment Channel</span>
                  <span className="text-[10px] text-slate-400 font-normal">2 Channels Available</span>
                </div>

                <div className="space-y-2">
                  {CHANNELS.map((ch) => {
                    const isSelected = selectedChannelId === ch.id;
                    return (
                      <div
                        key={ch.id}
                        onClick={() => setSelectedChannelId(ch.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#0077B6] bg-cyan-50/60 shadow-sm ring-2 ring-cyan-500/20'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[#0077B6] text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <Wallet size={20} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-slate-900 truncate">
                                {ch.name}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${ch.badgeColor}`}
                              >
                                {ch.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate mt-0.5">
                              {ch.description}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
                            isSelected ? 'border-[#0077B6] bg-[#0077B6]' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-sm font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Pay ₹{amount || 0}</span>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* How It Works Instructions */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3 text-xs">
              <h3 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#0077B6]" />
                <span>How Deposit Works</span>
              </h3>

              <div className="space-y-2.5 pt-1 text-slate-600">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>Choose either <b>Channel 1</b> or <b>Channel 2</b> and scan the unique QR code.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>Complete transfer on your UPI App (PhonePe, GPay, Paytm, BHIM).</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span><b>Take a screenshot of the successful transaction page</b> and enter the 12-digit UTR.</span>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0077B6] font-bold flex items-center justify-center shrink-0 text-[11px]">
                    4
                  </span>
                  <span>Upload your payment screenshot. <b>(Mandatory for instant verification)</b>.</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* STEP 2: Dedicated Payment & Screenshot Verification Desk */
          <div className="space-y-4">
            {/* Amount Summary & Channel Switcher Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 font-medium">Recharge Amount</span>
                  <div className="text-2xl font-black text-slate-900">₹ {amount}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentStep(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Edit Amount
                </button>
              </div>

              {/* Dynamic Channel Switcher Tabs */}
              <div className="pt-3">
                <div className="text-[11px] font-bold text-slate-500 mb-2">Switch Payment Channel:</div>
                <div className="grid grid-cols-2 gap-2">
                  {CHANNELS.map((ch) => {
                    const isSelected = selectedChannelId === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setSelectedChannelId(ch.id)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all text-left flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'border-[#0077B6] bg-cyan-50/80 text-[#0077B6] shadow-sm ring-1 ring-cyan-500/30'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{ch.name.split(' ')[0]} {ch.name.split(' ')[1]}</span>
                          {isSelected && <Check size={14} className="shrink-0 text-[#0077B6]" />}
                        </div>
                        <span className="text-[10px] font-normal text-slate-500 truncate mt-0.5">
                          {ch.code} &bull; {ch.speed}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* QR Code & UPI Coordinates Box */}
            <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 text-center space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                  {selectedChannel.name}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Valid for 15 mins</span>
              </div>

              {/* Official Scannable Recharge QR Code */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="p-2.5 bg-white rounded-2xl border-2 border-dashed border-[#0077B6]/40 shadow-md inline-block max-w-[210px]">
                  {selectedChannel.qrImage ? (
                    <img
                      src={selectedChannel.qrImage}
                      alt="Official Recharge QR Code"
                      className="w-48 h-48 object-contain rounded-xl mx-auto shadow-sm"
                    />
                  ) : (
                    <QRCodeSVG
                      value={upiIntentUrl}
                      size={180}
                      level="H"
                      includeMargin={false}
                      className="rounded-lg"
                    />
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800 mt-3">
                  Scan QR with any UPI App
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; Cred
                </p>
                <div className="pt-2">
                  <a
                    href={selectedChannel.qrImage || upiIntentUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="AeroMarine_Recharge_QR.jpg"
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={13} className="text-[#0077B6]" />
                    <span>Save QR to Gallery</span>
                  </a>
                </div>
              </div>

              {/* Mobile Direct Pay UPI Intent Link */}
              <a
                href={upiIntentUrl}
                className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0077B6] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
              >
                <ExternalLink size={14} />
                <span>Open Supported UPI App Directly</span>
              </a>

              {/* UPI ID Copy Field */}
              <div className="space-y-1.5 text-left pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>Payee UPI ID ({selectedChannel.payeeName}):</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-mono font-bold text-slate-800 truncate mr-2">
                    {selectedChannel.upiId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedChannel.upiId, 'upi')}
                    className="px-3 py-1.5 rounded-lg bg-[#0077B6] hover:bg-[#005f92] text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                  >
                    {copiedUpi ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* MANDATORY PAYMENT SCREENSHOT UPLOAD SECTION */}
            <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <UploadCloud size={18} className="text-[#0077B6]" />
                  <span className="text-xs font-black text-slate-900">
                    Payment Screenshot (Mandatory)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Required *
                </span>
              </div>

              <p className="text-[11px] text-slate-500">
                Upload clear screenshot of your completed transfer showing UTR, amount, and recipient.
              </p>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="deposit-screenshot-input"
              />

              {/* Dropzone / Upload Area */}
              {!screenshotPreview ? (
                <label
                  htmlFor="deposit-screenshot-input"
                  className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    uploadError
                      ? 'border-rose-400 bg-rose-50/50'
                      : 'border-slate-300 hover:border-[#0077B6] bg-slate-50/70 hover:bg-cyan-50/30'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#0077B6] flex items-center justify-center shadow-sm">
                    <ImageIcon size={24} />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-[#0077B6] block">
                      Tap to Choose Payment Screenshot
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      JPG, PNG, WebP up to 10MB
                    </span>
                  </div>
                </label>
              ) : (
                /* Uploaded Preview with Cloud Status */
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative">
                      <img
                        src={screenshotPreview}
                        alt="Payment Proof Preview"
                        className="w-full h-full object-cover"
                      />
                      {uploadingScreenshot && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <RefreshCw size={16} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {uploadingScreenshot ? 'Uploading receipt...' : 'Screenshot Verified'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {isCloudinaryStorage ? 'Stored on Cloudinary' : 'Secure Cloud Storage'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveScreenshot}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Remove screenshot"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Error Banner */}
              {uploadError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[11px] font-semibold flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* UTR Input Form */}
            <form onSubmit={handleSubmitRecharge} className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-800">
                    Enter 12-Digit UTR / Reference ID
                  </label>
                  <span className="text-[10px] text-slate-400">From UPI App Receipt</span>
                </div>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
                  placeholder="e.g. 432109876543"
                  maxLength={30}
                  className="w-full mt-1.5 h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0077B6] focus:ring-2 focus:ring-cyan-500/20 text-sm font-mono font-bold text-slate-900 transition-all placeholder:text-slate-300"
                  required
                />
              </div>

              {/* Strict Requirement Notice */}
              {!proofUrl && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-amber-800 text-[11px] font-medium flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <b>Screenshot Required:</b> You must upload the payment screenshot above before you can submit this deposit.
                  </span>
                </div>
              )}

              {/* Submit Button — Strictly disabled if no screenshot */}
              <button
                type="submit"
                disabled={submitting || !proofUrl || uploadingScreenshot || !utr || utr.length < 6}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B2545] to-[#0077B6] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Submitting Deposit...</span>
                  </>
                ) : !proofUrl ? (
                  <>
                    <Lock size={15} />
                    <span>Upload Screenshot to Proceed</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Submit Deposit Request (₹{amount})</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                <Lock size={12} className="text-emerald-500" />
                <span>Bank-grade 256-bit encrypted transaction audit</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
