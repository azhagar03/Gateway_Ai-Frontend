import React, { useEffect, useState } from "react";

const ContactManager = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("https://gateway-ai-backend.onrender.com/api/contact");
        const data = await res.json();

        if (Array.isArray(data)) {
          setContacts(data);
        } else {
          console.error("Unexpected API response:", data);
          setContacts([]);
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) return <p>Loading contacts...</p>;

  if (contacts.length === 0)
    return <p style={{ textAlign: "center" }}>No contacts found.</p>;

  return (
    <div className="container mt-4">
      <h2>Contact Submissions</h2>
      <table className="table table-bordered table-striped mt-3 text-center">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={contact._id || index}>
              <td>{index+1}</td>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.subject}</td>
              <td>{contact.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactManager;
