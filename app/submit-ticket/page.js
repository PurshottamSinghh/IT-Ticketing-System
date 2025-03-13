"use client";
import { auth, firestore } from '../../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MyTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

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

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const ticketRef = doc(firestore, 'tickets', ticketId);
      await updateDoc(ticketRef, { status: newStatus });
      setTickets(tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const openDetails = (ticket) => {
    setSelectedTicket(ticket);
  };

  const closeDetails = () => {
    setSelectedTicket(null);
  };

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
              <button onClick={() => openDetails(ticket)}>View Details</button>
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </li>
          ))}
        </ul>
      )}
      {selectedTicket && (
        <div>
          <h2>Details for Ticket {selectedTicket.id}</h2>
          <p>Issue: {selectedTicket.issue}</p>
          <p>Status: {selectedTicket.status}</p>
          <p>Created: {selectedTicket.createdAt.toDate().toLocaleDateString()}</p>
          <button onClick={closeDetails}>Close</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}