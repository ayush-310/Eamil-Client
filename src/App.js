import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import "./App.css";

const EmailClient = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailBody, setEmailBody] = useState(null);
  const [filter, setFilter] = useState('all'); // all, favorites, read, unread
  const [page, setPage] = useState(1); // Pagination state

  // Fetch all emails for a particular page
  useEffect(() => {
    axios.get(`https://flipkart-email-mock.now.sh/?page=${page}`)
      .then(response => {
        const persistedEmails = JSON.parse(localStorage.getItem('emails')) || {};
        const updatedEmails = response.data.list.map(email => {
          return persistedEmails[email.id] ? { ...email, ...persistedEmails[email.id] } : email;
        });
        setEmails(updatedEmails);
      })
      .catch(error => console.error(error));
  }, [page]);

  // Function to handle selecting/deselecting an email
  const handleEmailClick = (id) => {
    if (selectedEmail === id) {
      // Deselect the email if clicked again
      setSelectedEmail(null);
      setEmailBody(null);
    } else {
      // Fetch the email body when a new email is selected
      axios.get(`https://flipkart-email-mock.now.sh/?id=${id}`)
        .then(response => setEmailBody(response.data))
        .catch(error => console.error(error));

      // Mark as read when clicked
      setEmails(prevEmails => {
        const updatedEmails = prevEmails.map(email =>
          email.id === id ? { ...email, read: true } : email
        );
        persistEmails(updatedEmails);
        return updatedEmails;
      });

      setSelectedEmail(id);
    }
  };

  // Mark email as favorite
  const markAsFavorite = (id) => {
    setEmails(prevEmails => {
      const updatedEmails = prevEmails.map(email =>
        email.id === id ? { ...email, favorite: !email.favorite } : email
      );
      persistEmails(updatedEmails);
      return updatedEmails;
    });
  };

  // Persist emails in localStorage
  const persistEmails = (updatedEmails) => {
    const emailMap = updatedEmails.reduce((map, email) => {
      map[email.id] = { read: email.read, favorite: email.favorite };
      return map;
    }, {});
    localStorage.setItem('emails', JSON.stringify(emailMap));
  };

  // Filter emails based on the selected filter
  const filteredEmails = emails.filter(email => {
    if (filter === 'favorites') return email.favorite;
    if (filter === 'read') return email.read;
    if (filter === 'unread') return !email.read;
    return true;
  });

  return (
    <div className="email-client">
      {/* Email List View */}
      <div className="email-list">
        <h2>Emails</h2>
        <div>
          <button onClick={() => setFilter('all')}>All</button>
          {/* <p>Filter By :</p> */}
          <button onClick={() => setFilter('unread')}>Unread</button>
          <button onClick={() => setFilter('read')}>Read</button>
          <button onClick={() => setFilter('favorites')}>Favorites</button>
        </div>
        <ul>
          {filteredEmails.map(email => (
            <li
              key={email.id}
              className={`${email.read ? 'read' : 'unread'} ${selectedEmail === email.id ? 'selected' : ''}`}
              onClick={() => handleEmailClick(email.id)}
            >
              <div className="email-avatar">
                <p className="text">
                  {email.from.name.charAt(0).toUpperCase()}
                </p>
              </div>
              <div className='email-details'>
                <h4> <span className='aa'>From:</span> <span>{email.from.email}</span></h4>
                <h4>  <span className='aa'>Subject:</span> <span>{email.subject}</span></h4>
                <p className='aa' >{email.short_description} .....</p>
                <p className='aa' >{moment(email.date).format('DD/MM/YYYY hh:mm a')}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* Pagination Controls */}
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page}</span>
          <button disabled={page === 2} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>

      {/* Email Body View */}
      {selectedEmail && emailBody && (
        <div className="email-body">

          <h2>{emailBody.subject}</h2>
          <p>{emailBody.body}</p>
          <p>{moment(emailBody.date).format('DD/MM/YYYY hh:mm a')}</p>
          <button onClick={() => markAsFavorite(selectedEmail)}>
            {emails.find(email => email.id === selectedEmail)?.favorite
              ? 'Unmark Favorite'
              : 'Mark as Favorite'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailClient;
