'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  CarFront, Building2, Plus, Search, Edit, Trash2,
  CalendarCheck, Check, X, Clock, Hotel, TreePine, Package, ChevronDown, ChevronUp, Eye, Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { useSupabaseAdmin } from '@/hooks/useSupabaseAdmin';
import { Car, Apartment, CarReservation, Hotel as HotelType, Villa } from '@/types/supabase';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';

const CAR_TYPES = ['Sedan', 'SUV', 'Luxury Sedan', 'Luxury SUV', 'Sports Car', 'Electric'];
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Studio', 'Penthouse', 'Family Room'];
const CITIES = ['Sarajevo', 'Mostar', 'Konjic', 'Travnik', 'Jajce', 'Bihac', 'Vlasic', 'Bugojno', 'Donji Vakuf'];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    contacted: 'bg-blue-100 text-blue-800 border-blue-200',
    closed: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className="h-3 w-3" />,
    confirmed: <Check className="h-3 w-3" />,
    cancelled: <X className="h-3 w-3" />,
    contacted: <Check className="h-3 w-3" />,
    closed: <X className="h-3 w-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}


export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get('tab') || 'cars';

  const handleTabChange = (value: string) => {
    router.push(`/admin?tab=${value}`);
  };

  const {
    cars, apartments, hotels, villas, reservations,
    addCar, addApartment, addHotel, addVilla,
    updateCar, updateApartment, updateHotel, updateVilla,
    deleteCar, deleteApartment, deleteHotel, deleteVilla,
    updateReservationStatus, createReservation,
  } = useSupabaseAdmin();

  // ── Accommodation reservations state ──
  const [accReservations, setAccReservations] = useState<any[]>([]);
  const fetchAccReservations = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/accommodation-reservations');
      if (res.ok) setAccReservations(await res.json());
    } catch {}
  }, []);
  React.useEffect(() => { fetchAccReservations(); }, [fetchAccReservations]);

  const updateAccReservationStatus = async (id: number, status: string, price?: string, paymentOptions?: ('full' | 'deposit')[]) => {
    try {
      const body: any = { status };
      if (price) body.price = price;
      if (paymentOptions && paymentOptions.length > 0) body.payment_options = paymentOptions;
      const res = await fetch(`/api/admin/accommodation-reservations/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Reservation ${status}`);
      fetchAccReservations();
    } catch (err: any) { toast.error('Error updating reservation', { description: err.message }); }
  };

  // ── Approve dialog state ──
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [approvingType, setApprovingType] = useState<'car' | 'accommodation'>('car');
  const [approvePrice, setApprovePrice] = useState('');
  const [paymentOptions, setPaymentOptions] = useState({ full: true, deposit: false });

  const togglePaymentOption = (opt: 'full' | 'deposit') => {
    setPaymentOptions(prev => ({ ...prev, [opt]: !prev[opt] }));
  };

  const openApproveDialog = (id: number, type: 'car' | 'accommodation') => {
    setApprovingId(id);
    setApprovingType(type);
    setApprovePrice('');
    setPaymentOptions({ full: true, deposit: false });
  };

  const handleApproveConfirm = async () => {
    if (approvingId === null) return;
    const selectedOptions = (Object.keys(paymentOptions) as ('full' | 'deposit')[]).filter(k => paymentOptions[k]);
    if (approvingType === 'car') {
      await updateReservationStatus(approvingId, 'confirmed', undefined, approvePrice || undefined, selectedOptions);
    } else {
      await updateAccReservationStatus(approvingId, 'confirmed', approvePrice || undefined, selectedOptions);
    }
    setApprovingId(null);
    setApprovePrice('');
    setPaymentOptions({ full: true, deposit: false });
  };

  const basePrice = parseFloat(approvePrice) || 0;
  const fullAmount = (basePrice * 0.95).toFixed(2);
  const depositAmount = (basePrice * 0.10).toFixed(2);

  // ── Car state ──
  const emptyCar: Omit<Car, 'id'> = { name: '', image_url: '', images: [], price_per_day: 0, type: 'Sedan', seats: 5, transmission: 'Automatic', features: [], is_active: true };
  const [newCar, setNewCar] = useState(emptyCar);
  const [carImages, setCarImages] = useState<string[]>([]);
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [showCarForm, setShowCarForm] = useState(false);
  const [carSearch, setCarSearch] = useState('');
  const [carFeaturesInput, setCarFeaturesInput] = useState('');

  // ── Apartment state ──
  const emptyApt: Omit<Apartment, 'id'> = { address: '', city: '', rooms: 1, size: 0, price: 0, image_url: '' };
  const [newApartment, setNewApartment] = useState(emptyApt);
  const [editingAptId, setEditingAptId] = useState<number | null>(null);
  const [showAptForm, setShowAptForm] = useState(false);
  const [aptSearch, setAptSearch] = useState('');

  // ── Hotel state ──
  const emptyHotel: Omit<HotelType, 'id'> = { name: '', location: '', rating: 0, room_name: '', room_type: 'Standard', description: '', price_single: 0, price_double: 0, price_triple: 0, bathroom: 1, features: [], images: [], availability: true, name_en: '', name_bs: '', name_ar: '', description_en: '', description_bs: '', description_ar: '' };
  const [newHotel, setNewHotel] = useState(emptyHotel);
  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [showHotelForm, setShowHotelForm] = useState(false);
  const [hotelSearch, setHotelSearch] = useState('');
  const [hotelFeaturesInput, setHotelFeaturesInput] = useState('');
  const [hotelImages, setHotelImages] = useState<string[]>([]);

  // ── Villa state ──
  const emptyVilla: Omit<Villa, 'id'> = { name: '', location: '', rating: 0, room_name: '', room_type: 'Standard', description: '', price: 0, bathroom: 1, features: [], images: [], availability: true, name_en: '', name_bs: '', name_ar: '', description_en: '', description_bs: '', description_ar: '' };
  const [newVilla, setNewVilla] = useState(emptyVilla);
  const [editingVillaId, setEditingVillaId] = useState<number | null>(null);
  const [showVillaForm, setShowVillaForm] = useState(false);
  const [villaSearch, setVillaSearch] = useState('');
  const [villaFeaturesInput, setVillaFeaturesInput] = useState('');
  const [villaImages, setVillaImages] = useState<string[]>([]);

  // ── Bundle state ──
  interface AdminBundle { id?: number; title: string; subtitle: string; description: string; duration: number; price_per_person: number; price_per_group: number; max_group_size: number; regions: string[]; tags: string[]; highlights: string[]; includes: string[]; images: string[]; is_active: boolean; }
  const emptyBundle: Omit<AdminBundle, 'id'> = { title: '', subtitle: '', description: '', duration: 1, price_per_person: 0, price_per_group: 0, max_group_size: 8, regions: [], tags: [], highlights: [], includes: [], images: [], is_active: true };
  const [dbBundles, setDbBundles] = useState<AdminBundle[]>([]);
  const [bundleReservations, setBundleReservations] = useState<Record<string, unknown>[]>([]);
  const [customBundleRequests, setCustomBundleRequests] = useState<Record<string, unknown>[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [newBundle, setNewBundle] = useState(emptyBundle);
  const [editingBundleId, setEditingBundleId] = useState<number | null>(null);
  const [showBundleForm, setShowBundleForm] = useState(false);
  const [bundleSearch, setBundleSearch] = useState('');
  const [bundleRegionsInput, setBundleRegionsInput] = useState('');
  const [bundleTagsInput, setBundleTagsInput] = useState('');
  const [bundleHighlightsInput, setBundleHighlightsInput] = useState('');
  const [bundleIncludesInput, setBundleIncludesInput] = useState('');
  const [bundleImages, setBundleImages] = useState<string[]>([]);

  // ── Adventure state ──
  const [bundleSubTab, setBundleSubTab] = useState<'bundles' | 'adventures'>('bundles');
  interface AdminAdventure { id?: number; city: string; title: string; description: string; description_en: string; description_bs: string; description_ar: string; duration: string; price: number; image: string; is_active: boolean; }
  const emptyAdventure: Omit<AdminAdventure, 'id'> = { city: '', title: '', description: '', description_en: '', description_bs: '', description_ar: '', duration: '2 hours', price: 0, image: '', is_active: true };
  const [dbAdventures, setDbAdventures] = useState<AdminAdventure[]>([]);
  const [newAdventure, setNewAdventure] = useState(emptyAdventure);
  const [editingAdventureId, setEditingAdventureId] = useState<number | null>(null);
  const [showAdventureForm, setShowAdventureForm] = useState(false);
  const [adventureSearch, setAdventureSearch] = useState('');

  React.useEffect(() => {
    fetch('/api/admin/bundles').then(r => r.ok ? r.json() : []).then(setDbBundles).catch(() => {});
    fetch('/api/admin/bundle-reservations').then(r => r.ok ? r.json() : []).then(setBundleReservations).catch(() => {});
    fetch('/api/custom-bundle-requests').then(r => r.ok ? r.json() : []).then(setCustomBundleRequests).catch(() => {});
    fetch('/api/admin/adventures').then(r => r.ok ? r.json() : []).then(setDbAdventures).catch(() => {});
  }, []);

  // ── Reservation state ──
  const [showResForm, setShowResForm] = useState(false);
  const [newRes, setNewRes] = useState({ car_id: 0, customer_name: '', customer_email: '', customer_phone: '', start_date: '', end_date: '' });

  const filteredCars = cars.filter(c => c.name.toLowerCase().includes(carSearch.toLowerCase()));
  const filteredApts = apartments.filter(a => a.city.toLowerCase().includes(aptSearch.toLowerCase()) || a.address.toLowerCase().includes(aptSearch.toLowerCase()));
  const filteredHotels = hotels.filter(h => h.name.toLowerCase().includes(hotelSearch.toLowerCase()) || h.location.toLowerCase().includes(hotelSearch.toLowerCase()));
  const filteredVillas = villas.filter(v => v.name.toLowerCase().includes(villaSearch.toLowerCase()) || v.location.toLowerCase().includes(villaSearch.toLowerCase()));

  // ── Car handlers ──
  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const imgs = carImages.length > 0 ? carImages : [];
    await addCar({ ...newCar, images: imgs, image_url: imgs[0] || '', features: carFeaturesInput.split(',').map(f => f.trim()).filter(Boolean) });
    setNewCar(emptyCar); setCarImages([]); setCarFeaturesInput(''); setShowCarForm(false);
  };
  const handleUpdateCar = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const imgs = carImages.length > 0 ? carImages : [];
    await updateCar(id, { ...newCar, images: imgs, image_url: imgs[0] || '', features: carFeaturesInput.split(',').map(f => f.trim()).filter(Boolean) });
    setEditingCarId(null); setNewCar(emptyCar); setCarImages([]); setCarFeaturesInput(''); setShowCarForm(false);
  };
  const handleEditCar = (car: Car) => {
    setNewCar({ name: car.name, image_url: car.image_url, images: car.images || [], price_per_day: car.price_per_day, type: car.type, seats: car.seats, transmission: car.transmission, features: car.features, is_active: car.is_active });
    setCarImages(car.images || (car.image_url ? [car.image_url] : []));
    setCarFeaturesInput(car.features.join(', '));
    setEditingCarId(car.id || null); setShowCarForm(true);
  };

  // ── Apartment handlers ──
  const handleAddApt = async (e: React.FormEvent) => { e.preventDefault(); await addApartment(newApartment); setNewApartment(emptyApt); setShowAptForm(false); };
  const handleUpdateApt = async (e: React.FormEvent, id: number) => { e.preventDefault(); await updateApartment(id, newApartment); setEditingAptId(null); setNewApartment(emptyApt); setShowAptForm(false); };
  const handleEditApt = (a: Apartment) => { setNewApartment({ address: a.address, city: a.city, rooms: a.rooms, size: a.size, price: a.price, image_url: a.image_url }); setEditingAptId(a.id || null); setShowAptForm(true); };

  // ── Hotel handlers ──
  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    await addHotel({ ...newHotel, features: hotelFeaturesInput.split(',').map(f => f.trim()).filter(Boolean), images: hotelImages });
    setNewHotel(emptyHotel); setHotelFeaturesInput(''); setHotelImages([]); setShowHotelForm(false);
  };
  const handleUpdateHotel = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    await updateHotel(id, { ...newHotel, features: hotelFeaturesInput.split(',').map(f => f.trim()).filter(Boolean), images: hotelImages });
    setEditingHotelId(null); setNewHotel(emptyHotel); setHotelFeaturesInput(''); setHotelImages([]); setShowHotelForm(false);
  };
  const handleEditHotel = (h: HotelType) => {
    setNewHotel({ name: h.name, location: h.location, rating: h.rating, room_name: h.room_name, room_type: h.room_type, description: h.description, price_single: h.price_single, price_double: h.price_double, price_triple: h.price_triple, bathroom: h.bathroom, features: h.features, images: h.images, availability: h.availability });
    setHotelFeaturesInput(h.features.join(', '));
    setHotelImages(h.images || []);
    setEditingHotelId(h.id || null); setShowHotelForm(true);
  };

  // ── Villa handlers ──
  const handleAddVilla = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVilla({ ...newVilla, features: villaFeaturesInput.split(',').map(f => f.trim()).filter(Boolean), images: villaImages });
    setNewVilla(emptyVilla); setVillaFeaturesInput(''); setVillaImages([]); setShowVillaForm(false);
  };
  const handleUpdateVilla = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    await updateVilla(id, { ...newVilla, features: villaFeaturesInput.split(',').map(f => f.trim()).filter(Boolean), images: villaImages });
    setEditingVillaId(null); setNewVilla(emptyVilla); setVillaFeaturesInput(''); setVillaImages([]); setShowVillaForm(false);
  };
  const handleEditVilla = (v: Villa) => {
    setNewVilla({ name: v.name, location: v.location, rating: v.rating, room_name: v.room_name, room_type: v.room_type, description: v.description, price: v.price, bathroom: v.bathroom, features: v.features, images: v.images, availability: v.availability });
    setVillaFeaturesInput(v.features.join(', '));
    setVillaImages(v.images || []);
    setEditingVillaId(v.id || null); setShowVillaForm(true);
  };

  // ── Bundle handlers ──
  const parseBundleForm = () => ({
    ...newBundle,
    regions: bundleRegionsInput.split(',').map(s => s.trim()).filter(Boolean),
    tags: bundleTagsInput.split(',').map(s => s.trim()).filter(Boolean),
    highlights: bundleHighlightsInput.split(',').map(s => s.trim()).filter(Boolean),
    includes: bundleIncludesInput.split(',').map(s => s.trim()).filter(Boolean),
    images: bundleImages,
  });
  const resetBundleForm = () => { setNewBundle(emptyBundle); setBundleRegionsInput(''); setBundleTagsInput(''); setBundleHighlightsInput(''); setBundleIncludesInput(''); setBundleImages([]); setEditingBundleId(null); setShowBundleForm(false); };
  const handleAddBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/bundles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parseBundleForm()) });
    if (res.ok) { const b = await res.json(); setDbBundles(prev => [b, ...prev]); resetBundleForm(); }
  };
  const handleUpdateBundle = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/bundles/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parseBundleForm()) });
    if (res.ok) { const b = await res.json(); setDbBundles(prev => prev.map(x => x.id === id ? b : x)); resetBundleForm(); }
  };
  const handleEditBundle = (b: AdminBundle) => {
    setNewBundle({ title: b.title, subtitle: b.subtitle || '', description: b.description || '', duration: b.duration, price_per_person: b.price_per_person, price_per_group: b.price_per_group || 0, max_group_size: b.max_group_size || 8, regions: b.regions || [], tags: b.tags || [], highlights: b.highlights || [], includes: b.includes || [], images: b.images || [], is_active: b.is_active });
    setBundleRegionsInput((b.regions || []).join(', ')); setBundleTagsInput((b.tags || []).join(', '));
    setBundleHighlightsInput((b.highlights || []).join(', ')); setBundleIncludesInput((b.includes || []).join(', '));
    setBundleImages(b.images || []); setEditingBundleId(b.id || null); setShowBundleForm(true);
  };
  const handleDeleteBundle = async (id: number) => {
    if (!confirm('Delete this bundle?')) return;
    const res = await fetch(`/api/admin/bundles/${id}`, { method: 'DELETE' });
    if (res.ok) setDbBundles(prev => prev.filter(b => b.id !== id));
  };

  // ── Adventure handlers ──
  const resetAdventureForm = () => { setNewAdventure(emptyAdventure); setEditingAdventureId(null); setShowAdventureForm(false); };
  const handleAddAdventure = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/adventures', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdventure) });
    if (res.ok) { const a = await res.json(); setDbAdventures(prev => [a, ...prev]); resetAdventureForm(); }
  };
  const handleUpdateAdventure = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/adventures/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdventure) });
    if (res.ok) { const a = await res.json(); setDbAdventures(prev => prev.map(x => x.id === id ? a : x)); resetAdventureForm(); }
  };
  const handleEditAdventure = (a: AdminAdventure) => {
    setNewAdventure({ city: a.city, title: a.title, description: a.description || '', description_en: a.description_en || '', description_bs: a.description_bs || '', description_ar: a.description_ar || '', duration: a.duration, price: a.price, image: a.image || '', is_active: a.is_active });
    setEditingAdventureId(a.id || null); setShowAdventureForm(true);
  };
  const handleDeleteAdventure = async (id: number) => {
    if (!confirm('Delete this adventure?')) return;
    const res = await fetch(`/api/admin/adventures/${id}`, { method: 'DELETE' });
    if (res.ok) setDbAdventures(prev => prev.filter(a => a.id !== id));
  };

  const handleBundleResStatus = async (id: number, status: string) => {
    const res = await fetch('/api/admin/bundle-reservations', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (res.ok) { const updated = await res.json(); setBundleReservations(prev => prev.map(r => (r as any).id === id ? updated : r)); }
  };
  const handleCustomReqStatus = async (id: number, status: string) => {
    const res = await fetch('/api/custom-bundle-requests', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (res.ok) { const updated = await res.json(); setCustomBundleRequests(prev => prev.map(r => (r as any).id === id ? updated : r)); }
  };

  // ── Reservation handler ──
  const handleCreateRes = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReservation({ ...newRes, status: 'confirmed' } as any);
    setNewRes({ car_id: 0, customer_name: '', customer_email: '', customer_phone: '', start_date: '', end_date: '' });
    setShowResForm(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage cars, apartments, hotels, villas, and reservations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="border-border/50 bg-card shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><CarFront className="h-6 w-6 text-primary" /></div>
            <div><p className="text-2xl font-bold">{cars.length}</p><p className="text-sm text-muted-foreground">Cars</p></div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><Building2 className="h-6 w-6 text-primary" /></div>
            <div><p className="text-2xl font-bold">{apartments.length}</p><p className="text-sm text-muted-foreground">Apartments</p></div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><Hotel className="h-6 w-6 text-primary" /></div>
            <div><p className="text-2xl font-bold">{hotels.length}</p><p className="text-sm text-muted-foreground">Hotels</p></div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><TreePine className="h-6 w-6 text-primary" /></div>
            <div><p className="text-2xl font-bold">{villas.length}</p><p className="text-sm text-muted-foreground">Villas</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-card border border-border/50 p-1 h-auto mb-6 flex-wrap gap-1">
          <TabsTrigger value="cars" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md">
            <CarFront className="w-4 h-4" /> Cars
          </TabsTrigger>
          <TabsTrigger value="apartments" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md">
            <Building2 className="w-4 h-4" /> Apartments
          </TabsTrigger>
          <TabsTrigger value="hotels" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md">
            <Hotel className="w-4 h-4" /> Hotels
          </TabsTrigger>
          <TabsTrigger value="villas" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md">
            <TreePine className="w-4 h-4" /> Villas
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md">
            <CalendarCheck className="w-4 h-4" /> Reservations
            {reservations.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-1 h-5 w-5 rounded-full bg-yellow-500 text-white text-[10px] font-bold flex items-center justify-center">
                {reservations.filter(r => r.status === 'pending').length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="bundles" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-md">
            <Package className="w-4 h-4" /> Bundles
          </TabsTrigger>
        </TabsList>

        {/* ── CARS TAB ── */}
        <TabsContent value="cars">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search cars..." className="pl-9 bg-card border-border/50 h-10" value={carSearch} onChange={e => setCarSearch(e.target.value)} />
            </div>
            <Button onClick={() => { setEditingCarId(null); setNewCar(emptyCar); setCarImages([]); setCarFeaturesInput(''); setShowCarForm(!showCarForm); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Car
            </Button>
          </div>

          {showCarForm && (
            <Card className="mb-6 border-primary/20 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{editingCarId ? 'Edit Car' : 'Add New Car'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={e => editingCarId ? handleUpdateCar(e, editingCarId) : handleAddCar(e)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input required value={newCar.name} onChange={e => setNewCar({...newCar, name: e.target.value})} placeholder="e.g. Mercedes S-Class" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={newCar.type} onValueChange={v => setNewCar({...newCar, type: v})}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>{CAR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price / Day ($)</Label>
                      <Input type="number" required min={0} value={newCar.price_per_day} onChange={e => setNewCar({...newCar, price_per_day: parseInt(e.target.value) || 0})} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label>Seats</Label>
                      <Input type="number" required min={1} max={12} value={newCar.seats} onChange={e => setNewCar({...newCar, seats: parseInt(e.target.value) || 5})} className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <Label>Transmission</Label>
                      <Select value={newCar.transmission} onValueChange={v => setNewCar({...newCar, transmission: v})}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Features (comma-separated)</Label>
                      <Input value={carFeaturesInput} onChange={e => setCarFeaturesInput(e.target.value)} placeholder="Leather Seats, Navigation, Premium Sound" className="bg-background" />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Switch checked={newCar.is_active ?? true} onCheckedChange={v => setNewCar({...newCar, is_active: v})} />
                      <Label>Active (visible on site)</Label>
                    </div>
                  </div>
                  <MultiImageUpload
                    images={carImages}
                    onChange={setCarImages}
                    bucket="cars"
                    label="Images (first = main, displayed on card)"
                  />
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={() => { setShowCarForm(false); setEditingCarId(null); }}>Cancel</Button>
                    <Button type="submit">{editingCarId ? 'Update' : 'Add Car'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-foreground/[0.03] border-b border-border/50">
                    <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Name</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Type</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Seats</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Price/Day</th>
                    <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                    <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredCars.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center"><CarFront className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No cars found</p></td></tr>
                  ) : filteredCars.map(car => (
                    <tr key={car.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium">{car.name}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{car.type}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{car.seats}</td>
                      <td className="py-3.5 px-4 font-semibold text-primary">${car.price_per_day}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${car.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {car.is_active ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary" onClick={() => handleEditCar(car)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteCar(car.id || 0)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ── APARTMENTS TAB ── */}
        <TabsContent value="apartments">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search apartments..." className="pl-9 bg-card border-border/50 h-10" value={aptSearch} onChange={e => setAptSearch(e.target.value)} />
            </div>
            <Button onClick={() => { setEditingAptId(null); setNewApartment(emptyApt); setShowAptForm(!showAptForm); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Apartment
            </Button>
          </div>

          {showAptForm && (
            <Card className="mb-6 border-primary/20 shadow-md">
              <CardHeader className="pb-4"><CardTitle className="text-lg">{editingAptId ? 'Edit Apartment' : 'Add New Apartment'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={e => editingAptId ? handleUpdateApt(e, editingAptId) : handleAddApt(e)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Address</Label><Input required value={newApartment.address} onChange={e => setNewApartment({...newApartment, address: e.target.value})} className="bg-background" /></div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Select value={newApartment.city || ''} onValueChange={v => setNewApartment({...newApartment, city: v})}>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Select city" /></SelectTrigger>
                        <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Rooms</Label><Input type="number" required min={1} value={newApartment.rooms} onChange={e => setNewApartment({...newApartment, rooms: parseInt(e.target.value)})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Size (m²)</Label><Input type="number" required min={0} value={newApartment.size} onChange={e => setNewApartment({...newApartment, size: parseInt(e.target.value)})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Price ($)</Label><Input type="number" required min={0} value={newApartment.price} onChange={e => setNewApartment({...newApartment, price: parseInt(e.target.value)})} className="bg-background" /></div>
                  </div>
                  <MultiImageUpload
                    images={newApartment.image_url ? [newApartment.image_url] : []}
                    onChange={imgs => setNewApartment(prev => ({ ...prev, image_url: imgs[0] || '' }))}
                    bucket="apartments"
                    label="Image (first = displayed on card)"
                  />
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={() => { setShowAptForm(false); setEditingAptId(null); }}>Cancel</Button>
                    <Button type="submit">{editingAptId ? 'Update' : 'Add Apartment'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Address</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">City</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Rooms</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Size</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Price</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {filteredApts.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center"><Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No apartments found</p></td></tr>
                  ) : filteredApts.map(apt => (
                    <tr key={apt.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium">{apt.address}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{apt.city}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{apt.rooms}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{apt.size} m²</td>
                      <td className="py-3.5 px-4 font-semibold text-primary">${apt.price.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary" onClick={() => handleEditApt(apt)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteApartment(apt.id || 0)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ── HOTELS TAB ── */}
        <TabsContent value="hotels">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search hotels..." className="pl-9 bg-card border-border/50 h-10" value={hotelSearch} onChange={e => setHotelSearch(e.target.value)} />
            </div>
            <Button onClick={() => { setEditingHotelId(null); setNewHotel(emptyHotel); setHotelFeaturesInput(''); setHotelImages([]); setShowHotelForm(!showHotelForm); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Hotel
            </Button>
          </div>

          {showHotelForm && (
            <Card className="mb-6 border-primary/20 shadow-md">
              <CardHeader className="pb-4"><CardTitle className="text-lg">{editingHotelId ? 'Edit Hotel' : 'Add New Hotel'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={e => editingHotelId ? handleUpdateHotel(e, editingHotelId) : handleAddHotel(e)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Name (English)</Label><Input required value={newHotel.name_en || ''} onChange={e => setNewHotel({...newHotel, name_en: e.target.value, name: e.target.value})} placeholder="e.g. Sarajevo Hills" className="bg-background" /></div>
                    <div className="space-y-2"><Label>Name (Bosnian / BS)</Label><Input value={newHotel.name_bs || ''} onChange={e => setNewHotel({...newHotel, name_bs: e.target.value})} placeholder="e.g. Sarajevo Hills" className="bg-background" /></div>
                    <div className="space-y-2"><Label>Name (Arabic / AR)</Label><Input value={newHotel.name_ar || ''} onChange={e => setNewHotel({...newHotel, name_ar: e.target.value})} placeholder="e.g. سراييفو هيلز" className="bg-background" dir="rtl" /></div>
                    <div className="space-y-2">
                      <Label>Location / City</Label>
                      <Select value={newHotel.location || ''} onValueChange={v => setNewHotel({...newHotel, location: v})}>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Select city" /></SelectTrigger>
                        <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Rating (0–5)</Label><Input type="number" min={0} max={5} step={0.1} value={newHotel.rating} onChange={e => setNewHotel({...newHotel, rating: parseFloat(e.target.value) || 0})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Room Name</Label><Input required value={newHotel.room_name} onChange={e => setNewHotel({...newHotel, room_name: e.target.value})} placeholder="e.g. Deluxe King Room" className="bg-background" /></div>
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select value={newHotel.room_type} onValueChange={v => setNewHotel({...newHotel, room_type: v})}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>{ROOM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Bathrooms</Label><Input type="number" min={1} value={newHotel.bathroom} onChange={e => setNewHotel({...newHotel, bathroom: parseInt(e.target.value) || 1})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Price Single ($)</Label><Input type="number" required min={0} value={newHotel.price_single} onChange={e => setNewHotel({...newHotel, price_single: parseFloat(e.target.value) || 0})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Price Double ($)</Label><Input type="number" required min={0} value={newHotel.price_double} onChange={e => setNewHotel({...newHotel, price_double: parseFloat(e.target.value) || 0})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Price Triple ($)</Label><Input type="number" required min={0} value={newHotel.price_triple} onChange={e => setNewHotel({...newHotel, price_triple: parseFloat(e.target.value) || 0})} className="bg-background" /></div>
                    <div className="space-y-2 lg:col-span-3">
                      <Label>Description (English)</Label>
                      <Textarea value={newHotel.description_en || ''} onChange={e => setNewHotel({...newHotel, description_en: e.target.value, description: e.target.value})} placeholder="Brief description in English..." className="bg-background resize-none" rows={2} />
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                      <Label>Description (Bosnian / BS)</Label>
                      <Textarea value={newHotel.description_bs || ''} onChange={e => setNewHotel({...newHotel, description_bs: e.target.value})} placeholder="Kratak opis na bosanskom..." className="bg-background resize-none" rows={2} />
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                      <Label>Description (Arabic / AR)</Label>
                      <Textarea value={newHotel.description_ar || ''} onChange={e => setNewHotel({...newHotel, description_ar: e.target.value})} placeholder="وصف مختصر بالعربية..." className="bg-background resize-none" rows={2} dir="rtl" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Features (comma-separated)</Label>
                      <Input value={hotelFeaturesInput} onChange={e => setHotelFeaturesInput(e.target.value)} placeholder="wifi, pool, parking, breakfast" className="bg-background" />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Switch checked={newHotel.availability} onCheckedChange={v => setNewHotel({...newHotel, availability: v})} />
                      <Label>Available</Label>
                    </div>
                  </div>
                  <MultiImageUpload images={hotelImages} onChange={setHotelImages} bucket="hotels" label="Images (first = main)" />
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={() => { setShowHotelForm(false); setEditingHotelId(null); }}>Cancel</Button>
                    <Button type="submit">{editingHotelId ? 'Update' : 'Add Hotel'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Name</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Location</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Room Type</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Single / Double / Triple</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {filteredHotels.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center"><Hotel className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No hotels found</p></td></tr>
                  ) : filteredHotels.map(h => (
                    <tr key={h.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium">{h.name}<div className="text-xs text-muted-foreground">{h.room_name}</div></td>
                      <td className="py-3.5 px-4 text-foreground/80">{h.location}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{h.room_type}</td>
                      <td className="py-3.5 px-4 text-foreground/80 text-xs">${h.price_single} / ${h.price_double} / ${h.price_triple}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${h.availability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {h.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary" onClick={() => handleEditHotel(h)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteHotel(h.id || 0)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ── VILLAS TAB ── */}
        <TabsContent value="villas">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search villas..." className="pl-9 bg-card border-border/50 h-10" value={villaSearch} onChange={e => setVillaSearch(e.target.value)} />
            </div>
            <Button onClick={() => { setEditingVillaId(null); setNewVilla(emptyVilla); setVillaFeaturesInput(''); setVillaImages([]); setShowVillaForm(!showVillaForm); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Villa
            </Button>
          </div>

          {showVillaForm && (
            <Card className="mb-6 border-primary/20 shadow-md">
              <CardHeader className="pb-4"><CardTitle className="text-lg">{editingVillaId ? 'Edit Villa' : 'Add New Villa'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={e => editingVillaId ? handleUpdateVilla(e, editingVillaId) : handleAddVilla(e)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Name (English)</Label><Input required value={newVilla.name_en || ''} onChange={e => setNewVilla({...newVilla, name_en: e.target.value, name: e.target.value})} placeholder="e.g. Sarajevo Orange Villa" className="bg-background" /></div>
                    <div className="space-y-2"><Label>Name (Bosnian / BS)</Label><Input value={newVilla.name_bs || ''} onChange={e => setNewVilla({...newVilla, name_bs: e.target.value})} placeholder="e.g. Sarajevska narančasta vila" className="bg-background" /></div>
                    <div className="space-y-2"><Label>Name (Arabic / AR)</Label><Input value={newVilla.name_ar || ''} onChange={e => setNewVilla({...newVilla, name_ar: e.target.value})} placeholder="e.g. فيلا سراييفو البرتقالية" className="bg-background" dir="rtl" /></div>
                    <div className="space-y-2">
                      <Label>Location / City</Label>
                      <Select value={newVilla.location || ''} onValueChange={v => setNewVilla({...newVilla, location: v})}>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Select city" /></SelectTrigger>
                        <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Rating (0–5)</Label><Input type="number" min={0} max={5} step={0.1} value={newVilla.rating} onChange={e => setNewVilla({...newVilla, rating: parseFloat(e.target.value) || 0})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Room Name</Label><Input required value={newVilla.room_name} onChange={e => setNewVilla({...newVilla, room_name: e.target.value})} placeholder="e.g. Master Suite" className="bg-background" /></div>
                    <div className="space-y-2">
                      <Label>Room Type</Label>
                      <Select value={newVilla.room_type} onValueChange={v => setNewVilla({...newVilla, room_type: v})}>
                        <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent>{ROOM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Bathrooms</Label><Input type="number" min={1} value={newVilla.bathroom} onChange={e => setNewVilla({...newVilla, bathroom: parseInt(e.target.value) || 1})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Price / Night ($)</Label><Input type="number" required min={0} value={newVilla.price} onChange={e => setNewVilla({...newVilla, price: parseFloat(e.target.value) || 0})} className="bg-background" /></div>
                    <div className="space-y-2 lg:col-span-3">
                      <Label>Description (English)</Label>
                      <Textarea value={newVilla.description_en || ''} onChange={e => setNewVilla({...newVilla, description_en: e.target.value, description: e.target.value})} placeholder="Brief description in English..." className="bg-background resize-none" rows={2} />
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                      <Label>Description (Bosnian / BS)</Label>
                      <Textarea value={newVilla.description_bs || ''} onChange={e => setNewVilla({...newVilla, description_bs: e.target.value})} placeholder="Kratak opis na bosanskom..." className="bg-background resize-none" rows={2} />
                    </div>
                    <div className="space-y-2 lg:col-span-3">
                      <Label>Description (Arabic / AR)</Label>
                      <Textarea value={newVilla.description_ar || ''} onChange={e => setNewVilla({...newVilla, description_ar: e.target.value})} placeholder="وصف مختصر بالعربية..." className="bg-background resize-none" rows={2} dir="rtl" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Features (comma-separated)</Label>
                      <Input value={villaFeaturesInput} onChange={e => setVillaFeaturesInput(e.target.value)} placeholder="pool, wifi, kitchen, forest view" className="bg-background" />
                    </div>
                    <div className="flex items-center gap-3 pt-6">
                      <Switch checked={newVilla.availability} onCheckedChange={v => setNewVilla({...newVilla, availability: v})} />
                      <Label>Available</Label>
                    </div>
                  </div>
                  <MultiImageUpload images={villaImages} onChange={setVillaImages} bucket="villas" label="Images (first = main)" />
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={() => { setShowVillaForm(false); setEditingVillaId(null); }}>Cancel</Button>
                    <Button type="submit">{editingVillaId ? 'Update' : 'Add Villa'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Name</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Location</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Room Type</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Price/Night</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {filteredVillas.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center"><TreePine className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No villas found</p></td></tr>
                  ) : filteredVillas.map(v => (
                    <tr key={v.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium">{v.name}<div className="text-xs text-muted-foreground">{v.room_name}</div></td>
                      <td className="py-3.5 px-4 text-foreground/80">{v.location}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{v.room_type}</td>
                      <td className="py-3.5 px-4 font-semibold text-primary">${v.price.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v.availability ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {v.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary" onClick={() => handleEditVilla(v)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteVilla(v.id || 0)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ── RESERVATIONS TAB ── */}
        <TabsContent value="reservations">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h2 className="text-lg font-semibold">Car Reservations</h2>
              <p className="text-sm text-muted-foreground">Approve, reject, or manually create bookings.</p>
            </div>
            <Button onClick={() => setShowResForm(!showResForm)}>
              <Plus className="mr-2 h-4 w-4" /> Manual Booking
            </Button>
          </div>

          {showResForm && (
            <Card className="mb-6 border-primary/20 shadow-md">
              <CardHeader className="pb-4"><CardTitle className="text-lg">Manual Booking</CardTitle><CardDescription>This will be created as confirmed immediately.</CardDescription></CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRes} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Car</Label>
                      <Select value={String(newRes.car_id || '')} onValueChange={v => setNewRes({...newRes, car_id: parseInt(v)})}>
                        <SelectTrigger className="bg-background"><SelectValue placeholder="Select car" /></SelectTrigger>
                        <SelectContent>{cars.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Customer Name</Label><Input required value={newRes.customer_name} onChange={e => setNewRes({...newRes, customer_name: e.target.value})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" required value={newRes.customer_email} onChange={e => setNewRes({...newRes, customer_email: e.target.value})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Phone</Label><Input value={newRes.customer_phone} onChange={e => setNewRes({...newRes, customer_phone: e.target.value})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Start Date</Label><Input type="date" required value={newRes.start_date} onChange={e => setNewRes({...newRes, start_date: e.target.value})} className="bg-background" /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input type="date" required value={newRes.end_date} onChange={e => setNewRes({...newRes, end_date: e.target.value})} className="bg-background" /></div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={() => setShowResForm(false)}>Cancel</Button>
                    <Button type="submit">Create Booking</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Car</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Customer</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Dates</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {reservations.length === 0 ? (
                    <tr><td colSpan={5} className="py-16 text-center"><CalendarCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No reservations yet</p></td></tr>
                  ) : reservations.map(r => (
                    <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium">{(r as any).car?.name || `Car #${r.car_id}`}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-foreground">{r.customer_name}</div>
                        <div className="text-xs text-muted-foreground">{r.customer_email}</div>
                      </td>
                      <td className="py-3.5 px-4 text-foreground/80 text-xs">{r.start_date} &rarr; {r.end_date}</td>
                      <td className="py-3.5 px-4"><StatusBadge status={r.status} /></td>
                      <td className="py-3.5 px-4 text-right">
                        {r.status === 'pending' ? (
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => openApproveDialog(r.id!, 'car')}>
                              <Check className="h-3 w-3 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-3 text-xs hover:bg-destructive/10 hover:text-destructive" onClick={() => updateReservationStatus(r.id!, 'cancelled')}>
                              <X className="h-3 w-3 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ── BUNDLES TAB ── */}
        <TabsContent value="bundles">
          {/* Subtab navigation */}
          <div className="flex gap-2 mb-6 border-b border-border/50">
            <button
              type="button"
              onClick={() => setBundleSubTab('bundles')}
              className={cn('px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors', bundleSubTab === 'bundles' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              <Package className="h-4 w-4 inline mr-1.5" />Bundles
            </button>
            <button
              type="button"
              onClick={() => setBundleSubTab('adventures')}
              className={cn('px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors', bundleSubTab === 'adventures' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              <Compass className="h-4 w-4 inline mr-1.5" />Adventures
            </button>
          </div>

          {bundleSubTab === 'bundles' && (<>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bundles..." className="pl-9 bg-card border-border/50 h-10" value={bundleSearch} onChange={e => setBundleSearch(e.target.value)} />
            </div>
            <Button onClick={() => { resetBundleForm(); setShowBundleForm(true); }} className="flex items-center gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Add Bundle
            </Button>
          </div>

          {showBundleForm && (
            <Card className="mb-6 border-border/50 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base">{editingBundleId ? 'Edit Bundle' : 'New Bundle'}</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={e => editingBundleId ? handleUpdateBundle(e, editingBundleId) : handleAddBundle(e)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Title *</Label><Input required value={newBundle.title} onChange={e => setNewBundle(p => ({ ...p, title: e.target.value }))} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Subtitle</Label><Input value={newBundle.subtitle} onChange={e => setNewBundle(p => ({ ...p, subtitle: e.target.value }))} className="bg-background" /></div>
                  </div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={newBundle.description} onChange={e => setNewBundle(p => ({ ...p, description: e.target.value }))} className="bg-background" rows={3} /></div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-2"><Label>Duration (days)</Label><Input type="number" min={1} value={newBundle.duration} onChange={e => setNewBundle(p => ({ ...p, duration: parseInt(e.target.value) || 1 }))} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Price/Person (€)</Label><Input type="number" min={0} value={newBundle.price_per_person} onChange={e => setNewBundle(p => ({ ...p, price_per_person: parseFloat(e.target.value) || 0 }))} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Group Price (€)</Label><Input type="number" min={0} value={newBundle.price_per_group} onChange={e => setNewBundle(p => ({ ...p, price_per_group: parseFloat(e.target.value) || 0 }))} className="bg-background" /></div>
                    <div className="space-y-2"><Label>Max Group Size</Label><Input type="number" min={1} value={newBundle.max_group_size} onChange={e => setNewBundle(p => ({ ...p, max_group_size: parseInt(e.target.value) || 8 }))} className="bg-background" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Regions (comma-separated)</Label><Input value={bundleRegionsInput} onChange={e => setBundleRegionsInput(e.target.value)} placeholder="Sarajevo, Mostar" className="bg-background" /></div>
                    <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={bundleTagsInput} onChange={e => setBundleTagsInput(e.target.value)} placeholder="Culture, Nature, Adventure" className="bg-background" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Highlights (comma-separated)</Label><Input value={bundleHighlightsInput} onChange={e => setBundleHighlightsInput(e.target.value)} placeholder="Old Town tour, Mountain hike" className="bg-background" /></div>
                    <div className="space-y-2"><Label>Includes (comma-separated)</Label><Input value={bundleIncludesInput} onChange={e => setBundleIncludesInput(e.target.value)} placeholder="Transport, Guide, Lunch" className="bg-background" /></div>
                  </div>
                  <MultiImageUpload images={bundleImages} onChange={setBundleImages} bucket="bundles" label="Images (first = main)" />
                  <div className="flex items-center gap-3">
                    <Switch checked={newBundle.is_active} onCheckedChange={v => setNewBundle(p => ({ ...p, is_active: v }))} />
                    <Label>Active (visible to users)</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <Button type="button" variant="ghost" onClick={resetBundleForm}>Cancel</Button>
                    <Button type="submit">{editingBundleId ? 'Update Bundle' : 'Create Bundle'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card className="border-border/50 shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Title</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Duration</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Price/Person</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Regions</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {dbBundles.filter(b => b.title.toLowerCase().includes(bundleSearch.toLowerCase())).length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center"><Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No bundles yet</p></td></tr>
                  ) : dbBundles.filter(b => b.title.toLowerCase().includes(bundleSearch.toLowerCase())).map(b => (
                    <tr key={b.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4"><div className="font-medium">{b.title}</div><div className="text-xs text-muted-foreground">{b.subtitle}</div></td>
                      <td className="py-3.5 px-4 text-foreground/80">{b.duration} day{b.duration !== 1 ? 's' : ''}</td>
                      <td className="py-3.5 px-4 font-medium">€{b.price_per_person}</td>
                      <td className="py-3.5 px-4 text-foreground/80 text-xs">{(b.regions || []).join(', ') || '—'}</td>
                      <td className="py-3.5 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${b.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{b.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleEditBundle(b)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteBundle(b.id!)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bundle Reservations */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Bundle Reservations</h2>
            <p className="text-sm text-muted-foreground">Booking requests for bundle packages</p>
          </div>
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Bundle</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Customer</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Dates</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Persons</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {bundleReservations.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center"><CalendarCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No bundle reservations yet</p></td></tr>
                  ) : bundleReservations.map((r: any) => (
                    <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-medium">{r.bundle_title || `Bundle #${r.bundle_id}`}</td>
                      <td className="py-3.5 px-4"><div>{r.customer_name}</div><div className="text-xs text-muted-foreground">{r.customer_email}</div></td>
                      <td className="py-3.5 px-4 text-foreground/80 text-xs">{r.start_date} &rarr; {r.end_date}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{r.persons}</td>
                      <td className="py-3.5 px-4"><StatusBadge status={r.status} /></td>
                      <td className="py-3.5 px-4 text-right">
                        {r.status === 'pending' ? (
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBundleResStatus(r.id, 'confirmed')}><Check className="h-3 w-3 mr-1" /> Approve</Button>
                            <Button size="sm" variant="ghost" className="h-7 px-3 text-xs hover:bg-destructive/10 hover:text-destructive" onClick={() => handleBundleResStatus(r.id, 'cancelled')}><X className="h-3 w-3 mr-1" /> Reject</Button>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">--</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Accommodation Reservations */}
          <div className="mb-4 mt-8">
            <h2 className="text-lg font-semibold">Hotel / Villa / Apartment Reservations</h2>
            <p className="text-sm text-muted-foreground">Booking requests for accommodations</p>
          </div>
          <Card className="border-border/50 shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Type</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Property</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Customer</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Dates</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Persons</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {accReservations.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center"><Hotel className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No accommodation reservations yet</p></td></tr>
                  ) : accReservations.map((r: any) => (
                    <tr key={r.id} className="hover:bg-foreground/[0.02] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="capitalize inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">{r.type}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{r.item_name}</td>
                      <td className="py-3.5 px-4"><div>{r.customer_name}</div><div className="text-xs text-muted-foreground">{r.customer_email}</div>{r.customer_phone && <div className="text-xs text-muted-foreground">{r.customer_phone}</div>}</td>
                      <td className="py-3.5 px-4 text-foreground/80 text-xs">{r.start_date} &rarr; {r.end_date}</td>
                      <td className="py-3.5 px-4 text-foreground/80">{r.persons}</td>
                      <td className="py-3.5 px-4"><StatusBadge status={r.status} /></td>
                      <td className="py-3.5 px-4 text-right">
                        {r.status === 'pending' ? (
                          <div className="flex justify-end gap-1.5">
                            <Button size="sm" className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => openApproveDialog(r.id, 'accommodation')}>
                              <Check className="h-3 w-3 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="ghost" className="h-7 px-3 text-xs hover:bg-destructive/10 hover:text-destructive" onClick={() => updateAccReservationStatus(r.id, 'cancelled')}>
                              <X className="h-3 w-3 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">--</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Custom Bundle Requests (from Wizard) */}
          <div className="mb-4 mt-8">
            <h2 className="text-lg font-semibold">Custom Bundle Requests</h2>
            <p className="text-sm text-muted-foreground">Requests submitted through the Custom Bundle Wizard</p>
          </div>
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Customer</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Dates</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Persons</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Submitted</th>
                  <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                  <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border/30">
                  {customBundleRequests.length === 0 ? (
                    <tr><td colSpan={6} className="py-16 text-center"><Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No custom requests yet</p></td></tr>
                  ) : customBundleRequests.map((r: any) => {
                    const wd = r.wizard_data || {};
                    const isExpanded = expandedRequestId === r.id;
                    return (
                      <React.Fragment key={r.id}>
                        <tr className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="py-3.5 px-4"><div className="font-medium">{r.customer_name}</div><div className="text-xs text-muted-foreground">{r.customer_email}</div>{r.customer_phone && <div className="text-xs text-muted-foreground">{r.customer_phone}</div>}</td>
                          <td className="py-3.5 px-4 text-foreground/80 text-xs">{r.start_date} &rarr; {r.end_date}</td>
                          <td className="py-3.5 px-4 text-foreground/80">{r.persons}</td>
                          <td className="py-3.5 px-4 text-foreground/80 text-xs">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="py-3.5 px-4"><StatusBadge status={r.status} /></td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-1.5 flex-wrap">
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => setExpandedRequestId(isExpanded ? null : r.id)}>
                                {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                                {isExpanded ? 'Hide' : 'View'}
                              </Button>
                              {r.status === 'pending' && (<>
                                <Button size="sm" className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => handleCustomReqStatus(r.id, 'contacted')}><Check className="h-3 w-3 mr-1" /> Contacted</Button>
                                <Button size="sm" variant="ghost" className="h-7 px-3 text-xs hover:bg-destructive/10 hover:text-destructive" onClick={() => handleCustomReqStatus(r.id, 'closed')}><X className="h-3 w-3 mr-1" /> Close</Button>
                              </>)}
                              {r.status !== 'pending' && <span className="text-xs text-muted-foreground capitalize self-center">{r.status}</span>}
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-muted/40">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                {/* Guests */}
                                <div className="space-y-1">
                                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Guests</p>
                                  <p>Total: <span className="font-medium">{wd.userInfo?.totalGuests ?? r.persons}</span></p>
                                  {wd.userInfo?.kids02 > 0 && <p>Kids 0–2: {wd.userInfo.kids02}</p>}
                                  {wd.userInfo?.kids211 > 0 && <p>Kids 2–11: {wd.userInfo.kids211}</p>}
                                  {wd.airportTransfer && <p className="text-primary font-medium">✓ Airport transfer</p>}
                                  {wd.driver?.requested && <p className="text-primary font-medium">✓ Driver requested</p>}
                                </div>
                                {/* Car */}
                                <div className="space-y-1">
                                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Car Rental</p>
                                  {wd.carRental?.selected ? (
                                    <p className="font-medium">{wd.carRental.carName || 'Selected (no name)'}</p>
                                  ) : <p className="text-muted-foreground">Not requested</p>}
                                </div>
                                {/* Adventures */}
                                {wd.adventures?.length > 0 && (
                                  <div className="space-y-1">
                                    <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Adventures</p>
                                    {wd.adventures.map((a: any, i: number) => (
                                      <p key={i} className="font-medium">{a.title} <span className="text-muted-foreground font-normal">— {a.city}</span></p>
                                    ))}
                                  </div>
                                )}
                                {/* Hotels */}
                                {wd.hotels?.length > 0 && (
                                  <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                                    <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Hotels</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {wd.hotels.map((h: any, i: number) => (
                                        <div key={i} className="bg-background rounded-md border border-border/50 px-3 py-2 text-xs">
                                          <p className="font-semibold">{h.hotelName} <span className="text-muted-foreground font-normal">— {h.city}</span></p>
                                          <p>Check-in: {h.checkIn ? new Date(h.checkIn).toLocaleDateString() : '—'}</p>
                                          <p>Check-out: {h.checkOut ? new Date(h.checkOut).toLocaleDateString() : '—'}</p>
                                          {h.roomType && <p>Room: {h.roomType}</p>}
                                          {h.roomQuantities && (
                                            <p>Rooms: {[
                                              h.roomQuantities.single > 0 && `${h.roomQuantities.single}× Single`,
                                              h.roomQuantities.double > 0 && `${h.roomQuantities.double}× Double`,
                                              h.roomQuantities.triple > 0 && `${h.roomQuantities.triple}× Triple`,
                                            ].filter(Boolean).join(', ')}</p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          </>)}

          {bundleSubTab === 'adventures' && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search adventures..." className="pl-9 bg-card border-border/50 h-10" value={adventureSearch} onChange={e => setAdventureSearch(e.target.value)} />
                </div>
                <Button onClick={() => { resetAdventureForm(); setShowAdventureForm(true); }} className="flex items-center gap-2 shrink-0">
                  <Plus className="h-4 w-4" /> Add Adventure
                </Button>
              </div>

              {showAdventureForm && (
                <Card className="mb-6 border-border/50 shadow-sm">
                  <CardHeader className="pb-3"><CardTitle className="text-base">{editingAdventureId ? 'Edit Adventure' : 'New Adventure'}</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={e => editingAdventureId ? handleUpdateAdventure(e, editingAdventureId) : handleAddAdventure(e)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>City *</Label>
                          <Select value={newAdventure.city} onValueChange={v => setNewAdventure(p => ({ ...p, city: v }))}>
                            <SelectTrigger className="bg-background"><SelectValue placeholder="Select city" /></SelectTrigger>
                            <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2"><Label>Title *</Label><Input required value={newAdventure.title} onChange={e => setNewAdventure(p => ({ ...p, title: e.target.value }))} className="bg-background" /></div>
                      </div>
                      <div className="space-y-2"><Label>Description (English) *</Label><Textarea required value={newAdventure.description_en} onChange={e => setNewAdventure(p => ({ ...p, description_en: e.target.value, description: e.target.value }))} className="bg-background" rows={2} placeholder="Brief description in English..." /></div>
                      <div className="space-y-2"><Label>Description (Bosnian / BS) *</Label><Textarea required value={newAdventure.description_bs} onChange={e => setNewAdventure(p => ({ ...p, description_bs: e.target.value }))} className="bg-background" rows={2} placeholder="Kratak opis na bosanskom..." /></div>
                      <div className="space-y-2"><Label>Description (Arabic / AR) *</Label><Textarea required value={newAdventure.description_ar} onChange={e => setNewAdventure(p => ({ ...p, description_ar: e.target.value }))} className="bg-background" rows={2} placeholder="وصف مختصر بالعربية..." dir="rtl" /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Duration</Label><Input value={newAdventure.duration} onChange={e => setNewAdventure(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3 hours" className="bg-background" /></div>
                        <div className="space-y-2"><Label>Price (€)</Label><Input type="number" min={0} value={newAdventure.price} onChange={e => setNewAdventure(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="bg-background" /></div>
                        <div className="space-y-2"><Label>Image URL</Label><Input value={newAdventure.image} onChange={e => setNewAdventure(p => ({ ...p, image: e.target.value }))} placeholder="https://..." className="bg-background" /></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch checked={newAdventure.is_active} onCheckedChange={v => setNewAdventure(p => ({ ...p, is_active: v }))} />
                        <Label>Active (visible in wizard)</Label>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                        <Button type="button" variant="ghost" onClick={resetAdventureForm}>Cancel</Button>
                        <Button type="submit">{editingAdventureId ? 'Update Adventure' : 'Create Adventure'}</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-foreground/[0.03] border-b border-border/50">
                      <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Adventure</th>
                      <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">City</th>
                      <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Duration</th>
                      <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Price</th>
                      <th className="py-3.5 px-4 text-left text-xs font-semibold uppercase tracking-wider text-foreground/80">Status</th>
                      <th className="py-3.5 px-4 text-right text-xs font-semibold uppercase tracking-wider text-foreground/80">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-border/30">
                      {dbAdventures.filter(a => a.title.toLowerCase().includes(adventureSearch.toLowerCase()) || a.city.toLowerCase().includes(adventureSearch.toLowerCase())).length === 0 ? (
                        <tr><td colSpan={6} className="py-16 text-center"><Compass className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" /><p className="text-muted-foreground">No adventures yet</p></td></tr>
                      ) : dbAdventures.filter(a => a.title.toLowerCase().includes(adventureSearch.toLowerCase()) || a.city.toLowerCase().includes(adventureSearch.toLowerCase())).map(a => (
                        <tr key={a.id} className="hover:bg-foreground/[0.02] transition-colors">
                          <td className="py-3.5 px-4"><div className="font-medium">{a.title}</div><div className="text-xs text-muted-foreground line-clamp-1">{a.description}</div></td>
                          <td className="py-3.5 px-4 text-foreground/80">{a.city}</td>
                          <td className="py-3.5 px-4 text-foreground/80">{a.duration}</td>
                          <td className="py-3.5 px-4 font-medium">€{a.price}</td>
                          <td className="py-3.5 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${a.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>{a.is_active ? 'Active' : 'Inactive'}</span></td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => handleEditAdventure(a)}><Edit className="h-3.5 w-3.5" /></Button>
                              <Button size="sm" variant="ghost" className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteAdventure(a.id!)}><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve Dialog */}
      <Dialog open={approvingId !== null} onOpenChange={(open) => { if (!open) setApprovingId(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Reservation & Set Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="approvePrice">Base Price (EUR)</Label>
              <Input
                id="approvePrice"
                type="number"
                min="0"
                placeholder="e.g. 150"
                value={approvePrice}
                onChange={e => setApprovePrice(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Options (select one or both)</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => togglePaymentOption('full')}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${paymentOptions.full ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${paymentOptions.full ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}>
                      {paymentOptions.full && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <div className="font-semibold text-sm">Full Payment</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 pl-6">5% discount applied</div>
                  {basePrice > 0 && <div className="text-xs font-medium text-amber-700 mt-0.5 pl-6">{fullAmount} EUR</div>}
                </button>
                <button
                  type="button"
                  onClick={() => togglePaymentOption('deposit')}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${paymentOptions.deposit ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${paymentOptions.deposit ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}>
                      {paymentOptions.deposit && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <div className="font-semibold text-sm">10% Deposit</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 pl-6">Remainder on arrival</div>
                  {basePrice > 0 && <div className="text-xs font-medium text-amber-700 mt-0.5 pl-6">{depositAmount} EUR</div>}
                </button>
              </div>
            </div>
            {basePrice > 0 && (paymentOptions.full || paymentOptions.deposit) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-1.5">
                <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Email will include:</div>
                {paymentOptions.full && (
                  <div className="text-sm text-green-800">
                    ✅ <span className="font-semibold">Full payment:</span> {fullAmount} EUR <span className="text-xs text-green-600">(saves {(basePrice * 0.05).toFixed(2)} EUR)</span>
                  </div>
                )}
                {paymentOptions.deposit && (
                  <div className="text-sm text-green-800">
                    ✅ <span className="font-semibold">10% deposit:</span> {depositAmount} EUR <span className="text-xs text-green-600">(+ {(basePrice * 0.90).toFixed(2)} EUR on arrival)</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovingId(null)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApproveConfirm}>
              <Check className="h-4 w-4 mr-2" /> Send Confirmation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
