"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  MessageCircle,
  CheckCircle,
  XCircle,
  QrCode,
  Smartphone,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { Button, Input, Card, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

export default function AdminWhatsAppPage() {
  const [status, setStatus] = useState({
    is_connected: false,
    qr_code: null,
    linked_phone: null,
    admin_phone: "919064244204",
  });
  const [adminPhone, setAdminPhone] = useState("919064244204");
  const [testPhone, setTestPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const { addToast } = useToast();

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/device");
      const data = await res.json();
      if (res.ok) {
        setStatus(data);
        if (data.admin_phone) setAdminPhone(data.admin_phone);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!polling && !status.qr_code) return;
    const interval = setInterval(fetchStatus, 2500);
    return () => clearInterval(interval);
  }, [polling, status.qr_code, fetchStatus]);

  const handleConnect = async () => {
    setLoading(true);
    setPolling(true);
    try {
      const res = await fetch("/api/whatsapp/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Connection failed");
      setStatus(data);
      addToast("Scan the QR code with your WhatsApp app");
    } catch (err) {
      addToast(err.message, "error");
      setPolling(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect WhatsApp? You will need to scan QR again.")) return;
    setLoading(true);
    try {
      await fetch("/api/whatsapp/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      setPolling(false);
      await fetchStatus();
      addToast("WhatsApp disconnected", "info");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdminPhone = async () => {
    await fetch("/api/whatsapp/device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_admin_phone", admin_phone: adminPhone }),
    });
    addToast("Admin phone saved");
    fetchStatus();
  };

  const handleTest = async () => {
    if (!testPhone) {
      addToast("Enter a test phone number", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", phone: testPhone }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      addToast("Test message sent from your WhatsApp!");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status.is_connected) setPolling(false);
  }, [status.is_connected]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
        WhatsApp — Link Your Number
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Scan QR with your phone. Messages send from <strong>your WhatsApp number</strong> when
        customers register or place orders.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg">Your WhatsApp</h2>
                <div className="flex items-center gap-2 mt-1">
                  {status.is_connected ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <Badge variant="success">Linked</Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-400" />
                      <Badge variant="slate">Not linked</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button onClick={fetchStatus} className="p-2 text-slate-400 hover:text-sky-600" aria-label="Refresh">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          {status.is_connected && status.linked_phone && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100">
              <p className="text-sm text-green-800 font-medium flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Linked: +{status.linked_phone}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Customers will receive messages from this number
              </p>
            </div>
          )}

          {status.qr_code && !status.is_connected && (
            <div className="mb-6 text-center">
              <p className="text-sm font-medium text-slate-700 mb-3 flex items-center justify-center gap-2">
                <QrCode className="h-4 w-4" />
                Scan with WhatsApp on your phone
              </p>
              <div className="inline-block p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Image
                  src={status.qr_code}
                  alt="WhatsApp QR code"
                  width={220}
                  height={220}
                  className="mx-auto"
                  unoptimized
                />
              </div>
              <p className="text-xs text-slate-500 mt-3">
                WhatsApp → Settings → Linked devices → Link a device
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {!status.is_connected ? (
              <Button onClick={handleConnect} loading={loading} className="w-full">
                <QrCode className="h-4 w-4" />
                {status.qr_code ? "Waiting for scan..." : "Link WhatsApp (Show QR)"}
              </Button>
            ) : (
              <Button variant="danger" onClick={handleDisconnect} loading={loading} className="w-full">
                <LogOut className="h-4 w-4" />
                Disconnect WhatsApp
              </Button>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display font-semibold text-lg mb-4">Settings</h2>
            <div className="space-y-4">
              <Input
                label="Admin phone (order alerts to you)"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="919064244204"
              />
              <Button variant="secondary" onClick={handleSaveAdminPhone} className="w-full">
                Save admin phone
              </Button>
              <Input
                label="Test phone"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="Customer number to test"
              />
              <Button onClick={handleTest} loading={loading} disabled={!status.is_connected} className="w-full">
                Send test message
              </Button>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-semibold text-lg mb-4">Auto messages</h2>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                <p className="font-medium text-sky-800">Welcome (new account)</p>
                <p className="text-sky-600 mt-1">Sent to customer phone on registration</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                <p className="font-medium text-green-800">Order confirmation</p>
                <p className="text-green-600 mt-1">Sent to customer when order is placed</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="font-medium text-amber-800">Admin alert</p>
                <p className="text-amber-600 mt-1">Sent to admin phone ({adminPhone}) on new orders</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-semibold text-lg mb-2">Important</h2>
            <ul className="text-xs text-slate-500 space-y-2 list-disc list-inside">
              <li>Keep the server running while linked (<code className="text-sky-600">npm run dev</code> locally)</li>
              <li>On Vercel, run the app on a VPS/Railway for 24/7 WhatsApp (serverless cannot stay connected)</li>
              <li>Uses WhatsApp Linked Devices — same as WhatsApp Web on your phone</li>
              <li>Do not unlink this device from your phone while the store is active</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
