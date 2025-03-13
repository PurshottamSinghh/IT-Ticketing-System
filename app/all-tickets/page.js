"use client";
import { auth, firestore } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AllTickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRoleAndTickets = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        } else {
          setUserRole('user'); // Default role if not found
        }

        if (userRole === 'support') {
          // Fetch all tickets
          const querySnapshot = await getDocs(collection(firestore, 'tickets'));
          const ticketsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTickets(ticketsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndTickets();
  }, [router, userRole]);

  if (loading) {
    return <p>Loading tickets...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (userRole !== 'support') {
    return <p>Access Denied: Only support staff can view all tickets.</p>;
  }

  return (
    <div>
      <h1>All Tickets</h1>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id}>
              <p>Issue: {ticket.issue}</p>
              <p>User: {ticket.userId}</p>
              <p>Status: {ticket.status}</p>
              <p>Created: {ticket.createdAt.toDate().toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}