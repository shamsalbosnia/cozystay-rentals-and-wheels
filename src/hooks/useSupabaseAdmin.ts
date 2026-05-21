import { useState, useEffect } from 'react';
import { Car, Apartment, CarReservation, Hotel, Villa } from '@/types/supabase';
import { toast } from 'sonner';

export const useSupabaseAdmin = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [reservations, setReservations] = useState<CarReservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/admin/cars');
      if (!res.ok) throw new Error(await res.text());
      setCars(await res.json());
    } catch (err: any) {
      toast.error('Error fetching cars', { description: err.message });
    }
  };

  const fetchApartments = async () => {
    try {
      const res = await fetch('/api/admin/apartments');
      if (!res.ok) throw new Error(await res.text());
      setApartments(await res.json());
    } catch (err: any) {
      toast.error('Error fetching apartments', { description: err.message });
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await fetch('/api/admin/hotels');
      if (!res.ok) throw new Error(await res.text());
      setHotels(await res.json());
    } catch (err: any) {
      toast.error('Error fetching hotels', { description: err.message });
    }
  };

  const fetchVillas = async () => {
    try {
      const res = await fetch('/api/admin/villas');
      if (!res.ok) throw new Error(await res.text());
      setVillas(await res.json());
    } catch (err: any) {
      toast.error('Error fetching villas', { description: err.message });
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/admin/reservations');
      if (!res.ok) throw new Error(await res.text());
      setReservations(await res.json());
    } catch (err: any) {
      toast.error('Error fetching reservations', { description: err.message });
    }
  };

  const addCar = async (car: Omit<Car, 'id'>) => {
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(car),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Car added successfully');
      fetchCars();
      return await res.json();
    } catch (err: any) { toast.error('Error adding car', { description: err.message }); return null; }
  };

  const addApartment = async (apartment: Omit<Apartment, 'id'>) => {
    try {
      const res = await fetch('/api/admin/apartments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apartment),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Apartment added successfully');
      fetchApartments();
      return await res.json();
    } catch (err: any) { toast.error('Error adding apartment', { description: err.message }); return null; }
  };

  const addHotel = async (hotel: Omit<Hotel, 'id'>) => {
    try {
      const res = await fetch('/api/admin/hotels', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hotel),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Hotel added successfully');
      fetchHotels();
      return await res.json();
    } catch (err: any) { toast.error('Error adding hotel', { description: err.message }); return null; }
  };

  const addVilla = async (villa: Omit<Villa, 'id'>) => {
    try {
      const res = await fetch('/api/admin/villas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(villa),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Villa added successfully');
      fetchVillas();
      return await res.json();
    } catch (err: any) { toast.error('Error adding villa', { description: err.message }); return null; }
  };

  const updateCar = async (id: number, updates: Partial<Car>) => {
    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Car updated successfully');
      fetchCars();
      return true;
    } catch (err: any) { toast.error('Error updating car', { description: err.message }); return false; }
  };

  const updateApartment = async (id: number, updates: Partial<Apartment>) => {
    try {
      const res = await fetch(`/api/admin/apartments/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Apartment updated successfully');
      fetchApartments();
      return true;
    } catch (err: any) { toast.error('Error updating apartment', { description: err.message }); return false; }
  };

  const updateHotel = async (id: number, updates: Partial<Hotel>) => {
    try {
      const res = await fetch(`/api/admin/hotels/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Hotel updated successfully');
      fetchHotels();
      return true;
    } catch (err: any) { toast.error('Error updating hotel', { description: err.message }); return false; }
  };

  const updateVilla = async (id: number, updates: Partial<Villa>) => {
    try {
      const res = await fetch(`/api/admin/villas/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Villa updated successfully');
      fetchVillas();
      return true;
    } catch (err: any) { toast.error('Error updating villa', { description: err.message }); return false; }
  };

  const deleteCar = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/cars/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Car deleted successfully');
      fetchCars();
      return true;
    } catch (err: any) { toast.error('Error deleting car', { description: err.message }); return false; }
  };

  const deleteApartment = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/apartments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Apartment deleted successfully');
      fetchApartments();
      return true;
    } catch (err: any) { toast.error('Error deleting apartment', { description: err.message }); return false; }
  };

  const deleteHotel = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/hotels/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Hotel deleted successfully');
      fetchHotels();
      return true;
    } catch (err: any) { toast.error('Error deleting hotel', { description: err.message }); return false; }
  };

  const deleteVilla = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/villas/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Villa deleted successfully');
      fetchVillas();
      return true;
    } catch (err: any) { toast.error('Error deleting villa', { description: err.message }); return false; }
  };

  const updateReservationStatus = async (id: number, status: string, admin_notes?: string, price?: string, paymentOptions?: ('full' | 'deposit')[]) => {
    try {
      const body: any = { status };
      if (admin_notes !== undefined) body.admin_notes = admin_notes;
      if (price) body.price = price;
      if (paymentOptions && paymentOptions.length > 0) body.payment_options = paymentOptions;
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Reservation ${status}`);
      fetchReservations();
      return true;
    } catch (err: any) { toast.error('Error updating reservation', { description: err.message }); return false; }
  };

  const createReservation = async (reservation: Omit<CarReservation, 'id'>) => {
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reservation),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Reservation created');
      fetchReservations();
      return await res.json();
    } catch (err: any) { toast.error('Error creating reservation', { description: err.message }); return null; }
  };

  const uploadImage = async (file: File, bucket: 'cars' | 'apartments' | 'hotels' | 'villas' | 'bundles') => {
    try {
      const { uploadAdminImage } = await import('@/lib/adminImageUpload');
      return await uploadAdminImage(file, bucket);
    } catch (err: any) { toast.error('Error uploading image', { description: err.message }); return null; }
  };

  useEffect(() => {
    Promise.all([fetchCars(), fetchApartments(), fetchHotels(), fetchVillas(), fetchReservations()]).then(() => setLoading(false));
  }, []);

  return {
    cars, apartments, hotels, villas, reservations, loading,
    addCar, addApartment, addHotel, addVilla,
    updateCar, updateApartment, updateHotel, updateVilla,
    deleteCar, deleteApartment, deleteHotel, deleteVilla,
    updateReservationStatus, createReservation, uploadImage,
    fetchReservations,
  };
};
