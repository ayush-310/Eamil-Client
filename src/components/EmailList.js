// EmailList.js
import React from 'react';

const EmailList = ({ emails, selectEmail }) => {
    return (
        <div>
            <ul>
                {emails.map((email) => (
                    <li key={email.id} onClick={() => selectEmail(email.id)}>
                        <div>
                            <span>{email.from.name.charAt(0)}</span> {/* Avatar */}
                            <span>{email.subject}</span>
                            <span>{email.date}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmailList;
