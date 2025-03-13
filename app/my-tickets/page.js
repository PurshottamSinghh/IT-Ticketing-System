"use client";
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MyTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const q = query(
          collection(firestore, 'tickets'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const ticketsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTickets(ticketsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h1>My Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              <p>Issue: {ticket.issue}</p>
              <p>Status: {ticket.status}</p>
              <p>Created: {ticket.createdAt.toDate().toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}