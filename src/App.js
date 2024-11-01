import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import "./App.css";

const EmailClient = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null); // Storing complete email object
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
  const handleEmailClick = (email) => {
    if (selectedEmail && selectedEmail.id === email.id) {
      // Deselect the email if clicked again
      setSelectedEmail(null);
      setEmailBody(null);
    } else {
      // Fetch the email body when a new email is selected
      axios.get(`https://flipkart-email-mock.now.sh/?id=${email.id}`)
        .then(response => setEmailBody(response.data))
        .catch(error => console.error(error));

      // Mark as read when clicked
      setEmails(prevEmails => {
        const updatedEmails = prevEmails.map(e =>
          e.id === email.id ? { ...e, read: true } : e
        );
        persistEmails(updatedEmails);
        return updatedEmails;
      });

      setSelectedEmail(email); // Store the entire email object
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

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Read', value: 'read' },
    { label: 'Favorites', value: 'favorites' }
  ];

  return (
    <div className="email-client">
      {/* Email List View */}
      <div className="email-list">
        <h2>Emails</h2>
        <div>
          {filterButtons.map((button) => (
            <button
              key={button.value}
              onClick={() => setFilter(button.value)}
              style={{
                backgroundColor: filter === button.value ? '#E54065' : '#e2e8f0',
                color: filter === button.value ? 'white' : 'black'
              }}
            >
              {button.label}
            </button>
          ))}
        </div>
        <ul>
          {filteredEmails.map(email => (
            <li
              key={email.id}
              className={`${email.read ? 'read' : 'unread'} ${selectedEmail?.id === email.id ? 'selected' : ''}`}
              onClick={() => handleEmailClick(email)} // Pass the entire email object
            >
              <div className="email-avatar">
                <p className="text">
                  {email.from.name.charAt(0).toUpperCase()} {/* First letter of sender's name */}
                </p>
              </div>
              <div className='email-details'>
                <h4> <span className='aa'>From:</span> <span>{email.from.email}</span></h4>
                <h4>  <span className='aa'>Subject:</span> <span>{email.subject}</span></h4>
                <p className='aa'>{email.short_description} .....</p>
                <p className='aa'>{moment(email.date).format('DD/MM/YYYY hh:mm a')}</p>
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

          <div className='ww'>
            <div className='xx'>
              <div className="texte">
                <p>{selectedEmail.from.name.charAt(0).toUpperCase()}</p>
              </div>
              <div className='yy'>
                <h1>{selectedEmail.subject}</h1>
                <p>{moment(selectedEmail.date).format('DD/MM/YYYY hh:mm a')}</p>
              </div>
            </div>

            <button onClick={() => markAsFavorite(selectedEmail.id)}>
              {emails.find(email => email.id === selectedEmail.id)?.favorite
                ? 'Unmark Favorite'
                : 'Mark as Favorite'}
            </button>
          </div>
          <p className='zz'>{emailBody.body}</p>
        </div>
      )}
    </div>
  );
};

export default EmailClient;
